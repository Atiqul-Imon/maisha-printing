# Deployment Guide

This guide will help you deploy the Maisha Printing website to various platforms.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

**One-click deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/maisha-printing-website)

**Manual deployment:**
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Deploy automatically

### 2. Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Deploy

### 3. GitHub Pages

1. Enable GitHub Pages in repository settings
2. Use GitHub Actions workflow (included in this repo)
3. Set source to GitHub Actions

## 🔧 Environment Variables

No environment variables are required for basic deployment.

## 📝 Custom Domain

After deployment, you can add a custom domain:
- **Vercel**: Go to Project Settings > Domains
- **Netlify**: Go to Site Settings > Domain Management
- **GitHub Pages**: Go to Repository Settings > Pages

## 🛠️ Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Development server
npm run dev
```

## 📊 Performance

The website is optimized for:
- ✅ Fast loading times
- ✅ SEO optimization
- ✅ Mobile responsiveness
- ✅ Accessibility compliance

## 🔍 Testing

Before deployment, test locally:
```bash
npm run build
npm start
```

Visit `http://localhost:3000` to verify everything works correctly.

## 📞 Support

For deployment issues, contact:
- **Email**: maishaprintingbd@gmail.com
- **Phone**: +880 1861 623213
