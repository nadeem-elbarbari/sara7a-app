import { Router } from 'express';
import { authentication, authorization } from '../../middleware/auth.middleware';
import * as usersService from './users.service';
import * as schema from './users.validation';
import { Roles } from '../../DB/models/user.model';
import validation from '../../middleware/validations/validation';

const router = Router();

// ? user

// * --------- get ----------

// parameters: Object.values(Roles) || ['user', 'admin'] || ['user']
router.get('/profile', authentication, authorization(Object.values(Roles)), usersService.getProfile);

// ^ --------- post ----------

// ! --------- delete ----------

// ~ --------- patch ----------

router.patch(
    '/update',
    validation(schema.updateProfile),
    authentication,
    authorization(Object.values(Roles)),
    usersService.updateProfile
);

export default router;
