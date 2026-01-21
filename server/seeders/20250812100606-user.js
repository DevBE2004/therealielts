"use strict";
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const users = [];
    const roles = ["EDITOR", "ADMIN", "USER"];

    // Create admin user
    users.push({
      name: "Admin User",
      email: "leantu2004@gmail.com",
      mobile: faker.phone.number(),
      password: bcrypt.hashSync("leanhtu123", bcrypt.genSaltSync(10)),
      avatar: faker.image.avatar(),
      role: "ADMIN",
      code: faker.string.alphanumeric(6),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    });

    // Create other users
    for (let i = 0; i < 20; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        mobile: faker.phone.number(),
        password: bcrypt.hashSync("password123", bcrypt.genSaltSync(10)),
        avatar: faker.image.avatar(),
        role: roles[Math.floor(Math.random() * roles.length)],
        code: faker.string.alphanumeric(6),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      });
    }

    await queryInterface.bulkInsert("Users", users, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
