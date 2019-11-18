const router = require("express").Router();
const { Person, Dish } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#routers

router.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length === 0) {
     res.status(200).send(await Person.findAll({
        include: [{model: Dish}]
      }))
    }
    else if (req.query.is_attending){
     res.status(200).send(await Person.findAll({
        include: [{model: Dish}],
        where: {
          isAttending: req.query.is_attending
        }
      }))
    }
    else if (req.query.include_dishes) {
      res.status(200).send(await Dish.findAll())
     }
  }
  catch (err) {
    next(err)
  }
});

// .get() done w/o async await
// router.get("/", (req, res, next) => {
//   if (Object.keys(req.query).length === 0) {
//     Person.findAll({
//       include: [{model: Dish}]
//     })
//       .then(person => {
//         res.status(200).send(person)
//       })
//       .catch(next)
//   }
//   else {
//     Person.findAll({
//       include: [{model: Dish}],
//       where: {
//         isAttending: req.query.is_attending
//       }
//     })
//       .then(person => {
//         res.status(200).send(person)
//       })
//       .catch(next)
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    if (req.body.name === undefined || req.body.isAttending === undefined) {
      res.status(400).send('Bad request. Insert all necessary params.')
    }
    else {
      res.status(201)
      .send(await Person.create(req.body))
    }
  }
  catch (err) {
    next(err)
  }
});

// .post() done without async await
// router.post("/", (req, res, next) => {
//   if (req.body.name === undefined || req.body.isAttending === undefined) {
//     res.status(400).send('Bad request. Insert all necessary params.')
//   }
//   else {
//     Person.create(req.body)
//     .then(newPerson => res.send(newPerson))
//   }
// });

router.put("/:id", async (req, res, next) => {
  const attendance = req.body.isAttending
  const modifyId = req.params.id

  try {
    const getIds = await Person.findAll({attributes: ['id']})
    const arrIds = getIds.map(obj => obj.id.toString())

    // console.log(arrIds.includes(modifyId))
    // console.log('param',modifyId)
    // console.log('ids',arrIds.includes(modifyId))

    if (!arrIds.includes(modifyId)) {
      res.status(400).send('Bad request. Please provide a valid id.')
    }
    else {
      res.status(200)
      .send(await Person.update(
        {isAttending: attendance},
        {
          where: {id: modifyId},
          returning: true
        }
      ))
    }
  }
  catch (err) {
    next(err)
  }
});

router.delete("/:id", async (req, res, next) => {
  const modifyId = req.params.id
  const name = req.body.name

  try {
    const getPeople = await Person.findAll({attributes: ['id']})
    const arrIds = getPeople.map(obj => obj.id.toString())
    // const arrNames = getPeople.map(obj => obj.name.toString())

    if (!arrIds.includes(modifyId)) {
      res.status(400).send('Bad request. Please provide a valid param.')
    }
    else if (arrIds.includes(modifyId)) {
      await Person.destroy({
        where: {id: modifyId}
      })
    }
  }
  catch (err) {
    next(err)
  }
})

module.exports = router;
