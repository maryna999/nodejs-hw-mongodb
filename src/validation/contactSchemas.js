import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavorite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'personal', 'home').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavorite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'personal', 'home').optional(),
}).min(1);
