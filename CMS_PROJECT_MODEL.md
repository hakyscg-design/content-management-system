# CMS Project Model

CMS owns reusable production-layer capabilities. Projects own operating identity and project-specific configuration.

```text
CMS
  -> Project
```

A Project may define:

- identity
- platforms
- audience
- language
- content formats
- configuration
- scheduling preferences
- checklist templates
- project-specific metadata
- operating policy references
- naming and file conventions

CMS-01 does not implement multi-tenant SaaS behavior. This remains a simple local tool with project profiles.
