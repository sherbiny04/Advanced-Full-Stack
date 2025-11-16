Write-Host "`n=== Backend API Health Check ===`n" -ForegroundColor Cyan

try {
    $companies = Invoke-RestMethod -Uri "http://localhost:5000/companies"
    $jobs = Invoke-RestMethod -Uri "http://localhost:5000/jobs"
    $users = Invoke-RestMethod -Uri "http://localhost:5000/users"
    $applications = Invoke-RestMethod -Uri "http://localhost:5000/applications"
    
    Write-Host "✅ Server Status: " -NoNewline -ForegroundColor Green
    Write-Host "RUNNING on port 5000`n"
    
    Write-Host "API Endpoints:" -ForegroundColor Yellow
    Write-Host "  ✓ /companies     - $($companies.Count) records" -ForegroundColor Green
    Write-Host "  ✓ /jobs          - $($jobs.Count) records" -ForegroundColor Green
    Write-Host "  ✓ /users         - $($users.Count) records" -ForegroundColor Green
    Write-Host "  ✓ /applications  - $($applications.Count) records" -ForegroundColor Green
    
    Write-Host "`nSample Data:" -ForegroundColor Yellow
    if ($companies.Count -gt 0) {
        Write-Host "  First Company: $($companies[0].name)" -ForegroundColor White
    }
    if ($jobs.Count -gt 0) {
        Write-Host "  First Job: $($jobs[0].title) at $($jobs[0].company)" -ForegroundColor White
    }
    
    Write-Host "`n✅ All APIs are working correctly!`n" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nMake sure the server is running with: npm run server`n" -ForegroundColor Yellow
}
