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
]

module.exports = {
  async up (queryInterface, Sequelize) {
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

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
