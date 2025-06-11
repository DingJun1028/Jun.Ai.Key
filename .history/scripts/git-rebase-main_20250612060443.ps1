# PowerShell 腳本：一鍵 rebase main 分支

git fetch origin

git checkout main

git pull origin main

git checkout -

git rebase main

echo "rebase 完成，請檢查有無衝突。"
