'use strict';
/** @type {import('sequelize-cli').Migration} */

const roles = [
  {
    id: 1,
    name: 'Admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', roles, {});
    await queryInterface.bulkInsert('user_roles', [{
      user_id: 1,
      role_id: 1,
    }], {});
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
