output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
  sensitive   = true
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_cluster.main.cache_nodes[0].port
}

output "s3_media_bucket" {
  description = "S3 media bucket name"
  value       = aws_s3_bucket.media.id
}

output "s3_audio_bucket" {
  description = "S3 audio bucket name"
  value       = aws_s3_bucket.audio.id
}

output "s3_qr_codes_bucket" {
  description = "S3 QR codes bucket name"
  value       = aws_s3_bucket.qr_codes.id
}

output "cloudfront_media_domain" {
  description = "CloudFront media distribution domain"
  value       = var.enable_cloudfront ? aws_cloudfront_distribution.media[0].domain_name : null
}

output "cloudfront_qr_codes_domain" {
  description = "CloudFront QR codes distribution domain"
  value       = var.enable_cloudfront ? aws_cloudfront_distribution.qr_codes[0].domain_name : null
}

output "app_security_group_id" {
  description = "Application security group ID"
  value       = aws_security_group.app.id
}

output "alb_security_group_id" {
  description = "ALB security group ID"
  value       = aws_security_group.alb.id
}

output "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_role_arn" {
  description = "ECS task role ARN"
  value       = aws_iam_role.ecs_task.arn
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.app.name
}

output "secrets_manager_db_secret_arn" {
  description = "Secrets Manager DB secret ARN"
  value       = aws_secretsmanager_secret.db_password.arn
  sensitive   = true
}

output "secrets_manager_redis_secret_arn" {
  description = "Secrets Manager Redis secret ARN"
  value       = aws_secretsmanager_secret.redis_connection.arn
  sensitive   = true
}
