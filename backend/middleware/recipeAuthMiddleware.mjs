import { getRecipeByIdService } from '../services/recipes/recipeService.mjs';
import { CustomError } from '../utils/errors/CustomError.mjs';


const recipeAuthMiddleware = async (req, res, next) => {
    try {
        const recipeId = req.params.recipeId;
        const userId = req.user.id; // Ensure req.user is securely set by prior authentication middleware
        console.log(`[recipeAuthMiddleware] Attempting to authorize user ${userId} for recipe ${recipeId}`);

        const recipe = await getRecipeByIdService(recipeId);
        if (!recipe) {
            console.log(`[recipeAuthMiddleware] Recipe ${recipeId} not found.`);
            return res.status(404).json({ message: "Recipe not found." });
        }

        console.log(`[recipeAuthMiddleware] Recipe ${recipeId} found. Checking authorization...`);
        if (recipe.userId !== userId) {
            console.log(`[recipeAuthMiddleware] Authorization failed for user ${userId} on recipe ${recipeId}.`);
            throw new CustomError(403, "You do not have permission to edit this recipe.");
        }

        console.log(`[recipeAuthMiddleware] User ${userId} authorized to edit recipe ${recipeId}.`);
        next();
    } catch (error) {
        console.error("[recipeAuthMiddleware] Error:", error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error." });
    }
};

export { recipeAuthMiddleware };

