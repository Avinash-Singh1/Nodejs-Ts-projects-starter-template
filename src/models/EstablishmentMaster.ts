import { Schema, model, Document, Types } from 'mongoose';

export interface IEstablishmentMaster extends Document {
  hospitalId: Types.ObjectId;
  city?: string;
  isOwner?: boolean;
  name?: string;
  locality?: string;
  propertyStatus?: number;
  establishmentProof?: { url?: string; fileType?: string; urlType?: string }[];
  establishmentMobile?: string;
  establishmentEmail?: string;
  address?: { landmark?: string; locality?: string; city?: string; state?: Types.ObjectId; country?: string; pincode?: string };
  isDeleted: boolean;
  isLocationShared: boolean;
  location: { type: string; coordinates: number[] };
  totalreviews: number;
  rating: number;
  recommended: number;
  hospitalTypeId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  modifiedBy?: Types.ObjectId;
  profileSlug?: string;
}

const EstablishmentMasterSchema = new Schema<IEstablishmentMaster>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'users' },
    city: String,
    isOwner: Boolean,
    name: String,
    locality: String,
    propertyStatus: { type: Number, enum: [1, 2, 3, 4] },
    establishmentProof: [{ url: { type: String, default: null }, fileType: { type: String, default: null }, urlType: { type: String, default: null } }],
    establishmentMobile: String,
    establishmentEmail: String,
    address: {
      landmark: String,
      locality: String,
      city: String,
      state: { type: Schema.Types.ObjectId, ref: 'statemasters' },
      country: { type: String, default: 'India' },
      pincode: String,
    },
    isDeleted: { type: Boolean, default: false },
    isLocationShared: { type: Boolean, default: false },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [77.216721, 28.6448], index: '2dsphere' },
    },
    totalreviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    recommended: { type: Number, default: 0 },
    hospitalTypeId: { type: Schema.Types.ObjectId, ref: 'hospitaltypes' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    profileSlug: String,
  },
  { timestamps: true, versionKey: false }
);

export const EstablishmentMaster = model<IEstablishmentMaster>('establishmentmasters', EstablishmentMasterSchema);
export default EstablishmentMaster;
