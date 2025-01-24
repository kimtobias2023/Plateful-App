import Subscription from './../models/sequelize/Subscription.mjs';

export async function getSubscriptionByUserId(userId) {
  return await Subscription.findOne({
    where: { userId, status: 'active' },
    order: [['startDate', 'DESC']], // Get the most recent subscription
  });
}

export async function createSubscription(userId, plan, endDate = null) {
  return await Subscription.create({
    userId,
    plan,
    endDate,
  });
}

export async function cancelSubscription(userId) {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) {
    throw new Error('No active subscription found.');
  }
  subscription.status = 'canceled';
  await subscription.save();
  return subscription;
}
