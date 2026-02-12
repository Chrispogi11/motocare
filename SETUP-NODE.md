# Set up Node.js and npm on Windows

Node.js includes **npm** (the package manager). Install once and you get both.

## Option 1: Official installer (recommended)

1. **Download**
   - Go to [https://nodejs.org](https://nodejs.org)
   - Download the **LTS** version (e.g. "22.x LTS") for Windows.
   - Choose the **Windows Installer (.msi)** (64-bit if your PC is 64-bit).

2. **Install**
   - Run the downloaded `.msi` file.
   - Click **Next** through the steps.
   - Accept the license and leave the default install path (`C:\Program Files\nodejs\`).
   - On "Custom Setup", keep **Node.js** and **npm** selected.
   - Check **"Add to PATH"** if you see that option (installer usually does this by default).
   - Finish the installer.

3. **Restart your terminal (and Cursor)**  
   So that the updated PATH is picked up.

4. **Verify**
   Open a **new** PowerShell or Command Prompt and run:
   ```powershell
   node -v
   npm -v
   ```
   You should see version numbers (e.g. `v22.x.x` and `10.x.x`).

## Option 2: Winget (if you use Windows Package Manager)

In PowerShell (Run as Administrator optional for winget):

```powershell
winget install OpenJS.NodeJS.LTS
```

Then close and reopen your terminal and run `node -v` and `npm -v`.

## After Node/npm are installed

From the **Moto-Care** folder:

**Terminal 1 – backend**
```powershell
cd server
npm install
# Create server\.env from server\.env.example and set DATABASE_URL, JWT_SECRET
npm run db:migrate
npm run dev
```

**Terminal 2 – frontend**
```powershell
cd client
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) for MotoCare.

## Troubleshooting

- **"node is not recognized"**  
  Node is not in your PATH. Restart Cursor/terminal after installing. If it still fails, re-run the Node installer and ensure "Add to PATH" is enabled, or add `C:\Program Files\nodejs\` to your [system PATH](https://learn.microsoft.com/en-us/windows/win32/procthread/environment-variables).

- **Permission errors**  
  Don’t run the installer or npm as Administrator unless needed. If you get EACCES errors, avoid installing global packages with sudo/admin; use project-local installs only.
