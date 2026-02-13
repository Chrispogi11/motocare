# Deploy MotoCare to Vercel (step-by-step)

MotoCare has two parts:

- **Frontend** (React + Vite) → deploy to **Vercel**
- **Backend** (Node + Express + Postgres) → deploy to **Render** or **Railway** (Vercel doesn’t run long-lived Express servers the same way)

Do the **backend first**, then the **frontend**, then connect the two with an environment variable.

---

## Part 1: Deploy the backend (Render or Railway)

Your API and database must be online before the frontend can call them.

### Option A: Render (recommended, free tier)

1. Go to [render.com](https://render.com) and sign up (GitHub is easiest).
2. **New** → **Web Service**.
3. Connect your GitHub repo (e.g. `motocare`). If you haven’t pushed the code yet, push the project to GitHub first.
4. **Settings:**
   - **Name:** `motocare-api` (or any name).
   - **Root directory:** `server` (important).
   - **Runtime:** Node.
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. **Environment variables** (Add Environment Variable):
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = your Supabase connection string (same as in `server/.env`).
   - `JWT_SECRET` = same long secret as in `server/.env`.
   - `PORT` = leave empty (Render sets it).
6. **Create Web Service**. Wait for the first deploy to finish.
7. Run the migration against production DB:
   - In Render dashboard, open your service → **Shell** tab (or run locally with `DATABASE_URL` pointing to Supabase).
   - Run: `npm run db:migrate` (from the `server` directory context). If Render doesn’t give a shell, run `npm run db:migrate` locally once with `DATABASE_URL` set to your **production** Supabase URL in `server/.env`).
8. Copy your service URL, e.g. `https://motocare-api.onrender.com`. No trailing slash. You’ll use this as `VITE_API_URL` in Part 2.

### Option B: Railway

1. Go to [railway.app](https://railway.app) and sign up.
2. **New Project** → **Deploy from GitHub repo** → select your repo.
3. Set **Root directory** to `server` (in project settings).
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET` (same as in `server/.env`). Railway sets `PORT` automatically.
5. Deploy. Open the generated URL (e.g. `https://your-app.up.railway.app`).
6. Run the DB migration (Railway shell or locally with production `DATABASE_URL`): from `server`, run `npm run db:migrate`.
7. Copy the backend URL for Part 2.

---

## Part 2: Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).

2. **Add New** → **Project**.

3. **Import** your GitHub repository (the same repo that contains both `client` and `server`).

4. **Configure Project:**
   - **Framework Preset:** Vite (Vercel usually detects it).
   - **Root Directory:** click **Edit** and set to **`client`** (so Vercel builds the frontend only).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default for Vite).
   - **Install Command:** `npm install`.

5. **Environment variables** (critical for production):
   - Click **Environment Variables**.
   - Add:
     - **Name:** `VITE_API_URL`
     - **Value:** your backend URL from Part 1, e.g. `https://motocare-api.onrender.com` (no trailing slash).
   - Save.

6. Click **Deploy**. Wait for the build to finish.

7. Open the Vercel URL (e.g. `https://motocare-xxx.vercel.app`). You should see the MotoCare UI. Try **Sign up** and **Log in**; they will call your deployed API.

---

## Part 3: Optional – use a custom domain

- **Vercel:** Project → **Settings** → **Domains** → add your domain and follow the DNS instructions.
- **Backend (Render/Railway):** You can add a custom domain in the service settings if you have one for the API.

---

## Checklist

- [ ] Backend deployed (Render or Railway), migration run, URL copied.
- [ ] Frontend deployed on Vercel with **Root Directory** = `client`.
- [ ] `VITE_API_URL` set on Vercel to the backend URL (no trailing slash).
- [ ] Test: open Vercel URL → Sign up / Log in → add a bike and use the app.

---

## Troubleshooting

- **“Failed to fetch” or network errors in production**  
  The frontend can’t reach the API. Check that `VITE_API_URL` is set on Vercel and points to the correct backend URL (and that the backend is running and not sleeping on free tier).

- **CORS errors**  
  Your Express server already uses `cors`. If your backend is on Render, CORS is usually fine. If you add a custom frontend domain, ensure the backend allows that origin (e.g. in `cors({ origin: 'https://your-app.vercel.app' })` or keep `origin: true` for development).

- **Backend “Application failed to respond” (Render)**  
  Free-tier services spin down after inactivity. The first request after a while can take 30–60 seconds; subsequent requests are fast. Consider upgrading or pinging the service periodically if needed.

- **Photos / uploads**  
  On Render/Railway, the filesystem is ephemeral, so uploaded files don’t persist. For production you’d store files in Supabase Storage or another object store and save the file URL in the database. For MVP, you can keep uploads as-is and accept that they may disappear on redeploy.

---

You’re done. Your MotoCare frontend is on Vercel and the API is on Render or Railway.
