import { Schema, model, Document } from 'mongoose';

export interface EventModel extends Document {
  _id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  location: string;
  directions?: string;
  details?: string;
  date_added: Date;
  calendar_id: string;
  [key: string]: any;
}

const eventSchema = new Schema<EventModel>({
  name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  location: { type: String, required: true },
  directions: { type: String },
  details: { type: String },
  calendar_id: { type: String },
  date_added: { type: Date, default: Date.now() },
});

export const Event = model<EventModel>('Event', eventSchema);
