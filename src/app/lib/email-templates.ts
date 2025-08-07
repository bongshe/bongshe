// src/app/lib/email-templates.ts

export const verificationEmailTemplate = (code: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Verification</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .code { font-size: 28px; letter-spacing: 5px; text-align: center; margin: 25px 0; font-weight: bold; color: #2563eb; }
  </style>
</head>
<body>
  <h2>Email Verification</h2>
  <p>Please use the code below to verify your email address:</p>
  <div class="code">${code}</div>
  <p>This code will expire in 10 minutes.</p>
</body>
</html>
`
