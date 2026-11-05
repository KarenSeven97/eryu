import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({base:'./', plugins:[react(), VitePWA({registerType:'autoUpdate',includeAssets:['icon.svg','apple-touch-icon.png'],manifest:{name:'耳屿 · 音乐听觉实验室',short_name:'耳屿',description:'个人音乐听觉训练实验室',lang:'zh-CN',start_url:'.',display:'standalone',background_color:'#f6f5fb',theme_color:'#7770d9',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,svg,png,woff2,mp3,txt,md}'],maximumFileSizeToCacheInBytes:5*1024*1024}})]});
