'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    const routes = []
    const buzzwords = [
      'Development',
      'Science',
      'Engineering',
      'Design',
      'Management',
      'Marketing',
      'Data',
      'Cloud',
      'Security',
      'Analytics',
    ]

    for (let i = 0; i < 10; i++) {
      // Tạo title mới cho mỗi bản ghi
      const title = `${faker.company.buzzAdjective()} ${
        buzzwords[i % buzzwords.length]
      } Path ${faker.number.int({
        min: 1,
        max: 2024,
      })}`

      // Tạo slug từ title và thêm số ngẫu nhiên để đảm bảo tính duy nhất
      const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })
      const uniqueSlug = `${baseSlug}-${faker.string.alphanumeric(6).toLowerCase()}`

      routes.push({
        title: title,
        slug: uniqueSlug,
        description: faker.lorem.paragraphs(2),
        goal: JSON.stringify(
          Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () => ({
            title: faker.company.catchPhrase(),
            description: faker.lorem.sentence(),
          })),
        ),
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent(),
      })
    }

    await queryInterface.bulkInsert('Routes', routes, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Routes', null, {})
  },
}
