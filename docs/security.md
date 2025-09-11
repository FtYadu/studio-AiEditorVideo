# Security & Secret Management

This project uses API keys and other credentials to interact with external services. Keep these values out of source control and limit their scope.

## Storing Secrets

- **Local development**: create a local `.env` file based on `.env.example`. This file is ignored by git.
- **Vercel deployments**: define secrets in the [Vercel project settings](https://vercel.com/docs/projects/environment-variables). Use separate values for development, preview, and production.
- **GitHub Actions**: configure secrets in the repository under **Settings → Secrets and variables → Actions**. Reference them in workflows via `${{ secrets.MY_SECRET }}`.

## Rotation Checklist

1. Generate a new key with the minimal permissions required.
2. Update the value in Vercel and GitHub Secrets.
3. Redeploy or rerun the workflow to pick up the new value.
4. Revoke or delete the previous key.

## Tips

- Never commit real keys or tokens; scan your history before pushing changes.
- Prefer distinct keys for each environment and service.
- Log key usage to detect anomalies and plan future rotations.
