# Resend Setup for Bonsamti

## Configuration Complete ✅

Your Bonsamti app is now configured to use Resend for both sending and receiving emails.

## Environment Variables Set:
- `RESEND_API_KEY`: Full access key for admin operations
- `RESEND_SENDING_KEY`: Sending-only key for email delivery
- `RESEND_SIGNING_SECRET`: Webhook signature verification
- `RESEND_DOMAIN`: Your domain for email addresses (bonsamti.onrender.com)

## Next Steps Required:

### 1. Domain Setup in Resend Dashboard
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain: `bonsamti.onrender.com`
3. Configure DNS records as instructed by Resend:
   - MX records for receiving emails
   - SPF, DKIM, DMARC records for sending

### 2. Webhook Configuration
1. In Resend Dashboard, go to Webhooks
2. Add webhook endpoint: `https://yourdomain.com/api/emails/inbound`
3. Select event: `email.received`
4. Use signing secret: `whsec_z3eUAbzklSg/kkaQd6I6NdKaM0ADofDC`

### 3. Test Email Flow
1. Generate identity in app (will create `@bonsamti.dev` email)
2. Send test email to generated address
3. Check inbox in app for received email
4. Test sending email from the compose feature

## Features Now Available:
- ✅ Generate disposable emails with `@bonsamti.onrender.com` domain
- ✅ Receive emails via Resend webhook
- ✅ Send emails with branded HTML templates
- ✅ 24-hour automatic cleanup
- ✅ Real-time email notifications

## Domain Requirements:
You need to own `bonsamti.onrender.com` domain and configure it in Resend. If you don't own this domain, update `RESEND_DOMAIN` in your environment variables to a domain you control.