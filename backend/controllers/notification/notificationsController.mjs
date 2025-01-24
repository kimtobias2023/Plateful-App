import {
    createNotification,
    getNotification,
    updateNotification,
    deleteNotificationService,
    listNotificationsForUser,
    markNotificationAsRead
} from '../../services/sequelize/notification/notificationService.mjs';

const create = async (req, res) => {
    try {
        const notification = await createNotification(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const get = async (req, res) => {
    try {
        const notification = await getNotification(req.params.id);
        if (notification) {
            res.status(200).json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        await updateNotification(req.params.id, req.body);
        res.status(200).json({ message: 'Notification updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await deleteNotificationService(req.params.id);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const listForUser = async (req, res) => {
    try {
        const notifications = await listNotificationsForUser(req.params.userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await markNotificationAsRead(req.params.id);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {
    create,
    get,
    update,
    deleteNotification,
    listForUser,
    markAsRead
};

