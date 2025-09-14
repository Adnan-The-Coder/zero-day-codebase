// export const API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://127.0.0.1:8787';
export const API_BASE_URL = 'https://zero-day-cf-server.ghost-server.workers.dev';

export const API_ENDPOINTS = {
    // userProfile Endpoints 
    createProfile: `${API_BASE_URL}/users/create-profile`, // Creating a new user profile
    getAllProfiles: `${API_BASE_URL}/users/get-all-profiles`, // Fetching all userProfiles
    getProfileByUUID: (uuid: string) => `${API_BASE_URL}/users/get/${uuid}`, // Fetching a specific userProfile by uuid
    updateProfileByUUID: (uuid: string) => `${API_BASE_URL}/users/update/${uuid}`, // Updating a specific userProfile by uuid

// Supply Chain Endpoints
    // Organization CRUD
    createOrganization: `${API_BASE_URL}/supplychain/organization/create`, // Creating a new organization
    updateOrganization: `${API_BASE_URL}/supplychain/organization/update`, // Updating organization details
    getOrganization: `${API_BASE_URL}/supplychain/organization/get`, // Getting specific organization (requires user_uuid & organizationID params)
    getUserOrganizations: `${API_BASE_URL}/supplychain/organization/user`, // Getting all organizations for a user (requires user_uuid param)
    deleteOrganization: `${API_BASE_URL}/supplychain/organization/delete`, // Deleting an organization

    // Vendor Management
    updateVendors: `${API_BASE_URL}/supplychain/vendors/update`, // Adding/updating vendors for an organization
    deleteVendors: `${API_BASE_URL}/supplychain/vendors/delete`, // Removing all vendors from an organization
     getOrganizationVendors: `${API_BASE_URL}/supplychain/vendors/get`, // Fetching all vendors for an organization (requires organizationID param)
     getOrganizationsByUUID: `${API_BASE_URL}/supplychain/get-by-uuid`, // Fetching organizations by user UUID
}