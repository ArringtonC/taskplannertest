import { body, param, validationResult } from 'express-validator';

/**
 * Middleware to validate request data
 * @param {Array} validations - Array of validation chains
 * @returns {Array} - Array of middleware functions
 */
export const validate = (validations) => {
  return [
    // Run all validations
    ...validations,
    // Check for validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        const mappedErrors = errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }));
        console.log('Mapped errors:', mappedErrors);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: mappedErrors
        });
      }
      next();
    }
  ];
};

/**
 * Validation rules for creating a task
 */
export const validateCreateTask = validate([
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'deferred'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isString().withMessage('Priority must be a string')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date')
    .custom(value => {
      const date = new Date(value);
      return date > new Date();
    }).withMessage('Due date must be in the future'),
  
  body('project')
    .optional()
    .isMongoId().withMessage('Project must be a valid MongoDB ID'),
  
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Assigned user must be a valid MongoDB ID'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('Each tag must be a string'),
  
  body('complexity')
    .optional()
    .isString().withMessage('Complexity must be a string')
    .isIn(['simple', 'moderate', 'complex'])
    .withMessage('Complexity must be simple, moderate, or complex'),
]);

/**
 * Validation rules for updating a task
 */
export const validateUpdateTask = validate([
  param('id')
    .isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
  
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'deferred'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isString().withMessage('Priority must be a string')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
  
  body('project')
    .optional()
    .isMongoId().withMessage('Project must be a valid MongoDB ID'),
  
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Assigned user must be a valid MongoDB ID'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('Each tag must be a string'),
  
  body('complexity')
    .optional()
    .isString().withMessage('Complexity must be a string')
    .isIn(['simple', 'moderate', 'complex'])
    .withMessage('Complexity must be simple, moderate, or complex'),
]);

/**
 * Validation for updating a task status
 */
export const validateUpdateStatus = validate([
  param('id')
    .isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'deferred'])
    .withMessage('Invalid status value'),
]);

/**
 * Validation for adding a subtask
 */
export const validateAddSubtask = validate([
  param('id')
    .isMongoId().withMessage('Parent task ID must be a valid MongoDB ID'),
  
  // Same validations as create task, but subtask-specific
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'deferred'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isString().withMessage('Priority must be a string')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
]);

/**
 * Validation for adding a dependency
 */
export const validateAddDependency = validate([
  param('id')
    .isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
  
  body('dependencyId')
    .notEmpty().withMessage('Dependency ID is required')
    .isMongoId().withMessage('Dependency ID must be a valid MongoDB ID'),
]); 