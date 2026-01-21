'use strict'
const { faker } = require('@faker-js/faker')
const slugify = require('slugify')

module.exports = {
  up: async queryInterface => {
    // First get all course IDs from the database
    const [courses] = await queryInterface.sequelize.query('SELECT id FROM Courses;')
    const courseIds = courses.map(course => course.id)

    if (courseIds.length === 0) {
      console.log('No courses found. Please seed courses first.')
      return
    }

    const lessons = []
    const lessonCountPerCourse = 8 // Average lessons per course

    courseIds.forEach(courseId => {
      // Random number of lessons per course (between 5-12)
      const lessonCount = faker.number.int({
        min: Math.max(5, lessonCountPerCourse - 3),
        max: lessonCountPerCourse + 4,
      })

      for (let i = 0; i < lessonCount; i++) {
        // Tạo title mới cho mỗi bài học
        const title = `${faker.helpers.arrayElement([
          `Getting Started with ${faker.hacker.noun()}`,
          `Deep Dive: ${faker.hacker.ingverb()} ${faker.hacker.noun()}`,
          `Mastering ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
          `Advanced Techniques in ${faker.hacker.noun()}`,
          `Practical ${faker.hacker.noun()} Applications`,
          `${faker.hacker.ingverb()} ${faker.hacker.noun()} Effectively`,
          `Understanding ${faker.hacker.abbreviation()} ${faker.hacker.noun()}`,
          `Best Practices for ${faker.hacker.phrase()}`,
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

        lessons.push({
          title: title,
          slug: uniqueSlug,
          description: faker.lorem.paragraph(),
          details: faker.lorem.paragraphs(3),
          order_index: i + 1,
          courseId: courseId,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        })
      }
    })

    await queryInterface.bulkInsert('Lessons', lessons, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Lessons', null, {})
  },
}
