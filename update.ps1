# PowerShell 一鍵自動化更新腳本
# 使用方式：在專案根目錄執行 ./update.ps1

Write-Host "[1/6] 取得遠端最新內容..." -ForegroundColor Cyan
git fetch origin

Write-Host "[2/6] 進行 rebase..." -ForegroundColor Cyan
git rebase origin/main

Write-Host "[3/6] 安裝依賴..." -ForegroundColor Cyan
npm install

Write-Host "[4/6] 執行靜態檢查..." -ForegroundColor Cyan
npm run lint

Write-Host "[5/6] 執行測試..." -ForegroundColor Cyan
npm run test

Write-Host "[6/6] 編譯專案..." -ForegroundColor Cyan
npm run build

# 自動 commit & push（如有變更）
if ((git status --porcelain).Length -gt 0) {
    Write-Host "檢測到變更，自動 commit 並 push..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: 自動化更新與同步"
    git push origin HEAD
} else {
    Write-Host "無需 commit，專案已同步。" -ForegroundColor Green
}

Write-Host "更新流程完成！" -ForegroundColor Green
