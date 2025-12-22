export default function handler(req: any, res: any) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Sanitize input (basic XSS prevention)
    const sanitizedName = name.replace(/[<>]/g, '');
    const sanitizedMessage = message.replace(/[<>]/g, '');

    // Log for debugging (in production, use proper logging)
    console.log('Contact form submission:', { 
      name: sanitizedName, 
      email, 
      message: sanitizedMessage 
    });
    
    // Here you would typically:
    // 1. Send email using a service like SendGrid (API key stored in Vercel env)
    //    Example: await sendEmail({ to: 'admin@example.com', from: email, subject: `Contact from ${sanitizedName}`, text: sanitizedMessage })
    // 2. Save to database (connection string stored in Vercel env)
    //    Example: await db.contacts.create({ data: { name: sanitizedName, email, message: sanitizedMessage } })
    // 3. Send to CRM, etc.
    
    // Simulate processing time
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
    }, 500);

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}