# Keep goldcodeevents.com on Cloudflare and read events from Supabase

The public site must show an Event Manager's save, so it can no longer be a static export. goldcodeevents.com stays on Cloudflare, and events, galleries, and sign-in live in Supabase. Hosting was not moved to Vercel, because the domain is already on Cloudflare. Sign-in is one Event Manager account with a password. A Published Event updates on the public site when it is saved. A new Event stays a Draft until it is published.
