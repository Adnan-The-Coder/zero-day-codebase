import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { supplyChainEntries } from '../db/schema';

// Create a new organization entry
export const createOrganization = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { user_uuid, organization_name, userRole, organizationID, vendors, details } = body;

    // Basic validation
    if (!user_uuid || !organization_name || !userRole || !organizationID) {
      return c.json({ 
        success: false, 
        message: 'user_uuid, organization_name, userRole, and organizationID are required.' 
      }, 400);
    }

    // Check if organization already exists for this user
    const existingOrganization = await db
      .select()
      .from(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .limit(1);

    if (existingOrganization.length > 0) {
      return c.json({ 
        success: false, 
        message: 'Organization with this ID already exists for this user. Use update endpoint to modify.' 
      }, 409);
    }

    // Validate and stringify vendors if provided
    let vendorsString = null;
    if (vendors) {
      try {
        vendorsString = typeof vendors === 'string' ? vendors : JSON.stringify(vendors);
        // Validate it's proper JSON
        JSON.parse(vendorsString);
      } catch (error) {
        return c.json({ 
          success: false, 
          message: 'Invalid vendors format. Must be valid JSON.' 
        }, 400);
      }
    }

    const result = await db.insert(supplyChainEntries).values({
      user_uuid,
      organization_name: organization_name.trim(),
      userRole: userRole.trim(),
      organizationID: organizationID.trim(),
      vendors: vendorsString,
      details: details?.trim() || null,
      createdAt: new Date().toISOString()
    }).returning();

    return c.json({
      success: true,
      message: 'Organization created successfully!',
      data: {
        ...result[0],
        vendors: result[0].vendors ? JSON.parse(result[0].vendors) : null
      }
    });

  } catch (error) {
    console.error('Create organization error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};

// Update organization details
export const updateOrganization = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { user_uuid, organizationID, organization_name, userRole, details } = body;

    // Basic validation
    if (!user_uuid || !organizationID) {
      return c.json({ 
        success: false, 
        message: 'user_uuid and organizationID are required.' 
      }, 400);
    }

    // Check if organization exists
    const existingOrganization = await db
      .select()
      .from(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .limit(1);

    if (existingOrganization.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Organization not found.' 
      }, 404);
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (organization_name) updateData.organization_name = organization_name.trim();
    if (userRole) updateData.userRole = userRole.trim();
    if (details !== undefined) updateData.details = details?.trim() || null;

    const result = await db
      .update(supplyChainEntries)
      .set(updateData)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .returning();

    return c.json({
      success: true,
      message: 'Organization updated successfully!',
      data: {
        ...result[0],
        vendors: result[0].vendors ? JSON.parse(result[0].vendors) : null
      }
    });

  } catch (error) {
    console.error('Update organization error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};

// Get organization details
export const getOrganization = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const user_uuid = c.req.query('user_uuid');
    const organizationID = c.req.query('organizationID');

    if (!user_uuid || !organizationID) {
      return c.json({ 
        success: false, 
        message: 'user_uuid and organizationID query parameters are required.' 
      }, 400);
    }

    const organization = await db
      .select()
      .from(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .limit(1);

    if (organization.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Organization not found.' 
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        ...organization[0],
        vendors: organization[0].vendors ? JSON.parse(organization[0].vendors) : null
      }
    });

  } catch (error) {
    console.error('Get organization error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};

// Get all organizations for a user
export const getUserOrganizations = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const user_uuid = c.req.query('user_uuid');

    if (!user_uuid) {
      return c.json({ 
        success: false, 
        message: 'user_uuid query parameter is required.' 
      }, 400);
    }

    const organizations = await db
      .select()
      .from(supplyChainEntries)
      .where(eq(supplyChainEntries.user_uuid, user_uuid));

    const organizationsWithParsedVendors = organizations.map(org => ({
      ...org,
      vendors: org.vendors ? JSON.parse(org.vendors) : null
    }));

    return c.json({
      success: true,
      data: organizationsWithParsedVendors
    });

  } catch (error) {
    console.error('Get user organizations error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};

// Add or update vendors for an organization
export const updateVendors = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { user_uuid, organizationID, vendors } = body;

    // Basic validation
    if (!user_uuid || !organizationID || !vendors) {
      return c.json({ 
        success: false, 
        message: 'user_uuid, organizationID, and vendors are required.' 
      }, 400);
    }

    // Validate vendors format
    let vendorsString;
    try {
      vendorsString = typeof vendors === 'string' ? vendors : JSON.stringify(vendors);
      // Validate it's proper JSON
      JSON.parse(vendorsString);
    } catch (error) {
      return c.json({ 
        success: false, 
        message: 'Invalid vendors format. Must be valid JSON.' 
      }, 400);
    }

    // Check if organization exists
    const existingOrganization = await db
      .select()
      .from(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .limit(1);

    if (existingOrganization.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Organization not found.' 
      }, 404);
    }

    const result = await db
      .update(supplyChainEntries)
      .set({
        vendors: vendorsString,
        updatedAt: new Date().toISOString()
      })
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .returning();

    return c.json({
      success: true,
      message: 'Vendors updated successfully!',
      data: {
        ...result[0],
        vendors: result[0].vendors ? JSON.parse(result[0].vendors) : null
      }
    });

  } catch (error) {
    console.error('Update vendors error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};

// Delete vendors for an organization
export const deleteVendors = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { user_uuid, organizationID } = body;

    // Basic validation
    if (!user_uuid || !organizationID) {
      return c.json({ 
        success: false, 
        message: 'user_uuid and organizationID are required.' 
      }, 400);
    }

    // Check if organization exists
    const existingOrganization = await db
      .select()
      .from(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .limit(1);

    if (existingOrganization.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Organization not found.' 
      }, 404);
    }

    const result = await db
      .update(supplyChainEntries)
      .set({
        vendors: null,
        updatedAt: new Date().toISOString()
      })
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .returning();

    return c.json({
      success: true,
      message: 'Vendors deleted successfully!',
      data: {
        ...result[0],
        vendors: null
      }
    });

  } catch (error) {
    console.error('Delete vendors error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};

// Delete entire organization
export const deleteOrganization = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { user_uuid, organizationID } = body;

    // Basic validation
    if (!user_uuid || !organizationID) {
      return c.json({ 
        success: false, 
        message: 'user_uuid and organizationID are required.' 
      }, 400);
    }

    // Check if organization exists
    const existingOrganization = await db
      .select()
      .from(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      )
      .limit(1);

    if (existingOrganization.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Organization not found.' 
      }, 404);
    }

    await db
      .delete(supplyChainEntries)
      .where(
        and(
          eq(supplyChainEntries.user_uuid, user_uuid),
          eq(supplyChainEntries.organizationID, organizationID)
        )
      );

    return c.json({
      success: true,
      message: 'Organization deleted successfully!'
    });

  } catch (error) {
    console.error('Delete organization error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    }, 500);
  }
};