import { ContactsCollection } from '../db/models/contact.js';

export const createContactInDB = async ({
  name,
  phoneNumber,
  email,
  isFavorite,
  contactType,
  userId,
}) => {
  try {
    console.log('Creating a new contact with data:', {
      name,
      phoneNumber,
      email,
      isFavorite,
      contactType,
      userId,
    });

    const newContact = new ContactsCollection({
      name,
      phoneNumber,
      email,
      isFavorite,
      contactType,
      userId,
    });

    await newContact.save();

    console.log('New contact created successfully:', newContact);
    return newContact;
  } catch (error) {
    console.error('Error while creating contact:', error);
    throw error;
  }
};

export const updateContactInDB = async (contactId, updateData) => {
  try {
    console.log(`Updating contact ${contactId} with data:`, updateData);

    const updatedContact = await ContactsCollection.findByIdAndUpdate(
      contactId,
      { ...updateData },
      { new: true },
    );

    console.log('Updated contact:', updatedContact);
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
