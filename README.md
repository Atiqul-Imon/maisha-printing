# Maisha Printing - Professional Printing Services Website

A modern, responsive website for Maisha Printing, a professional printing service provider in Bangladesh. Built with Next.js 15, React, and Tailwind CSS.

## 🌟 Features

- **Responsive Design** - Works perfectly on all devices (mobile, tablet, desktop)
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Fast Performance** - Optimized for speed and SEO
- **WhatsApp Integration** - Direct WhatsApp chat widget for customer inquiries
- **Multi-language Support** - Bengali and English content
- **SEO Optimized** - Proper meta tags and structured data
- **Contact Integration** - Phone, email, and address information
- **Service Pages** - Detailed pages for each printing service

## 🚀 Services Offered

- T-Shirt Printing
- Glass Printing
- Calendar Printing
- ID Card Printing
- Ribbon Printing
- Sticker Printing
- Visiting Cards
- Flyer & Brochure Printing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Fonts**: Inter, Roboto (Google Fonts)
- **Deployment**: Vercel (recommended)

## 📱 Contact Information

- **Phone**: +880 1861 623213
- **Email**: maishaprintingbd@gmail.com
- **Address**: 224/1, Fakirapool, (2nd Floor), 1 No Lane, Motijheel, Dhaka-1000, Bangladesh
- **Facebook**: [Maisha Printing BD](https://www.facebook.com/maishaprintingbd)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/maisha-printing-website.git
cd maisha-printing-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Platforms

The website can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── services/          # Services pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Footer.tsx         # Footer component
│   ├── Header.tsx         # Header component
│   └── WhatsAppWidget.tsx # WhatsApp chat widget
└── public/               # Static assets
```

## 🎨 Customization

### Colors
The website uses a green color scheme. To change colors, update the Tailwind config in `tailwind.config.js` and CSS variables in `src/app/globals.css`.

### Content
- Update contact information in `src/components/Footer.tsx` and `src/app/contact/page.tsx`
- Modify testimonials in `src/app/page.tsx`
- Update services in respective service pages

### WhatsApp Widget
Configure the WhatsApp number in `src/components/WhatsAppWidget.tsx` (line 12).

## 📄 License

This project is proprietary software developed for Maisha Printing.

## 👨‍💻 Developer

**Website developed by [Pixel Forge](https://www.pixelforgebd.com)**

For website development services, contact Pixel Forge.

## 📞 Support

For any issues or questions about the website, please contact:
- **Email**: maishaprintingbd@gmail.com
- **Phone**: +880 1861 623213

---

© 2024 Maisha Printing. All rights reserved.