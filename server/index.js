const { app } = require('./app');
const PORT = 3000;
const { db, Person, Dish } = require('../db');

async function syncAndSeedDatabase() {
  try {
    await db.sync({ force: true });
    //  Create some rows in your Person and Dish tables here
    //  to interact with your API using the `npm run start:watch`
    //  or `npm run start` commands.

      const russel = await Person.create({
        name: 'russel',
        isAttending: false
      })

      const ryan = await Person.create({
        name: 'ryan',
        isAttending: true
      })

      const mark = await Person.create({
        name: 'mark',
        isAttending: true
      })

      const turkey = await Dish.create({
        name: 'turkey',
        description: 'delicious briney turkey',
        personId: mark.id
      })

      const pie = await Dish.create({
        name: 'pie',
        description: 'delicious pumpkiney pie',
        personId: ryan.id
      })

  } catch (e) {
    console.log(e);
  }

  console.log('done seeding and associating!');
}

syncAndSeedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
