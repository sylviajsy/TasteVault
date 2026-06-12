# Testing Guide

## Clone The Repository

```bash
git clone https://github.com/sylviajsy/TasteVault.git
cd TasteVault/Taste_vault
```

If you want to test a specific branch:

```bash
git checkout <branch_name>
```

## Install Dependencies

Open two terminals or switch between folders as needed.

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

## Environment Variables

### Server

Create `server/.env`.

Required:

```env
DATABASE_URL=your_supabase_postgres_connection_string
```

Optional:

```env
PORT=3001
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
```

Notes:

- `DATABASE_URL` is required. The server will not start without it.
- `REDIS_URL` is optional. If it is missing, the app will still run without cache.
- `GEMINI_API_KEY` is only needed if you want to test AI note generation.

### Client

Create `client/.env`.

```env
VITE_API_URL=http://localhost:3001
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-api-audience
```

Auth0 is required for the current client login flow.

In your Auth0 application settings, make sure these local URLs are allowed:

- Allowed Callback URLs: `http://localhost:5173/`
- Allowed Logout URLs: `http://localhost:5173`
- Allowed Web Origins: `http://localhost:5173`

Notes:

- `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, and `VITE_AUTH0_AUDIENCE` are required for the frontend to load Auth0 correctly.
- The client currently uses Auth0 login/signup before showing the main app.

## Run The App Locally

### Start The Server

From `server/`:

```bash
npm start
```

The API should run on:

```text
http://localhost:3001
```

You can also verify the backend is up by opening:

```text
http://localhost:3001/
```

It should return a JSON response showing server and database status.

### Optional Redis

If you want to test Redis caching locally and you already have Redis installed:

```bash
brew services start redis
```

If Redis is not running, the app should still work.

### Start The Client

From `client/` in a separate terminal:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## What The App Currently Does

The current app includes:

- a Discovery page for browsing and searching wines
- a Journal page for viewing and creating tasting notes
- a mock user flow on the backend for local development
- optional AI note generation through the Gemini API

## Manual Testing Checklist

### App Load

- Confirm the frontend loads at `http://localhost:5173`.
- Confirm the Auth0 landing page appears if you are not logged in.
- Confirm `Signup` and `Login` buttons are visible.
- Confirm login redirects to Auth0 and returns to `http://localhost:5173/`.
- After login, confirm the navbar appears.
- Confirm the app fetches the current user without crashing.

### Discovery Page

- Confirm Discovery page loads by default.
- Confirm wine cards appear.
- Confirm more wines load as you scroll.
- Type in the search bar and confirm results update.
- Click a wine card and confirm the wine detail modal opens.
- Confirm the modal closes when you click the close button or outside the modal.

### Journal Page

- Open the Journal page from the navbar.
- Confirm existing tasting notes load if your database has any.
- If there are no notes, confirm the empty-state message appears.
- Use the Journal search bar and confirm journal entries filter correctly.
- Click a journal card and confirm the journal detail modal opens.
- Confirm the journal detail modal closes correctly.

### Auth0

- Click `Signup` and confirm Auth0 opens the signup flow.
- Click `Login` and confirm Auth0 opens the login flow.
- After authenticating, confirm you are redirected back to the app.
- Refresh the page and confirm the session is still recognized.
- Log out and confirm you return to the logged-out landing page.

### Add Tasting Note

- On the Journal page, click `Add Tasting Note`.
- Confirm the Add Note modal opens.
- Search for a wine and confirm results appear in the wine picker.
- Select a wine and confirm it is attached to the note.
- Enter price and score.
- Adjust the sliders for acidity, fizziness, intensity, sweetness, and tannin.
- Select flavor groups and notes.
- Unselect a flavor group and confirm that group disappears from selected flavors.
- Add a written comment.
- Submit the note and confirm it saves successfully.

### AI Note Generation

- This test only applies if `GEMINI_API_KEY` is set in `server/.env`.
- In the Add Note modal, click `Generate AI Note`.
- Confirm an AI tasting note is returned.
- Confirm the generated note fits the tasting data you entered.

## Automated Tests

### Client Tests

From `client/`:

```bash
npm test
```

Coverage:

```bash
npm run coverage
```

### Server Tests

From `server/`:

```bash
npm test
```

## Troubleshooting

- If the client cannot reach the backend, check `client/.env` and confirm `VITE_API_URL` points to the running server.
- If login fails before the app loads, verify `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, and `VITE_AUTH0_AUDIENCE` in `client/.env`.
- If Auth0 redirects fail, verify the allowed callback, logout, and web origin URLs in the Auth0 dashboard.
- If the server fails on startup, confirm `DATABASE_URL` is present and valid.
- If wine data does not appear, confirm your database has records in the `wines` table.
- If journal features do not work, confirm your database has the expected tasting note tables and data.
- If AI note generation fails, confirm `GEMINI_API_KEY` is set correctly.
- If Redis errors appear, either start Redis locally or remove `REDIS_URL` from `server/.env`.
