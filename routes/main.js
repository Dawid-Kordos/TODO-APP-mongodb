const { Router } = require('express');

const mainRouter = Router();

mainRouter.get('/', (req, res) => {
  res.redirect('/task');
});

module.exports = { mainRouter };
