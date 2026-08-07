# Security

Football Troll Vault v2 is manual-first and human-governed. Secrets, platform credentials, tokens, cookies, private keys, and production connection strings must never be committed.

Use `.env.example` and `.env.test.example` for fake non-sensitive examples only. Local environment files such as `.env`, `.env.local`, `.env.test`, and `.env.*.local` are ignored by version control.

Logging must not expose credentials, private source material, rights-sensitive notes, personal data, or platform account tokens. Dependency additions require license and security review before direct adoption.

Security issues should be recorded as review findings and handled before any Freeze or release decision.
