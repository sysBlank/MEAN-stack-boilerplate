'use strict';

/** @type {import('sequelize-cli').Migration} */

const adminPerm = [
  {
    id: 1,
    name: 'user_access',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'user_edit',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'user_delete',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: 'user_create',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    name: 'user_show',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    name: 'role_access',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    name: 'role_edit',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    name: 'role_delete',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 9,
    name: 'role_create',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 10,
    name: 'role_show',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'permission_access',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'permission_edit',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 13,
    name: 'permission_delete',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 14,
    name: 'permission_create',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 15,
    name: 'permission_show',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', adminPerm, {});
    let permArrAdmin = [];

    adminPerm.forEach(el => {
      permArrAdmin.push({
        role_id: 1,
        permission_id: el.id,
      });
    })
    await queryInterface.bulkInsert('role_permissions', permArrAdmin, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
