import { Types } from 'mongoose'

export interface ISettings {
  _id?: Types.ObjectId
  insurance: {
    percentage: number
    maxValue: number
  }
  profitMargin?: number
  allowCountrys?: string[]
}
