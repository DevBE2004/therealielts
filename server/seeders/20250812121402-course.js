'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    // First get all existing route IDs
    const routes = await queryInterface.sequelize.query('SELECT id FROM Routes;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })

    if (routes.length === 0) {
      console.error('No routes found! Please seed routes first.')
      return
    }

    const courses = []
    const routeIds = routes.map(route => route.id)

    const courseTitles = [
      `Introduction to ${faker.company.buzzNoun()}`,
      `Advanced ${faker.company.buzzNoun()} Techniques`,
      `${faker.company.buzzAdjective()} ${faker.company.buzzNoun()} Masterclass`,
      `Fundamentals of ${faker.company.buzzNoun()}`,
      `${faker.company.buzzNoun()} Essentials`,
      `Professional ${faker.company.buzzNoun()} Development`,
      `${faker.company.buzzNoun()} Strategies and Applications`,
      `Modern ${faker.company.buzzNoun()} Practices`,
      `Comprehensive ${faker.company.buzzNoun()} Course`,
      `${faker.company.buzzNoun()} for Beginners`,
    ]

    for (let i = 0; i < 20; i++) {
      // Tạo title mới cho mỗi bản ghi
      const title = `${faker.helpers.arrayElement(courseTitles)} ${faker.number.int({
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

      // Tạo level dưới dạng JSON array
      const level = JSON.stringify([
        faker.number.int({ min: 0, max: 9 }),
        faker.number.int({ min: 0, max: 9 }),
      ])

      courses.push({
        title: title,
        slug: uniqueSlug,
        description: faker.lorem.paragraphs(2),
        images: JSON.stringify(
          Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () =>
            faker.image.urlLoremFlickr({ category: 'education' }),
          ),
        ),
        duration: `${faker.number.int({ min: 4, max: 16 })} weeks`,
        level: level,
        target: faker.number.float({ min: 6.0, max: 9.5, precision: 0.1 }),
        routeId: faker.helpers.arrayElement(routeIds),
        totalHours: faker.number.float({ min: 20, max: 100, precision: 0.5 }),
        benefit: `["${faker.person.jobType()}","${faker.company.buzzPhrase()}","${faker.commerce.productName()}"]`,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      })
    }

    await queryInterface.bulkInsert('Courses', courses, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Courses', null, {})
  },
}
