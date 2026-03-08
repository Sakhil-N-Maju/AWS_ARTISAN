# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "media" {
  comment = "OAI for ${var.project_name} media bucket"
}

# CloudFront Distribution for Media
resource "aws_cloudfront_distribution" "media" {
  count   = var.enable_cloudfront ? 1 : 0
  enabled = true
  comment = "${var.project_name} Media CDN - ${var.environment}"

  origin {
    domain_name = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.media.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.media.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media.id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-media-cdn-${var.environment}"
  }
}

# Update S3 bucket policy to allow CloudFront
resource "aws_s3_bucket_policy" "media_cloudfront" {
  bucket = aws_s3_bucket.media.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontAccess"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.media.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.media.arn}/*"
      }
    ]
  })
}

# CloudFront Distribution for QR Codes
resource "aws_cloudfront_distribution" "qr_codes" {
  count   = var.enable_cloudfront ? 1 : 0
  enabled = true
  comment = "${var.project_name} QR Codes CDN - ${var.environment}"

  origin {
    domain_name = aws_s3_bucket.qr_codes.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.qr_codes.id}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.qr_codes.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-qr-codes-cdn-${var.environment}"
  }
}

# Store CloudFront URLs in Secrets Manager
resource "aws_secretsmanager_secret" "cloudfront_urls" {
  count                   = var.enable_cloudfront ? 1 : 0
  name                    = "${var.project_name}/cloudfront/urls-${var.environment}"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-cloudfront-urls-${var.environment}"
  }
}

resource "aws_secretsmanager_secret_version" "cloudfront_urls" {
  count     = var.enable_cloudfront ? 1 : 0
  secret_id = aws_secretsmanager_secret.cloudfront_urls[0].id
  secret_string = jsonencode({
    media_cdn_url    = "https://${aws_cloudfront_distribution.media[0].domain_name}"
    qr_codes_cdn_url = "https://${aws_cloudfront_distribution.qr_codes[0].domain_name}"
  })
}
