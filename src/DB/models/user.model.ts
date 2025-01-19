import mongoose from 'mongoose';

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
}

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    gender: Gender;
    isVerified: boolean;
    role: Roles;
    confirmedAt?: Date;
    isDeleted?: boolean;
    OTP?: string;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 25,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
            required: true,
            lowercase: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.USER,
        },
        confirmedAt: {
            type: Date,
        },
        isDeleted: {
            type: Boolean,
        },
        OTP: {
            type: String,
        },
    },
    { timestamps: true, versionKey: false }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
