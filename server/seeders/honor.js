'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface) => {
    const honors = [];
    
    for (let i = 0; i < 20; i++) {
      honors.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        mobile: faker.phone.number('09########'),
        achievement: faker.lorem.sentence(),
        awardDate: faker.date.past({ years: 2 }),
        description: faker.lorem.paragraph(),
        photo: faker.image.avatar(),
        isPublic: faker.datatype.boolean(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent()
      });
    }
    
    await queryInterface.bulkInsert('Honors', honors, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Honors', null, {});
  }
};