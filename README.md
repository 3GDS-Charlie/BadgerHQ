# Badger HQ - Charlie Management Portal

Welcome to **Badger HQ**, this mobile-friendly website allows commanders to seamlessly update parade state and enables PSes to plan guard duty arrangements efficiently.

## Targeted Users

All Charlie key stakeholders.

## User Types
- **Admin:** Ability to POST/UPDATE parade state.
- **User:** READ access only.

## Main Features
- **Personal Account Management:**
  - Login/Logout/Profile Management
- **Parade State:**
  - CRUD (Create, Read, Update, Delete) Parade State
  - Parade State Summary
  - Copy/Paste Parade State Summary
- **Mobile-Friendly Interface**
- **HA Currency Tracking**
- **Lancer Build-Up Qualification**
- **Commander Duty Planning**
- **Troopers Duty Planning**
- **Data Export:**
  - Export parade state and conduct tracking data to CSV
- **Google Analytics Plugin**
- **Charts Page:**
  - Display useful statistics (e.g., best unit statistics, IPPT gold/silver)
- **PWA Install Feature**
- **Offline Capability:** Check if there is an internet connection

## Good to Have Features

- Dark/Light/System Mode
- System Status via BetterUptime
- Strava Leaderboard (Monthly Distance)
- Search Functionality
- Cloudflare IP Whitelisting
- Send Emails to Respective Personnel When Duty is Planned

## Tech Stack

- **Frontend:** Next.js, TailwindCSS
- **Backend:** Supabase
- **Hosting:** Netlify
- **UI Components:** ShadCN
- **Analytics:** Google Analytics

## Contribution

This project is open-source, and contributions are welcome! If you have ideas, suggestions, or want to report issues, please contact @keiloktql.

## Getting Started

1. **Clone the repository:**
    ```sh
    git clone https://github.com/3GDS-Charlie/badger-hq.git
    cd badger-hq
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add your Supabase and other necessary keys.
    ```sh
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4. **Run the development server:**
    ```sh
    npm run dev
    ```

5. **Start the production server:**
    ```sh
    npm start
    ```

## Contact

-   Tham Kei Lok (Project Lead/Fullstack Engineer) - [LinkedIn](https://www.linkedin.com/in/keiloktql/)
