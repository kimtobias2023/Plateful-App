import * as Auth from './users/auth/index.mjs';
import * as BasicProfile from './users/basic-profile/index.mjs';
import * as Community from './community/index.mjs';
import * as ExtendedProfile from './users/extended-profile/index.mjs';
import * as Labels from './labels/index.mjs';
import * as Groceries from './groceries/index.mjs';
import * as Mealplanning from './mealplanning/index.mjs';
import * as Notifications from './notifications/index.mjs';
import * as Recipes from './recipes/index.mjs';
import * as Units from './units/index.mjs';


export const setupAssociations = () => {
    BasicProfile.User.hasMany(Auth.RefreshToken, { foreignKey: 'userId' });
    Auth.RefreshToken.belongsTo(BasicProfile.User, { foreignKey: 'userId' });

    BasicProfile.User.hasOne(Auth.ResetToken, { foreignKey: 'userId' }); 
    Auth.ResetToken.belongsTo(BasicProfile.User, { foreignKey: 'userId' }); 

    // Auth: Role, Permission, and User
    Auth.Role.belongsToMany(Auth.Permission, { through: 'rolePermissions', foreignKey: 'roleId' });
    Auth.Permission.belongsToMany(Auth.Role, { through: 'rolePermissions', foreignKey: 'permissionId' });

    Auth.Role.belongsToMany(BasicProfile.User, { through: 'userRoles', foreignKey: 'roleId' });
    BasicProfile.User.belongsToMany(Auth.Role, { through: 'userRoles', foreignKey: 'userId' });

    // Community: CommunityPost, CommunityComment, and User
    Community.CommunityPost.hasMany(Community.CommunityComment, { foreignKey: 'post_id' });
    Community.CommunityComment.belongsTo(Community.CommunityPost, { foreignKey: 'post_id' });

    BasicProfile.User.hasMany(Community.CommunityComment, { foreignKey: 'userId' });
    Community.CommunityComment.belongsTo(BasicProfile.User, { foreignKey: 'userId' });

    // User and GroceryList
    BasicProfile.User.hasMany(Groceries.GroceryList, { foreignKey: 'userId' });
    Groceries.GroceryList.belongsTo(BasicProfile.User, { foreignKey: 'userId' });

    // GroceryList and GroceryItem
    Groceries.GroceryList.belongsToMany(Groceries.GroceryItem, { through: 'GroceryListItems' });
    Groceries.GroceryItem.belongsToMany(Groceries.GroceryList, { through: 'GroceryListItems' });

    // Assuming Recipe is your model defined for the "Recipes" table
    Recipes.Recipe.hasMany(Recipes.RecipeNote, { foreignKey: 'recipeId', as: 'RecipeNotes' });
    Recipes.RecipeNote.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });


    // Recipes: Recipe, RecipeIngredientSections, RecipeInstructionSections, RecipeIngredients, and RecipeInstructions
    Recipes.Recipe.hasMany(Recipes.RecipeIngredientSection, { foreignKey: 'recipeId', as: 'RecipeIngredientSections' });
    Recipes.RecipeIngredientSection.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });

    Recipes.Recipe.hasMany(Recipes.RecipeInstructionSection, { foreignKey: 'recipeId', as: 'RecipeInstructionSections' });
    Recipes.RecipeInstructionSection.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });

    // Associate RecipeIngredientSections with RecipeIngredients
    Recipes.RecipeIngredientSection.hasMany(Recipes.RecipeIngredient, { foreignKey: 'sectionId', as: 'RecipeIngredients' });
    Recipes.RecipeIngredient.belongsTo(Recipes.RecipeIngredientSection, { foreignKey: 'sectionId', as: 'RecipeIngredientSections' });

    // Associate RecipeInstructionSections with RecipeInstructions
    Recipes.RecipeInstructionSection.hasMany(Recipes.RecipeInstruction, { foreignKey: 'sectionId', as: 'RecipeInstructions' });
    Recipes.RecipeInstruction.belongsTo(Recipes.RecipeInstructionSection, { foreignKey: 'sectionId', as: 'RecipeInstructionSections' });



    // Recipe and RecipeRatingsReview
    Recipes.Recipe.hasMany(Recipes.RecipeRatingsReview, { foreignKey: 'recipeId' });
    Recipes.RecipeRatingsReview.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId' });


    Recipes.RecipeIngredient.belongsToMany(Groceries.LongShelfLifeItem, {
        through: Groceries.IngredientShelfLife,
        foreignKey: 'ingredientId',
        otherKey: 'shelfLifeItemId',
        as: 'ShelfLives'
    });

    Groceries.LongShelfLifeItem.belongsToMany(Recipes.RecipeIngredient, {
        through: Groceries.IngredientShelfLife,
        foreignKey: 'shelfLifeItemId',
        otherKey: 'ingredientId',
        as: 'Ingredients'
    });

    // GroceryList and GroceryListItem association
    Groceries.GroceryItem.hasMany(Groceries.GroceryListItem, { foreignKey: 'groceryItemId' });
    Groceries.GroceryListItem.belongsTo(Groceries.GroceryItem, { foreignKey: 'groceryItemId' });

    Groceries.GroceryList.hasMany(Groceries.GroceryListItem, { foreignKey: 'groceryListId' });
    Groceries.GroceryListItem.belongsTo(Groceries.GroceryList, { foreignKey: 'groceryListId' });

    // Units and UnitConversion
    Units.Unit.hasMany(Units.UnitConversion, { foreignKey: 'fromUnit', sourceKey: 'unitName', as: 'FromUnitConversions' });
    Units.UnitConversion.belongsTo(Units.Unit, { foreignKey: 'fromUnit', targetKey: 'unitName', as: 'FromUnit' });

    Units.Unit.hasMany(Units.UnitConversion, { foreignKey: 'toUnit', sourceKey: 'unitName', as: 'ToUnitConversions' });
    Units.UnitConversion.belongsTo(Units.Unit, { foreignKey: 'toUnit', targetKey: 'unitName', as: 'ToUnit' });

    // Associate Recipe with RecipeNutrition
    Recipes.Recipe.hasOne(Recipes.RecipeNutrition, { foreignKey: 'recipeId', as: 'Nutrition' });
    Recipes.RecipeNutrition.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
    // RecipeLabel with Label and Recipe
    Recipes.RecipeLabel.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId' });
    Recipes.RecipeLabel.belongsTo(Labels.Label, { foreignKey: 'labelId' });

    // Labels and Recipe
    Labels.Label.belongsToMany(Recipes.Recipe, { through: Recipes.RecipeLabel, foreignKey: 'labelId', otherKey: 'recipeId' });
    Recipes.Recipe.belongsToMany(Labels.Label, {
        through: Recipes.RecipeLabel,
        foreignKey: 'recipeId',
        otherKey: 'labelId',
        as: 'Labels' // Alias used in include
    });

    // User and Recipe
    BasicProfile.User.hasMany(Recipes.Recipe, { foreignKey: 'userId' });
    Recipes.Recipe.belongsTo(BasicProfile.User, { foreignKey: 'userId', as: 'user' }); // 'as' is an alias for the association

    // User and UserMedia
    BasicProfile.User.hasMany(ExtendedProfile.UserMedia, { foreignKey: 'userId', as: 'UserMedias' });
    ExtendedProfile.UserMedia.belongsTo(BasicProfile.User, { foreignKey: 'userId', as: 'User' });

    // Menu Associations
    BasicProfile.User.hasMany(Mealplanning.Menu, { foreignKey: 'userId' });
    Mealplanning.Menu.belongsTo(BasicProfile.User, { foreignKey: 'userId' });

    // Menu and Recipe association through MenuRecipe
    Mealplanning.Menu.belongsToMany(Recipes.Recipe, {
        through: Mealplanning.MenuRecipe,
        foreignKey: 'menuId',
        otherKey: 'recipeId',
        as: 'Recipes' // Alias used in include
    });

    Recipes.Recipe.belongsToMany(Mealplanning.Menu, {
        through: Mealplanning.MenuRecipe,
        foreignKey: 'recipeId',
        otherKey: 'menuId'
    });

    Mealplanning.MenuRecipe.belongsTo(Mealplanning.Menu, { foreignKey: 'menuId' });
    Mealplanning.MenuRecipe.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId' });

    // Define the inverse relation on the join table
    Mealplanning.MenuRecipe.belongsTo(Mealplanning.Menu, { foreignKey: 'menuId' });
    Mealplanning.MenuRecipe.belongsTo(Recipes.Recipe, { foreignKey: 'recipeId' });

    BasicProfile.User.hasMany(Mealplanning.MealRating, { foreignKey: 'userId' });
    Mealplanning.MealRating.belongsTo(BasicProfile.User, { foreignKey: 'userId' });

    Recipes.Recipe.hasMany(Mealplanning.MealRating, { foreignKey: 'meal_id', constraints: false });
    Mealplanning.MealRating.belongsTo(Recipes.Recipe, { foreignKey: 'meal_id', constraints: false });

    // Notifications: User and Notification
    BasicProfile.User.hasMany(Notifications.Notification, { foreignKey: 'userId' });
    Notifications.Notification.belongsTo(BasicProfile.User, { foreignKey: 'userId' });

};




