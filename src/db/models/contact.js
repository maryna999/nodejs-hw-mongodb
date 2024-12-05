import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavorite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'personal', 'work +'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const ContactsCollection = mongoose.model('Contact', contactSchema);
