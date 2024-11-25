// src/services/contacts.js

import { ContactsCollection } from '../db/models/contact.js'; // Імпортуємо модель

// Функція для створення нового контакту в базі даних
export const createContactInDB = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
}) => {
  const newContact = new ContactsCollection({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  // Зберігаємо новий контакт у базі даних
  await newContact.save();

  return newContact;
};

// Функція для оновлення контакту
export const updateContactInDB = async (contactId, updateData) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    { ...updateData },
    { new: true },
  );

  return updatedContact;
};

// Функції для отримання контактів
export const getAllContacts = async () => {
  return await ContactsCollection.find(); // Повертаємо всі контакти
};

export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId); // Повертаємо контакт за ID
};

export const deleteContactFromDB = async (contactId) => {
  const result = await ContactsCollection.findByIdAndDelete(contactId); // Видаляємо контакт за ID
  if (!result) {
    throw new Error('Contact not found'); // Якщо контакт не знайдений, викидаємо помилку
  }
  return result; // Повертаємо результат видалення
};
