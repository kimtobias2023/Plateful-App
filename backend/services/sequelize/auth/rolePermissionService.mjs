import RolePermission from '../../../models/sequelize/auth/RolePermission.mjs';

const associateRoleWithPermission = async (roleId, permissionId) => {
    return await RolePermission.create({ roleId: roleId, permissionId: permissionId });
};

const removeAssociation = async (roleId, permissionId) => {
    const association = await RolePermission.findOne({
        where: { roleId: roleId, permissionId: permissionId }
    });
    if (!association) throw new Error('Association not found');
    await association.destroy();
    return { message: 'Association removed successfully' };
};

const getPermissionsByRoleId = async (roleId) => {
    return await RolePermission.findAll({
        where: { roleId: roleId },
        include: {
            association: 'Permission',
            attributes: ['id', 'name']
        }
    });
};

const getRolesByPermissionId = async (permissionId) => {
    return await RolePermission.findAll({
        where: { permissionId: permissionId },
        include: {
            association: 'Role',
            attributes: ['id', 'name']
        }
    });
};

export {
    associateRoleWithPermission,
    removeAssociation,
    getPermissionsByRoleId,
    getRolesByPermissionId
};

