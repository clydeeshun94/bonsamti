# Bonsamti Deployment Guide

## External Email Reception Setup

To receive real emails from external sources, you need to configure an inbound email service. Here are the recommended options:

### Option 1: CloudMailin (Recommended)
1. Sign up at [CloudMailin](https://www.cloudmailin.com/)
2. Create a new address and set the target URL to: `https://yourdomain.com/api/emails/inbound`
3. Configure your domain's MX records to point to CloudMailin's servers
4. Add your webhook secret as `CLOUDMAILIN_SECRET` environment variable

### Option 2: Mailgun
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Configure inbound routing to forward to: `https://yourdomain.com/api/emails/inbound`
3. Set up your domain and MX records
4. Add your webhook secret as `WEBHOOK_SECRET` environment variable

### Option 3: Custom MX Setup
For advanced users who want to handle MX records directly:
1. Set up MX records pointing to your server
2. Configure a mail server to forward emails to the webhook endpoint
3. Ensure proper authentication and security measures

## Environment Variables Required

\`\`\`env
# Choose one based on your email service
CLOUDMAILIN_SECRET=your_cloudmailin_webhook_secret
RESEND_SIGNING_SECRET=your_resend_webhook_secret
WEBHOOK_SECRET=your_custom_webhook_secret

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Testing Email Reception

1. Deploy your application to a public URL
2. Configure your chosen email service to point to your webhook endpoint
3. Send a test email to one of your generated disposable addresses
4. Check the application logs and database to verify the email was received

## Troubleshooting

- **Emails not appearing**: Check webhook logs and ensure your email service is configured correctly
- **Signature verification failing**: Verify your webhook secret matches the one configured in your email service
- **Account not found**: Ensure the recipient email address matches an active account in your database
- **Expired accounts**: Accounts automatically expire after 24 hours - this is by design

## Security Considerations

- Always use HTTPS for webhook endpoints in production
- Implement proper webhook signature verification
- Consider rate limiting to prevent abuse
- Monitor webhook logs for suspicious activity
