import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { userProfiles } from '../db/schema';

export const getAllProfiles = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    // Fetch all profiles from the database
    const profiles = await db.select().from(userProfiles).all();

    return c.json({
      success: true,
      message: 'Profiles fetched successfully!',
      total: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};

export const createProfile = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { full_name, email, uuid, avatar_url='https://avatar.iran.liara.run/public/boy?username=[8]' } = body;

    // Basic Validation
    if (!full_name || !email  || !uuid ) {
      return c.json({ success: false, message: 'All fields are required.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ success: false, message: 'Invalid email address.' }, 400);
    }

    // Insert into appointmentBooking table
    const result = await db.insert(userProfiles).values({
      uuid,
      full_name,
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url,
    }).returning();

    return c.json({
      success: true,
      message: 'Profile create successfully!',
      data: {
        id: result[0].id,
        name: result[0].full_name,
        email: result[0].email,
        phone: result[0].phone,
        createdAt: result[0].created_at
      }
    });

  } catch (error) {
    console.error('Profile Creation error:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};


export const getProfileByUUID = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const uuid = c.req.param('uuid');

    if (!uuid) {
      return c.json({ success: false, message: 'UUID is required.' }, 400);
    }

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.uuid, uuid))
      .limit(1);

    if (profile.length === 0) {
      return c.json({ success: false, message: 'Profile not found.' }, 404);
    }

    return c.json({
      success: true,
      message: 'Profile fetched successfully!',
      data: profile[0],
    });
  } catch (error) {
    console.error('Error fetching profile by UUID:', error);
    return c.json({ success: false, message: 'Internal server error.' }, 500);
  }
};

export const updateProfileByUUID = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const uuid = c.req.param('uuid');
    const body = await c.req.json();

    if (!uuid) {
      return c.json({ success: false, message: 'UUID is required.' }, 400);
    }

    // If user_login_info is present and is an object, stringify it
    if (body.user_login_info && typeof body.user_login_info === 'object') {
      body.user_login_info = JSON.stringify(body.user_login_info);
    }

    // Only allow updating fields that exist in the schema
    const allowedFields = [
      'full_name', 'avatar_url', 'phone', 'address', 'city', 'state', 'pincode',
      'updated_at', 'email_notifications', 'bio', 'user_login_info', 'reviews'
    ];
    const updateData:any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    updateData.updated_at = new Date().toISOString();

    if (Object.keys(updateData).length === 0) {
      return c.json({ success: false, message: 'No valid fields to update.' }, 400);
    }

    const result = await db
      .update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.uuid, uuid))
      .run() as any;

    if (result.rowsAffected === 0) {
      return c.json({ success: false, message: 'Profile not found or nothing changed.' }, 404);
    }

    return c.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile by UUID:', error);
    return c.json({ success: false, message: 'Internal server error.' }, 500);
  }
};