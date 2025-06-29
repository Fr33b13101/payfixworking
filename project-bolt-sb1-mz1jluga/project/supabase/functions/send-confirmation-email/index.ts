import { corsHeaders } from '../_shared/cors.ts';

interface EmailRequest {
  email: string;
  name: string;
  requestId: string;
  phoneModel: string;
  urgency: string;
  turnaround?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
      status: 415,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Received request to send confirmation email');

    const requestBody = await req.json();
    console.log('Request body:', requestBody);

    const { email, name, requestId, phoneModel, urgency, turnaround }: EmailRequest = requestBody;

    // Validate required fields
    if (!email || !name || !phoneModel || !urgency || !requestId) {
      console.error('Missing required fields:', { email, name, phoneModel, urgency, requestId });
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: email, name, phoneModel, urgency, requestId'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get urgency details
    const urgencyDetails = {
      low: { label: 'Low Priority', color: '#059669', turnaround: '5-7 business days' },
      medium: { label: 'Medium Priority', color: '#d97706', turnaround: '2-3 business days' },
      high: { label: 'High Priority', color: '#dc2626', turnaround: '24-48 hours' }
    }[urgency] || { label: 'Medium Priority', color: '#d97706', turnaround: '2-3 business days' };

    const emailSubject = `✅ Repair Request Confirmed - ${phoneModel} (ID: ${requestId.slice(-8)})`;

    // You may insert your full emailBody template HTML string here as before...
     const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Repair Request Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center;">
              <div style="background-color: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <span style="color: white; font-size: 24px;">🔧</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">PayFix</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Professional Mobile Repair Service</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #059669; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
                ✅ Request Confirmed!
              </h2>
              
              <p style="margin: 0 0 25px 0; font-size: 16px;">Dear ${name},</p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px;">
                Thank you for choosing PayFix! We've successfully received your repair request and our expert technicians are ready to help restore your device to perfect working condition.
              </p>
              
              <!-- Request Details Card -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">📋 Request Details</h3>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Request ID:</span>
                    <span style="font-family: 'Courier New', monospace; background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 6px; font-size: 14px;">${requestId}</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Device:</span>
                    <span style="color: #1f2937; font-weight: 500;">📱 ${phoneModel}</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Priority Level:</span>
                    <span style="color: ${urgencyDetails.color}; font-weight: 600;">⚡ ${urgencyDetails.label}</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                    <span style="font-weight: 500; color: #6b7280;">Expected Turnaround:</span>
                    <span style="color: #059669; font-weight: 600;">⏱️ ${turnaround || urgencyDetails.turnaround}</span>
                  </div>
                </div>
              </div>
              
              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">🚀 What happens next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #78350f;">
                  <li style="margin-bottom: 8px;">Our technical team will review your request within <strong>2 hours</strong></li>
                  <li style="margin-bottom: 8px;">We'll contact you via email or phone to discuss repair options and scheduling</li>
                  <li style="margin-bottom: 8px;">You'll receive a detailed quote before any work begins</li>
                  <li style="margin-bottom: 0;">Track your repair status using your Request ID</li>
                </ul>
              </div>
              
              <!-- Contact Info -->
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">📞 Need immediate assistance?</h4>
                <p style="margin: 0 0 10px 0; color: #1e3a8a;">
                  <strong>WhatsApp:</strong> <a href="https://wa.me/2348052689119" style="color: #059669; text-decoration: none;">+234 805 268 9119</a>
                </p>
                <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                  Please reference your Request ID: <strong>${requestId}</strong>
                </p>
              </div>
              
              <p style="margin: 30px 0 0 0; font-size: 16px;">
                Thank you for trusting PayFix with your device repair. We're committed to providing you with fast, reliable, and professional service.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <div style="background-color: #374151; width: 40px; height: 40px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                  <span style="color: white; font-size: 16px;">🔧</span>
                </div>
                <h3 style="color: white; margin: 0; font-size: 18px;">PayFix</h3>
              </div>
              
              <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 14px;">
                Professional Mobile Repair Service
              </p>
              
              <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 20px;">
                <p style="color: #6b7280; margin: 0; font-size: 12px;">
                  This is an automated confirmation email. Please do not reply directly to this message.
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                  © 2025 PayFix. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;


    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY in environment variables');
    }

    console.log('🚀 Sending email via Resend API...');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PayFix <noreply@resend.dev>',
        to: [email],
        subject: emailSubject,
        html: emailBody,
        reply_to: 'ohenusiliberty@gmail.com'
      }),
    });

    const resendResult = await resendResponse.json();

    if (resendResponse.ok) {
      console.log('✅ Email sent successfully via Resend:', resendResult);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Confirmation email sent successfully',
          requestId,
          recipient: email,
          subject: emailSubject,
          method: 'Resend',
          emailId: resendResult.id,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.error('❌ Resend API error:', resendResult);
      return new Response(
        JSON.stringify({
          success: false,
          error: resendResult,
          note: 'Email service temporarily unavailable',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('❌ Error in send-confirmation-email function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        note: 'Unexpected error occurred',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
