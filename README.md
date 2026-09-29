# NK FOZ 0M! Browser — Secure ChatGPT Setup

## 1. Rotate the exposed API key
The API key previously pasted into chat should be revoked/rotated. Create a fresh key and keep it private.

## 2. Install
Requires Node.js 18+.

```bash
npm install
```

## 3. Set the secret
Create a `.env` file from `.env.example` and set:

OPENAI_API_KEY=your_new_key

For production, use your hosting provider's secret/environment-variable settings instead of committing `.env`.

## 4. Run
```bash
npm start
```

Open:
http://localhost:3000

The browser calls `/api/chat`; the server calls OpenAI. The API key never reaches the browser.

## Files
- `public/index.html` — browser UI
- `server.js` — secure API proxy
- `package.json` — Node dependency
- `.env.example` — environment variable template

The API key must NOT be placed inside the HTML.
