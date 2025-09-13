import { Hono } from 'hono';
import { createProfile, getAllProfiles, getProfileByUUID, updateProfileByUUID } from '../controllers/user';


const userProfileRoutes = new Hono();

userProfileRoutes.post('/create-profile', createProfile);
userProfileRoutes.get('/get-all-profiles', getAllProfiles);
userProfileRoutes.get('get/:uuid', getProfileByUUID);
userProfileRoutes.patch('/update/:uuid', updateProfileByUUID);

export default userProfileRoutes;   