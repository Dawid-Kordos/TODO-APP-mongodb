const { Router } = require('express');
const { TodoRecord } = require('../records/todo-record');
const { DuplicatedTaskError, NotFoundError, ValidationError } = require('../utils/errors');

const taskRouter = Router();

taskRouter
  .get('/', async (req, res) => {
    res.render('tasks/show-all', {
      tasks: await TodoRecord.getAll(),
    });
  })

  .post('/', async (req, res) => {
    const task = new TodoRecord(req.body);
    const allTasks = await TodoRecord.getAll();

    for (const item of allTasks) {
      if (item.task.toLowerCase() === req.body.task.toLowerCase()) {
        throw new DuplicatedTaskError();
      }
    }

    await task.create();

    res.redirect('/task');
  })

  .put('/:id', async (req, res) => {
    const task = await TodoRecord.getOne(req.params.id);
    const allTasks = await TodoRecord.getAll();
    const { status, dueDate } = req.body;

    if (!task) {
      throw new NotFoundError();
    }

    for (const item of allTasks.filter((obj) => obj.id !== task.id)) {
      if (item.task.toLowerCase() === req.body.task.toLowerCase()) {
        throw new DuplicatedTaskError();
      }
    }

    task.task = req.body.task;
    task.status = status === 'done' ? 'done' : '';
    task.dueDate = dueDate;
    await task.update();

    res.redirect('/task');
  })

  .delete('/:id', async (req, res) => {
    const task = await TodoRecord.getOne(req.params.id);

    if (!task) {
      throw new NotFoundError();
    }

    await task.delete();

    res.redirect('/task');
  })

  .get('/add', async (req, res) => {
    res.render('tasks/forms/add', {
      tasks: await TodoRecord.getAll(),
    });
  })

  .get('/search', async (req, res) => {
    const { search } = req.query;

    if (!search || search.trim().length < 1) {
      throw new ValidationError('Search text cannot be empty!');
    }

    const tasks = (await TodoRecord.getAll()).filter((task) => task.task.toLowerCase().includes(search.toLowerCase().trim()));

    if (!tasks[0]) {
      throw new ValidationError('There is no task with given text!');
    }

    res.render('tasks/forms/search', {
      tasks,
    });
  })

  .get('/edit/:id', async (req, res) => {
    const task = await TodoRecord.getOne(req.params.id);

    if (!task) {
      throw new NotFoundError();
    }

    res.render('tasks/forms/edit', {
      task,
    });
  });

module.exports = { taskRouter };
