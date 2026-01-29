@echo off
REM Post-commit hook: automatically run review for changed challenges after commit.
REM Install: copy scripts\post-commit-review-changed.bat .git\hooks\post-commit
REM Or run manually after commit: npm run review:changed

cd /d "%~dp0\.."

REM Get the commit that was just made (HEAD)
for /f "tokens=*" %%i in ('git rev-parse HEAD~1 2^>nul') do set PREV_COMMIT=%%i
for /f "tokens=*" %%i in ('git rev-parse HEAD') do set CURRENT_COMMIT=%%i

if "%PREV_COMMIT%"=="" (
  REM First commit, compare against empty tree
  set REF=--root
) else (
  set REF=%PREV_COMMIT%
)

REM Run review for changed challenges
node scripts\run-review-changed.js --ref %REF% || exit /b 0

REM Update progress and README
node scripts\update-progress.js || exit /b 0

exit /b 0
