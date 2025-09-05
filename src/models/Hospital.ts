import { Schema, model, Document, Types } from 'mongoose';
import constants from '../utils/constant';

export interface IHospital extends Document {
  userId: Types.ObjectId;
  profilePic?: string;
  city?: string;
  totalDoctor?: number;
  hospitalType?: Types.ObjectId;
  isOwner?: boolean;
  totalBed?: number;
  ambulance?: number;
  about?: string;
  service?: { name: string }[];
  social?: { type: Types.ObjectId; url: string }[];
  image?: { url: string }[];
  specialization?: Types.ObjectId[];
  steps: number;
  speciality?: Types.ObjectId[];
  procedure?: Types.ObjectId[];
  address?: {
    landmark?: string;
    locality?: string;
    city?: string;
    state?: Types.ObjectId;
    country?: string;
    pincode?: string;
  };
  isLocationShared?: boolean;
  location?: { type: string; coordinates: number[] };
  publicUrl?: string;
  isVerified?: number;
  rejectReason?: string;
  establishmentProof?: { url?: string; fileType?: string }[];
  status?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  profileScreen?: number;
}

const hospitalSchema = new Schema<IHospital>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    profilePic: { type: String, default: null },
    city: { type: String, default: null },
    totalDoctor: { type: Number, default: 0 },
    hospitalType: { type: Schema.Types.ObjectId, ref: 'hospitaltypes' },
    isOwner: Boolean,
    totalBed: Number,
    ambulance: Number,
    about: String,
    service: [{ name: String }],
    social: [{ type: { type: Schema.Types.ObjectId, ref: 'socialmedias' }, url: String }],
    image: [{ url: String }],
    specialization: [{ type: Schema.Types.ObjectId, ref: 'Specialization' }],
    steps: { type: Number, enum: Object.values(constants.PROFILE_STEPS), default: constants.PROFILE_STEPS.SECTION_A },
    speciality: [{ type: Schema.Types.ObjectId, ref: 'specializations' }],
    procedure: [{ type: Schema.Types.ObjectId, ref: 'proceduremasters' }],
    address: {
      landmark: String,
      locality: String,
      city: String,
      state: { type: Schema.Types.ObjectId, ref: 'statemasters' },
      country: { type: String, default: 'India' },
      pincode: String,
    },
    isLocationShared: { type: Boolean, default: false },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [77.216721, 28.6448], index: '2dsphere' },
    },
    publicUrl: String,
    isVerified: { type: Number, enum: Object.values(constants.PROFILE_STATUS), default: constants.PROFILE_STATUS.PENDING },
    rejectReason: String,
    establishmentProof: [{ url: { type: String, default: null }, fileType: { type: String, default: null } }],
    status: String,
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    profileScreen: { type: Number, enum: Object.values(constants.HOSPITAL_SCREENS), default: constants.HOSPITAL_SCREENS.ESTABLISHMENT_DETAILS },
  },
  { timestamps: true, versionKey: false }
);

export const Hospital = model<IHospital>('hospitals', hospitalSchema);
export default Hospital;
