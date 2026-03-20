# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Active  |

## Security Architecture

SecureVault is built on a Zero-Knowledge architecture. This means:

- All encryption and decryption happens **client-side in the browser**
- The master password **never leaves your device**
- GitHub stores only an **encrypted blob** — it cannot read your data
- No backend server, no telemetry, no external dependencies

## Cryptographic Standards

| Component | Standard | Parameters |
|-----------|----------|------------|
| Encryption | AES-256-GCM | 12-byte random IV per entry |
| Key Derivation | PBKDF2-SHA256 | 200,000 iterations |
| Auth Hash | PBKDF2-SHA256 | 100,000 iterations |
| Salt | CSPRNG | 24 bytes per user |
| Password Generator | CSPRNG | 142-bit entropy |
| Hash Comparison | HMAC-based timing-safe | Prevents timing attacks |

All cryptographic operations use the **Web Crypto API** — a native browser standard audited by browser vendors.

## Known Limitations

- **No audit log** — by design. Zero-Knowledge means the operator cannot see what is decrypted.
- **No per-project access control** — all users with vault access see all entries (Milestone 4 will address this).
- **GitHub metadata visible** — sync timestamps are visible in the repository commit history.
- **Token in localStorage** — if the user chooses persistent storage, the GitHub token persists until explicit logout.

## Reporting a Vulnerability

If you discover a security vulnerability, please do **not** open a public GitHub issue.

Instead, report it via:
1. GitHub Security Advisories (preferred): Repository → Security → Advisories → New Draft
2. Email the maintainer directly

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

You will receive a response within **72 hours**. We take all security reports seriously and will credit responsible disclosure.

## Security Test Results (v1.0)

59 tests passed · 0 failed · 7 minor warnings (all addressed in v1.0.1)

Categories tested: XSS, CSRF, Authentication, Cryptography, Data Storage, Input Validation, API Security, DOM Security, Data Leakage, Session Management, Conflict Resolution.
