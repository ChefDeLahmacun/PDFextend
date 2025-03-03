# PDFextend Deployment Guide

## Table of Contents
1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [Cloudflare Setup](#cloudflare-setup)
3. [Google Ads Setup](#google-ads-setup)
4. [Manual SSL with Let's Encrypt](#manual-ssl-with-lets-encrypt)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Post-Deployment Checks](#post-deployment-checks)

## Vercel Deployment (Recommended)

### Steps:
1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Deploy your application:
   ```bash
   vercel
   ```

### Benefits:
- Automatic SSL certificate provisioning
- Zero configuration needed
- Built-in CI/CD
- Automatic deployments on git push
- Free tier available

## Cloudflare Setup

### Steps:
1. Create a Cloudflare account
2. Add your domain to Cloudflare
3. Update nameservers with your domain registrar
4. Enable SSL/TLS encryption:
   - Go to SSL/TLS tab in Cloudflare dashboard
   - Select "Full" or "Full (Strict)" mode
   - Enable "Always Use HTTPS"

### Benefits:
- Free SSL
- CDN services
- DDoS protection
- Caching capabilities

## Google Ads Setup

### Prerequisites:
1. Custom domain (required for AdSense)
2. Age 18+ years
3. No policy violations on your site
4. Original content

### Steps:
1. Domain Setup:
   - Purchase a domain (e.g., from Google Domains, Namecheap, etc.)
   - Connect domain to Vercel:
     ```bash
     vercel domains add yourdomain.com
     ```
   - Add domain to Cloudflare for CDN benefits

2. Google AdSense Setup:
   - Visit https://www.google.com/adsense
   - Sign up for an AdSense account
   - Add your website
   - Wait for site review (typically 1-2 weeks)

3. Website Preparation:
   - Add Privacy Policy page
   - Add Terms of Service page
   - Ensure cookie consent notification
   - Make sure site loads fast (affects ad revenue)

4. Ad Implementation:
   ```javascript
   // components/GoogleAds.tsx
   import { useEffect } from 'react';

   export const GoogleAds = () => {
     useEffect(() => {
       try {
         (window.adsbygoogle = window.adsbygoogle || []).push({});
       } catch (err) {
         console.error('AdSense error:', err);
       }
     }, []);

     return (
       <ins
         className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client="ca-pub-YOURPUBLISHERID"
         data-ad-slot="YOURADSLOT"
         data-ad-format="auto"
         data-full-width-responsive="true"
       />
     );
   };
   ```

5. Add AdSense Script:
   ```javascript
   // pages/_document.tsx
   import { Html, Head, Main, NextScript } from 'next/document';

   export default function Document() {
     return (
       <Html>
         <Head>
           <script
             async
             src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
             crossOrigin="anonymous"
           />
         </Head>
         <body>
           <Main />
           <NextScript />
         </body>
       </Html>
     );
   }
   ```

### Best Practices for Ad Revenue:
1. Performance:
   - Optimize images
   - Use lazy loading
   - Implement caching
   - Keep Time to First Byte (TTFB) under 200ms

2. Content:
   - Create high-quality content
   - Regular updates
   - SEO optimization
   - Mobile responsiveness

3. Ad Placement:
   - Don't overload with ads
   - Test different placements
   - Monitor user experience
   - Follow AdSense policies

4. Analytics Setup:
   - Install Google Analytics
   - Connect to Google Search Console
   - Monitor ad performance
   - Track user behavior

### Monitoring:
1. Regular Checks:
   - Ad performance metrics
   - Page load times
   - User engagement
   - Revenue reports

2. Optimization:
   - A/B test ad placements
   - Monitor click-through rates
   - Analyze high-performing pages
   - Optimize for mobile users

## Manual SSL with Let's Encrypt

### Prerequisites:
- A domain name
- SSH access to your server
- Root or sudo privileges

### Steps:
1. Install Certbot:
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install certbot

   # For macOS
   brew install certbot
   ```

2. Obtain certificate:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. Certificate renewal (set up cron job):
   ```bash
   sudo certbot renew --dry-run
   ```

### Certificate Locations:
- Certificate: `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- Private key: `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

## Environment Variables Setup

1. Create a `.env.production` file with your production values:
   ```
   # Email Configuration
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password

   # Other API Keys
   NEXT_PUBLIC_API_KEY=your_api_key
   ```

2. Add these variables to your deployment platform:
   - Vercel: Add in Project Settings > Environment Variables
   - Other platforms: Follow their respective documentation

## Post-Deployment Checks

1. SSL Verification:
   - Check for padlock icon in browser
   - Verify HTTPS redirect works
   - Test at https://www.ssllabs.com/ssltest/

2. Application Checks:
   - Test PDF upload functionality
   - Verify email sending works
   - Check all API integrations
   - Test responsive design

3. Performance Checks:
   - Run Lighthouse audit
   - Check page load times
   - Verify CDN is working (if using Cloudflare)

## Security Best Practices

1. Enable HTTP/2
2. Set up security headers:
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             },
             {
               key: 'Strict-Transport-Security',
               value: 'max-age=31536000; includeSubDomains'
             }
           ],
         },
       ]
     }
   }
   ```

3. Enable CORS appropriately
4. Set up rate limiting for API routes

## Troubleshooting

Common issues and solutions:

1. SSL Certificate Issues:
   - Verify DNS propagation
   - Check certificate renewal status
   - Ensure proper redirect rules

2. Email Service Issues:
   - Verify SMTP settings
   - Check email service provider status
   - Test email sending functionality

3. API Connection Issues:
   - Verify API keys are properly set
   - Check CORS settings
   - Validate API endpoint URLs

## Maintenance

Regular maintenance tasks:

1. Monitor SSL certificate expiration
2. Update dependencies regularly
3. Check error logs
4. Monitor performance metrics
5. Backup configuration files

---

For additional support or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Cloudflare Documentation](https://developers.cloudflare.com/) 