# Hướng dẫn Deploy Frontend - Bloodline ADN Testing Service

## 1. Chuẩn bị trước khi deploy

### 1.1. Cài đặt dependencies
```bash
cd my-react-app
npm install
```

### 1.2. Kiểm tra cấu hình API
Hiện tại API base URL được cấu hình trong `src/service/api/ApiServiceManage.js`:
```javascript
this.baseURL = 'http://localhost:8080/api';
```

**Quan trọng**: Bạn cần thay đổi URL này thành URL production của backend trước khi deploy.

## 2. Các phương pháp deploy

### 2.1. Deploy lên Vercel (Khuyến nghị)

#### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

#### Bước 2: Tạo file cấu hình môi trường
Tạo file `.env.production` trong thư mục `my-react-app`:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

#### Bước 3: Cập nhật cấu hình API
Chỉnh sửa file `src/service/api/ApiServiceManage.js`:
```javascript
constructor() {
  this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  // ... rest of the code
}
```

#### Bước 4: Deploy
```bash
cd my-react-app
vercel
```

### 2.2. Deploy lên Netlify

#### Bước 1: Build project
```bash
cd my-react-app
npm run build
```

#### Bước 2: Tạo file `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Bước 3: Deploy
- Kéo thả thư mục `dist` lên Netlify, hoặc
- Kết nối GitHub repository và deploy tự động

### 2.3. Deploy lên GitHub Pages

#### Bước 1: Cài đặt gh-pages
```bash
npm install --save-dev gh-pages
```

#### Bước 2: Cập nhật package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://your-username.github.io/your-repo-name"
}
```

#### Bước 3: Deploy
```bash
npm run deploy
```

### 2.4. Deploy lên AWS S3 + CloudFront

#### Bước 1: Build project
```bash
npm run build
```

#### Bước 2: Upload lên S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Bước 3: Cấu hình CloudFront
- Tạo CloudFront distribution
- Point đến S3 bucket
- Cấu hình error pages để redirect về index.html

## 3. Cấu hình môi trường

### 3.1. Tạo file môi trường
Tạo các file sau trong thư mục `my-react-app`:

#### `.env.development`
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_ENV=development
```

#### `.env.production`
```env
VITE_API_BASE_URL=https://your-production-backend.com/api
VITE_APP_ENV=production
```

### 3.2. Cập nhật Vite config
Chỉnh sửa `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
        },
      },
    },
  },
})
```

## 4. Xử lý routing

### 4.1. Cấu hình redirect cho SPA
Tạo file `_redirects` (cho Netlify) hoặc cấu hình tương tự cho platform khác:
```
/*    /index.html   200
```

### 4.2. Cấu hình nginx (nếu sử dụng)
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 5. Tối ưu hóa performance

### 5.1. Code splitting
React Router đã hỗ trợ lazy loading. Đảm bảo sử dụng:
```javascript
const LazyComponent = lazy(() => import('./Component'));
```

### 5.2. Image optimization
- Sử dụng format WebP
- Implement lazy loading cho images
- Sử dụng CDN cho static assets

### 5.3. Bundle optimization
```bash
npm run build -- --analyze
```

## 6. Monitoring và Analytics

### 6.1. Error tracking
Thêm Sentry hoặc LogRocket:
```bash
npm install @sentry/react
```

### 6.2. Performance monitoring
Sử dụng Google Analytics hoặc Vercel Analytics.

## 7. Security

### 7.1. Environment variables
- Không commit file `.env.production`
- Sử dụng secrets management của platform

### 7.2. Content Security Policy
Thêm CSP headers:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

## 8. Troubleshooting

### 8.1. Build errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run lint
```

### 8.2. Runtime errors
- Kiểm tra console browser
- Verify API endpoints
- Check CORS configuration

### 8.3. Performance issues
- Use Lighthouse audit
- Check bundle size
- Optimize images and assets

## 9. Checklist trước khi deploy

- [ ] Cập nhật API base URL cho production
- [ ] Test build locally: `npm run build`
- [ ] Kiểm tra tất cả routes hoạt động
- [ ] Verify authentication flow
- [ ] Test responsive design
- [ ] Check loading states
- [ ] Verify error handling
- [ ] Test on different browsers
- [ ] Check performance metrics

## 10. Post-deployment

### 10.1. Monitoring
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics

### 10.2. Backup
- Backup build artifacts
- Document deployment process
- Version control configuration files

### 10.3. Rollback plan
- Keep previous versions
- Document rollback procedures
- Test rollback process

---

**Lưu ý**: Đảm bảo backend API đã được deploy và có thể truy cập từ domain production trước khi deploy frontend. 