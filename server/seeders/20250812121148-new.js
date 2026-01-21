'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    const news = []
    const categories = [
      'IELTS Listening',
      'IELTS Reading',
      'IELTS Writing Task 1',
      'IELTS Writing Task 2',
      'IELTS Speaking',
      'IELTS Tips',
      'IELTS Practice Test',
      'IELTS Vocabulary',
      'IELTS Grammar',
      'IELTS Band Score',
    ]

    for (let i = 0; i < 20; i++) {
      // Tạo title mới cho mỗi bản ghi
      const title = `${faker.helpers.arrayElement([
        `New ${faker.company.buzzNoun()} Program Announced`,
        `${faker.company.buzzAdjective()} Update from ${faker.company.name()}`,
        `Important ${faker.company.buzzNoun()} Information`,
        `${faker.company.buzzAdjective()} ${faker.company.buzzNoun()} Tips for Success`,
        `How to Improve Your ${faker.company.buzzNoun()} Skills`,
        `Latest ${faker.company.buzzNoun()} Trends and Insights`,
      ])} ${faker.number.int({
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

      news.push({
        title: title,
        slug: uniqueSlug,
        description: faker.lorem.paragraphs(3),
        images: JSON.stringify(
          Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
            faker.image.urlLoremFlickr({ category: 'business' }),
          ),
        ),
        url: faker.internet.url(),
        category: faker.helpers.arrayElement(categories),
        isActive: faker.datatype.boolean({ probability: 0.8 }), // 80% là active
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      })
    }

    await queryInterface.bulkInsert('News', news, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('News', null, {})
  },
}
