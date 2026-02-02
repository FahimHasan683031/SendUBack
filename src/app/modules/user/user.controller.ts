import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserServices } from './user.service'
import { IUser } from './user.interface'
import config from '../../../config'
import { JwtPayload } from 'jsonwebtoken'
import { ExportUtils } from '../../../utils/export.util'



// Update Profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {

  const result = await UserServices.updateProfile(req.user! as JwtPayload, req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser(req.query)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: { ...result },
  })
})

// get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getSingleUser(req.params.id)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  })
})



// delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteUser(req.params.id)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
  })
})

// get profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getProfile(req.user! as JwtPayload)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile fetched successfully',
    data: result,
  })
})


// delete my account
const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteMyAccount(req.user! as JwtPayload)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Account deleted successfully",
  })
})



// export users
const exportBusinessUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsersForExport();

  const data = users.map((user: any) => ({
    "First Name": user.firstName || "",
    "Last Name": user.lastName || "",
    "Email": user.email,
    "Business Name": user.businessDetails?.businessName || "",
    "Business Address": user.businessDetails?.addressLine1 || "",
    "City": user.businessDetails?.city || "",
    "Country": user.businessDetails?.country || "",
    "Status": user.status,
    "Verified": user.verified ? "Yes" : "No",
    "Joined At": user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
  }));

  const format = req.query.format as string || 'csv';
  const fileName = "Business_Users_Export";

  if (format === 'xlsx') {
    const columns = [
      { header: 'First Name', key: 'First Name', width: 20 },
      { header: 'Last Name', key: 'Last Name', width: 20 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Business Name', key: 'Business Name', width: 25 },
      { header: 'Business Address', key: 'Business Address', width: 30 },
      { header: 'City', key: 'City', width: 15 },
      { header: 'Country', key: 'Country', width: 15 },
      { header: 'Status', key: 'Status', width: 15 },
      { header: 'Verified', key: 'Verified', width: 10 },
      { header: 'Joined At', key: 'Joined At', width: 15 },
    ];
    await ExportUtils.toExcel(res, data, columns, "Users", fileName);
  } else {
    const fields = ["First Name", "Last Name", "Email", "Business Name", "Business Address", "City", "Country", "Status", "Verified", "Joined At"];
    await ExportUtils.toCSV(res, data, fields, fileName);
  }
});

const getAllBusinessUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllBusinessUsers(req.query.searchTerm as string)

  const data = result.map((user: any) => ({
    _id: user._id,
    businessName: user.businessDetails?.businessName || `${user.firstName} ${user.lastName}`.trim(),
    image: user.image || "",
  }))

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Business users fetched successfully',
    data,
  })
})

export const UserController = {
  getAllUser,
  updateProfile,
  getSingleUser,
  deleteUser,
  getProfile,
  deleteMyAccount,
  exportBusinessUsers,
  getAllBusinessUsers,
}
