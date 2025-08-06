@echo off
echo ========================================
echo Moloc Data Visualization Platform
echo Auto-Deploy Script for GitHub Pages
echo ========================================
echo.

echo Step 1: Checking current directory...
cd /d K:\html\eqtl-visualization
echo Current directory: %CD%
echo.

echo Step 2: Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Error: Failed to initialize git repository
    pause
    exit /b 1
)
echo Git repository initialized successfully.
echo.

echo Step 3: Adding remote repository...
git remote add origin https://github.com/andyfenghaonan-arch/transverse.git
if %errorlevel% neq 0 (
    echo Warning: Remote origin might already exist, continuing...
)
echo.

echo Step 4: Setting default branch to main...
git branch -M main
if %errorlevel% neq 0 (
    echo Error: Failed to set branch to main
    pause
    exit /b 1
)
echo Branch set to main successfully.
echo.

echo Step 5: Adding all files...
git add .
if %errorlevel% neq 0 (
    echo Error: Failed to add files
    pause
    exit /b 1
)
echo All files added successfully.
echo.

echo Step 6: Committing files...
git commit -m "Add Moloc data visualization platform with interactive filtering"
if %errorlevel% neq 0 (
    echo Error: Failed to commit files
    pause
    exit /b 1
)
echo Files committed successfully.
echo.

echo Step 7: Pushing to GitHub...
echo Note: You may need to enter your GitHub credentials
git push -u origin main
if %errorlevel% neq 0 (
    echo Error: Failed to push to GitHub
    echo Please check your GitHub credentials and try again
    pause
    exit /b 1
)
echo.

echo ========================================
echo SUCCESS! Deployment completed!
echo ========================================
echo.
echo Next steps:
echo 1. Visit your repository: https://github.com/andyfenghaonan-arch/transverse
echo 2. Go to Settings ^> Pages
echo 3. Select 'Deploy from a branch'
echo 4. Choose 'main' branch and '/ (root)' folder
echo 5. Click Save
echo.
echo Your website will be available at:
echo https://andyfenghaonan-arch.github.io/transverse/
echo.
echo (It may take 1-5 minutes for the site to be available)
echo.
pause