const fk = require('@faker-js/faker');

const user = require('../models').User;



function createRandomUser(id) {
    return {
        id: id,
        username: fk.faker.internet.userName() + id,
        email: id + fk.faker.internet.email(),
        password: fk.faker.internet.password(),
        email_verified_at: fk.faker.date.past(),
    };
}


async function massInsertUsers(numberOfUsers) {
    const massUsers = [];
    for (let i = 0; i < numberOfUsers; i++) {
        massUsers.push(createRandomUser(i + 6));
    }
    await user.bulkCreate(massUsers);
}

massInsertUsers(1000000);