import { Schema, model } from 'mongoose'
import { IProperty } from './property.interface'

const propertySchema = new Schema<IProperty>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        propertyName: {
            type: String,
            required: true,
            trim: true,
        },
        propertyType: {
            type: String,
            required: true,
            trim: true,
        },
        propertyImage: [
            {
                type: String,
                trim: true,
            },
        ],
        addressLine1: {
            type: String,
            required: true,
            trim: true,
        },
        addressLine2: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        postcode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        countryCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        contactPhone: {
            type: String,
            required: true,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
)

// Indexes for better query performance
propertySchema.index({ user: 1 })
propertySchema.index({ propertyType: 1 })
propertySchema.index({ city: 1 })
propertySchema.index({ country: 1 })

export const Property = model<IProperty>('Property', propertySchema)
