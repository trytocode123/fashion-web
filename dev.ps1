param (
    [Parameter(Mandatory=$false)]
    [String]$action = "all"
)

$RootPath = Get-Location

function Restart-Backend {
    Write-Host ">>> Rebuilding Backend..." -ForegroundColor Cyan
    Set-Location "$RootPath\backend"
    .\gradlew build -x test
    Set-Location $RootPath
    Write-Host ">>> Restarting Backend Container..." -ForegroundColor Cyan
    docker-compose up -d --build backend
}

function Restart-Frontend {
    Write-Host ">>> Rebuilding Frontend..." -ForegroundColor Cyan
    # Note: Frontend Dockerfile handles 'npm run build' during image creation.
    # We just need to trigger a rebuild of the image.
    Write-Host ">>> Restarting Frontend Container..." -ForegroundColor Cyan
    docker-compose up -d --build frontend
}

function Restart-All {
    Write-Host ">>> Rebuilding and Restarting Everything..." -ForegroundColor Cyan
    Set-Location "$RootPath\backend"
    .\gradlew build -x test
    Set-Location $RootPath
    docker-compose up -d --build
}

switch ($action) {
    "be" { Restart-Backend }
    "fe" { Restart-Frontend }
    "all" { Restart-All }
    default {
        Write-Host "Usage: .\dev.ps1 [be|fe|all]" -ForegroundColor Yellow
        Write-Host "  be  : Rebuild & Restart Backend"
        Write-Host "  fe  : Rebuild & Restart Frontend"
        Write-Host "  all : Rebuild & Restart Everything (Default)"
    }
}
