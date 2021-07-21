import { Event, EventModel } from '../../models/event';
import { Request } from 'express';
import { Model } from 'mongoose';

export const createEvent = (req: Request<{}, {}, EventModel>) => {
  const { name, date, location, directions, details } = req.body;
  const event = new Event({
    name,
    date,
    location,
    directions,
    details,
  });
  return event;
};

export const saveEvent = (event: EventModel) => {
  return event.save();
};
