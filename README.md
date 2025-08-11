# 简易天气预报应用

这是一个简单的天气预报Web应用，包含前端页面和后端API。用户可以输入城市名称查询当前天气情况。应用支持在微信中分享和在手机上使用。

## 功能特点

- 纯HTML/CSS/JavaScript前端，无外部依赖
- Node.js后端，无需安装额外依赖
- 使用wttr.in免费天气API
- 自动处理跨域问题
- 响应式设计，适配不同设备
- 支持PWA，可添加到手机主屏幕
- 优化微信分享体验

## 文件结构

- `index.html` - 前端页面，包含内联CSS和JavaScript
- `server.js` - Node.js后端服务，提供API接口
- `package.json` - 项目配置文件，包含依赖和脚本
- `manifest.json` - PWA配置文件，支持添加到主屏幕
- `Procfile` - Heroku部署配置文件
- `.gitignore` - Git忽略文件配置

## 在Trae中运行

### 启动应用

在Trae终端中运行以下命令启动Node.js服务：

```
node server.js
```

服务启动后，Node.js将在`http://localhost:5000`上运行。

### 访问应用

应用启动后，在Trae的内置浏览器中访问：

```
http://localhost:5000
```

## 使用方法

1. 在输入框中输入城市名称（如：北京、上海、广州等）
2. 点击"查天气"按钮或按回车键
3. 等待数据加载，查看天气信息

## 技术说明

- 前端使用原生JavaScript发送API请求
- 后端使用Node.js原生http模块处理请求并调用wttr.in API
- 服务器自动处理跨域问题
- 应用无需额外安装任何软件，在Trae环境中即可运行

## 注意事项

- wttr.in是一个免费的天气API，可能有请求限制
- 城市名称支持中文和英文，但某些小城市可能找不到数据
- 如遇到问题，请检查网络连接和城市名称拼写

## 部署到公网并在微信上分享

### 方法一：使用Vercel部署（推荐）

1. 注册[Vercel](https://vercel.com)账号
2. 安装Git并创建GitHub仓库：
   ```
   git init
   git add .
   git commit -m "初始提交"
   ```
3. 在GitHub上创建新仓库并推送代码
4. 在Vercel中导入GitHub仓库
5. 部署完成后，Vercel会提供一个域名（如`your-app.vercel.app`）

### 方法二：使用Heroku部署

1. 注册[Heroku](https://heroku.com)账号
2. 安装Heroku CLI
3. 登录Heroku：`heroku login`
4. 创建Heroku应用：`heroku create your-weather-app`
5. 推送代码到Heroku：`git push heroku main`

### 方法三：使用云服务器部署

1. 购买云服务器（阿里云、腾讯云等）
2. 安装Node.js环境
3. 上传代码到服务器
4. 安装PM2：`npm install -g pm2`
5. 使用PM2启动应用：`pm2 start server.js`
6. 配置域名和SSL证书

### 在微信中分享

1. 复制应用的公网URL（如`https://your-weather-app.vercel.app`）
2. 在微信中直接分享这个链接
3. 接收者点击链接后，会在微信内置浏览器中打开应用
4. 用户可以点击"添加到主屏幕"将应用保存到手机桌面

### 提示

- 为获得最佳体验，建议使用HTTPS协议
- 如果使用自定义域名，确保配置了正确的SSL证书
- 在微信开发者工具中测试分享效果