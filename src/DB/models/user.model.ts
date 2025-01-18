import mongoose from 'mongoose';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

enum Roles {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    gender: Gender;
    isConfirmed: boolean;
    role: Roles;
    confirmedAt?: Date;
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
    isConfirmed: {
      type: Boolean,
      default: false,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER,
    },
    confirmedAt: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
