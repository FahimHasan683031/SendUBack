import { JwtPayload } from 'jsonwebtoken'
import { IProperty } from './property.interface'
import { Property } from './property.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '../user/user.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { searchLocationsByQuery } from '../../../utils/googleMapsAddress.util'
import { ClientSession } from 'mongoose'

// Create property
const createProperty = async (
    user: JwtPayload,
    payload: IProperty,
    session?: ClientSession,
) => {
    const isExistUser = await User.findById(user.authId)
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (isExistUser.role !== USER_ROLES.BUSINESS) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            'Only business users can create properties',
        )
    }

    // Auto-detect country code from address using Google Maps API
    const searchQuery = [
        payload.addressLine1,
        payload.addressLine2,
        payload.city,
        payload.postcode,
        payload.country,
    ]
        .filter(Boolean)
        .join(', ')

    try {
        const result = await searchLocationsByQuery(searchQuery)

        if (!result || result.length === 0) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Address not found. Please verify that the address is valid and exists.',
            )
        }

        if (!result[0].countryCode) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Unable to detect country code from the provided address. Please check the country name is correct.',
            )
        }

        payload.countryCode = result[0].countryCode
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to validate address. Please ensure the address details are correct.',
        )
    }

    const property = await Property.create([{
        ...payload,
        user: user.authId,
    }], { session })

    return property[0]
}

// Get properties by user ID
const getPropertiesByUserId = async (
    userId: string,
    query: Record<string, unknown>,
) => {
    const isExistUser = await User.findById(userId)
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Add user filter to query
    const modifiedQuery = { ...query, user: userId }

    const propertyQueryBuilder = new QueryBuilder(
        Property.find(),
        modifiedQuery,
    )
        .filter()
        .search(['propertyName', 'propertyType', 'city', 'country'])
        .sort()
        .paginate()
        .fields()

    const properties = await propertyQueryBuilder.modelQuery
    const paginateInfo = await propertyQueryBuilder.getPaginationInfo()

    return {
        properties,
        meta: paginateInfo,
    }
}

// Get my properties (logged-in business user)
const getMyProperties = async (
    user: JwtPayload,
    query: Record<string, unknown>,
) => {
    const isExistUser = await User.findById(user.authId)
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Add user filter to query
    const modifiedQuery = { ...query, user: user.authId }

    const propertyQueryBuilder = new QueryBuilder(
        Property.find(),
        modifiedQuery,
    )
        .filter()
        .search(['propertyName', 'propertyType', 'city', 'country'])
        .sort()
        .paginate()
        .fields()

    const properties = await propertyQueryBuilder.modelQuery
    const paginateInfo = await propertyQueryBuilder.getPaginationInfo()

    return {
        properties,
        meta: paginateInfo,
    }
}

// Get single property
const getSingleProperty = async (id: string) => {
    const property = await Property.findById(id).populate({
        path: 'user',
        select: 'firstName lastName email image businessDetails',
    })

    if (!property) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found')
    }

    return property
}

// Update property
const updateProperty = async (
    user: JwtPayload,
    id: string,
    payload: Partial<IProperty>,
) => {
    const isExistUser = await User.findById(user.authId)
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    const isExistProperty = await Property.findById(id)
    if (!isExistProperty) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found')
    }

    // Check if user is the owner or admin
    if (
        isExistProperty.user.toString() !== user.authId &&
        isExistUser.role !== USER_ROLES.ADMIN
    ) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            'You are not authorized to update this property',
        )
    }

    // Auto-detect country code if address is being updated
    if (
        payload.addressLine1 ||
        payload.addressLine2 ||
        payload.city ||
        payload.postcode ||
        payload.country
    ) {
        const searchQuery = [
            payload.addressLine1 || isExistProperty.addressLine1,
            payload.addressLine2 || isExistProperty.addressLine2,
            payload.city || isExistProperty.city,
            payload.postcode || isExistProperty.postcode,
            payload.country || isExistProperty.country,
        ]
            .filter(Boolean)
            .join(', ')


        try {
            let result = await searchLocationsByQuery(searchQuery)

            // Fallback: If full address fails and country is being updated, try just the country
            if ((!result || result.length === 0 || !result[0].countryCode) && payload.country) {
                result = await searchLocationsByQuery(payload.country)
            }

            if (!result || result.length === 0) {
                throw new ApiError(
                    StatusCodes.BAD_REQUEST,
                    'Updated address not found. Please verify that the address is valid and exists.',
                )
            }

            if (!result[0].countryCode) {
                throw new ApiError(
                    StatusCodes.BAD_REQUEST,
                    'Unable to detect country code from the updated address. Please check the country name is correct.',
                )
            }

            payload.countryCode = result[0].countryCode
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Failed to validate updated address. Please ensure the address details are correct.',
            )
        }
    }

    const property = await Property.findByIdAndUpdate(id, payload, {
        new: true,
    })

    return property
}

// Delete property
const deleteProperty = async (user: JwtPayload, id: string) => {
    const isExistUser = await User.findById(user.authId)
    if (!isExistUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    const isExistProperty = await Property.findById(id)
    if (!isExistProperty) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found')
    }

    // Check if user is the owner or admin
    if (
        isExistProperty.user.toString() !== user.authId &&
        isExistUser.role !== USER_ROLES.ADMIN
    ) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            'You are not authorized to delete this property',
        )
    }

    const property = await Property.findByIdAndDelete(id)
    return property
}

export const PropertyServices = {
    createProperty,
    getPropertiesByUserId,
    getMyProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
}
