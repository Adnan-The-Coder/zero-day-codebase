import { Hono } from 'hono';
import { 
    createOrganization,
    updateOrganization,
    getOrganization,
    getUserOrganizations,
    updateVendors,
    deleteVendors,
    deleteOrganization,
    getOrganizationsByUUID
} from '../controllers/supply-chain';

const supplyChainRoutes = new Hono();

// Organization CRUD routes
supplyChainRoutes.post('/organization/create', createOrganization);
supplyChainRoutes.put('/organization/update', updateOrganization);
supplyChainRoutes.get('/organization/get', getOrganization);
supplyChainRoutes.get('/get-by-uuid',getOrganizationsByUUID);
supplyChainRoutes.get('/organization/user', getUserOrganizations);
supplyChainRoutes.delete('/organization/delete', deleteOrganization);

// Vendor management routes
supplyChainRoutes.put('/vendors/update', updateVendors);
supplyChainRoutes.delete('/vendors/delete', deleteVendors);

export default supplyChainRoutes;