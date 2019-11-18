const router = require("express").Router();
const { Dish, Person } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#router


router.get("/", async (req, res, next) => {
  try {
    res.status(200).send(await Dish.findAll({
      include: {model: Person}
    }))
  }
  catch (err) {
    next(err)
  }
});

router.get("/:id", async (req, res, next) => {
  const dishId = req.params.id
  try {
    res.status(200).send(await Dish.findAll({
      include: {model: Person},
      where: {id: dishId}
    }))
  }
  catch (err) {
    next(err)
  }
});


router.post("/", async (req, res, next) => {
  try {
    if (req.body.name === undefined || req.body.description === undefined) {
      res.status(400).send('Bad request. Insert all necessary params.')
    }
    else {
      res.status(201)
      .send(await Dish.create(req.body))
    }
  }
  catch (err) {
    next(err)
  }
});

router.put("/:id", async (req, res, next) => {
  const personId = req.body.personId
  const dishName = req.body.name
  const dishDesc = req.body.description
  const modifyId = req.params.id

  try {
    const getIds = await Dish.findAll({attributes: ['id']})
    const arrIds = getIds.map(obj => obj.id.toString())

    if (!arrIds.includes(modifyId)) {
      res.status(400).send('Bad request. Please provide a valid id.')
    }
    else {
      res.status(200)
      .send(await Dish.update(
        {
          personId: personId,
          name: dishName,
          description: dishDesc
        },
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

  try {
    const getDishes = await Dish.findAll({attributes: ['id']})
    const arrIds = getDishes.map(obj => obj.id.toString())

    if (!arrIds.includes(modifyId)) {
      res.status(400).send('Bad request. Please provide a valid param.')
    }
    else if (arrIds.includes(modifyId)) {
      await Dish.destroy({
        where: {id: modifyId}
      })
    }
  }
  catch (err) {
    next(err)
  }
})

module.exports = router;
