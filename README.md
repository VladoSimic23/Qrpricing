# QR Cjenik Monorepo

Monorepo that contains both apps:

- `frontend/` -> Next.js app (dashboard + public menu + embedded Studio route)
- `backend/qr-cjenik/` -> standalone Sanity Studio project

## Repository Structure

```text
qrcjenik/
  backend/
    qr-cjenik/
  frontend/
```

## Prerequisites

- Node.js 20+
- npm 10+

## Local Setup

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Backend Studio

```bash
cd backend/qr-cjenik
npm install
npm run dev
```

## GitHub Preparation (Single Repo: backend + frontend)

This workspace currently contains nested git repositories in:

- `frontend/.git`
- `backend/qr-cjenik/.git`

If you want one GitHub repository at `qrcjenik/`, remove nested git metadata before first root commit.

PowerShell:

```powershell
Remove-Item -Recurse -Force .\frontend\.git
Remove-Item -Recurse -Force .\backend\qr-cjenik\.git
```

Then initialize and commit from root:

```bash
git init
git add .
git commit -m "Initial monorepo commit"
```

## Security Notes

- Never commit `.env` files.
- Use `frontend/.env.example` as a template.
- Rotate any secrets that were previously exposed.
