const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 设置CORS头部
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // 解析URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // 处理offline.html请求
    if (pathname === '/offline.html') {
        fs.readFile(path.join(__dirname, 'offline.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // 处理icon.svg请求
    if (pathname === '/icon.svg') {
        fs.readFile(path.join(__dirname, 'icon.svg'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(data);
        });
        return;
    }
    
    // 处理service-worker.js请求
    if (pathname === '/service-worker.js') {
        fs.readFile(path.join(__dirname, 'service-worker.js'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
        return;
    }
    
    // 处理manifest.json请求
    if (pathname === '/manifest.json') {
        fs.readFile(path.join(__dirname, 'manifest.json'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
        return;
    }
    
    // 处理根路径请求，返回index.html
    if (pathname === '/' || pathname === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // 处理天气API请求
    if (pathname === '/api/weather') {
        const city = parsedUrl.query.city;
        
        if (!city) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '请提供城市名称' }));
            return;
        }
        
        // 调用wttr.in API获取天气数据
        const wttrUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
        
        https.get(wttrUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                try {
                    const weatherData = JSON.parse(data);
                    
                    // 提取需要的天气信息
                    const currentCondition = weatherData.current_condition?.[0] || {};
                    const nearestArea = weatherData.nearest_area?.[0] || {};
                    
                    // 构建返回的数据结构
                    const result = {
                        location: nearestArea.areaName?.[0]?.value || '未知地点',
                        country: nearestArea.country?.[0]?.value || '未知国家',
                        temperature: currentCondition.temp_C || 'N/A',
                        feels_like: currentCondition.FeelsLikeC || 'N/A',
                        weather_description: currentCondition.weatherDesc?.[0]?.value || '未知天气',
                        humidity: currentCondition.humidity || 'N/A',
                        wind_speed: currentCondition.windspeedKmph || 'N/A',
                        wind_direction: currentCondition.winddir16Point || 'N/A'
                    };
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    console.error('解析天气数据失败:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `解析天气数据失败: ${error.message}` }));
                }
            });
        }).on('error', (error) => {
            console.error('获取天气数据失败:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `获取天气数据失败: ${error.message}` }));
        });
        
        return;
    }
    
    // 处理404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

// 启动服务器
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`服务器运行在 http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log('按 Ctrl+C 停止服务器');
    console.log('如果部署在云服务器上，请使用公网IP或域名访问');
});