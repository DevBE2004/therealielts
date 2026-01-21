'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async queryInterface => {
    // Corrected query syntax for MySQL
    // const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
    //   type: queryInterface.sequelize.QueryTypes.SELECT,
    // })

    // if (users.length === 0) {
    //   console.warn('Không tìm thấy user nào trong database, hãy chạy seed User trước')
    //   return
    // }

    const comments = []
    const commentContents = [
      'Bài viết rất hay, cảm ơn tác giả!',
      'Tôi không đồng ý với quan điểm này',
      'Thông tin rất hữu ích, mong chờ bài viết tiếp theo',
      'Có thể giải thích rõ hơn phần này không?',
      'Tôi đã thử và thấy hiệu quả',
      'Quá tuyệt vời!',
      'Cần thêm dẫn chứng khoa học cho luận điểm này',
      'Ai có thể giúp tôi hiểu rõ hơn về vấn đề này?',
      'Chính xác là như vậy!',
      'Theo tôi nghĩ thì khác một chút...',
    ]

    // Tạo 50 comments ngẫu nhiên
    for (let i = 0; i < 50; i++) {
      // const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)]

      comments.push({
        // authorId: randomUser.id,
        content: randomContent,
        avatar: faker.image.avatar(),
        name: faker.person.fullName(),
        job: faker.person.jobArea(),
        createdAt: faker.date.between({
          from: new Date(2023, 0, 1),
          to: new Date(),
        }),
        updatedAt: faker.date.recent(),
      })
    }

    await queryInterface.bulkInsert('Comments', comments, {})
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Comments', null, {})
  },
}
