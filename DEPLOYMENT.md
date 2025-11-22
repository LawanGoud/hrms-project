# HRMS Deployment Guide

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Backend Deployment

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     PORT=5000
     JWT_SECRET=your_production_secret_key_here
     NODE_ENV=production
     ```

3. **Add a PostgreSQL Database** (or keep SQLite for simplicity):
   - If using PostgreSQL: Create a new PostgreSQL instance on Render
   - Copy the connection string and add to environment variables:
     ```
     DB_HOST=your-db-host
     DB_PORT=5432
     DB_USER=your-db-user
     DB_PASS=your-db-password
     DB_NAME=your-db-name
     ```
   - If using SQLite: No additional setup needed (already configured)

4. **Deploy**: Render will automatically deploy your backend

### Frontend Deployment

1. **Update API URL** in `frontend/src/services/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
   });
   ```

2. **Create `.env.production` in frontend**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

3. **Deploy to Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Navigate to frontend: `cd frontend`
   - Run: `vercel`
   - Follow prompts and deploy

   OR deploy via Vercel Dashboard:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
   - Deploy

---

## Option 2: Deploy to Railway

### Backend + Database

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database (or use SQLite)
4. Deploy from GitHub
5. Set environment variables
6. Get deployment URL

### Frontend

Same as Option 1 (Vercel or Netlify)

---

## Option 3: Deploy to Heroku

### Backend

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create hrms-backend`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set NODE_ENV=production
   ```
6. Deploy:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a hrms-backend
   git push heroku main
   ```

### Frontend

Deploy to Netlify or Vercel (same as above)

---

## Option 4: VPS Deployment (DigitalOcean, AWS, etc.)

### Requirements
- Ubuntu server (20.04+)
- Node.js 18+
- PostgreSQL (optional)
- Nginx (reverse proxy)
- PM2 (process manager)

### Steps

1. **SSH into your server**

2. **Install dependencies**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql nginx
   npm install -g pm2
   ```

3. **Clone repository**:
   ```bash
   git clone your-repo-url
   cd hrms
   ```

4. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with production values
   pm2 start src/index.js --name hrms-backend
   pm2 save
   pm2 startup
   ```

5. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

6. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /path/to/hrms/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable SSL** (Let's Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Quick Deploy (Recommended for Beginners)

**Easiest Path:**
1. **Backend**: Deploy to Render (Free tier, auto-deploy from GitHub)
2. **Frontend**: Deploy to Vercel (Free, instant deployment)
3. **Database**: Use SQLite (already configured) or Render PostgreSQL

**Steps:**
1. Push code to GitHub
2. Connect Render to your repo (backend)
3. Connect Vercel to your repo (frontend)
4. Update frontend API URL to point to Render backend
5. Done! ✅

---

## Environment Variables Checklist

### Backend (.env)
- ✅ PORT
- ✅ JWT_SECRET (use strong random string in production)
- ✅ NODE_ENV=production
- ✅ Database credentials (if using PostgreSQL)

### Frontend (.env.production)
- ✅ VITE_API_URL (your deployed backend URL)

---

## Post-Deployment

1. **Seed the database**:
   ```bash
   node seed.js
   ```

2. **Test the application**:
   - Visit your frontend URL
   - Try logging in with seeded credentials
   - Test CRUD operations

3. **Monitor**:
   - Check backend logs
   - Monitor database connections
   - Set up error tracking (optional: Sentry)

---

## Troubleshooting

**CORS Issues**: Ensure backend CORS is configured to allow your frontend domain
**Database Connection**: Check environment variables are set correctly
**Build Errors**: Ensure all dependencies are in package.json (not devDependencies)
