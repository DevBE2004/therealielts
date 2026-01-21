'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface) => {
    const examRegistrations = [];

    for (let i = 0; i < 20; i++) {
      examRegistrations.push({
        name: faker.person.fullName(),
        mobile: faker.phone.number('09########'),
        email: faker.internet.email(),
        organization: faker.company.name(),
        module: faker.lorem.word({ min: 5, max: 10 }),
        form: faker.helpers.arrayElement(['Online', 'In-Person', 'Hybrid']),
        examDate: faker.date.future({ years: 1 }),
        mailingAddress: faker.location.streetAddress({ useFullAddress: true }),
        promotionalProduct: faker.commerce.productName(),
        passport: faker.string.alphanumeric({ length: 9 }),
        registrationObject: faker.lorem.sentence(),
        bill: faker.string.uuid(),
        isConfirmed: faker.datatype.boolean(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      });
    }

    await queryInterface.bulkInsert('ExamRegistrations', examRegistrations, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ExamRegistrations', null, {});
  },
};