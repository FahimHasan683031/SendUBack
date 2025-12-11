import { ISettings } from "./settings.interface"
import { SettingsModel } from "./settings.model"

const createSettings = async (settings: ISettings) => {
    const existingSettings = await SettingsModel.findOne({})
    if (existingSettings) {
       const res= await SettingsModel.findByIdAndUpdate(existingSettings._id, settings,{
        new:true
       })
       return res
    }
    return await SettingsModel.create(settings)
}

const getSettings = async () => {
    const existingSettings = await SettingsModel.findOne({})
    return existingSettings || null
}


export const SettingsService = {
    createSettings,
    getSettings
}
