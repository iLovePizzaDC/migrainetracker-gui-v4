# MigraineTracker-GUI-v4

MigraineTracker-GUI is a [**Vite**](https://vite.dev) project, using the [**MigraineTrackerV3**](https://github.com/iLovePizzaDC/migraineTrackerV3) endpoints.

---

## Prerequisites

- [MigraineTrackerV3](https://github.com/iLovePizzaDC/migraineTrackerV3) project is set up
- Node.js/npm

---

## Environment Variables

Create a `.env` file in the project root

```properties
VITE_BASE_URL="http://localhost:5173/"
VITE_ENDPOINT_BASE_URL="http://localhost:8080/"
VITE_API_URL_SUFFIX="api/"
VITE_GOOGLE_REDIRECT_URL_SUFFIX="home/"
VITE_GOOGLE_CLIENT_ID="changeme"
```

The `.env` file is automatically loaded and must not be committed.

## Deploy new version

First build the code with

```bash
npm run build
```

Move the **dist** folder to Luna at `~`.

After this run the following commands

```bash
sudo rm -rf /var/www/migrainetracker/
sudo mkdir /var/www/migrainetracker
sudo cp -r ~/dist/* /var/www/migrainetracker/
sudo rm -rf ~/dist
sudo chown -R www-data:www-data /var/www/migrainetracker
sudo chmod -R 755 /var/www/migrainetracker
```

## MigraineTrackerV3 endpoints

Start the server by running the [MigraineTrackerV3](https://github.com/iLovePizzaDC/migraineTrackerV3) project in IntelliJ.

## Commit message convention

- `feat: xxx` → Minor version (1.0.0 → 1.1.0)
- `fix: xxx` → Patch version (1.0.0 → 1.0.1)
- `feat!: xxx` → Major version (1.0.0 → 2.0.0)
- `chore: xxx` → no release
