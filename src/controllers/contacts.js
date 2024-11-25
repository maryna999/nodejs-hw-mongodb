import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContactInDB,
  updateContactInDB,
  deleteContactFromDB,
} from '../services/contacts.js';

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavorite, contactType } = req.body;

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
    const contacts = await getAllContacts();
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
    const updateData = req.body;

    const contact = await getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    const updatedContact = await updateContactInDB(contactId, updateData);

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    await deleteContactFromDB(contactId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
