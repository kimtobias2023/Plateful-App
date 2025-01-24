import Joi from 'joi';

const recipeValidationSchema = Joi.object({
    recipe_name: Joi.string().required().max(255),
    recipe_link: Joi.string().allow(null, '').max(255),
    recipe_notes: Joi.string().allow(null, ''),
    recipe_description: Joi.string().allow(null, ''),
    preparation_time: Joi.string().allow(null, '').max(255),
    cooking_time: Joi.string().allow(null, '').max(255),
    total_time: Joi.string().allow(null, '').max(255),
    course: Joi.string().allow(null, '').max(255),
    cuisine: Joi.string().allow(null, '').max(255),
    servings: Joi.number().integer().allow(null),
    website_url: Joi.string().allow(null, '').max(255),
    author: Joi.string().allow(null, '').max(255),
});

export default recipeValidationSchema;







