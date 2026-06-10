# BCG - Baseball Card Game
## Async Multiplayer Deploy Guide

Total setup time: ~10 minutes. Both services are free.

---

## STEP 1 — Create a Supabase project (your database)

1. Go to https://supabase.com and sign up (free)
2. Click "New Project", give it a name like "bcg", set a password, pick a region
3. Wait ~1 minute for it to spin up
4. Go to **SQL Editor** (left sidebar) and paste the entire contents of `supabase_setup.sql`, then click **Run**
5. Go to **Project Settings > API** (left sidebar)
6. Copy these two values — you'll need them shortly:
   - **Project URL** (looks like: https://abcdefgh.supabase.co)
   - **anon public** key (a long string starting with "eyJ...")

---

## STEP 2 — Put your code on GitHub

1. Go to https://github.com and create a new **public** repository called `bcg`
2. Upload all the files from this folder into that repo
   - Easiest way: drag and drop files into GitHub's web interface
   - Or use `git init && git add . && git commit -m "init" && git remote add origin YOUR_REPO_URL && git push`
3. Make sure these files are in the repo root:
   - `package.json`
   - `public/index.html`
   - `src/` folder with all .js and .jsx files

---

## STEP 3 — Deploy to Vercel (your hosting)

1. Go to https://vercel.com and sign up with GitHub (free)
2. Click **"Add New Project"**, import your `bcg` GitHub repo
3. Vercel will auto-detect it as a React app. Before clicking Deploy, click **"Environment Variables"** and add:

   | Name | Value |
   |------|-------|
   | `REACT_APP_SUPABASE_URL` | your Supabase Project URL from Step 1 |
   | `REACT_APP_SUPABASE_ANON_KEY` | your Supabase anon key from Step 1 |

4. Click **Deploy**. Vercel builds it and gives you a URL like `bcg-yourname.vercel.app`

---

## STEP 4 — Play!

1. Open your Vercel URL on your phone
2. Enter your name, tap **Start New Game**, build your team
3. After creating the game, tap **Share Link** and text it to your friend
4. Your friend opens the link, joins as the home team, builds their team
5. The away team (you) bats first in the top of inning 1
6. Each player rolls on their own turn — the game auto-syncs in real time
7. When it's not your turn, you see a "Waiting for opponent" banner

---

## HOW THE ASYNC FLOW WORKS

- Games are stored in Supabase as a single JSON object
- Every roll, steal, or pitcher change saves the new game state to the database
- The opponent's screen auto-updates via Supabase real-time subscriptions (no refresh needed)
- Share the URL with multiple friends for multiple simultaneous games
- Games persist — pick up where you left off anytime

---

## TROUBLESHOOTING

**"Game not found" error:** Make sure you ran the SQL setup script in Step 1.

**Real-time not updating:** In Supabase Dashboard, go to Database > Replication and make sure the `games` table is toggled ON under "Source" tables.

**Build fails on Vercel:** Check that your environment variables are set correctly (no extra spaces).

**Players can see each other's rolls:** That's intentional — the game is designed to be transparent like a real board game. Both players can see all actions.

---

## OPTIONAL: Add your own domain

In Vercel, go to your project > Settings > Domains and add any custom domain you own.
