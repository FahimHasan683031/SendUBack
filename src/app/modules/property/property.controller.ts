import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PropertyServices } from './property.service'

// Create property
const createProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyServices.createProperty(req.user, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Property created successfully',
        data: result,
    })
})

// Get properties by user ID
const getPropertiesByUserId = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyServices.getPropertiesByUserId(
        req.params.userId,
        req.query,
    )

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User properties retrieved successfully',
        data: result.properties,
        meta: result.meta,
    })
})

// Get my properties
const getMyProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyServices.getMyProperties(req.user, req.query)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'My properties retrieved successfully',
        data: result.properties,
        meta: result.meta,
    })
})

// Get single property
const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyServices.getSingleProperty(req.params.id)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Property retrieved successfully',
        data: result,
    })
})

// Update property
const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyServices.updateProperty(
        req.user,
        req.params.id,
        req.body,
    )

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Property updated successfully',
        data: result,
    })
})

// Delete property
const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyServices.deleteProperty(req.user, req.params.id)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Property deleted successfully',
        data: result,
    })
})

export const PropertyControllers = {
    createProperty,
    getPropertiesByUserId,
    getMyProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
}
