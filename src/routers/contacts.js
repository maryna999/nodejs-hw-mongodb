// src/routers/contacts.js

import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js'; // Імпортуємо контролери
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // Імпортуємо обгортку для обробки помилок

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', ctrlWrapper(getContacts));

// Роут для отримання контакту за ID
router.get('/:contactId', ctrlWrapper(getContact));

// Роут для створення нового контакту
router.post('/', ctrlWrapper(createContact));

// Роут для оновлення контакту
router.patch('/:contactId', ctrlWrapper(updateContact));

router.delete('/:contactId', ctrlWrapper(deleteContact)); // Новий маршрут для видалення

export default router;
