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
    const { task } = req.body;
    const allTasks = await TodoRecord.getAll();

    for (const item of allTasks) {
      if (item.task.toLowerCase() === task.toLowerCase()) {
        throw new DuplicatedTaskError();
      }
    }

    const newTask = new TodoRecord({ task });
    await newTask.create();
    res
      .redirect('/task');
  })

  .put('/:id', async (req, res) => {
    const { task } = req.body;
    const { id } = req.params;

    const updatedTask = await TodoRecord.getOne(id);
    const allTasks = await TodoRecord.getAll();

    if (!updatedTask) {
      throw new NotFoundError();
    }

    for (const item of allTasks) {
      if (item.task.toLowerCase() === task.toLowerCase()) {
        throw new DuplicatedTaskError();
      }
    }

    updatedTask.task = task;
    await updatedTask.update();
    res.redirect('/task');
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params;

    const task = await TodoRecord.getOne(id);

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

  .get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const task = await TodoRecord.getOne(id);

    if (!task) {
      throw new NotFoundError();
    }

    res.render('tasks/forms/edit', {
      task,
    });
  })

  .get('/search', async (req, res) => {
    const { search } = req.query;

    if (!search || search.trim().length < 1) {
      throw new ValidationError('Search text cannot be empty!');
    }

    const tasks = (await TodoRecord.getAll()).filter((task) => task.task.toLowerCase().includes(search.toLowerCase()));

    if (!tasks[0]) {
      throw new ValidationError('There is no task with given text!');
    }

    res.render('tasks/search', {
      tasks,
    });
  });

module.exports = { taskRouter };
