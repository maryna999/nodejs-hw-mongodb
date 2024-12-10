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

export const getAllContacts = async (filter, sortBy, order) => {
  return await ContactsCollection.find(filter).sort({ [sortBy]: order });
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const updateContactInDB = async (contactId, updateData, userId) => {
  return await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { ...updateData },
    { new: true },
  );
};

export const deleteContactFromDB = async (contactId, userId) => {
  const result = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  if (!result) {
    throw new Error('Contact not found');
  }
  return result;
};
