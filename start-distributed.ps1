# PowerShell Script to Start Distributed System
Write-Host "🚀 Starting TransactHub Distributed System..." -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

# Start Node 1
Write-Host "🟢 Starting Node 1 on port 4001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node server-node1.js"
Start-Sleep -Seconds 2

# Start Node 2
Write-Host "🟢 Starting Node 2 on port 4002..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node server-node2.js"
Start-Sleep -Seconds 2

# Start Node 3
Write-Host "🟢 Starting Node 3 on port 4003..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node server-node3.js"
Start-Sleep -Seconds 2

# Start Node 4
Write-Host "🟢 Starting Node 4 on port 4004..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node server-node4.js"
Start-Sleep -Seconds 2

# Start Node 5
Write-Host "🟢 Starting Node 5 on port 4005..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node server-node5.js"
Start-Sleep -Seconds 2

# Start Gateway
Write-Host "🌐 Starting API Gateway on port 4000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node gateway.js"
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Magenta
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Backend Nodes:" -ForegroundColor Yellow
Write-Host "   Node 1: http://localhost:4001" -ForegroundColor White
Write-Host "   Node 2: http://localhost:4002" -ForegroundColor White
Write-Host "   Node 3: http://localhost:4003" -ForegroundColor White
Write-Host "   Node 4: http://localhost:4004" -ForegroundColor White
Write-Host "   Node 5: http://localhost:4005" -ForegroundColor White
Write-Host ""
Write-Host "🌐 API Gateway: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
