# पापड़ उड़ 🫓 — Papad Udd Game

A desi Flappy Bird where a **Papad** (thin Indian crispy wafer) navigates through
obstacles. Built to cover core **PHP** and **Next.js** concepts hands-on.

---

## Project Structure

```
papad-udd-game/
├── frontend/                  ← Next.js 14 (App Router + Redux)
│   └── src/
│       ├── app/
│       │   ├── layout.tsx     ← Root layout (Server Component)
│       │   ├── page.tsx       ← Homepage route "/"
│       │   └── globals.css
│       ├── components/
│       │   ├── Providers.tsx  ← Redux <Provider> wrapper
│       │   └── game/
│       │       ├── GameCanvas.tsx      ← Smart/container component
│       │       ├── PapadCharacter.tsx  ← Dumb/presentational component
│       │       ├── ObstacleSet.tsx     ← Renders list of obstacles
│       │       ├── ScoreDisplay.tsx    ← HUD
│       │       ├── MenuScreen.tsx      ← Papad selector + start
│       │       ├── DeathScreen.tsx     ← Game over + score save
│       │       └── Leaderboard.tsx     ← Fetches from PHP
│       ├── store/
│       │   ├── index.ts               ← configureStore
│       │   ├── hooks.ts               ← typed useAppDispatch / useAppSelector
│       │   └── slices/
│       │       └── gameSlice.ts       ← ALL game state + reducers
│       ├── hooks/
│       │   └── useGameLoop.ts         ← rAF loop + keydown hook
│       └── lib/
│           └── api.ts                 ← fetch() calls to PHP
│
└── backend/                   ← PHP 8.1 (OOP + PDO + MVC)
    ├── src/
    │   ├── Database/
    │   │   └── Connection.php  ← PDO Singleton
    │   ├── Models/
    │   │   └── Score.php       ← DB queries with prepared statements
    │   └── Controllers/
    │       └── ScoreController.php ← HTTP handling, JSON responses
    ├── public/
    │   ├── index.php           ← Front Controller / Router
    │   └── .htaccess           ← URL rewriting
    ├── composer.json           ← PSR-4 autoloading config
    ├── setup.sql               ← Database schema
    └── .env                    ← DB credentials (edit this!)
```

---

## PHP Concepts Covered

| Concept | Where |
|---|---|
| OOP — classes, constructors, typed properties | All 3 backend files |
| Singleton pattern | `Connection.php` |
| PDO + prepared statements | `Score.php` |
| MVC — Controller → Model → Response | `ScoreController.php` + `Score.php` |
| Front Controller / Router | `public/index.php` |
| PSR-4 autoloading via Composer | `composer.json` |
| `php://input` for JSON body reading | `ScoreController.php` |
| HTTP status codes + CORS headers | `ScoreController.php` |
| `.env` config loading | `public/index.php` |
| Data validation + sanitisation | `Score.php` |
| Error handling (`try/catch`) | `ScoreController.php` |

---

## Next.js + React Concepts Covered

| Concept | Where |
|---|---|
| App Router — `page.tsx`, `layout.tsx` | `app/` folder |
| Server Components vs Client Components | `page.tsx` (server) vs `GameCanvas.tsx` (client) |
| `"use client"` directive | `DeathScreen.tsx`, `Leaderboard.tsx`, `Providers.tsx` |
| Redux Toolkit — `createSlice`, `configureStore` | `gameSlice.ts`, `store/index.ts` |
| `PayloadAction`, typed reducers | `gameSlice.ts` |
| Immer immutable state mutations | `gameSlice.ts` (you write `state.score += 1` directly) |
| Selectors | `gameSlice.ts` bottom section |
| `useSelector` / `useDispatch` (typed) | `store/hooks.ts` |
| Custom Hooks | `useGameLoop.ts` |
| `requestAnimationFrame` + cleanup | `useGameLoop.ts` |
| Controlled inputs | `MenuScreen.tsx` |
| Smart vs Dumb components | `GameCanvas.tsx` vs `PapadCharacter.tsx` |
| `useEffect` for data fetching | `Leaderboard.tsx` |
| `useState` for local async state | `DeathScreen.tsx` |
| `NEXT_PUBLIC_` env variables | `next.config.js`, `lib/api.ts` |
| Centralised fetch layer | `lib/api.ts` |

---

## Setup — Step by Step

### 1. MySQL Database

```bash
mysql -u root -p < backend/setup.sql
```

### 2. PHP Backend

```bash
cd backend
composer install          # generates vendor/ with PSR-4 autoloader

# Edit .env with your MySQL credentials
nano .env

# Start the dev server on port 8000
php -S localhost:8000 -t public/
```

Test it:
```bash
curl http://localhost:8000/api/scores
# → {"success":true,"scores":[]}
```

### 3. Next.js Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_PHP_API_URL=http://localhost:8000" > .env.local

npm run dev   # starts on http://localhost:3000
```

---

## Game Physics

Each papad type has different physics constants in `gameSlice.ts`:

| Papad | Gravity | Flap Power | Feel |
|---|---|---|---|
| 🫓 Kacha (raw) | 0.35 | -7 | Floaty, forgiving |
| 🟤 Tala (fried) | 0.55 | -9 | Heavy, punchy — hard mode |
| 🟡 Seka (baked) | 0.42 | -7.8 | Balanced |

---

## Assignment for You

Once you have this running, try these to deepen your understanding:

1. **PHP**: Add a `DELETE /api/scores/{id}` route — add the route in `index.php`, a
   `delete(int $id)` method in `Score.php`, and a `destroy()` method in `ScoreController.php`.

2. **Redux**: Add a `paused` state — pressing `P` should toggle between `running` and
   `paused` without resetting the game. Add the action to `gameSlice.ts` and the
   keydown handler in `useGameLoop.ts`.

3. **Next.js**: Create a new page `app/leaderboard/page.tsx` that is a Server Component
   and fetches the leaderboard data directly on the server using `fetch()` at build/request time.
   Compare it with the client-side fetch in `Leaderboard.tsx`.
