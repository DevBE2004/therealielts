'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    const studyAbroads = []
    const countries = [
      'USA',
      'UK',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Japan',
      'New Zealand',
      'Netherlands',
      'Sweden',
    ]

    for (let i = 0; i < countries.length; i++) {
      // Tạo title mới cho mỗi study abroad
      const title = `Study in ${countries[i]}`

      // Tạo slug từ title và thêm số ngẫu nhiên để đảm bảo tính duy nhất
      const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })
      const uniqueSlug = `${baseSlug}-${faker.string.alphanumeric(6).toLowerCase()}`

      studyAbroads.push({
        title: title,
        slug: uniqueSlug,
        description: faker.lorem.paragraphs(3),
        images: JSON.stringify(
          Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
            faker.image.urlLoremFlickr({ category: 'city' }),
          ),
        ),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      })
    }

    await queryInterface.bulkInsert('StudyAbroads', studyAbroads, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('StudyAbroads', null, {})
  },
}
