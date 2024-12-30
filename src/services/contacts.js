import { ContactsCollection } from '../db/models/contact.js';

export const createContactInDB = async ({
  name,
  phoneNumber,
  email,
  isFavorite,
  contactType,
  userId,
  photo,
}) => {
  try {
    const newContact = new ContactsCollection({
      name,
      phoneNumber,
      email,
      isFavorite,
      contactType,
      userId,
      photo,
    });

    await newContact.save();

    return newContact;
  } catch (error) {
    console.error('Error while creating contact:', error);
    throw error;
  }
};

export const updateContactInDB = async (contactId, updateData) => {
  try {
    const updatedContact = await ContactsCollection.findByIdAndUpdate(
      contactId,
      updateData ,
      { new: true },
    );

    return updatedContact;
  } catch (error) {
    console.error('Error while updating contact:', error);
    throw error;
  }
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
