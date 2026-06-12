# Task 3+4: Backend API Builder - Work Summary

## Completed Routes

### Auth Routes (src/app/api/auth/)
- **POST /api/auth/signup** - Register with email, name, password. Uses SHA-256 hash. Sets `mortality-session` cookie. Returns `{ user: { id, email, name, avatar, createdAt } }`.
- **POST /api/auth/login** - Login with email/password. Verifies SHA-256 hash. Sets session cookie. Returns user object.
- **POST /api/auth/logout** - Clears session cookie.
- **GET /api/auth/me** - Gets current user from session cookie. Returns `{ user: {...} }` or 401.

### Mortality Routes (src/app/api/mortality/)
- **GET /api/mortality** - Returns raw mortality JSON data.
- **GET /api/mortality/summary** - Returns computed summary: life expectancy, infant mortality, survival to 65, most dangerous age, probability of reaching 90, gender gap.
- **GET /api/mortality/charts** - Returns chart-ready data with full and sampled series for recharts.

### Curiosities Route (src/app/api/curiosities/)
- **GET /api/curiosities** - 18 curiosities with categories: longevidade, mortalidade, comparacao, dados.

### Quiz Routes (src/app/api/quiz/)
- **GET /api/quiz** - 15 quiz questions with 4 options each, correctIndex, and explanation.
- **POST /api/quiz/score** - Saves score (authenticated). Body: { score, total, timeTaken }.
- **GET /api/quiz/ranking** - Top 20 scores with user info.

## Key Files
- `src/lib/auth.ts` - Auth utilities (hash, session cookies)
- Session cookie name: `mortality-session`
