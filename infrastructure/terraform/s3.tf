# S3 Bucket for Media Storage
resource "aws_s3_bucket" "media" {
  bucket = "${var.project_name}-media-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "${var.project_name}-media-${var.environment}"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Lifecycle Policy
resource "aws_s3_bucket_lifecycle_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }
  }

  rule {
    id     = "delete-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# S3 Bucket CORS Configuration
resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 Bucket for Audio Files
resource "aws_s3_bucket" "audio" {
  bucket = "${var.project_name}-audio-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "${var.project_name}-audio-${var.environment}"
  }
}

resource "aws_s3_bucket_versioning" "audio" {
  bucket = aws_s3_bucket.audio.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "audio" {
  bucket = aws_s3_bucket.audio.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "audio" {
  bucket = aws_s3_bucket.audio.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket for QR Codes
resource "aws_s3_bucket" "qr_codes" {
  bucket = "${var.project_name}-qr-codes-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "${var.project_name}-qr-codes-${var.environment}"
  }
}

resource "aws_s3_bucket_versioning" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Public read policy for QR codes
resource "aws_s3_bucket_policy" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.qr_codes.arn}/*"
      }
    ]
  })
}

# Store S3 bucket names in Secrets Manager
resource "aws_secretsmanager_secret" "s3_buckets" {
  name                    = "${var.project_name}/s3/buckets-${var.environment}"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-s3-buckets-${var.environment}"
  }
}

resource "aws_secretsmanager_secret_version" "s3_buckets" {
  secret_id = aws_secretsmanager_secret.s3_buckets.id
  secret_string = jsonencode({
    media_bucket    = aws_s3_bucket.media.id
    audio_bucket    = aws_s3_bucket.audio.id
    qr_codes_bucket = aws_s3_bucket.qr_codes.id
  })
}
