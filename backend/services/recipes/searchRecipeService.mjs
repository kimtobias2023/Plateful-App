import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeLabel } from '../../models/recipes/index.mjs';


async function searchRecipeService(query, filters, transaction = null) {
    try {
        let whereClause = {};
        let include = [];
        let searchConditions = [];

        // Apply search query
        if (query) {
            searchConditions = [
                { recipeName: { [Op.iLike]: `%${query}%` } },
                { recipeDescription: { [Op.iLike]: `%${query}%` } },
                { author: { [Op.iLike]: `%${query}%` } }
            ];
        }

        // Handle label filters
        if (filters.labels && filters.labels.length) {
            const labelConditions = filters.labels.map(labelStr => {
                const [type, name] = labelStr.split(':').map(str => str.trim());
                return {
                    [Op.and]: [
                        { labelType: type },
                        { labelName: name }
                    ]
                };
            });

            include.push({
                model: Label,
                as: 'Labels', // Ensure this alias matches the one used in associations
                through: {
                    model: RecipeLabel, // Specify the join table
                    as: 'RecipeLabel' // Alias for the join table (if used in associations)
                },
                where: { [Op.or]: labelConditions },
                required: true
            });

        }

        // Combine searchConditions into whereClause
        if (searchConditions.length) {
            whereClause = { [Op.or]: searchConditions };
        }

        // Fetch recipes with filters and include JOINs
        const recipes = await Recipe.findAll({
            where: whereClause,
            include: include,
            transaction
        });

        return recipes;
    } catch (error) {
        console.error("Error in searchRecipeService:", error);
        throw error;
    }
}


export { searchRecipeService };


