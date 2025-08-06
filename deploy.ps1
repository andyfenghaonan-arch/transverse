# Moloc Data Visualization Platform - Auto-Deploy Script
# PowerShell version for GitHub Pages deployment

Write-Host "========================================"
Write-Host "Moloc Data Visualization Platform"
Write-Host "Auto-Deploy Script for GitHub Pages"
Write-Host "========================================"
Write-Host ""

# Step 1: Change to project directory
Write-Host "Step 1: Checking current directory..." -ForegroundColor Yellow
Set-Location "K:\html\eqtl-visualization"
Write-Host "Current directory: $(Get-Location)"
Write-Host ""

# Step 2: Initialize Git repository
Write-Host "Step 2: Initializing Git repository..." -ForegroundColor Yellow
try {
    git init
    Write-Host "Git repository initialized successfully." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to initialize git repository" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 3: Add remote repository
Write-Host "Step 3: Adding remote repository..." -ForegroundColor Yellow
try {
    git remote add origin https://github.com/andyfenghaonan-arch/transverse.git
    Write-Host "Remote repository added successfully." -ForegroundColor Green
} catch {
    Write-Host "Warning: Remote origin might already exist, continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Set default branch
Write-Host "Step 4: Setting default branch to main..." -ForegroundColor Yellow
try {
    git branch -M main
    Write-Host "Branch set to main successfully." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to set branch to main" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 5: Add all files
Write-Host "Step 5: Adding all files..." -ForegroundColor Yellow
try {
    git add .
    Write-Host "All files added successfully." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 6: Commit files
Write-Host "Step 6: Committing files..." -ForegroundColor Yellow
try {
    git commit -m "Add Moloc data visualization platform with interactive filtering"
    Write-Host "Files committed successfully." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to commit files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 7: Push to GitHub
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Note: You may need to enter your GitHub credentials" -ForegroundColor Cyan
try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================"
    Write-Host "SUCCESS! Deployment completed!" -ForegroundColor Green
    Write-Host "========================================"
} catch {
    Write-Host "Error: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your GitHub credentials and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit your repository: https://github.com/andyfenghaonan-arch/transverse"
Write-Host "2. Go to Settings > Pages"
Write-Host "3. Select 'Deploy from a branch'"
Write-Host "4. Choose 'main' branch and '/ (root)' folder"
Write-Host "5. Click Save"
Write-Host ""
Write-Host "Your website will be available at:" -ForegroundColor Green
Write-Host "https://andyfenghaonan-arch.github.io/transverse/"
Write-Host ""
Write-Host "(It may take 1-5 minutes for the site to be available)" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"