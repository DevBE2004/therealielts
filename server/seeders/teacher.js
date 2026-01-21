'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface) => {
    const teachers = [];
    
    for (let i = 0; i < 20; i++) {
      teachers.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        mobile: faker.phone.number('09########'),
        avatar: faker.image.avatar(),
        bio: faker.person.bio(),
        education: faker.helpers.arrayElement([
          'MA in TESOL, University of London',
          'PhD in Linguistics, Harvard University',
          'BA in English Literature, Oxford University'
        ]),
        ieltsScore: faker.number.float({ min: 5.5, max: 9, precision: 0.5 }),
        yearsOfExperience: faker.number.int({ min: 1, max: 20 }),
        teachingStyle: faker.lorem.paragraph(),
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent()
      });
    }
    
    await queryInterface.bulkInsert('Teachers', teachers, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Teachers', null, {});
  }
};