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

router.get('/share/:id', validation(schema.shareProfile), usersService.shareProfile);

// ^ --------- post ----------

router.post('/request-otp', validation(schema.requestOTP), usersService.requestOTP);

router.post('/reset-password', validation(schema.resetPassword), usersService.resetPassword);

// ! --------- delete ----------
router.delete('/delete/:id', validation(schema.deleteProfile), authentication, usersService.softDelete);
// ~ --------- patch ----------

router.patch(
    '/update',
    validation(schema.updateProfile),
    authentication,
    authorization(Object.values(Roles)),
    usersService.updateProfile
);

router.patch('/update-password', validation(schema.changePassword), authentication, usersService.updatePassword);

export default router;
