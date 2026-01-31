# Security

Security measures implemented from a penetration-testing perspective.

## XSS (Cross-Site Scripting)

- **React default**: All `{variable}` in JSX is escaped by React; no `dangerouslySetInnerHTML` or raw HTML injection.
- **Markdown (AI answers)**: `react-markdown` is used with **rehype-sanitize** so only safe HTML from markdown is allowed (GitHub-style schema). Scripts, `javascript:` URLs, and dangerous attributes are stripped.
- **Display strings**: User-controlled strings (file names, toast messages) are passed through `sanitizeDisplayString()` to strip control characters and limit length before display (defense in depth).

## HTTP Security Headers (Netlify)

- **Content-Security-Policy**: Restricts script/style sources to `'self'`; `connect-src` allows only the app and `https://api.openai.com`; `frame-ancestors 'none'` prevents embedding in iframes.
- **X-Content-Type-Options: nosniff**: Prevents MIME-type sniffing.
- **X-Frame-Options: DENY**: Mitigates clickjacking.
- **X-XSS-Protection: 1; mode=block**: Legacy XSS filter (CSP is primary).
- **Referrer-Policy: strict-origin-when-cross-origin**: Limits referrer leakage.
- **Permissions-Policy**: Disables unnecessary browser features (camera, mic, etc.).

## Data & Storage

- **API key**: Stored in `localStorage`; shown masked in UI. Not sent to any server except OpenAI when the user asks a question.
- **Documents & Q&A**: Stored in `localStorage`; no server-side persistence in this frontend.

## Recommendations

- No Backend dependency for now so everything sits on the frontend
