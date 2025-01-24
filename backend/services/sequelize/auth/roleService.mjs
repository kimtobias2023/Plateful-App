import Role from '../../../models/sequelize/auth/Role.mjs';

const createRole = async (roleData) => {
    return await Role.create(roleData);
};

const getRoleById = async (id) => {
    return await Role.findByPk(id);
};

const updateRole = async (id, updatedData) => {
    const role = await Role.findByPk(id);
    if (!role) throw new Error('Role not found');
    return await role.update(updatedData);
};

const deleteRole = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) throw new Error('Role not found');
    await role.destroy();
    return { message: 'Role deleted successfully' };
};

const getAllRoles = async (limit = 10, offset = 0) => {
    return await Role.findAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    });
};

export {
    createRole,
    getRoleById,
    updateRole,
    deleteRole,
    getAllRoles
};
