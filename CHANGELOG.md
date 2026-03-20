# Changelog

All notable changes to SecureVault are documented here.

---

## [1.0.1] - 2025-03 · Security Patch

### Fixed
- **XSS** — `innerHTML` in setup confirmation box replaced with safe DOM construction (`textContent`)
- **Timing Attack** — Password hash comparison now uses HMAC-based timing-safe method instead of direct string equality
- **Token Persistence** — GitHub token is now cleared from both `localStorage` and `sessionStorage` on logout
- **Account Enumeration** — Registration and login now return generic error messages to prevent username probing
- **Input Validation** — Username now validated with strict regex `^[a-zA-Z0-9_]{3,32}$`
- **Notes Length** — Notes field limited to 5,000 characters (HTML `maxlength` + server-side slice)
- **Inline Handlers** — All `onclick` inline attributes replaced with `addEventListener` in `DOMContentLoaded`

### Security Test Results
- 59 tests passed · 0 failed · 0 warnings (was 7 warnings in v1.0.0)

---

## [1.0.0] - 2025-03 · Initial Release

### Added
- AES-256-GCM encryption for all vault entries
- PBKDF2 key derivation (200,000 iterations, SHA-256)
- GitHub API as encrypted remote storage (`vault.db.enc`)
- Zero-Knowledge architecture — master password never leaves the browser
- Team Vault — shared vault key, individual master passwords
- Multi-user support with admin-controlled user creation
- GitHub Token Access Control — time-based and revocable access
- Project/category organization
- Cryptographically secure password generator (142-bit entropy)
- Real-time search
- Brute-force protection (5 attempts → 5-minute lockout)
- Sync conflict detection and resolution (SHA pre-check + 409 handler)
- Token storage choice: localStorage (persistent) vs sessionStorage (session-only)
- Password reveal toggle (blurred by default)
- 1-click copy for passwords and usernames
- History API cleanup — no credentials in browser URL history
- Mobile-responsive layout
