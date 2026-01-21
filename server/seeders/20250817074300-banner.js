'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    const banners = []
    const ieltsCategories = [
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
      'IELTS Preparation',
      'IELTS Strategies',
      'IELTS Mock Test',
      'IELTS Online Course',
      'IELTS Study Materials',
    ]

    const bannerTitles = [
      'Master IELTS Writing',
      'Improve Your Speaking Skills',
      'IELTS Preparation Course',
      'Achieve Your Target Score',
      'Expert IELTS Guidance',
      'Boost Your IELTS Band',
      'Comprehensive IELTS Training',
      'IELTS Success Strategies',
      'Professional IELTS Coaching',
      'IELTS Practice Materials',
    ]

    for (let i = 0; i < 20; i++) {
      // Tạo title mới cho mỗi banner
      const title = `${faker.helpers.arrayElement(bannerTitles)} ${faker.number.int({
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

      banners.push({
        title: title,
        slug: uniqueSlug,
        image: faker.image.urlLoremFlickr({ category: 'education' }), // Changed to education category
        isActive: faker.datatype.boolean({ probability: 0.8 }), // 80% chance of being active
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
        url: faker.internet.url(),
        category: faker.helpers.arrayElement(ieltsCategories),
      })
    }

    await queryInterface.bulkInsert('Banners', banners, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Banners', null, {})
  },
}
