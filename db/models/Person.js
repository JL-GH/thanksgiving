const Sequelize = require('sequelize');
const { db } = require('../connection');

const Person = db.define('person', {
  name: {
    type: Sequelize.STRING,
    isNotNull: false,
  },
  isAttending: {
    type: Sequelize.BOOLEAN,
  }
});

module.exports = { Person };
