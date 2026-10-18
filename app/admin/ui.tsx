"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "@/components/icons";
import { addEventPhoto, createEvent, deletePhoto, movePhoto, saveEvent, updatePhoto } from "./actions";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { statusLabels } from "@/lib/events";
import type { EventStatus, GoldCodeEvent } from "@/lib/types";

const managerEmail = "kudzymad@gmail.com";

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signIn(event: FormEvent) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }
    const email = username.trim().toLowerCase() === "goldcode" ? managerEmail : username.trim();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <section className="admin-login">
      <p className="kicker">GoldCode manager</p>
      <h1>Sign in to manage events.</h1>
      <form onSubmit={signIn}>
        <label htmlFor="admin-username">Username</label>
        <div><Mail size={18} /><input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Goldcode" required /></div>
        <label htmlFor="admin-password">Password</label>
        <div><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
        <button className="button" type="submit">Sign in</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

function aucklandInput(value: string) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function ActionForm({ action, children, className, success = "Saved." }: { action: (formData: FormData) => Promise<void>; children: React.ReactNode; className?: string; success?: string }) {
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  return (
    <form className={className} action={async (formData) => {
      setMessage("");
      try {
        await action(formData);
        setFailed(false);
        setMessage(success);
      } catch (error) {
        setFailed(true);
        setMessage(error instanceof Error ? error.message : "Something went wrong.");
      }
    }}>
      {children}
      {message && <p className={failed ? "admin-message error" : "admin-message"}>{message}</p>}
    </form>
  );
}

function EventForm({ event }: { event: GoldCodeEvent }) {
  return (
    <div className="admin-panel">
      <ActionForm action={saveEvent} className="admin-editor">
        <input type="hidden" name="id" value={event.id} />
        <div className="admin-split">
          <label>Title<input name="title" defaultValue={event.title} required /></label>
          <label>Short name<input name="name" defaultValue={event.name} required /></label>
        </div>
        <div className="admin-split">
          <label>Series<input name="series" defaultValue={event.series ?? ""} /></label>
          <label>Place line<input name="placeLine" defaultValue={event.placeLine} /></label>
        </div>
        <label>Story<span className="admin-hint">Separate paragraphs with a blank line.</span><textarea name="paragraphs" defaultValue={event.paragraphs.join("\n\n")} /></label>
        <label>Search description<span className="admin-hint">One sentence for the page title area and search results.</span><input name="description" defaultValue={event.description} /></label>
        <div className="admin-split">
          <label>Starts<input type="datetime-local" name="startsAt" defaultValue={aucklandInput(event.startsAt)} /></label>
          <label>Ends<input type="datetime-local" name="endsAt" defaultValue={aucklandInput(event.endsAt)} /></label>
        </div>
        <label className="admin-check"><input type="checkbox" name="past" defaultChecked={event.past} /> This night has passed</label>
        <div className="admin-split">
          <label>Venue<input name="venue" defaultValue={event.venue} /></label>
          <label>City<input name="city" defaultValue={event.city} /></label>
        </div>
        <label>Address<input name="address" defaultValue={event.address} /></label>
        <label>Humanitix link<span className="admin-hint">Leave this empty and the ticket button stays hidden.</span><input name="ticketUrl" defaultValue={event.ticketUrl} placeholder="https://events.humanitix.com/..." /></label>
        <div className="admin-split">
          <label>Age note<input name="ageRestriction" defaultValue={event.ageRestriction} /></label>
          <label>Ticket status
            <select name="status" defaultValue={event.status}>
              {(Object.keys(statusLabels) as EventStatus[]).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
            </select>
          </label>
        </div>
        <label>Visibility
          <select name="publishState" defaultValue={event.publishState}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <button className="button" type="submit">Save night</button>
      </ActionForm>
      {event.publishState === "published" && <a className="text-link admin-public" href={`/events/${event.slug}`}>View the public page</a>}
      <div className="admin-editor">
        <h3>Photographs ({event.photos.length}/10)</h3>
        <div className="admin-photos">
          {event.photos.map((photo, index) => (
            <figure key={photo.id}>
              <img src={photo.src} alt={photo.alt} />
              <ActionForm action={updatePhoto}>
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="sortOrder" value={photo.sortOrder} />
                <label>Caption<input name="caption" defaultValue={photo.caption} placeholder="Optional" /></label>
                <button className="admin-text-button" type="submit">Save caption</button>
              </ActionForm>
              <div className="admin-photo-actions">
                <ActionForm action={movePhoto} success="Moved.">
                  <input type="hidden" name="id" value={photo.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" disabled={index === 0}>Move earlier</button>
                </ActionForm>
                <ActionForm action={movePhoto} success="Moved.">
                  <input type="hidden" name="id" value={photo.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" disabled={index === event.photos.length - 1}>Move later</button>
                </ActionForm>
                <ActionForm action={deletePhoto} success="Removed.">
                  <input type="hidden" name="id" value={photo.id} />
                  <button type="submit">Remove</button>
                </ActionForm>
              </div>
            </figure>
          ))}
        </div>
        {event.photos.length < 10 && (
          <ActionForm action={addEventPhoto} success="Photograph added.">
            <input type="hidden" name="eventId" value={event.id} />
            <label>Add a photograph<input type="file" name="file" accept="image/*" required /></label>
            <label>Caption<input name="caption" placeholder="Optional" /></label>
            <button className="button" type="submit">Upload</button>
          </ActionForm>
        )}
      </div>
    </div>
  );
}

export function AdminEditor({ events }: { events: GoldCodeEvent[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const published = events.filter((event) => event.publishState === "published").length;
  const photos = events.reduce((count, event) => count + event.photos.length, 0);

  return (
    <section className="dashboard admin-board">
      <div className="dashboard-top">
        <div><p className="kicker">GoldCode manager</p><h1>Events</h1></div>
        <button className="button" type="button" onClick={async () => { await createSupabaseBrowserClient()?.auth.signOut(); router.refresh(); }}>Sign out</button>
      </div>
      <div className="dashboard-stats">
        <article><span>Published</span><strong>{published}</strong></article>
        <article><span>Drafts</span><strong>{events.length - published}</strong></article>
        <article><span>Photographs</span><strong>{photos}</strong></article>
      </div>
      <button className="button" type="button" onClick={() => setCreating((open) => !open)}>{creating ? "Close new night" : "New night"}</button>
      {creating && (
        <ActionForm action={createEvent} className="admin-editor admin-night admin-panel" success="Draft created.">
          <h2>New night</h2>
          <p className="admin-hint">A new night stays a draft until you publish it.</p>
          <div className="admin-split">
            <label>Title<input name="title" required /></label>
            <label>Short name<input name="name" required /></label>
          </div>
          <label>Story<textarea name="paragraphs" /></label>
          <button className="button" type="submit">Create draft</button>
        </ActionForm>
      )}
      {events.map((event) => (
        <article className="admin-night" key={event.id}>
          <button className="admin-night-toggle" type="button" aria-expanded={openId === event.id} onClick={() => setOpenId(openId === event.id ? null : event.id)}>
            <span><strong>{event.title}</strong><small>{event.placeLine || "No date or venue yet"}</small></span>
            <span className="admin-badges">
              <span className="admin-badge">{event.publishState === "published" ? "Published" : "Draft"}</span>
              <span className="admin-badge">{event.past ? "Past" : "Upcoming"}</span>
              <span className="admin-badge">{event.photos.length}/10 photos</span>
            </span>
          </button>
          {openId === event.id && <EventForm event={event} />}
        </article>
      ))}
    </section>
  );
}
