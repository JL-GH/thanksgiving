// tests for /api/dishes

// supertest is a module that allows us to test our express server
const request = require('supertest');
const { app } = require('./../server/app.js');
const { db, Dish, Person } = require('./../db/index.js');

beforeEach(async done => {
  // wipe the db before each test block
  await db.sync({ force: true });
  done();
});
afterAll(async done => {
  // close the db connection upon completion of all tests
  await db.close();
  done();
});
describe('/api/dishes routes', () => {
  // its up to you to create the test conditions for /api/dishes
  // add as many tests as you feel necessary to fully cover each routes functionality
  const person1 = { name: 'mark', isAttending: true };
  const person2 = { name: 'russell', isAttending: false };
  const person3 = { name: 'ryan', isAttending: true };
  const person4 = { name: 'johnson', isAttending: true }

  const dish1 = { name: 'turkey', description: 'delicious briney turkey' };
  const dish2 = { name: 'pie', description: 'delicious pumpkiney pie' };
  describe('GET to /api/dishes', () => {
    it('should retrieve all dishes if no params are given', async () => {
      await Promise.all([Dish.create(dish1), Dish.create(dish2)])
      await request(app) // have to return this promise as well
        .get('/api/dishes')
        .expect('Content-Type', /json/) // you can make assertions about the response using supertest's built in methods
        .expect(200) // you should always be sending status codes when sending a response from your server
        .then(response => {
          const dishes = response.body;
          expect(dishes.length).toBe(2);
          expect(dishes).toEqual(
            expect.arrayContaining([
              expect.objectContaining(dish1),
              expect.objectContaining(dish2),
            ])
          );
        })
        .catch(err => {
          fail(err);
        });
    });
  });

  describe('GET to /api/dishes/:id', () => {
    it('should retrieve the dish based on the id', async () => {
      try {
        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);

        await request(app)
          .get(`/api/dishes/${turk.id}`)
          .expect('Content-Type', /json/)
          .expect(200)
      }
      catch (err) {
        fail(err)
      }
    });
  });

  describe('POST to /api/dishes/', () => {
    it('should create a new dish and return that dishs information if all the required information is given', async () => {
      try {
        const [mark, russell, ryan, johnson] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
          Person.create(person4),
        ]);

        const newDish = {
          name: 'mash potatoes',
          description: 'comes with gravy and stuff',
          personId: 4
        }
        await Dish.create(newDish)

        await request(app)
          .post('/api/dishes')
          .send(newDish)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201)
      }
      catch (err) {
        fail(err)
      }
    });
    it('should return status code 400 if missing required information', async () => {
      try {
        await Dish.create({
          name: undefined,
          description: ''
        })

        await request(app)
          .post('/api/dishes')
          .send({
            name: undefined,
            description: ''
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(400)
      }
      catch (err) {
        fail(err)
      }
    });
  });

  describe('PUT to /api/dishes/:id', () => {
    it('should allow you to update the name, description, and person assignment', async () => {
      try {
        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);


        await Dish.update({description: 'half eaten'}, {where: {id: turk.id}})

        await request(app)
          .put(`/api/dishes/${turk.id}`)
          .send({description: 'half eaten' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
      }
      catch (err) {
        fail(err)
      }
    });
    it('should return a 400 if given an invalid id', async () => {
      try {

        await Dish.update({name: '90th Turkey'}, {where: {id: 99}})

        await request(app)
          .put(`/api/dishes/:id`)
          .send({name: '90th Turkey'}, {where: {id: 99}})
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(400)
      }
      catch (err) {
        fail(err)
      }
    });
  });

  describe('DELETE to /api/dishes/:id', () => {
    it('should remove a person from the database', async () => {
      try {
        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);

        await Dish.destroy({where: {id: turk.id}})

        await request(app)
          .delete(`/api/dishes/${turk.id}`)
        }
        catch (err) {
          fail(err)
        }
      });
      it('should return a 400 if given an invalid id', async () => {
        try {
          await Dish.destroy({where: {id: 99}})

          await request(app)
            .del(`/api/dishes/${99}`)
            .expect(400);
        }
        catch (err) {
          fail(err)
        }
    });
  });
});
