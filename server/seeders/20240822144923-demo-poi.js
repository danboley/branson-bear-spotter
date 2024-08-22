'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pois', [
      {
        id: uuidv4(),
        name: 'POI 1',
        address: '123 Main St',
        details: 'Description of POI 1',
        latitude: 37.7749,
        longitude: -122.4194,
        approvalStatus: 'pending',
        userId: 'ee5a06c3-793d-46c3-a0ce-6c4d62aca7e2', // Replace with actual user ID from User seeder
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'POI 2',
        address: '456 Oak St',
        details: 'Description of POI 2',
        latitude: 40.7128,
        longitude: -74.0060,
        approvalStatus: 'pending',
        userId: 'ee5a06c3-793d-46c3-a0ce-6c4d62aca7e2', // Replace with another actual user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pois', null, {});
  },
};
