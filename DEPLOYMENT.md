# Deployment Guide: LeafDoc on Render.com

This guide will walk you through deploying the LeafDoc application using the provided configuration files.

## Prerequisites
1. A [Render.com](https://render.com) account.
2. Your LeafDoc repository pushed to GitHub or GitLab.

## Deployment Steps

### 1. Connect Repository
1. Log in to the Render Dashboard.
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub/GitLab repository.

### 2. Configure Environment Variables
Render will detect the `render.yaml` file and prompt you for the following environment variables:

| Variable | Description |
| :--- | :--- |
| `REPLICATE_API_TOKEN` | Your API token from [Replicate](https://replicate.com). |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID. |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret. |
| `AUTH_SECRET` | Generated automatically by Render (or provide a random string). |
| `NEXTAUTH_URL` | Your public Render URL (e.g., `https://leafdoc.onrender.com`). |
| `DATABASE_URL` | Your **Neon.tech** connection string (e.g., `postgres://user:pass@ep-cool-name...`). |

### 3. Database Persistence
By using **Neon.tech**, your database is managed externally. This ensures your plant scans and user data are preserved across deployments and server restarts, even on Render's Free tier.

### 4. Build & Deploy
Once you click **Apply**, Render will:
1. Provision a Web Service.
2. Provision a Persistent Disk.
3. Install dependencies and build the Next.js app.
4. Run `prisma db push` to initialize/update the database schema.
5. Start the application.

## Troubleshooting
- **Prisma Errors**: If you encounter issues with database connections, ensure `DATABASE_URL` is set correctly to `file:/data/sqlite.db`.
- **Auth Errors**: Make sure `NEXTAUTH_URL` matches your actual Render domain and your Google OAuth "Authorized redirect URIs" include `https://<your-app>.onrender.com/api/auth/callback/google`.
