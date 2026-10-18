"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseContext } from "@/lib/supabase/context";
import type { EventStatus } from "@/lib/types";

const statuses: EventStatus[] = ["coming_soon", "available", "low_availability", "sold_out", "postponed", "cancelled"];

async function requireAdmin() {
  const { data, error } = await createSupabaseContext({ auth: "user" });
  if (error || !data?.userClaims) throw new Error("Sign in as the Event Manager.");
  const userId = data.userClaims.id;
  const { data: row } = await data.supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (!row) throw new Error("This account cannot edit events.");
  return data;
}

function eventPayload(formData: FormData) {
  const status = String(formData.get("status") ?? "coming_soon");
  const publishState = formData.get("publishState") === "published" ? "published" : "draft";
  const paragraphs = String(formData.get("paragraphs") ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const startsAt = nzTimestamp(String(formData.get("startsAt") ?? ""));
  const endsAt = nzTimestamp(String(formData.get("endsAt") ?? ""));
  return {
    title: String(formData.get("title") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    series: String(formData.get("series") ?? "").trim() || null,
    place_line: String(formData.get("placeLine") ?? "").trim(),
    paragraphs,
    description: String(formData.get("description") ?? "").trim(),
    past: formData.get("past") === "on",
    starts_at: startsAt,
    ends_at: endsAt,
    venue: String(formData.get("venue") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim() || "Auckland",
    age_restriction: String(formData.get("ageRestriction") ?? "").trim(),
    ticket_url: String(formData.get("ticketUrl") ?? "").trim(),
    status: statuses.includes(status as EventStatus) ? status : "coming_soon",
    publish_state: publishState,
  };
}

function nzTimestamp(value: string) {
  if (!value) return null;
  const month = Number(value.slice(5, 7));
  const offset = month >= 10 || month <= 3 ? "+13:00" : "+12:00";
  return `${value.length === 16 ? `${value}:00` : value}${offset}`;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function refresh(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/events");
  revalidatePath("/gallery");
  if (slug) revalidatePath(`/events/${slug}`);
}

export async function saveEvent(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const payload = eventPayload(formData);
  if (!payload.title || !payload.name) throw new Error("A night needs a title and a name.");
  const { error } = await ctx.supabase.from("events").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  const { data } = await ctx.supabase.from("events").select("slug").eq("id", id).single();
  refresh(data?.slug);
}

export async function createEvent(formData: FormData) {
  const ctx = await requireAdmin();
  const payload = eventPayload(formData);
  if (!payload.title || !payload.name) throw new Error("A night needs a title and a name.");
  const slug = slugify(String(formData.get("slug") ?? "") || payload.title);
  const { error } = await ctx.supabase.from("events").insert({ ...payload, slug, publish_state: "draft" });
  if (error) throw new Error(error.message);
  refresh(slug);
}

export async function addEventPhoto(formData: FormData) {
  const ctx = await requireAdmin();
  const eventId = String(formData.get("eventId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose a photograph.");
  const { count } = await ctx.supabase.from("gallery_items").select("id", { count: "exact", head: true }).eq("event_id", eventId);
  if ((count ?? 0) >= 10) throw new Error("This night already has ten photographs.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${eventId}/${crypto.randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await ctx.supabaseAdmin.storage.from("event-photos").upload(path, bytes, { contentType: file.type || "image/jpeg" });
  if (uploadError) throw new Error(uploadError.message);
  const caption = String(formData.get("caption") ?? "").trim();
  const { error } = await ctx.supabase.from("gallery_items").insert({
    event_id: eventId,
    image_path: path,
    alt_text: caption || "Photograph from a GoldCode night",
    caption,
    sort_order: count ?? 0,
  });
  if (error) throw new Error(error.message);
  const { data } = await ctx.supabase.from("events").select("slug").eq("id", eventId).single();
  refresh(data?.slug);
}

export async function movePhoto(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? -1 : 1;
  const { data: photo } = await ctx.supabase.from("gallery_items").select("id, event_id, sort_order").eq("id", id).single();
  if (!photo) return;
  const { data: siblings } = await ctx.supabase.from("gallery_items").select("id, sort_order").eq("event_id", photo.event_id).order("sort_order");
  const list = siblings ?? [];
  const index = list.findIndex((item) => item.id === id);
  const swap = list[index + direction];
  if (!swap) return;
  const { error: firstError } = await ctx.supabase.from("gallery_items").update({ sort_order: swap.sort_order }).eq("id", photo.id);
  const { error: secondError } = await ctx.supabase.from("gallery_items").update({ sort_order: photo.sort_order }).eq("id", swap.id);
  if (firstError || secondError) throw new Error(firstError?.message ?? secondError?.message);
  refresh();
}

export async function updatePhoto(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const { error } = await ctx.supabase.from("gallery_items").update({
    caption,
    alt_text: caption || "Photograph from a GoldCode night",
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deletePhoto(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { data: photo } = await ctx.supabase.from("gallery_items").select("image_path, event_id").eq("id", id).single();
  const { error } = await ctx.supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (photo?.image_path && !photo.image_path.startsWith("/")) {
    await ctx.supabaseAdmin.storage.from("event-photos").remove([photo.image_path]);
  }
  refresh();
}
