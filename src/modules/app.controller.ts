import e from 'express';
import connectDB from '../DB/dbConnection';
import cors from 'cors';
import authRouter from './auth/auth.controller';
import usersRouter from './users/users.controller';
import msgRouter from './messages/messages.controller';
import { globalErrorHandler } from '../utils/error/errorHandler';

const bootstrap = (app: e.Application, express: typeof e) => {
  // middleware
  app.use(express.json());

  app.use(cors()); // enable cors

  // routes
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/messages', msgRouter)
  // database
  connectDB();

  // global error handler
  app.use(globalErrorHandler as any);
};

export default bootstrap;
