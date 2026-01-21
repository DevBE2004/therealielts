'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface) => {
    const partners = [];
    
    for (let i = 0; i < 20; i++) {
      partners.push({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        images: JSON.stringify(
          Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => 
            faker.image.urlLoremFlickr({ category: 'logo' })
          )
        ),
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent()
      });
    }
    
    await queryInterface.bulkInsert('Partners', partners, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Partners', null, {});
  }
};