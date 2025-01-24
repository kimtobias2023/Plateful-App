export * as Audio from './audio/index.mjs';
export * as Auth from './auth/index.mjs';
export * as Grocery from './grocery/index.mjs';
export * as Label from './label/index.mjs';
export * as Media from './menu/index.mjs';
export * as Menu from './menu/index.mjs';
export * as Notification from './notification/index.mjs';
export * as Profile from './profile/index.mjs';
export * as Social from './social/index.mjs';
export * as Recipe from './recipe/index.mjs';
export * as Unit from './unit/index.mjs';


export const setupAssociations = () => {
    Profile.User.hasMany(Auth.RefreshToken, { foreignKey: 'userId' });
    Auth.RefreshToken.belongsTo(Profile.User, { foreignKey: 'userId' });

    Profile.User.hasOne(Auth.ResetToken, { foreignKey: 'userId' }); 
    Auth.ResetToken.belongsTo(Profile.User, { foreignKey: 'userId' }); 

    // Auth: Role, Permission, and User
    Auth.Role.belongsToMany(Auth.Permission, { through: 'rolePermissions', foreignKey: 'roleId' });
    Auth.Permission.belongsToMany(Auth.Role, { through: 'rolePermissions', foreignKey: 'permissionId' });

    Auth.Role.belongsToMany(Profile.User, { through: 'userRoles', foreignKey: 'roleId' });
    Profile.User.belongsToMany(Auth.Role, { through: 'userRoles', foreignKey: 'userId' });

    // Social: SocialPost, SocialComment, and User
    Social.SocialPost.hasMany(Social.SocialComment, { foreignKey: 'post_id' });
    Social.SocialComment.belongsTo(Social.SocialPost, { foreignKey: 'post_id' });

    Profile.User.hasMany(Social.SocialComment, { foreignKey: 'userId' });
    Social.SocialComment.belongsTo(Profile.User, { foreignKey: 'userId' });

    // User and GroceryList
    Profile.User.hasMany(Grocery.GroceryList, { foreignKey: 'userId' });
    Grocery.GroceryList.belongsTo(Profile.User, { foreignKey: 'userId' });

    // GroceryList and GroceryItem
    Grocery.GroceryList.belongsToMany(Grocery.GroceryItem, { through: 'GroceryListItems' });
    Grocery.GroceryItem.belongsToMany(Grocery.GroceryList, { through: 'GroceryListItems' });

    // Assuming Recipe is your model defined for the "Recipe" table
    Recipe.Recipe.hasMany(Recipe.RecipeNote, { foreignKey: 'recipeId', as: 'RecipeNotes' });
    Recipe.RecipeNote.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });


    // Recipe: Recipe, RecipeIngredientSections, RecipeInstructionSections, RecipeIngredients, and RecipeInstructions
    Recipe.Recipe.hasMany(Recipe.RecipeIngredientSection, { foreignKey: 'recipeId', as: 'RecipeIngredientSections' });
    Recipe.RecipeIngredientSection.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });

    Recipe.Recipe.hasMany(Recipe.RecipeInstructionSection, { foreignKey: 'recipeId', as: 'RecipeInstructionSections' });
    Recipe.RecipeInstructionSection.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });

    // Associate RecipeIngredientSections with RecipeIngredients
    Recipe.RecipeIngredientSection.hasMany(Recipe.RecipeIngredient, { foreignKey: 'sectionId', as: 'RecipeIngredients' });
    Recipe.RecipeIngredient.belongsTo(Recipe.RecipeIngredientSection, { foreignKey: 'sectionId', as: 'RecipeIngredientSections' });

    // Associate RecipeInstructionSections with RecipeInstructions
    Recipe.RecipeInstructionSection.hasMany(Recipe.RecipeInstruction, { foreignKey: 'sectionId', as: 'RecipeInstructions' });
    Recipe.RecipeInstruction.belongsTo(Recipe.RecipeInstructionSection, { foreignKey: 'sectionId', as: 'RecipeInstructionSections' });



    // Recipe and RecipeRatingsReview
    Recipe.Recipe.hasMany(Recipe.RecipeRatingsReview, { foreignKey: 'recipeId' });
    Recipe.RecipeRatingsReview.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId' });


    Recipe.RecipeIngredient.belongsToMany(Grocery.LongShelfLifeItem, {
        through: Grocery.IngredientShelfLife,
        foreignKey: 'ingredientId',
        otherKey: 'shelfLifeItemId',
        as: 'ShelfLives'
    });

    Grocery.LongShelfLifeItem.belongsToMany(Recipe.RecipeIngredient, {
        through: Grocery.IngredientShelfLife,
        foreignKey: 'shelfLifeItemId',
        otherKey: 'ingredientId',
        as: 'Ingredients'
    });

    // GroceryList and GroceryListItem association
    Grocery.GroceryItem.hasMany(Grocery.GroceryListItem, { foreignKey: 'groceryItemId' });
    Grocery.GroceryListItem.belongsTo(Grocery.GroceryItem, { foreignKey: 'groceryItemId' });

    Grocery.GroceryList.hasMany(Grocery.GroceryListItem, { foreignKey: 'groceryListId' });
    Grocery.GroceryListItem.belongsTo(Grocery.GroceryList, { foreignKey: 'groceryListId' });

    // Unit and UnitConversion
    Unit.Unit.hasMany(Unit.UnitConversion, { foreignKey: 'fromUnit', sourceKey: 'unitName', as: 'FromUnitConversions' });
    Unit.UnitConversion.belongsTo(Unit.Unit, { foreignKey: 'fromUnit', targetKey: 'unitName', as: 'FromUnit' });

    Unit.Unit.hasMany(Unit.UnitConversion, { foreignKey: 'toUnit', sourceKey: 'unitName', as: 'ToUnitConversions' });
    Unit.UnitConversion.belongsTo(Unit.Unit, { foreignKey: 'toUnit', targetKey: 'unitName', as: 'ToUnit' });

    // Associate Recipe with RecipeNutrition
    Recipe.Recipe.hasOne(Recipe.RecipeNutrition, { foreignKey: 'recipeId', as: 'Nutrition' });
    Recipe.RecipeNutrition.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
    // RecipeLabel with Label and Recipe
    Recipe.RecipeLabel.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId' });
    Recipe.RecipeLabel.belongsTo(Label.Label, { foreignKey: 'labelId' });

    // Label and Recipe
    Label.Label.belongsToMany(Recipe.Recipe, { through: Recipe.RecipeLabel, foreignKey: 'labelId', otherKey: 'recipeId' });
    Recipe.Recipe.belongsToMany(Label.Label, {
        through: Recipe.RecipeLabel,
        foreignKey: 'recipeId',
        otherKey: 'labelId',
        as: 'Label' // Alias used in include
    });

    // User and Recipe
    Profile.User.hasMany(Recipe.Recipe, { foreignKey: 'userId' });
    Recipe.Recipe.belongsTo(Profile.User, { foreignKey: 'userId', as: 'user' }); // 'as' is an alias for the association

    // User and UserMedia
    Profile.User.hasMany(Media.UserMedia, { foreignKey: 'userId', as: 'UserMedias' });
    Media.UserMedia.belongsTo(Profile.User, { foreignKey: 'userId', as: 'User' });

    // Menu Associations
    Profile.User.hasMany(Menu.Menu, { foreignKey: 'userId' });
    Menu.Menu.belongsTo(Profile.User, { foreignKey: 'userId' });

    // Menu and Recipe association through MenuRecipe
    Menu.Menu.belongsToMany(Recipe.Recipe, {
        through: Menu.MenuRecipe,
        foreignKey: 'menuId',
        otherKey: 'recipeId',
        as: 'Recipe' // Alias used in include
    });

    Recipe.Recipe.belongsToMany(Menu.Menu, {
        through: Menu.MenuRecipe,
        foreignKey: 'recipeId',
        otherKey: 'menuId'
    });

    Menu.MenuRecipe.belongsTo(Menu.Menu, { foreignKey: 'menuId' });
    Menu.MenuRecipe.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId' });

    // Define the inverse relation on the join table
    Menu.MenuRecipe.belongsTo(Menu.Menu, { foreignKey: 'menuId' });
    Menu.MenuRecipe.belongsTo(Recipe.Recipe, { foreignKey: 'recipeId' });

    Profile.User.hasMany(Menu.MealRating, { foreignKey: 'userId' });
    Menu.MealRating.belongsTo(Profile.User, { foreignKey: 'userId' });

    Recipe.Recipe.hasMany(Menu.MealRating, { foreignKey: 'meal_id', constraints: false });
    Menu.MealRating.belongsTo(Recipe.Recipe, { foreignKey: 'meal_id', constraints: false });

    // Notification: User and Notification
    Profile.User.hasMany(Notification.Notification, { foreignKey: 'userId' });
    Notification.Notification.belongsTo(Profile.User, { foreignKey: 'userId' });

};




