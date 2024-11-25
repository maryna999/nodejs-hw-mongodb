import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', ctrlWrapper(getContact));

router.post('/', ctrlWrapper(createContact));

router.patch('/:contactId', ctrlWrapper(updateContact));

router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
