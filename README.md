# TECHPULSE 2027 • Cybertron Robotics Tech Fest

> **Where Future Robotics & Next-Gen Innovators Collide**  
> Official Delegate & Competition Enrollment Portal for the premier robotics & tech festival in South 24 Parganas, Kolkata. Powered by **5 Point Education** & **Kranti Foundation**.

---

## ⚡ Features & Highlights

- **Transformers Cybertron Design System**:
  - Energon Cyan (`#00f0ff`), AllSpark Amber (`#ffb700`), and Decepticon Violet (`#bd34fe`) neon aesthetics.
  - Interactive **Autobot Alliance** vs. **Decepticon Reign** faction protocol switcher.
  - Built-in **Web Audio API sound synthesizer** for authentic Transformers servo transforms, metallic clicks, and HUD telemetry beeps without external sound dependencies.
  - 3D rotating **AllSpark Matrix cube loader**.

- **Surveillance Theater Video Reel**:
  - Interactive multi-feed sci-fi video player showcasing tactical drone arenas, delegate walkthroughs, technology exhibition stalls, and high-speed line followers.

- **7+ Battle Arenas & Competitions**:
  - `01 FAST-TRACK` — Robo Race (Obstacle & drag circuit)
  - `02 MECHSTRIKERS` — Robo Soccer (3v3 robot football clashes)
  - `03 ROBO SUMO` — Robot Combat (Circular ring sumo & ejection)
  - `04 AUTO-PATH` — Autonomous Line Follower (PID sensory navigation)
  - `05 AQUA-BLAST` — Aerodynamic Pressurized Water Rocketry
  - `06 AERO-STRIKE` — FPV Drone Flight & Obstacle Agility
  - `07 CYBER-INNOVATE` — Next-Gen AI & Robotics Hardware Expo

- **Dual-Profile Registration Portal**:
  - **School Student** (`Class / Grade V – XII`, Section, Stream, Guardian contact).
  - **College / University** (`B.Tech, BCA, Diploma, PG`, Department, Year/Sem, Roll Number).
  - Avatar Selector: Optimus Prime, Bumblebee, Megatron, or custom photo upload / live webcam selfie capture.

- **Interactive 3D Holographic ID Pass**:
  - **Live Real-time Sync**: Updates instantly as you type into the form.
  - **Dynamic QR Code**: Generates authentic, scannable QR verification code.
  - **3D Card Flip**: 3D perspective flip between Front (credentials, avatar, QR) and Back (access policies, schedule, barcode).
  - **Download & Print**: 1-click **Download HD Pass** (high-resolution PNG via Canvas) and **Print Lanyard Pass** (browser print-optimized layout).

- **Google Sheets / Apps Script Integration**:
  - Submits registration records in real-time to Google Sheets via Google Apps Script.
  - Dual-mode local registry backup: export all collected entries directly to Microsoft Excel (`.csv` / `.xlsx`) directly from the browser.

---

## 📁 Repository Structure

```text
├── index.html                 # Main single-page web application
├── css/
│   └── cybertron.css          # Transformers design system, HUD styles & mobile queries
├── js/
│   ├── app.js                 # State, pass sync, Web Audio synth & Apps Script connection
│   └── qrcode.js              # Lightweight zero-dependency client QR generator
├── assets/
│   ├── images/                # High-res posters, mecha artwork, and avatar icons
│   └── videos/                # Drone arena, expo grounds, stalls, and line-follower reels
├── google_apps_script.js      # Copy-paste Google Apps Script backend for Google Sheets
├── APPSCRIPT_SETUP_GUIDE.md   # Step-by-step setup guide for Google Sheets & Excel
└── README.md                  # Project documentation
```

---

## 🚀 Deployment & Local Running

### Option A: Local Testing
Run a simple HTTP server in the root folder:
```bash
python -m http.server 8888
```
Then visit `http://localhost:8888` in any browser.

### Option B: GitHub Pages
1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment**, set source to `Deploy from a branch` > branch: `main` / `root`.
3. Your site will be live on GitHub Pages with instant HTTPS!

---

## 📄 License & Credits
- **Organized by**: Kranti Foundation
- **Powered by**: 5 Point Education
- **Design Theme**: Transformers Cybertronian Techno-Fest Aesthetic
