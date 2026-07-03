# MigraineTracker GUI

MigraineTracker-GUI is a [**Vite**](https://vite.dev) + React/TypeScript frontend for tracking and analyzing migraine episodes, using the [**MigraineTrackerV3**](https://github.com/iLovePizzaDC/migraineTrackerV3) backend.

---

## Prerequisites

- [MigraineTrackerV3](https://github.com/iLovePizzaDC/migraineTrackerV3) project is set up
- Node.js/npm

---

## Environment Variables

Create a `.env` file in the project root:

```properties
VITE_BASE_URL="http://localhost:5173/"
VITE_ENDPOINT_BASE_URL="http://localhost:8080/"
VITE_API_URL_SUFFIX="api/"
VITE_GOOGLE_REDIRECT_URL_SUFFIX="home/"
VITE_GOOGLE_CLIENT_ID="changeme"
```

The `.env` file is automatically loaded and must not be committed.

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Architecture

Single-page application built with Vite and React/TypeScript, following **Atomic Design** and **Feature-Driven Design** principles.

- **Features** – self-contained modules organized by domain
- **Atoms / Molecules / Organisms** – components organized by size and complexity
- **Shared** – reusable hooks, types, and API functions used across features

Authentication is handled via Google OAuth redirect. The session is managed through a session cookie set by the backend.

---

## CI/CD

This project uses GitHub Actions with a self-hosted runner on a Raspberry Pi (Luna).

**On every push and pull request to main/develop:**

- Type checking
- Linting
- Unit tests
- Security audit (`npm audit`)

**On release tag (`v*`):**

- Builds the project with production environment variables
- Deploys the `dist` folder to Luna
- Runs a health check against `https://migrainetracker.de`
- Automatically rolls back on failure

Releases are managed via [release-please](https://github.com/googleapis/release-please-action) and main is automatically synced to develop after every merge.

---

## Manually deploy new version

```bash
npm run build
```

Move the **dist** folder to Luna at `~`, then run:

```bash
sudo rm -rf /var/www/migrainetracker/
sudo mkdir /var/www/migrainetracker
sudo cp -r ~/dist/* /var/www/migrainetracker/
sudo rm -rf ~/dist
sudo chown -R github-runner:github-runner /var/www/migrainetracker
sudo chmod -R 755 /var/www/migrainetracker
```

---

## Commit message convention

- `feat: xxx` → Minor version (1.0.0 → 1.1.0)
- `fix: xxx` → Patch version (1.0.0 → 1.0.1)
- `feat!: xxx` → Major version (1.0.0 → 2.0.0)
- `chore: xxx` → no release
