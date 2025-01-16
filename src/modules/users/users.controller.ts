import { Router } from 'express';
import * as usersService from './users.service';

const router = Router();

// ? auth

// * --------- get ----------

// ^ --------- post ----------

router.post('/auth/signup', usersService.signUp);

router.post('/auth/login', usersService.logIn);

// ! --------- delete ----------

// ~ --------- patch ----------

// ? user

// * --------- get ----------

// ^ --------- post ----------

// ! --------- delete ----------

// ~ --------- patch ----------

export default router;
