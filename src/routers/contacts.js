import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateContactBody } from '../middlewares/validateContactBody.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContact));

router.post('/', validateContactBody, ctrlWrapper(createContact));

router.patch('/:contactId', validateContactBody, ctrlWrapper(updateContact));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
