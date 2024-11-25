// src/controllers/contacts.js

import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContactInDB, // Сервіс для створення контакту
  updateContactInDB,
  deleteContactFromDB, // Сервіс для оновлення контакту
} from '../services/contacts.js'; // Імпортуємо всі необхідні сервіси

// Контролер для створення нового контакту
export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевірка на обов'язкові поля
    if (!name || !phoneNumber || !contactType) {
      throw createError(
        400,
        'Missing required fields: name, phoneNumber, contactType',
      );
    }

    // Створення нового контакту через сервіс
    const newContact = await createContactInDB({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

// Контролер для отримання всіх контактів
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts(); // Викликаємо сервіс для отримання всіх контактів
    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

// Контролер для отримання одного контакту за ID
export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId); // Викликаємо сервіс для отримання контакту за ID

    if (!contact) {
      throw createError(404, 'Contact not found'); // Якщо контакт не знайдено, кидаємо помилку
    }

    res.status(200).json({
      status: 200,
      message: `Successfully retrieved contact with ID ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

// Контролер для оновлення контакту
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    const contact = await getContactById(contactId); // Перевіряємо, чи існує контакт
    if (!contact) {
      throw createError(404, 'Contact not found'); // Створюємо помилку, якщо контакт не знайдений
    }

    const updatedContact = await updateContactInDB(contactId, updateData); // Оновлюємо контакт

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params; // Отримуємо ID контакту з параметрів

    // Перевірка, чи контакт існує
    const contact = await getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found'); // Створюємо помилку, якщо контакт не знайдений
    }

    // Видалення контакту з бази даних
    await deleteContactFromDB(contactId);

    // Відповідь без тіла і зі статусом 204
    res.status(204).send();
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};
