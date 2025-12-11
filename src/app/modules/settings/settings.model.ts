import { model, Schema } from "mongoose";
import { ISettings } from "./settings.interface";

const SettingsSchema = new Schema<ISettings>({
    insurance:{
        type:Number,
        required:true
    },
    profitMargin:{
        type:Number,
        default:0
    },
    allowCountrys:{
        type:[String],
        default:[]
    }
})


export const SettingsModel = model<ISettings>("Settings",SettingsSchema)
