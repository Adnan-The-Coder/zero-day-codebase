import { Hono } from 'hono';
import { 
    submitContactUsForm} from '../controllers/contact';

const contactRoutes = new Hono();

contactRoutes.post('/submit-new', submitContactUsForm);

export default contactRoutes;