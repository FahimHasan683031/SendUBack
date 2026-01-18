import { Types, Document } from 'mongoose'

export interface IProperty extends Document {
    _id: Types.ObjectId
    user: Types.ObjectId
    propertyName: string
    propertyType: string
    propertyImage?: string[]
    addressLine1: string
    addressLine2?: string
    city: string
    postcode?: string
    country: string
    countryCode: string
    contactEmail: string
    contactPhone: string
    website?: string
}
