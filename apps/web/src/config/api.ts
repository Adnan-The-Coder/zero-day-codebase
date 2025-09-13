// export const API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://127.0.0.1:8787';
export const API_BASE_URL = 'https://zero-day-cf-server.ghost-server.workers.dev';

export const API_ENDPOINTS = {
    // userProfile Endpoints 
    createProfile: `${API_BASE_URL}/user-profile/create-profile`, // Creating a new user profile
    getAllProfiles: `${API_BASE_URL}/user-profile/get-all-profiles`, // Fetching all userProfiles
    getProfileByUUID: (uuid: string) => `${API_BASE_URL}/user-profile/get/${uuid}`, // Fetching a specific userProfile by uuid
    updateProfileByUUID: (uuid: string) => `${API_BASE_URL}/user-profile/update/${uuid}`, // Updating a specific userProfile by uuid



}   