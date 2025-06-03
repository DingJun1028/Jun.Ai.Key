#!/bin/bash
# --- 使用前請修改以下三個參數 ---
GITHUB_USERNAME="你的GitHub帳號"
REPO_NAME="junaikey"
PROJECT_PATH="你的本地專案資料夾路徑"
# ------------------------------

cd "$PROJECT_PATH" || exit 1

# 初始化 git（如已初始化可略過）
if [ ! -d ".git" ]; then
  git init
fi

# 新增檔案與首次提交
git add .
git commit -m "Initial commit"

# 在 GitHub 上建立新倉庫（需安裝 gh CLI 並已登入）
gh repo create "$GITHUB_USERNAME/$REPO_NAME" --public --source=. --remote=origin --push

# 若未安裝 gh CLI，請註冊：https://cli.github.com/
# 或手動在 GitHub 建立倉庫後，使用：
# git remote add origin https://github.com/你的GitHub帳號/junaikey.git
# git push -u origin master   # 或 main