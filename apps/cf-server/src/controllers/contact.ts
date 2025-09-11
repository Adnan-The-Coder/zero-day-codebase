import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { contactUs } from '../db/schema';
export const submitContactUsForm = async (c: Context) => {
    try {
      const db = drizzle(c.env.DB);
      const body = await c.req.json();
      const { name, email, subject, description } = body;
  
      // Basic validation
      if (!name || !email || !subject || !description) {
        return c.json({ success: false, message: 'All fields are required.' }, 400);
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return c.json({ success: false, message: 'Invalid email address.' }, 400);
      }
  
      const result = await db.insert(contactUs).values({
        name,
        email: email.toLowerCase(),
        subject,
        description,
        createdAt: new Date().toISOString()
      }).returning();
  
      return c.json({
        success: true,
        message: 'Your message has been received!',
        data: {
          id: result[0].id,
          submittedAt: result[0].createdAt
        }
      });
  
    } catch (error) {
      console.error('Contact form submission error:', error);
      return c.json({ success: false, message: 'Internal server error. Please try again later.' }, 500);
    }
  };
