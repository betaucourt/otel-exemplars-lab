# Security Policy

## Supported Versions

| Version | Supported          |
| :------ | :----------------- |
| `0.1.x` | :white_check_mark: |
| `< 0.1` | :x:                |

---

## Telemetry & Trace Security

In observability environments, sensitive credentials, tokens, or PII can inadvertently enter trace attributes or metric labels:

- **Header Scrubbing**: OTLP receivers and producers should never log raw `Authorization` or bearer token headers.
- **Trace Redaction**: Ensure database queries in `producer-go-sql` use parameterized placeholders rather than embedding plaintext literals into trace spans.
- **Network Isolation**: By default, docker-compose exposes OTLP receiver ports only within the local developer environment.

---

## Reporting a Vulnerability

If you discover a security vulnerability in `otel-exemplars-lab`, please report it privately:

1. Open a **GitHub Security Advisory**: [New Security Advisory](https://github.com/betaucourt/otel-exemplars-lab/security/advisories/new)
2. Or contact the maintainer via email: `betaucourt@users.noreply.github.com`

We will acknowledge receipt within **48 hours** and provide a resolution timeline.
