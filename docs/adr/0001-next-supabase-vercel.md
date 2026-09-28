# Use Next.js, Supabase, and Vercel

GoldCode Events needs a fast public site and a private client-managed dashboard with durable event records, image uploads, and passwordless access. We chose Next.js with Supabase and Vercel instead of a static site or custom ticket platform so the client can manage content while ticket payment remains with Humanitix; this introduces external service configuration but avoids building payment and identity infrastructure from scratch.
