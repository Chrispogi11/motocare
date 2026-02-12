# MotoCare backend setup (step-by-step)

You need two things: **Node.js** (you’re setting that up) and a **PostgreSQL database**. This guide walks you through both, then starting the backend.

---

## Part 1: Get a PostgreSQL database

You can use a **free cloud database** (easiest) or **PostgreSQL on your PC**. Pick one.

### Option A: Supabase (free cloud – recommended)

No database install on your computer. You get a URL and password to connect from the backend.

1. **Create an account**
   - Go to [https://supabase.com](https://supabase.com).
   - Click **Start your project** and sign up (e.g. with GitHub or email).

2. **Create a new project**
   - Click **New project**.
   - **Name:** e.g. `motocare`.
   - **Database password:** Choose a strong password and **save it somewhere safe** (you’ll need it in Step 4).
   - **Region:** Pick one close to you.
   - Click **Create new project** and wait until it says “Project is ready”.

3. **Get your connection string**
   - In the left sidebar, click **Project Settings** (gear icon).
   - Click **Database** in the left menu.
   - Scroll to **Connection string**.
   - Open the **URI** tab.
   - You’ll see something like:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - Click **Copy** (or select and copy it).

4. **Put your real password in the URL**
   - The copied URL has a placeholder for the password.
   - Find `[YOUR-PASSWORD]` in the string and **replace it** with the database password you set in Step 2.
   - Example:
     - Before: `...postgres.[PROJECT-REF]:[YOUR-PASSWORD]@...`
     - After:  `...postgres.abcdefgh:MyStr0ngP@ss@...`
   - Save this full URL; you’ll use it as `DATABASE_URL` in Part 2.

You’re done with the database. Skip Option B and go to **Part 2**.

---

### Option B: PostgreSQL on your computer

Only do this if you prefer to run the database locally.

1. **Download PostgreSQL**
   - Go to [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/).
   - Use the installer from the official site (or “EDB” installer). Download and run it.

2. **Run the installer**
   - Leave the default port **5432**.
   - Set a **password** for the `postgres` user and remember it.
   - Finish the install (defaults are fine).

3. **Create the MotoCare database**
   - Open **pgAdmin** (installed with PostgreSQL) or use **Command Line**:
   - **Using pgAdmin:** Connect to the server (use the password you set), right‑click **Databases** → **Create** → **Database**, name it `motocare`, Save.
   - **Using command line:** Open a new terminal and run:
     ```powershell
     "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE motocare;"
     ```
     (If your PostgreSQL is in a different folder or version, change the path, e.g. `...\PostgreSQL\15\...`.)

4. **Build your connection string**
   - Format:
     ```text
     postgresql://postgres:YOUR_PASSWORD@localhost:5432/motocare
     ```
   - Replace `YOUR_PASSWORD` with the password you set for `postgres`.
   - Example: `postgresql://postgres:secret123@localhost:5432/motocare`
   - Save this; you’ll use it as `DATABASE_URL` in Part 2.

---

## Part 2: Configure and run the backend

All of these steps are in the **Moto-Care** project folder, in the **server** folder.

### Step 1: Open the server folder

In PowerShell or Command Prompt:

```powershell
cd "c:\Users\Nicole & Chris\OneDrive\Documents\Coding projects\Moto-Care\server"
```

(Or in Cursor: right‑click the `server` folder → “Open in Integrated Terminal”.)

---

### Step 2: Install dependencies

```powershell
npm install
```

Wait until it finishes. You should see a `node_modules` folder in `server`.

---

### Step 3: Create your `.env` file

The backend reads settings from a file named `.env` (it’s in `.gitignore`, so it won’t be committed).

1. In the `server` folder, copy the example file:
   - **PowerShell:**
     ```powershell
     Copy-Item .env.example .env
     ```
   - Or manually: duplicate `.env.example`, rename the copy to `.env`.

2. Open **`.env`** in the editor. It should look like:

   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/motocare
   JWT_SECRET=your-super-secret-key-change-in-production
   UPLOAD_DIR=./uploads
   ```

3. **Edit these two values:**

   - **`DATABASE_URL`**  
     Replace the whole line with your real connection string:
     - **Supabase:** the URL you built in Part 1 Option A (with your actual password in it).
     - **Local:** `postgresql://postgres:YOUR_PASSWORD@localhost:5432/motocare`

   - **`JWT_SECRET`**  
     Replace with any long random string (used to sign login tokens). For example:
     - `JWT_SECRET=motocare-dev-secret-abc123xyz`
     - Or generate one: [randomkeygen.com](https://randomkeygen.com/) (use a “CodeIgniter Encryption Keys” or similar long string).

4. **Save the file.**

Example `.env` (Supabase, fake password): 

```env
PORT=3001
DATABASE_URL=postgresql://postgres.abcdefgh:MyStr0ngP%40ss@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=motocare-dev-secret-abc123xyz
UPLOAD_DIR=./uploads
```

**Note:** If your password has special characters (e.g. `@`, `#`, `%`), you may need to **URL-encode** them in `DATABASE_URL` (e.g. `@` → `%40`, `#` → `%23`).

---

### Step 4: Create the database tables (migration)

This runs the `schema.sql` that creates `users`, `bikes`, `services`, etc.

```powershell
npm run db:migrate
```

You should see:

```text
Migration complete.
```

If you see an error:

- **“connection refused” / “ECONNREFUSED”**  
  Database isn’t running or the URL is wrong. Check:
  - Supabase: project is running, password is correct and replaced in the URL.
  - Local: PostgreSQL service is running, port 5432, database `motocare` exists.

- **“password authentication failed”**  
  Wrong password in `DATABASE_URL`, or wrong user. Fix the password (and special characters) in `.env`.

- **“database … does not exist”**  
  For local Postgres: create the `motocare` database (see Option B, Step 3).

---

### Step 5: Start the backend server

```powershell
npm run dev
```

You should see something like:

```text
MotoCare API on http://localhost:3001
```

Leave this terminal open. The backend is now running.

---

### Step 6: Quick test

Open a **new** terminal (or a browser) and check:

- **Browser:** open [http://localhost:3001/api/health](http://localhost:3001/api/health)  
  You should see: `{"ok":true}`

- **PowerShell:**
  ```powershell
  Invoke-RestMethod -Uri http://localhost:3001/api/health
  ```
  Should return `ok: true`.

---

## Summary checklist

- [ ] PostgreSQL database ready (Supabase **or** local).
- [ ] `server/.env` created from `.env.example`.
- [ ] `DATABASE_URL` in `.env` set to your real connection string (password in it).
- [ ] `JWT_SECRET` in `.env` set to a long random string.
- [ ] `npm install` run in `server`.
- [ ] `npm run db:migrate` run successfully.
- [ ] `npm run dev` running and `http://localhost:3001/api/health` returns `{"ok":true}`.

Next: run the **frontend** (`cd client`, `npm install`, `npm run dev`) and open [http://localhost:5173](http://localhost:5173) to use MotoCare.
