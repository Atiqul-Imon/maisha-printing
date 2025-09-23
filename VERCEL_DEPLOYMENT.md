# Vercel Deployment Guide for Maisha Printing

This guide will help you deploy your Maisha Printing website to Vercel.

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Atiqul-Imon/maisha-printing.git)

### Option 2: Manual Deployment

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `Atiqul-Imon/maisha-printing`

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## ⚙️ Vercel Configuration

The project includes a `vercel.json` file with optimized settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["bom1"],
  "functions": {
    "src/app/**/*.tsx": {
      "maxDuration": 10
    }
  }
}
```

## 🌍 Custom Domain Setup

After deployment:

1. **Add Domain**
   - Go to your project dashboard
   - Click "Domains" tab
   - Add your custom domain (e.g., `maishaprinting.com`)

2. **DNS Configuration**
   - Add CNAME record pointing to your Vercel domain
   - Or use Vercel's nameservers

## 🔧 Environment Variables

No environment variables are required for basic deployment.

If you need to add any:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

## 📊 Performance Optimization

Your website is already optimized for Vercel:

- ✅ **Static Generation**: All pages are pre-rendered
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Code Splitting**: Automatic code splitting
- ✅ **Edge Functions**: Ready for edge deployment
- ✅ **CDN**: Global content delivery

## 🔄 Automatic Deployments

Vercel automatically deploys when you:
- Push to the `main` branch
- Create a pull request
- Merge pull requests

## 📱 Preview Deployments

Every pull request gets a preview URL:
- Automatic preview deployments
- Share with team for testing
- No manual deployment needed

## 🛠️ Local Development

To test locally with Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## 📈 Analytics & Monitoring

Vercel provides built-in:
- **Web Analytics**: Page views, performance metrics
- **Speed Insights**: Core Web Vitals
- **Function Logs**: Server-side debugging

## 🔒 Security Features

Your deployment includes:
- **HTTPS**: Automatic SSL certificates
- **Security Headers**: XSS protection, content type options
- **DDoS Protection**: Built-in protection
- **Edge Security**: Global security policies

## 📞 Support

If you encounter issues:
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Email**: maishaprintingbd@gmail.com

## 🎯 Next Steps After Deployment

1. **Test Your Site**: Visit your Vercel URL
2. **Add Custom Domain**: Configure your domain
3. **Set Up Analytics**: Enable Vercel Analytics
4. **Monitor Performance**: Check Speed Insights
5. **Share Your Site**: Your website is now live!

---

**Your Maisha Printing website is ready for Vercel deployment! 🚀**
