'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    const documents = []

    const documentTitles = [
      'IELTS Study Guide',
      'Application Requirements',
      'Student Visa Form',
      'Course Registration',
      'Examination Rules',
      'Study Materials',
      'Practice Test Papers',
      'Vocabulary Handbook',
      'Grammar Reference',
      'Writing Templates',
      'Speaking Tips',
      'Listening Strategies',
      'Reading Techniques',
      'Band Score Criteria',
      'Test Day Checklist',
    ]

    for (let i = 0; i < 20; i++) {
      // Tạo title mới cho mỗi document
      const title = `${faker.helpers.arrayElement(documentTitles)} ${faker.number.int({
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

      documents.push({
        title: title,
        slug: uniqueSlug,
        image: faker.image.urlLoremFlickr({ category: 'document' }),
        description: faker.lorem.sentences(3),
        isActive: faker.datatype.boolean({ probability: 0.8 }), // Fixed typo and set 80% active
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      })
    }

    await queryInterface.bulkInsert('Documents', documents, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Documents', null, {})
  },
}
