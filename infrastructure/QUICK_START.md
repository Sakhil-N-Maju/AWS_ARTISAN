# Quick Start - Windows Installation

## Install AWS CLI (Choose ONE method)

### Option 1: Direct Download (Easiest)
1. Download: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Double-click and install
3. **Close and reopen PowerShell**
4. Test: `aws --version`

### Option 2: Using Chocolatey
```powershell
# Run PowerShell as Administrator
choco install awscli -y
```

### Option 3: Using winget
```powershell
winget install Amazon.AWSCLI
```

---

## Install Terraform (Choose ONE method)

### Option 1: Using Chocolatey (Easiest)
```powershell
# Run PowerShell as Administrator
choco install terraform -y
```

### Option 2: Using winget
```powershell
winget install Hashicorp.Terraform
```

### Option 3: Manual
1. Download: https://www.terraform.io/downloads
2. Extract to `C:\terraform`
3. Add `C:\terraform` to PATH
4. **Close and reopen PowerShell**
5. Test: `terraform --version`

---

## Configure AWS

```powershell
aws configure
```

Enter when prompted:
- **Access Key ID**: (from AWS Console)
- **Secret Access Key**: (from AWS Console)
- **Region**: `ap-south-1`
- **Output**: `json`

---

## Verify Everything Works

```powershell
# Test AWS CLI
aws --version
aws sts get-caller-identity

# Test Terraform
terraform --version

# Navigate to project
cd C:\projects\AWS-EUPHORIA\infrastructure\terraform

# Initialize Terraform
terraform init
```

---

## If Commands Don't Work

1. **Close ALL PowerShell windows**
2. **Open a NEW PowerShell window**
3. Try again

If still not working:
- Restart your computer
- Check PATH: `$env:Path -split ';'`

---

## Need AWS Access Keys?

See: `AWS_CREDENTIALS_GUIDE.md`

Quick steps:
1. Go to https://console.aws.amazon.com
2. Search for "IAM"
3. Click "Users" → "Create user"
4. Name: `artisan-ai-terraform`
5. Attach policy: `AdministratorAccess`
6. Create access key for CLI
7. Download CSV file
8. Run `aws configure` and enter keys

---

## All-in-One Install Script

Save as `install.ps1` and run as Administrator:

```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install tools
choco install awscli terraform git nodejs-lts -y

Write-Host "Done! Close and reopen PowerShell, then run: aws configure"
```

Run:
```powershell
# Right-click PowerShell → Run as Administrator
.\install.ps1
```

---

**That's it! You're ready to deploy to AWS! 🚀**
