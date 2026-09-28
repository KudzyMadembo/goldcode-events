"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, Mail, Music2 } from "@/components/icons";
import { springHeat, statusLabels } from "@/lib/events";
import { createSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setMessage(error ? error.message : "Check your email for a secure sign-in link.");
  }

  if (!hasSupabaseConfig) return <section className="admin-setup"><Music2 size={34} /><p className="kicker">Admin preview</p><h1>Connect Supabase to open the dashboard.</h1><p>The public site is ready to preview. Add the two values from <code>.env.example</code> to enable passwordless access, persistent events, gallery uploads, and publishing controls.</p></section>;

  if (!user) return <section className="admin-login"><p className="kicker">GoldCode manager</p><h1>Sign in to manage events.</h1><form onSubmit={signIn}><label htmlFor="admin-email">Authorized email</label><div><Mail size={18} /><input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div><button className="button" type="submit">Send secure link</button></form>{message && <p className="form-message">{message}</p>}</section>;

  return <section className="dashboard"><div className="dashboard-top"><div><p className="kicker">GoldCode manager</p><h1>Events</h1></div><button className="button" type="button">Create event</button></div><div className="dashboard-stats"><article><span>Published</span><strong>1</strong></article><article><span>Drafts</span><strong>0</strong></article><article><span>Gallery images</span><strong>0</strong></article></div><article className="admin-event"><div><CalendarDays size={20} /><span className="status low_availability">{statusLabels.low_availability}</span></div><h2>{springHeat.name}</h2><p>24 October 2026 · Vogue Lounge</p><div><button type="button">Edit</button><button type="button">Archive</button></div></article></section>;
}
