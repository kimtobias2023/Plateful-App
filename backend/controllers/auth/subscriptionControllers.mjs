import { getSubscriptionByUserId, createSubscription, cancelSubscription } from '../services/sequelize/subscription/subscriptionService.mjs';

export async function getSubscription(req, res) {
  try {
    const userId = req.user.id; // Assuming req.user is populated
    const subscription = await getSubscriptionByUserId(userId);
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found.' });
    }
    res.json(subscription);
  } catch (error) {
    console.error('[SubscriptionController] Error fetching subscription:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export async function createSubscriptionController(req, res) {
  try {
    const { plan, endDate } = req.body;
    const userId = req.user.id; // Assuming req.user is populated
    const subscription = await createSubscription(userId, plan, endDate);
    res.status(201).json(subscription);
  } catch (error) {
    console.error('[SubscriptionController] Error creating subscription:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export async function cancelSubscriptionController(req, res) {
  try {
    const userId = req.user.id; // Assuming req.user is populated
    const subscription = await cancelSubscription(userId);
    res.json({ message: 'Subscription canceled successfully.', subscription });
  } catch (error) {
    console.error('[SubscriptionController] Error canceling subscription:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
