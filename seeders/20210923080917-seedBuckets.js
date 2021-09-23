'use strict';
const fs = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     var data = JSON.parse(fs.readFileSync('./json/bucket.json', 'utf-8'))
     data.forEach(element => {
      element.createdAt = new Date()
      element.updatedAt = new Date()
     });
     return queryInterface.bulkInsert('Buckets', data) 
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('Buckets', null)
  }
};
