import { Schema, model, Document } from 'mongoose';

interface Person extends Document {
  _id: string;
  name: string;
  email: string;
  phone_number?: string;
  birthday?: Date;
  country?: string;
}

const personSchema = new Schema<Person>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String },
  birthday: { type: Date },
  country: { type: String },
});

export const Person = model<Person>('Person', personSchema);
