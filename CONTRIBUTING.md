# Contributing to SecureVault

Thank you for your interest in contributing! SecureVault is a security-focused project, so contributions are reviewed carefully.

## Ground Rules

1. **Security first** — no change that weakens the cryptographic architecture will be accepted
2. **No dependencies** — SecureVault is intentionally dependency-free (Vanilla JS only)
3. **Zero-Knowledge must be preserved** — nothing sensitive may be sent to any server

## How to Contribute

### Reporting Bugs
Open a GitHub Issue with:
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS

### Security Vulnerabilities
**Do not open public issues for security bugs.** See [SECURITY.md](SECURITY.md).

### Feature Requests
Open a GitHub Issue with the `enhancement` label. Check the [Roadmap](README.md#roadmap) first — your idea might already be planned.

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes in `index.html`
4. Test in Chrome and Firefox
5. Open a Pull Request with a clear description

## Code Style

- Vanilla JS only — no frameworks, no npm packages
- Use `textContent` instead of `innerHTML` for user-controlled data
- All user input must be validated before use
- Cryptographic operations must use `window.crypto.subtle`

## Roadmap Items Open for Contribution

| Milestone | Status | Good First Issue |
|-----------|--------|-----------------|
| Password Aging Tracker | 🟡 Planned | ✅ Yes |
| Browser Extension | 🔵 Planned | ❌ Complex |
| Digital Legacy | 🔵 Planned | ❌ Complex |
| Project Access Control | 🔵 Planned | ❌ Complex |
