import { EventEmitter } from 'node:events';
import { sendEmail } from '../mail/sendEmail';
import { IUser } from '../../DB/models/user.model';

const emitter = new EventEmitter();

emitter.on('sendEmail', ([data, link]: [string, string], newUser: IUser) => {
    sendEmail(
        data,
        'Signup confirmation',
        `
            <h1>Signup Confirmation 😂</h1>
            <p style="font-size: 15px; font-weight: bold;">Hi ${newUser.name} 👋,</p>
            <p style="font-size: 20px;">please click on the link below to confirm your account 👇</p>
            <a href="${link}">${link}</a>
            <p style="font-size: 25px; color: red; text-decoration: underline">⚠️ This link will expire in 24 hours</p>
        `
    );
});

export default emitter;
