import { Router } from 'express';
import * as usersService from './auth.service';
import validation from '../../middleware/validations/validation';
import * as schema from './auth.validation';

const router = Router();

// ? auth

// * --------- get ----------

router.get('/verify/:token', usersService.verifyEmail);

// ^ --------- post ----------

router.post('/signup', validation(schema.signUpSchema), usersService.signUp);

router.post('/login', validation(schema.loginSchema), usersService.logIn);

// ! --------- delete ----------

// ~ --------- patch ----------


export default router;