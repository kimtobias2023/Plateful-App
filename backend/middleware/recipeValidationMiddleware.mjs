import RecipeValidationSchema from '../models/recipes/RecipeValidation.mjs';


const recipeValidationMiddleware = (req, res, next) => {
    const { error } = RecipeValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next(); // move to the next middleware or route handler if validation passed
}

export { recipeValidationMiddleware };
