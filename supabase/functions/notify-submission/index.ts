import "@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL = "randy@bayexdelivery.com";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();

    // Database webhook sends: { type, table, record, ... }
    const table = payload.table;
    const record = payload.record;

    let subject: string;
    let html: string;

    if (table === "contact_submissions") {
      subject = `New Contact Form: ${record.name}`;
      html = `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Company:</strong> ${record.company || "—"}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Email:</strong> ${record.email || "—"}</p>
        <p><strong>Details:</strong> ${record.details || "—"}</p>
        <hr>
        <p style="color:#888;font-size:12px;">Submitted ${record.created_at}</p>
      `;
    } else if (table === "delivery_requests") {
      subject = `New Delivery Request: ${record.name}`;
      html = `
        <h2>New Delivery Request</h2>
        <h3>Customer Info</h3>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Company:</strong> ${record.company || "—"}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Email:</strong> ${record.email || "—"}</p>
        <h3>Delivery Details</h3>
        <p><strong>Pickup:</strong> ${record.pickup_address}</p>
        <p><strong>Delivery:</strong> ${record.delivery_address}</p>
        <p><strong>Pickup Time:</strong> ${record.pickup_time}</p>
        <p><strong>Service Type:</strong> ${record.service_type}</p>
        ${record.custom_service ? `<p><strong>Custom Service:</strong> ${record.custom_service}</p>` : ""}
        <p><strong>Notes:</strong> ${record.notes || "—"}</p>
        <hr>
        <p style="color:#888;font-size:12px;">Submitted ${record.created_at}</p>
      `;
    } else {
      return new Response(JSON.stringify({ error: "Unknown table" }), { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bay Area Express <notifications@bayexdelivery.com>",
        to: [NOTIFY_EMAIL],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify(data), { status: res.status });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
