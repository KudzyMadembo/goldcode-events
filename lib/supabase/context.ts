import { createServerClient } from "@supabase/ssr";
import { createContextClient, createAdminClient, verifyCredentials } from "@supabase/server/core";
import type { AuthModeWithKey, SupabaseContext, SupabaseEnv } from "@supabase/server";
import { cookies } from "next/headers";

function resolveNextEnv(): Partial<SupabaseEnv> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  return {
    url: url ?? undefined,
    publishableKeys: publishableKey ? { default: publishableKey } : {},
    secretKeys: secretKey ? { default: secretKey } : {},
  };
}

let cachedJwks: SupabaseEnv["jwks"] = null;

async function getJwks(supabaseUrl: string): Promise<SupabaseEnv["jwks"]> {
  if (cachedJwks) return cachedJwks;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
    if (!res.ok) return null;
    cachedJwks = await res.json();
    return cachedJwks;
  } catch {
    return null;
  }
}

export function createPublicClient() {
  return createContextClient({ env: resolveNextEnv() });
}

export async function createSupabaseContext(
  options: { auth?: AuthModeWithKey | AuthModeWithKey[] } = { auth: "user" },
): Promise<{ data: SupabaseContext; error: null } | { data: null; error: Error }> {
  const nextEnv = resolveNextEnv();
  if (!nextEnv.url || !nextEnv.publishableKeys?.default) {
    return { data: null, error: new Error("Missing Supabase URL or publishable key") };
  }

  const cookieStore = await cookies();
  const ssrClient = createServerClient(nextEnv.url, nextEnv.publishableKeys.default, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) => cookieStore.set(name, value, cookieOptions));
        } catch {
          // Server Components cannot write cookies. Proxy refreshes them.
        }
      },
    },
  });

  const {
    data: { session },
  } = await ssrClient.auth.getSession();
  const token = session?.access_token ?? null;
  const jwks = await getJwks(nextEnv.url);
  const env: Partial<SupabaseEnv> = { ...nextEnv, jwks };
  const { data: auth, error } = await verifyCredentials(
    { token, apikey: null },
    { auth: options.auth ?? "user", env },
  );
  if (error || !auth) return { data: null, error: error ?? new Error("Sign-in required") };

  return {
    data: {
      supabase: createContextClient({ auth: { token: auth.token }, env }),
      supabaseAdmin: createAdminClient({ env }),
      userClaims: auth.userClaims,
      jwtClaims: auth.jwtClaims,
      authMode: auth.authMode,
    },
    error: null,
  };
}
