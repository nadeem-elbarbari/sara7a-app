import { Router } from 'express';
import { authentication, authorization } from '../../middleware/auth.middleware';
import * as usersService from './users.service';
import { Roles } from '../../DB/models/user.model';

const router = Router();

// ? user

// * --------- get ----------

// parameters: Object.values(Roles) || ['user', 'admin'] || ['user']
router.get('/profile', authentication, authorization(Object.values(Roles)), usersService.getProfile);

// ^ --------- post ----------

// ! --------- delete ----------

// ~ --------- patch ----------

router.patch('/update', authentication, authorization(Object.values(Roles)), usersService.updateProfile);

export default router;
