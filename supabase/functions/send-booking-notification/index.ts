const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  console.log("[send-booking-notification] Function invoked, method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    console.log("[send-booking-notification] RESEND_API_KEY present:", !!RESEND_API_KEY);
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Resend API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { customerName, email, phone, weeksPregnant, serviceName, amountPaid } = await req.json();

    if (!customerName || !email || !serviceName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a7c59; font-size: 22px; margin-bottom: 20px;">New Booking Completed</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Customer Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${phone || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Weeks Pregnant</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${weeksPregnant || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Service Booked</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Amount Paid</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${amountPaid}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #333;">Scheduled Via</td>
            <td style="padding: 10px 0; color: #555;">Cal.com (check calendar for details)</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">This is an automated notification from SonoView For You.</p>
      </div>
    `;

    console.log("[send-booking-notification] Sending email to care@sonoviewforyou.com for:", customerName, serviceName);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SonoView For You <onboarding@resend.dev>",
        to: ["care@sonoviewforyou.com"],
        subject: `New Booking: ${serviceName} — ${customerName}`,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Failed to send notification" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error sending booking notification:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
