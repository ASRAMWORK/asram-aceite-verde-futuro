import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nombre, email, telefono, asunto, mensaje }: ContactEmailRequest = await req.json();

    console.log("Sending contact email from:", email);

    // Send notification to ASRAM (temporalmente usando email de prueba)
    const notificationResponse = await resend.emails.send({
      from: "ASRAM <onboarding@resend.dev>",
      to: ["tonoone9607@gmail.com"],
      subject: `Nuevo mensaje de contacto: ${asunto}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
        <p><strong>Asunto:</strong> ${asunto}</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log("Notification email sent:", notificationResponse);

    // Send confirmation to user
    const confirmationResponse = await resend.emails.send({
      from: "ASRAM <onboarding@resend.dev>",
      to: [email],
      subject: "Hemos recibido tu mensaje - ASRAM",
      html: `
        <h1>¡Gracias por contactarnos, ${nombre}!</h1>
        <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
        <hr>
        <p><strong>Resumen de tu mensaje:</strong></p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Atentamente,<br>El equipo de ASRAM</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
