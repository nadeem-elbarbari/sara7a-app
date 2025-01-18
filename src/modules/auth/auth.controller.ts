import { Router } from 'express';
import * as usersService from './auth.service';
import validation from '../../middleware/validations/validation';
import * as schema from './auth.validation';

const router = Router();

// ? auth

// * --------- get ----------

router.get('/auth/verify/:token', usersService.verifyEmail);

// ^ --------- post ----------

router.post('/auth/signup', validation(schema.signUpSchema), usersService.signUp);

router.post('/auth/login', validation(schema.loginSchema), usersService.logIn);

// ! --------- delete ----------

// ~ --------- patch ----------
