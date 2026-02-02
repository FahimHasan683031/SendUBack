import { JwtPayload } from 'jsonwebtoken'
import { LostItem } from '../lostItem/lostItem.model'
import { Shipping } from '../shipping/shipping.model'
import { User } from '../user/user.model'

const getDashboardOverview = async () => {
  //  TOTAL Shipping
  const totalShipping = await Shipping.countDocuments()

  //  total Business
  const totalBusiness = await User.countDocuments({
    role: 'business',
  })

  // total delivar this month
  const totalDeliveriesThisMonth = await Shipping.countDocuments({
    status: 'shipped',
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  })

  // Resent Shipping
  const resentOrders = await Shipping.find({
    status: 'paymentCompleted',
  }).populate([
      {
        path: 'lostItemId',
        populate: [
          {
            path: 'property',
          },
          {
            path: 'user',
            select: '-password -authentication -__v',
          },
        ],
      },
    ])
    .limit(5)
    .sort({
      createdAt: -1,
    })

  // Resent Lost Items
  const resentLostItems = await LostItem.find().populate([
      {
        path: 'user',
        select: '-authentication -password -__v',
      },
      {
        path: 'property',
      },
    ])
    .limit(5)
    .sort({
      createdAt: -1,
    })

  //  ✅ TOTAL Lost Item
  const totalLostItems = await LostItem.countDocuments()

  // ✅ Orders Today
  const todayOrders = await Shipping.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  })

  // ✅ Shipment In Progress
  const shipmentInProgress = await Shipping.countDocuments({
    status: 'inTransit',
  })

  return {
    totalShipping,
    totalBusiness,
    totalDeliveriesThisMonth,
    totalLostItems,
    todayOrders,
    shipmentInProgress,
    resentOrders,
    resentLostItems
  }
}

const businessDashboardOverview = async (user: JwtPayload) => {
  //  TOTAL Lost Item
  const totalLostItem = await LostItem.countDocuments({
    user: user.authId,
  })

  //  my shipping
  const totalShipping = await Shipping.countDocuments({
    'address_from.email': user.email,
  })

  // total delivar this month
  const totalDeliveriesThisMonth = await Shipping.countDocuments({
    'address_from.email': user.email,
    status: 'shipped',
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  })

  // Resent lost items
  const resentLostItems = await LostItem.find({
    user: user.authId,
  })
    .limit(5)
    .sort({
      createdAt: -1,
    })

  return {
    totalLostItem,
    resentLostItems,
    totalShipping,
    totalDeliveriesThisMonth,
  }
}
const getPublicStats = async () => {
  const totalBusinessAccounts = await User.countDocuments({ role: 'business' })
  const totalShippings = await Shipping.countDocuments()

  return {
    totalBusinessAccounts,
    totalShippings,
  }
}

export const DshboardServices = {
  getDashboardOverview,
  businessDashboardOverview,
  getPublicStats,
}
