const { Router } = require('express');
const { TodoRecord } = require('../records/todo-record');
const { DuplicatedTaskError, NotFoundError } = require('../utils/errors');

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

    const newTask = new TodoRecord({ task /* done: 'false' */ });
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
  });

module.exports = { taskRouter };
