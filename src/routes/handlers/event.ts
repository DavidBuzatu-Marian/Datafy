import { Event, EventModel } from '../../models/event';
import { Request } from 'express';
import { Model } from 'mongoose';

export const createEvent = (req: Request<{}, {}, EventModel>) => {
  const { name, start_date, end_date, location, directions, details } =
    req.body;
  const event = new Event({
    name,
    start_date,
    end_date,
    location,
    directions,
    details,
  });
  return event;
};

export const findEvents = () => {
  return Event.find({});
};

export const findEventById = (id: any) => {
  return Event.findById(id);
};

export const saveEvent = (event: EventModel) => {
  return event.save();
};

export const deleteEvent = (id: any) => {
  return Event.deleteOne({ _id: id });
};
export const updateEvent = async (req: Request): Promise<EventModel> => {
  return Event.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true }
  );
};
