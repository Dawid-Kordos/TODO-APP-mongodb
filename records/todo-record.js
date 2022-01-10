const { ObjectId } = require('mongodb');
const { todos } = require('../utils/db');
const { ValidationError } = require('../utils/errors');

class TodoRecord {
  constructor(obj) {
    const {
      _id, task, status, dueDate,
    } = obj;

    this._id = _id;
    this.task = task;
    this.status = status;
    this.dueDate = dueDate;

    this._validate();
  }

  _validate() {
    if (!this.task || typeof this.task !== 'string' || this.task.trim().length < 3 || this.task.length > 40) {
      throw new ValidationError('Task must have at least 3 and at most 40 characters!');
    }
  }

  async create() {
    const { insertedId } = await todos.insertOne({
      _id: this._id,
      task: String(this.task),
      status: '',
      dueDate: 'yyyy-mm-dd',
    });

    this._id = insertedId;
    return insertedId;
  }

  static async getAll() {
    return (await todos.find().toArray()).map((obj) => new TodoRecord(obj));
  }

  static async getOne(id) {
    const item = await todos.findOne({ _id: ObjectId(String(id)) });
    return item === null ? null : new TodoRecord(item);
  }

  async update() {
    this._validate();

    await todos.replaceOne(
      { _id: this._id },
      { task: String(this.task), status: this.status, dueDate: this.dueDate },
    );
  }

  async delete() {
    await todos.deleteOne(
      { _id: this._id },
    );
  }
}

module.exports = {
  TodoRecord,
};
