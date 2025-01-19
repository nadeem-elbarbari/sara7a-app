import { EventEmitter } from 'node:events';
import { sendEmail } from '../mail/sendEmail';
import { IUser } from '../../DB/models/user.model';

const emitter = new EventEmitter();

emitter.on('sendEmail', (to: string, subject: string, html: string) => {
    sendEmail(to, subject, html);
});

export default emitter;
