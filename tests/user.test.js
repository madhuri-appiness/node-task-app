const request = require('supertest');
const app = require('../src/app');
const User = require('../src/model/user');
const { userOne,userOneId, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase);


test('sign up new user', async () => {
    const response = await request(app).post('/users').send({
        name: "madhuri",
        email: "maddy@gmail.com",
        password: "maddy@29"
    }).expect(201)

    // assert that db was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // assertion about response
    expect(response.body).toMatchObject({
        user: {
            name: "madhuri",
            email: "maddy@gmail.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('maddy@29');
})


test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    //assert token
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login unknow user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'djixk'
    }).expect(400)
})


test('should get login user profile', async () => {
    await request(app).get('/users/me')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})


test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('should delete authenticated user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete Unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
})


test('should upload avatar image', async () => {
   const response= await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})



test('Should update valid user', async ()=>{
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'basanni'
    })
    .expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('basanni')
})

test('Should not update invalid user', async ()=>{
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'jcndj'
    })
    .expect(400)

})