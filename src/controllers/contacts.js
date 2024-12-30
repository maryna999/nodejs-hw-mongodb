import createError from 'http-errors';
import {
  getContactById,
  createContactInDB,
  updateContactInDB,
  deleteContactFromDB,
} from '../services/contacts.js';
import { ContactsCollection } from '../db/models/contact.js';
import { uploadImage } from '../utils/cloudinary.js';
import { updateContactSchema } from '../validation/contactSchemas.js';

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavorite, contactType, photo } =
      req.body;
    const userId = req.user._id;

    if (!name || !phoneNumber || !contactType) {
      throw createError(
        400,
        'Missing required fields: name, phoneNumber, contactType',
      );
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadImage(req.file.path);
    } else if (photo) {
      photoUrl = photo;
    }

    const newContact = await createContactInDB({
      name,
      phoneNumber,
      email,
      isFavorite,
      contactType,
      userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error('Error in createContact:', error);
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const {
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      perPage = 10,
      type,
      isFavorite,
    } = req.query;

    const userId = req.user._id;
    const filter = { userId };
    if (type) filter.contactType = type;
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';

    const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
    const skip = (page - 1) * perPage;

    const totalItems = await ContactsCollection.countDocuments(filter);
    const contacts = await ContactsCollection.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(Number(perPage));

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages: Math.ceil(totalItems / perPage),
        hasPreviousPage: page > 1,
        hasNextPage: skip + contacts.length < totalItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId, userId);

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
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: error.details,
    });
  }

  try {
    const { contactId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = await uploadImage(req.file.path);
    }

    const updatedContact = await updateContactInDB(contactId, updateData);

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId, userId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    await deleteContactFromDB(contactId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
