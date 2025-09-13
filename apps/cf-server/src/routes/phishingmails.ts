import { Hono } from 'hono';
import { 
  createPhishingMail, 
  getallPhishingMails, 
getPhishingMailsByUser 
} from '../controllers/phishingmail';

const phishingmailroutes = new Hono();

// create new phishing mail analysis
phishingmailroutes.post('/create', createPhishingMail);

// get all phishing mail records (admin use)
phishingmailroutes.get('/all', getallPhishingMails);

// get phishing mail history for a specific user
phishingmailroutes.get('/user/:user_uuid', getPhishingMailsByUser);

export default phishingmailroutes;
