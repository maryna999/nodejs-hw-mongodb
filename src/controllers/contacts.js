import createError from 'http-errors';
import {
  getContactById,
  createContactInDB,
  updateContactInDB,
  deleteContactFromDB,
} from '../services/contacts.js';
import { ContactsCollection } from '../db/models/contact.js';

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavorite, contactType } = req.body;
    const { _id: userId } = req.user;

    if (!name || !phoneNumber || !contactType) {
      throw createError(
        400,
        'Missing required fields: name, phoneNumber, contactType',
      );
    }

    const newContact = await createContactInDB({
      name,
      phoneNumber,
      email,
      isFavorite,
      contactType,
      userId,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { sortBy = 'name', sortOrder = 'asc', type, isFavorite } = req.query;

    const filter = { userId };
    if (type) filter.contactType = type;
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';

    const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
    const contacts = await ContactsCollection(filter, sortBy, order);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with ID ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const updateData = req.body;

    const contact = await getContactById(contactId, userId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    const updatedContact = await updateContactInDB(
      contactId,
      updateData,
      userId,
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const contact = await getContactById(contactId, userId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    await deleteContactFromDB(contactId, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
