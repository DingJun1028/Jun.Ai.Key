import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/light.css'; // 強制亮色主題

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
