import { Router } from 'express';
import { getMessages, sendMessage } from './messages.service';
import validation from '../../middleware/validations/validation';
import { messageSchema } from './messages.validation';
import { authentication } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', validation(messageSchema), sendMessage);

router.get('/', authentication, getMessages);

export default router;
