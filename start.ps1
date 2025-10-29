# TransactHub Startup Script
Write-Host "🏦 Starting TransactHub Distributed Banking System..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "📡 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\tanis\Desktop\TransactHub\backend'; Write-Host '🚀 Backend Server' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\tanis\Desktop\TransactHub\frontend'; Write-Host '🎨 Frontend Server' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📡 Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo Accounts:" -ForegroundColor Yellow
Write-Host "  👤 user1@bank.com / password123"
Write-Host "  👤 user2@bank.com / password123"
Write-Host "  👑 admin@bank.com / admin123"
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop servers" -ForegroundColor Gray
