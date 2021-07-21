import mongoose from 'mongoose';
import config from 'config';

const database: string = config.get('mongoURI');

export const connectToDatabase = async () => {
  try {
    connectWithMongoose();
  } catch (err) {
    logError(err);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    disconnectWithMongoose();
  } catch (err) {
    logError(err);
  }
};

export const destroyDatabase = async () => {
  try {
    destroyDatabaseAndCloseConnection();
  } catch (err) {
    logError(err);
  }
};

const destroyDatabaseAndCloseConnection = async () => {
  await mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
};

const disconnectWithMongoose = async () => {
  await mongoose.connection.close();
};

const connectWithMongoose = async () => {
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', true);
  await mongoose.connect(database);
};

const logError = (err: { message: string }) => {
  console.error(err.message);
  process.exit(1);
};
