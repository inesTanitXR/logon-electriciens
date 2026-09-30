// Supabase Edge Function: e-mail Log-ON when a new devis arrives.
// Deploy:  supabase functions deploy notify-devis --no-verify-jwt
// Secrets: supabase secrets set RESEND_API_KEY=re_xxx NOTIFY_TO=ste@log-on.tn NOTIFY_FROM="Log-ON App <app@log-on.tn>"
// Then in the dashboard: Database → Webhooks → new webhook on table public.devis, event INSERT,
// type "Supabase Edge Function", function notify-devis.
Deno.serve(async (req) => {
  const payload = await req.json().catch(() => null);
  const d = payload?.record;
  if (!d) return new Response("no record", { status: 400 });
  const key = Deno.env.get("RESEND_API_KEY"), to = Deno.env.get("NOTIFY_TO"), from = Deno.env.get("NOTIFY_FROM") || "Log-ON App <onboarding@resend.dev>";
  if (!key || !to) return new Response("missing RESEND_API_KEY / NOTIFY_TO", { status: 500 });
  const ref = String(d.id).slice(0, 6).toUpperCase();
  const html = `<p>Nouveau devis <b>${ref}</b> reçu depuis l’app.</p>
<ul><li>Client : ${d.client_name || "—"} · +216 ${d.client_phone}</li>
<li>Envoyé par : ${d.submitted_by === "pro" ? "l’électricien" : "le client"}</li>
<li>${d.delivery === "delivery" ? "Livraison · " + (d.delivery_zone_id || "") : "Retrait au magasin"}</li>
<li>Photos : ${(d.photos || []).length}</li>
<li>Note : ${d.note || "—"}</li></ul>
<p>Ouvrez l’app → Compte → Administration → Devis pour voir les photos et répondre par WhatsApp.</p>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: `Nouveau devis ${ref} · ${d.client_name || d.client_phone}`, html }),
  });
  return new Response(r.ok ? "sent" : await r.text(), { status: r.ok ? 200 : 502 });
});
