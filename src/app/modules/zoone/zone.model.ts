import { Schema, model } from 'mongoose';
import { IZone } from './zone.interface';

const zoneSchema = new Schema<IZone>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    countries: [
      {
        type: String,
        required: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better performance
zoneSchema.index({ id: 1 });
zoneSchema.index({ countries: 1 });
zoneSchema.index({ name: 1 });

export const Zone = model<IZone>('Zone', zoneSchema);