const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/model/task');
const { userOne, 
    userOneId, 
    setUpDatabase,
    taskOne,
    taskTwo,
    taskThree,
    userTwo,
    userTwoId } = require('./fixtures/db')

beforeEach(setUpDatabase);

test('should create task', async () => {
    const response = await request(app).post('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ description: 'My test task' })
        .expect(200)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    expect(task.completed).toEqual(false)
})


test('should get user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        
    expect(response.body.length).toEqual(2)
})


test('should not delete other user tasks', async()=>{
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
