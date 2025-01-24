import Notification from '../../models/sequelize/notification/Notification.mjs';

const createNotification = async (data) => {
    try {
        return await Notification.create(data);
    } catch (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
    }
};

const getNotification = async (notificationId) => {
    try {
        return await Notification.findByPk(notificationId);
    } catch (error) {
        throw new Error(`Failed to get notification: ${error.message}`);
    }
};

const updateNotification = async (notificationId, data) => {
    try {
        return await Notification.update(data, {
            where: {
                id: notificationId
            }
        });
    } catch (error) {
        throw new Error(`Failed to update notification: ${error.message}`);
    }
};

const deleteNotificationService = async (notificationId) => {
    try {
        return await Notification.destroy({
            where: {
                id: notificationId
            }
        });
    } catch (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
    }
};

const listNotificationsForUser = async (userId) => {
    try {
        return await Notification.findAll({
            where: {
                user_id: userId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    } catch (error) {
        throw new Error(`Failed to list notifications: ${error.message}`);
    }
};

const markNotificationAsRead = async (notificationId) => {
    try {
        return await Notification.update({ read: true }, {
            where: {
                id: notificationId
            }
        });
    } catch (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
};

export {
    createNotification,
    getNotification,
    updateNotification,
    deleteNotificationService,
    listNotificationsForUser,
    markNotificationAsRead
};
