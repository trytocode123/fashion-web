# Script deploy backend len Railway (chay trong PowerShell o thu muc backend)
# Usage: .\deploy.ps1

Write-Host "=== Building JAR ===" -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Users\ASUS\.jdks\ms-17.0.16"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

.\gradlew bootJar -x test --no-daemon

if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED! Dung lai." -ForegroundColor Red
    exit 1
}

Write-Host "=== Build thanh cong! Dang push len GitHub... ===" -ForegroundColor Green

git add -f build/libs/backend-0.0.1-SNAPSHOT.jar
git add -A

$message = Read-Host "Nhap commit message (enter de dung 'update')"
if ([string]::IsNullOrWhiteSpace($message)) { $message = "update" }

git commit -m $message
git push

Write-Host "=== Done! Railway se tu dong deploy ===" -ForegroundColor Green
