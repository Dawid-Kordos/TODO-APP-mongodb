const express = require('express');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
require('express-async-errors');
const { handleError } = require('./utils/errors');

const { taskRouter } = require('./routes/task');
const { mainRouter } = require('./routes/main');

const app = express();

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.static('public'));
app.use(express.json());
app.use(methodOverride('_method'));

app.use('/', mainRouter);
app.use('/task', taskRouter);

app.engine('.hbs', hbs({
  extname: '.hbs',
}));
app.set('view engine', '.hbs');

app.use(handleError);

app.listen(3000, () => console.log('Server is listenning on port 3000...'));
