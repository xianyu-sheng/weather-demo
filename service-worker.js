// 缓存名称和版本
const CACHE_NAME = 'weather-app-cache-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/offline.html'
];

// 安装service worker并缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活service worker并清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求并从缓存中提供资源
self.addEventListener('fetch', event => {
  // 跳过非GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 处理导航请求（HTML页面）
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 如果导航请求失败（离线），返回离线页面
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // 处理API请求
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // 如果API请求失败，返回一个带有错误信息的JSON响应
          return new Response(JSON.stringify({
            error: true,
            message: '您当前处于离线状态，无法获取天气数据。'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 处理其他资源请求（图片、CSS、JS等）
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (response) {
          return response;
        }

        // 否则发起网络请求
        return fetch(event.request).then(response => {
          // 检查是否收到有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应，因为响应是流，只能使用一次
          const responseToCache = response.clone();

          // 将响应添加到缓存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});