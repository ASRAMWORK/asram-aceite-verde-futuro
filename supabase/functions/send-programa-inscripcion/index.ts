import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InscripcionRequest {
  programa: string;
  nombre: string;
  email: string;
  telefono?: string;
  organizacion?: string;
  direccion?: string;
  mensaje?: string;
  tipoSolicitante?: string;
  numeroViviendas?: string;
  etapasEducativas?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InscripcionRequest = await req.json();
    const { 
      programa, 
      nombre, 
      email, 
      telefono, 
      organizacion, 
      direccion, 
      mensaje, 
      tipoSolicitante,
      numeroViviendas,
      etapasEducativas
    } = data;

    console.log(`Sending ${programa} inscription from:`, email);

    const programaTitles: Record<string, string> = {
      'alianza-verde': 'Alianza Verde Escolar',
      'asram-kids': 'ASRAM Kids',
      'puntos-verdes': 'Puntos Verdes',
      'asram-rural': 'ASRAM Rural'
    };

    const programaTitle = programaTitles[programa] || programa;

    // Build HTML content based on available fields
    let fieldsHtml = `
      <p><strong>Nombre/Contacto:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
    `;
    
    if (telefono) fieldsHtml += `<p><strong>Teléfono:</strong> ${telefono}</p>`;
    if (organizacion) fieldsHtml += `<p><strong>Organización/Centro:</strong> ${organizacion}</p>`;
    if (tipoSolicitante) fieldsHtml += `<p><strong>Tipo de solicitante:</strong> ${tipoSolicitante}</p>`;
    if (direccion) fieldsHtml += `<p><strong>Dirección:</strong> ${direccion}</p>`;
    if (numeroViviendas) fieldsHtml += `<p><strong>Número de viviendas:</strong> ${numeroViviendas}</p>`;
    if (etapasEducativas && etapasEducativas.length > 0) {
      fieldsHtml += `<p><strong>Etapas educativas:</strong> ${etapasEducativas.join(', ')}</p>`;
    }
    if (mensaje) fieldsHtml += `<p><strong>Mensaje/Observaciones:</strong><br>${mensaje.replace(/\n/g, '<br>')}</p>`;

    // Send notification to ASRAM
    const notificationResponse = await resend.emails.send({
      from: "ASRAM <onboarding@resend.dev>",
      to: ["tonoone9607@gmail.com"],
      subject: `Nueva inscripción: ${programaTitle}`,
      html: `
        <h1>Nueva inscripción en ${programaTitle}</h1>
        <hr>
        ${fieldsHtml}
        <hr>
        <p><em>Este mensaje fue enviado desde el formulario de inscripción de ${programaTitle} en la web de ASRAM.</em></p>
      `,
    });

    console.log("Notification email sent:", notificationResponse);

    // Send confirmation to user
    const confirmationResponse = await resend.emails.send({
      from: "ASRAM <onboarding@resend.dev>",
      to: [email],
      subject: `Inscripción recibida: ${programaTitle} - ASRAM`,
      html: `
        <h1>¡Gracias por tu interés en ${programaTitle}!</h1>
        <p>Hola ${nombre},</p>
        <p>Hemos recibido tu solicitud de inscripción en el programa <strong>${programaTitle}</strong>.</p>
        <p>Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en los próximos días para confirmar los siguientes pasos.</p>
        <hr>
        <p><strong>Resumen de tu solicitud:</strong></p>
        ${fieldsHtml}
        <hr>
        <p>Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo o llamando al teléfono de atención.</p>
        <p>Atentamente,<br>El equipo de ASRAM</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-programa-inscripcion function:", error);
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
