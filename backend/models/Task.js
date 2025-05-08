import mongoose from 'mongoose';

/**
 * @typedef {Object} TaskDTO
 * @property {string}   id
 * @property {string}   title
 * @property {string=}  description
 * @property {'low'|'medium'|'high'} [priority]
 * @property {'simple'|'moderate'|'complex'} [complexity]
 * @property {string=}  dueDate
 * @property {'pending'|'in-progress'|'completed'|'cancelled'|'deferred'} [status]
 * @property {string[]} [tags]
 * @property {string}   createdBy
 * @property {string}   assignedTo
 * @property {string}   project
 * @property {string}   parentTask
 * @property {string[]} [subtasks]
 * @property {string[]} [dependencies]
 * @property {string}   createdAt
 * @property {string}   updatedAt
 */

// Create a custom schema type that accepts both ObjectId and String
const ObjectIdOrString = {
  type: mongoose.Schema.Types.Mixed,
  required: true,
  validate: {
    validator: function(value) {
      // Accept valid ObjectId or String
      return mongoose.Types.ObjectId.isValid(value) || typeof value === 'string';
    },
    message: 'createdBy must be either a valid ObjectId or a string'
  }
};

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Task description cannot exceed 500 characters']
  },
  complexity: {
    type: String,
    enum: ['simple', 'moderate', 'complex'],
    default: 'moderate'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled', 'deferred'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Use our custom type definition that accepts both ObjectId and String
  createdBy: ObjectIdOrString,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true });

export default mongoose.model('Task', taskSchema); 