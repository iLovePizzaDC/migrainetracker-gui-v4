# MigraineTracker-GUI-v4

MigraineTracker-GUI is a [**Vite**](https://vite.dev) project, using the [**MigraineTrackerV3**](https://github.com/iLovePizzaDC/migraineTrackerV3) endpoints.

---

## Prerequisites

- [MigraineTrackerV3](https://github.com/iLovePizzaDC/migraineTrackerV3) project is set up
- Node.js/npm

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_BASE_URL="http://localhost:5173/"
VITE_ENDPOINT_BASE_URL="http://localhost:8080/"
VITE_API_URL_SUFFIX="api/"
VITE_GOOGLE_REDIRECT_URL_SUFFIX="home/"
VITE_GOOGLE_CLIENT_ID="changeme"
```

The `.env` file is automatically loaded and must not be committed.

## MigraineTrackerV3 endpoints

Start the server by running the  [MigraineTrackerV3](https://github.com/iLovePizzaDC/migraineTrackerV3) project in IntelliJ.
