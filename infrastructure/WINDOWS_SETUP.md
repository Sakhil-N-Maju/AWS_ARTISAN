# Windows Setup Guide for AWS CLI and Terraform

Complete guide to install AWS CLI and Terraform on Windows.

## Step 1: Install AWS CLI on Windows

### Method 1: MSI Installer (Recommended)

1. **Download the AWS CLI installer**:
   - Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Or visit: https://aws.amazon.com/cli/
   - Click "Download for Windows"

2. **Run the installer**:
   - Double-click the downloaded `AWSCLIV2.msi` file
   - Click "Next" through the installation wizard
   - Accept the license agreement
   - Click "Install"
   - Click "Finish" when complete

3. **Verify installation**:
   - Open a **NEW** PowerShell window (important!)
   - Run:
   ```powershell
   aws --version
   ```
   - You should see something like: `aws-cli/2.x.x Python/3.x.x Windows/10`

### Method 2: Using Chocolatey (If you have Chocolatey)

```powershell
# Run PowerShell as Administrator
choco install awscli
```

### Method 3: Using winget (Windows 11 or Windows 10 with App Installer)

```powershell
winget install Amazon.AWSCLI
```

---

## Step 2: Install Terraform on Windows

### Method 1: Manual Installation (Recommended)

1. **Download Terraform**:
   - Go to: https://www.terraform.io/downloads
   - Click "Windows" under "Binary download"
   - Download the AMD64 version (most common)

2. **Extract the ZIP file**:
   - Right-click the downloaded ZIP file
   - Select "Extract All..."
   - Extract to: `C:\terraform`

3. **Add to PATH**:
   - Press `Windows + X`, select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\terraform`
   - Click "OK" on all windows

4. **Verify installation**:
   - Open a **NEW** PowerShell window
   - Run:
   ```powershell
   terraform --version
   ```
   - You should see: `Terraform v1.x.x`

### Method 2: Using Chocolatey

```powershell
# Run PowerShell as Administrator
choco install terraform
```

### Method 3: Using winget

```powershell
winget install Hashicorp.Terraform
```

---

## Step 3: Configure AWS CLI

Now that AWS CLI is installed, configure it with your credentials:

```powershell
aws configure
```

You'll be prompted for:
```
AWS Access Key ID [None]: YOUR_ACCESS_KEY_ID
AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY
Default region name [None]: ap-south-1
Default output format [None]: json
```

### Verify Configuration

```powershell
# Check your AWS identity
aws sts get-caller-identity

# Should output something like:
# {
#     "UserId": "AIDAI...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/your-user"
# }
```

---

## Step 4: Install Git (If not already installed)

### Method 1: Official Installer

1. Download from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (recommended)

### Method 2: Using Chocolatey

```powershell
choco install git
```

### Method 3: Using winget

```powershell
winget install Git.Git
```

---

## Step 5: Install Node.js (For the application)

### Method 1: Official Installer

1. Download from: https://nodejs.org/
2. Download the LTS version (20.x)
3. Run the installer
4. Check "Automatically install necessary tools"

### Method 2: Using Chocolatey

```powershell
choco install nodejs-lts
```

### Method 3: Using winget

```powershell
winget install OpenJS.NodeJS.LTS
```

### Verify Node.js

```powershell
node --version
npm --version
```

---

## Step 6: Install Docker Desktop (Optional, for local development)

1. Download from: https://www.docker.com/products/docker-desktop/
2. Run the installer
3. Restart your computer
4. Start Docker Desktop
5. Verify:
   ```powershell
   docker --version
   docker-compose --version
   ```

---

## Troubleshooting

### Issue: "aws is not recognized"

**Solution:**
1. Close ALL PowerShell/Command Prompt windows
2. Open a NEW PowerShell window
3. Try again: `aws --version`
4. If still not working, restart your computer

### Issue: "terraform is not recognized"

**Solution:**
1. Verify Terraform is in PATH:
   ```powershell
   $env:Path -split ';' | Select-String terraform
   ```
2. If not found, add to PATH manually (see Step 2 above)
3. Close and reopen PowerShell

### Issue: PowerShell Execution Policy Error

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: AWS CLI installed but not working

**Solution:**
```powershell
# Check if AWS CLI is in PATH
where.exe aws

# If not found, add to PATH:
# C:\Program Files\Amazon\AWSCLIV2\
```

---

## Quick Setup Script

Save this as `setup.ps1` and run in PowerShell as Administrator:

```powershell
# Install Chocolatey (if not installed)
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install tools
choco install awscli -y
choco install terraform -y
choco install git -y
choco install nodejs-lts -y

# Refresh environment
refreshenv

Write-Host "Installation complete! Please close and reopen PowerShell."
Write-Host "Then run: aws configure"
```

Run it:
```powershell
# Run PowerShell as Administrator
.\setup.ps1
```

---

## Alternative: Use AWS CloudShell (No Installation Required)

If you don't want to install anything locally:

1. Sign in to AWS Console
2. Click the CloudShell icon (terminal icon, top right)
3. CloudShell opens with AWS CLI pre-configured
4. Clone your repository:
   ```bash
   git clone https://github.com/your-repo/AWS-EUPHORIA.git
   cd AWS-EUPHORIA/infrastructure/terraform
   ```
5. Run Terraform commands directly

---

## Next Steps After Installation

1. **Get AWS Access Keys** (see `AWS_CREDENTIALS_GUIDE.md`)
2. **Configure AWS CLI**:
   ```powershell
   aws configure
   ```
3. **Verify everything works**:
   ```powershell
   aws --version
   terraform --version
   node --version
   git --version
   ```
4. **Navigate to infrastructure folder**:
   ```powershell
   cd infrastructure/terraform
   ```
5. **Initialize Terraform**:
   ```powershell
   terraform init
   ```

---

## Useful PowerShell Commands

```powershell
# Check installed software versions
aws --version
terraform --version
node --version
npm --version
git --version

# Check AWS configuration
aws configure list

# Check AWS credentials
aws sts get-caller-identity

# List environment variables
$env:Path -split ';'

# Refresh environment variables (after installation)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

---

## Windows-Specific Tips

### Use PowerShell (Not Command Prompt)

PowerShell is more powerful and recommended for development:
- Press `Windows + X`
- Select "Windows PowerShell" or "Terminal"

### Use Windows Terminal (Recommended)

Install Windows Terminal for better experience:
```powershell
winget install Microsoft.WindowsTerminal
```

Or from Microsoft Store: https://aka.ms/terminal

### Set PowerShell as Default in VS Code

1. Open VS Code
2. Press `Ctrl + Shift + P`
3. Type "Terminal: Select Default Profile"
4. Select "PowerShell"

---

## Summary Checklist

- [ ] Install AWS CLI
- [ ] Install Terraform
- [ ] Install Git
- [ ] Install Node.js
- [ ] Install Docker Desktop (optional)
- [ ] Configure AWS CLI with credentials
- [ ] Verify all installations
- [ ] Close and reopen PowerShell
- [ ] Test: `aws sts get-caller-identity`
- [ ] Test: `terraform --version`

---

**Need Help?**

- AWS CLI Docs: https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html
- Terraform Docs: https://learn.hashicorp.com/tutorials/terraform/install-cli
- Windows Terminal: https://aka.ms/terminal

---

**Last Updated**: February 28, 2026  
**Platform**: Windows 10/11
