# Testing Guide

## Clone The Repository

```bash
git clone `https://github.com/sylviajsy/TasteVault.git`
cd Taste_vault
```

## Install Dependencies

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

## Set Up Environment Variables

Create a `.env` file in `server/` and add the required backend variables.

Example:

```env
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
```

Create a `.env` file in `client/` and add:

```env
VITE_API_URL=http://localhost:3001
```

## Run The App

### Start The Server

From `server/`:

```bash
npm start
```

### Start The Client

From `client/` in a separate terminal:

```bash
npm run dev
```

## Test The Website

Go to desired branch
```bash
git checkout <branch_name>
```

Open the client URL shown by Vite in your browser, usually:

```text
http://localhost:5173
```

## Manual Testing Checklist

### Discovery Page

- Confirm the page loads.
- Confirm wines are displayed as cards.
- Confirm the search bar filters wine results.
- Click a wine card and confirm the wine detail modal opens.
- Confirm the modal closes correctly.

### Journal Page

- Open the Journal page from the navbar.
- Click `Add Tasting Note`.
- Confirm the modal opens.
- Search for a wine and confirm results appear.
- Select one wine and confirm it fills the wine field.
- Fill in price, sliders, flavors, and comment.
- Click `Generate AI Note` and confirm text is generated if AI is configured.
- Submit the form and confirm the tasting note saves successfully.

## Notes

- Make sure the backend is running before testing the frontend.
- If API requests fail, verify `VITE_API_URL` and server `.env` values.
- If AI note generation fails, verify the OpenAI API key is set correctly.
