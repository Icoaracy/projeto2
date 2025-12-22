export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Here you would typically:
    // 1. Send email using a service like SendGrid (API key stored in Vercel env)
    // 2. Save to database (connection string stored in Vercel env)
    // 3. Send to CRM, etc.
    
    // For demo purposes, we'll just log and return success
    console.log('Contact form submission:', { name, email, message });
    
    // Simulate processing time
    setTimeout(() => {
      res.status(200).json({ 
        success: true, 
        message: 'Form submitted successfully!' 
      });
    }, 1000);

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}