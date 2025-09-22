const Joi = require('joi');

// Validation schemas
const userSyncSchema = Joi.object({
  uid: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(1).max(100).optional(),
  photoURL: Joi.string().uri().optional()
});

const productSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  category: Joi.string().min(1).max(50).required(),
  profitabilityScore: Joi.number().min(0).max(100).optional(),
  trendPercentage: Joi.number().optional(),
  description: Joi.string().max(1000).optional(),
  price: Joi.object({
    current: Joi.number().positive().optional(),
    currency: Joi.string().default('USD')
  }).optional(),
  availability: Joi.object({
    inStock: Joi.boolean().optional(),
    stockCount: Joi.number().integer().min(0).optional()
  }).optional()
});

// Validation middleware
const validateUserSync = (req, res, next) => {
  const { error } = userSyncSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateUserSync,
  validateProduct
};
