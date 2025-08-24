# CloudMailin Setup for Bonsamti

## Your CloudMailin Configuration

**Email Address:** `93a9b47c12fc000c4c24@cloudmailin.net`
**App URL:** `https://bonsamti.onrender.com/`
**Webhook URL:** `https://bonsamti.onrender.com/api/emails/inbound`

## Setup Steps

### 1. Configure CloudMailin Webhook
In your CloudMailin dashboard:
- Set **Target URL** to: `https://bonsamti.onrender.com/api/emails/inbound`
- Set **HTTP Method** to: `POST`
- Set **Format** to: `JSON`

### 2. Add Environment Variable (Optional)
For webhook security, add to Render:
\`\`\`
CLOUDMAILIN_SECRET=your_cloudmailin_secret_key
\`\`\`

### 3. Test Email Reception
1. Generate a new identity in the app
2. Send a test email to the generated address (will be `@cloudmailin.net`)
3. Check if it appears in the inbox

## How It Works

1. **Email Generation**: App creates emails like `zara.shadowbane3884@cloudmailin.net`
2. **Email Reception**: CloudMailin receives emails sent to any `@cloudmailin.net` address
3. **Webhook Forwarding**: CloudMailin forwards email data to your webhook endpoint
4. **Processing**: Your app processes the email and stores it in the database
5. **Display**: Email appears in the user's inbox

## Troubleshooting

- **Emails not appearing**: Check CloudMailin logs and webhook URL configuration
- **Webhook errors**: Check Render logs for API endpoint errors
- **Domain mismatch**: Ensure generated emails use `@cloudmailin.net` domain

## Next Steps

Once working, you can:
- Purchase a custom domain and configure MX records
- Set up proper webhook authentication
- Add email sending capabilities through SMTP
