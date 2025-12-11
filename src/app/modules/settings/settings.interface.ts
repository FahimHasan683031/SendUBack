import { Types } from "mongoose"

export interface ISettings{
    _id?:Types.ObjectId
    insurance:number
    profitMargin?:number
    allowCountrys?:string[]
}

