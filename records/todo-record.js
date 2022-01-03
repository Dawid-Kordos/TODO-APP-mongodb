const { ObjectId } = require('mongodb');
const { todos } = require('../utils/db');
const { ValidationError } = require('../utils/errors');

class TodoRecord {
  constructor(obj) {
    const { _id, task, done } = obj;

    this._id = _id;
    this.task = task;
    this.done = done;

    this._validate();
  }

  _validate() {
    if (!this.task || typeof this.task !== 'string' || this.task.length < 3) {
      throw new ValidationError('Task must have at least 3 characters and be a text!');
    }
  }

  async create() {
    const { insertedId } = await todos.insertOne({
      _id: this._id,
      task: String(this.task),
      done: false,
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
      { task: String(this.task), done: this.done },
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
