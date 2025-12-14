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
  const resentShipping = await Shipping.find({
    status: 'paymentCompleted',
  }).limit(5).sort({
    createdAt: -1,
  })

  return {
    totalShipping,
    totalBusiness,
    totalDeliveriesThisMonth,
    resentShipping
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
  }).limit(5).sort({
    createdAt: -1,
  })

  return {
    totalLostItem,
    resentLostItems,
    totalShipping,
    totalDeliveriesThisMonth,
  }
}
export const DshboardServices = {
  getDashboardOverview,
  businessDashboardOverview
}
