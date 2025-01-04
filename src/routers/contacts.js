import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateJoi } from '../middlewares/validateJoi.js';
import { isValidId } from '../middlewares/isValidId.js';
import { updateContactSchema } from '../validation/contactSchemas.js';
import { validateContactBody } from '../middlewares/validateContactBody.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContact));

router.post(
  '/',
  upload.single('photo'),
  (req, res, next) => {
    console.log('Multer file:', req.file);
    console.log('Request body:', req.body);
    next();
  },
  validateContactBody,
  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateJoi(updateContactSchema),
  ctrlWrapper(updateContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
