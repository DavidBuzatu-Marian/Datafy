import { Schema, model, Document } from 'mongoose';

export interface PersonModel extends Document {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  birthday?: Date;
  country?: string;
  [key: string]: any;
}

const personSchema = new Schema<PersonModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  birthday: { type: Date },
  country: { type: String },
});

export const Person = model<PersonModel>('Person', personSchema);
