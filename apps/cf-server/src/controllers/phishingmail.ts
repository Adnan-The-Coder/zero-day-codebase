import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { phishingMails, userProfiles } from '../db/schema';

// create phishing mail analysis
export const createPhishingMail = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { email_content, analysis_details, user_uuid } = body;

    if (!email_content || !user_uuid) {
      return c.json({ success: false, message: 'email content and user uuid are required.' }, 400);
    }

    // check user exists
    const user = await db.select().from(userProfiles).where(eq(userProfiles.uuid, user_uuid)).limit(1);
    if (user.length === 0) {
      return c.json({ success: false, message: 'user not found.' }, 404);
    }

    const result = await db.insert(phishingMails).values({
      email_content,
      analysis_details: analysis_details ? JSON.stringify(analysis_details) : null,
      user_uuid,
      created_at: new Date().toISOString(),
    }).returning();

    return c.json({
      success: true,
      message: 'phishing mail analysis saved successfully!',
      data: {
        id: result[0].id,
        email_content: result[0].email_content,
        analysis_details: result[0].analysis_details,
        user_uuid: result[0].user_uuid,
        created_at: result[0].created_at,
      },
    });
  } catch (error) {
    console.error('error creating phishing mail record:', error);
    return c.json({ success: false, message: 'internal server error.' }, 500);
  }
};

// get all phishing mails
export const getallPhishingMails = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const records = await db.select().from(phishingMails).all();

    return c.json({
      success: true,
      message: 'phishing mails fetched successfully!',
      total: records.length,
      data: records,
    });
  } catch (error) {
    console.error('error fetching phishing mails:', error);
    return c.json({ success: false, message: 'internal server error.' }, 500);
  }
};

// get phishing mail history by user
export const getPhishingMailsByUser = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const user_uuid = c.req.param('user_uuid');

    if (!user_uuid) {
      return c.json({ success: false, message: 'user uuid is required.' }, 400);
    }

    const records = await db
      .select()
      .from(phishingMails)
      .where(eq(phishingMails.user_uuid, user_uuid))
      .orderBy(phishingMails.created_at);

    return c.json({
      success: true,
      message: 'phishing mail history fetched successfully!',
      total: records.length,
      data: records,
    });
  } catch (error) {
    console.error('error fetching phishing mails by user:', error);
    return c.json({ success: false, message: 'internal server error.' }, 500);
  }
};
