import e from 'express';
import connectDB from '../DB/dbConnection';
import cors from 'cors';
import usersRouter from './users/users.controller';
import { globalErrorHandler } from '../utils/error/errorHandler';

const bootstrap = (app: e.Application, express: typeof e) => {
  // middleware
  app.use(express.json());

  app.use(cors()); // enable cors

  // routes
  app.use('/', usersRouter);

  // database
  connectDB();

  // global error handler
  app.use(globalErrorHandler as any);
};

export default bootstrap;
