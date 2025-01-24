import Permission from '../../../models/sequelize/auth/Permission.mjs';

const createPermission = async (permissionData) => {
    return await Permission.create(permissionData);
};

const getPermissionById = async (id) => {
    return await Permission.findByPk(id);
};

const updatePermission = async (id, updatedData) => {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error('Permission not found');
    return await permission.update(updatedData);
};

const deletePermission = async (id) => {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error('Permission not found');
    await permission.destroy();
    return { message: 'Permission deleted successfully' };
};

const getAllPermissions = async (limit = 10, offset = 0) => {
    return await Permission.findAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']] // Updated to camelCase
    });
};

export {
    createPermission,
    getPermissionById,
    updatePermission,
    deletePermission,
    getAllPermissions
};

