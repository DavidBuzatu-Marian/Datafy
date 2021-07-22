import { Schema, model, Document } from 'mongoose';

export interface EventModel extends Document {
  _id: string;
  name: string;
  date: Date;
  location: string;
  directions?: string;
  details?: string;
  [key: string]: any;
}

const eventSchema = new Schema<EventModel>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  directions: { type: String },
  details: { type: String },
});

export const Event = model<EventModel>('Event', eventSchema);
