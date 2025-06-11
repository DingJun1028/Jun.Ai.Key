import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/light.css'; // 強制亮色主題

// Git rebase 操作說明（可移除）
// 若需一鍵 rebase main 分支，可於 package.json scripts 加入：
// "rebase:main": "pwsh scripts/git-rebase-main.ps1"
// 並於 scripts 目錄下建立 git-rebase-main.ps1 腳本（已自動建立）
// 使用方式：npm run rebase:main

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
