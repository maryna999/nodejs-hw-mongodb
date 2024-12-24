import { ContactsCollection } from '../db/models/contact.js';

export const createContactInDB = async ({
  name,
  phoneNumber,
  email,
  isFavorite,
  contactType,
  userId,
}) => {
  const newContact = new ContactsCollection({
    name,
    phoneNumber,
    email,
    isFavorite,
    contactType,
    userId,
  });

  await newContact.save();

  return newContact;
};

export const updateContactInDB = async (contactId, updateData) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    { ...updateData },
    { new: true },
  );

  return updatedContact;
};

export const getAllContacts = async () => {
  return await ContactsCollection.find();
};

export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

export const deleteContactFromDB = async (contactId) => {
  const result = await ContactsCollection.findByIdAndDelete(contactId);
  if (!result) {
    throw new Error('Contact not found');
  }
  return result;
};
