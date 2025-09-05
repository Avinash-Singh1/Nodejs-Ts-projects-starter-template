// src/models/Doctor.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation {
  degree: string;
  college: string;
  year: string;
}

export interface IDoctor extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  gender: number;
  city?: string;
  state?: string;
  email?: string;
  experience?: string;
  specialization?: mongoose.Types.ObjectId | string;
  education?: IEducation[];
  createdAt?: Date;
  updatedAt?: Date;
}

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  college: { type: String, required: true },
  year: { type: String, required: true },
}, { _id: false });

const DoctorSchema = new Schema<IDoctor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gender: { type: Number, default: 3 },
  city: String,
  state: String,
  email: { type: String, index: true },
  experience: String,
  specialization: { type: Schema.Types.ObjectId, ref: 'Specialization' },
  education: [EducationSchema],
}, { timestamps: true });

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);
export default Doctor;
