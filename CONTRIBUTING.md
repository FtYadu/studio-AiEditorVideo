# Contributing to AIVidFlow

Thanks for your interest in contributing! We're excited to build this project together.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the required variables.
4. Start the development server:
   ```bash
   npm run dev
   ```
   In another terminal you can run the Genkit watcher:
   ```bash
   npm run genkit:watch
   ```

## Coding Standards

- We use TypeScript and follow the conventions enforced by ESLint.
- Run `npm run lint` and `npm run typecheck` before submitting a PR.
- Add or update tests as appropriate and ensure `npm test` passes.

## Pull Request Process

1. Ensure your branch is rebased on the latest `main`.
2. Provide a clear description of the problem and solution.
3. Update documentation (README, comments) where relevant.
4. Verify that CI checks pass.
5. After review, your PR will be squashed or merged.

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue with
as much detail as possible. Screenshots or code snippets are helpful.

## Security

Please do not commit secrets. Store sensitive values in environment variables or
use GitHub/Vercel secrets. If you discover a security vulnerability, contact the
maintainers privately.
