Volume serial number is 0870 - 9199
C:.
│   .env
│   .gitignore
│   combined.log
│   logger.mjs
│   npm
│   npx
│   package - lock.json
│   package.json
│   server.mjs
│   test.log
├───config
│       config.json
│       sequelize - instance.mjs
│
├───controllers
│   │   index.mjs
│   │
│   ├───community
│   │       communityCommentsController.mjs
│   │       communityPostsController.mjs
│   │       index.mjs
│   │
│   ├───finance
│   │       expensesController.mjs
│   │       financialSummariesController.mjs
│   │       index.mjs
│   │       receiptItemsController.mjs
│   │       receiptsController.mjs
│   │       transactionsController.mjs
│   │
│   ├───foods
│   │       foodLabelsController.mjs
│   │       foodNutrientsController.mjs
│   │       foodsController.mjs
│   │       foodSynonymsController.mjs
│   │       index.mjs
│   │
│   ├───groceries
│   │       cartItemsController.mjs
│   │       groceryItemsController.mjs
│   │       groceryListItemsController.mjs
│   │       groceryListsController.mjs
│   │       index.mjs
│   │
│   ├───inventory
│   │       index.mjs
│   │       inventoryItemsController.mjs
│   │       perishableItemsController.mjs
│   │       purchaseHistoriesController.mjs
│   │       userInventoriesController.mjs
│   │
│   ├───labels
│   │       index.mjs
│   │       labelsController.mjs
│   │
│   ├───mealplanning
│   │       index.mjs
│   │       mealHistoryController.mjs
│   │       mealPlansController.mjs
│   │       mealRatingsController.mjs
│   │       mealRecipesController.mjs
│   │       mealTypesController.mjs
│   │       restaurantMealsController.mjs
│   │       userMealIntakeController.mjs
│   │
│   ├───notifications
│   │       index.mjs
│   │       notificationsController.mjs
│   │
│   ├───recipes
│   │       index.mjs
│   │       recipeInstructionsController.mjs
│   │       recipeLabelsController.mjs
│   │       recipeMediaController.mjs
│   │       recipesController.mjs
│   │       recipeSectionFoodsController.mjs
│   │       recipeSectionsController.mjs
│   │
│   ├───stores
│   │       index.mjs
│   │       shoppingCartsController.mjs
│   │       storeInventoryController.mjs
│   │       storePricesController.mjs
│   │       storesController.mjs
│   │
│   ├───units
│   │       index.mjs
│   │       unitConversionsController.mjs
│   │       unitsController.mjs
│   │
│   └───users
│       │   index.mjs
│       │
│       ├───auth
│       │       forgotPasswordController.mjs
│       │       index.mjs
│       │       loginUserController.mjs
│       │       registerUserController.mjs
│       │       resetPasswordController.mjs
│       │       verifyLoginLinkController.mjs
│       │
│       ├───basic - profile
│       │       changePasswordsController.mjs
│       │       deleteUsersController.mjs
│       │       getUserDetailsController.mjs
│       │       index.mjs
│       │       udateUserDetailsController.mjs
│       │
│       ├───extended - profile
│       │       getProfilesController.mjs
│       │       getUserMediaController.mjs
│       │       index.mjs
│       │       updateProfilesController.mjs
│       │
│       └───metrics - and - goals
│               index.mjs
│               updateBudgetController.mjs
│               userGoalsController.mjs
│               userGoalsProgressController.mjs
│
├───middleware
│       authMiddleware.mjs
│       errorMiddleware.mjs
│       generateTokenMiddleware.mjs
│       index.mjs
│       permissionsMiddleware.mjs
│       recipeValidationMiddleware.mjs
│       uploadLimiterMiddleware.mjs
│
├───migrations
│
├───models
│   │   associations.mjs
│   │   index.mjs
│   │
│   ├───community
│   │       CommunityComment.mjs
│   │       CommunityPost.mjs
│   │       index.mjs
│   │
│   ├───finance
│   │       Expense.mjs
│   │       FinancialSummary.mjs
│   │       index.mjs
│   │       Receipt.mjs
│   │       ReceiptItem.mjs
│   │       Transaction.mjs
│   │
│   ├───foods
│   │       Food.mjs
│   │       FoodLabel.mjs
│   │       FoodNutrient.mjs
│   │       FoodSynonym.mjs
│   │       index.mjs
│   │
│   ├───groceries
│   │       CartItem.mjs
│   │       GroceryItem.mjs
│   │       GroceryList.mjs
│   │       GroceryListItem.mjs
│   │       index.mjs
│   │
│   ├───inventory
│   │       index.mjs
│   │       InventoryItem.mjs
│   │       PerishableItem.mjs
│   │       PurchaseHistory.mjs
│   │       UserInventory.mjs
│   │
│   ├───labels
│   │       index.mjs
│   │       Label.mjs
│   │
│   ├───mealplanning
│   │       index.mjs
│   │       MealHistory.mjs
│   │       MealPlan.mjs
│   │       MealRating.mjs
│   │       MealRecipe.mjs
│   │       MealType.mjs
│   │       RestaurantMeal.mjs
│   │       UserMealIntake.mjs
│   │
│   ├───notifications
│   │       index.mjs
│   │       Notification.mjs
│   │
│   ├───recipes
│   │       index.mjs
│   │       Recipe.mjs
│   │       RecipeInstruction.mjs
│   │       RecipeLabel.mjs
│   │       RecipeMedia.mjs
│   │       RecipeSection.mjs
│   │       RecipeSectionFood.mjs
│   │       RecipeValidation.mjs
│   │
│   ├───stores
│   │       index.mjs
│   │       ShoppingCart.mjs
│   │       Store.mjs
│   │       StoreInventory.mjs
│   │       StorePrice.mjs
│   │
│   ├───units
│   │       index.mjs
│   │       Unit.mjs
│   │       UnitConversion.mjs
│   │
│   └───users
│       │   index.mjs
│       │
│       ├───auth
│       │       index.mjs
│       │       Permission.mjs
│       │       Role.mjs
│       │       RolePermission.mjs
│       │
│       ├───basic - profile
│       │       index.mjs
│       │       User.mjs
│       │
│       ├───extended - profile
│       │       index.mjs
│       │       UserMedia.mjs
│       │
│       └───metrics - and - goals
│               index.mjs
│               UserGoal.mjs
│               UserGoalProgress.mjs
│               UserGroup.mjs
│               UserHealthMetric.mjs
│
├───routes
│   │   index.mjs
│   │
│   ├───community
│   │       index.mjs
│   │
│   ├───finance
│   │       index.mjs
│   │
│   ├───foods
│   │       index.mjs
│   │
│   ├───groceries
│   │       index.mjs
│   │
│   ├───inventory
│   │       index.mjs
│   │
│   ├───labels
│   │       index.mjs
│   │
│   ├───mealplanning
│   │       index.mjs
│   │
│   ├───notifications
│   │       index.mjs
│   │
│   ├───recipes
│   │       index.mjs
│   │
│   ├───stores
│   │       index.mjs
│   │
│   ├───units
│   │       index.mjs
│   │
│   └───users
│       │   index.mjs
│       │
│       ├───auth
│       │       index.mjs
│       │
│       ├───basic - profile
│       │       index.mjs
│       │
│       ├───extended - profile
│       │       index.mjs
│       │
│       └───metrics - and - goals
│               index.mjs
│
├───scripts
│       backendTree.js
│       syncDatabase.mjs
│       testJwt.mjs
│       videoUpload.mjs
│
├───services
│   │   index.mjs
│   │
│   ├───community
│   │       communityCommentService.mjs
│   │       communityPostService.mjs
│   │       index.mjs
│   │
│   ├───finance
│   │       expenseService.mjs
│   │       financialSummaryService.mjs
│   │       index.mjs
│   │       receiptItemService.mjs
│   │       receiptService.mjs
│   │       transactionService.mjs
│   │
│   ├───foods
│   │       foodLabelService.mjs
│   │       foodNutrientService.mjs
│   │       foodService.mjs
│   │       foodSynonymService.mjs
│   │       index.mjs
│   │
│   ├───groceries
│   │       cartItemService.mjs
│   │       groceryItemService.mjs
│   │       groceryListItemService.mjs
│   │       groceryListService.mjs
│   │       index.mjs
│   │
│   ├───inventory
│   │       index.mjs
│   │       inventoryItemService.mjs
│   │       perishableItemService.mjs
│   │       purchaseHistoryService.mjs
│   │       userInventoryService.mjs
│   │
│   ├───labels
│   │       index.mjs
│   │       labelService.mjs
│   │
│   ├───mealplanning
│   │       index.mjs
│   │       mealHistoryService.mjs
│   │       mealPlanService.mjs
│   │       mealRatingService.mjs
│   │       mealRecipeService.mjs
│   │       mealTypeService.mjs
│   │       restaurantMealService.mjs
│   │       userMealIntakeService.mjs
│   │
│   ├───notifications
│   │       index.mjs
│   │       notificationService.mjs
│   │
│   ├───recipes
│   │       index.mjs
│   │       recipeInstructionService.mjs
│   │       recipeLabelService.mjs
│   │       recipeMediaService.mjs
│   │       recipeSectionFoodService.mjs
│   │       recipeSectionService.mjs
│   │       recipeService.mjs
│   │
│   ├───stores
│   │       index.mjs
│   │       shoppingCartService.mjs
│   │       storeInventoryService.mjs
│   │       storePriceService.mjs
│   │       storeService.mjs
│   │
│   ├───units
│   │       index.mjs
│   │       unitConversionService.mjs
│   │       unitService.mjs
│   │
│   └───users
│       │   index.mjs
│       │   userService.mjs
│       │
│       ├───auth
│       │       authService.mjs
│       │       index.mjs
│       │       permissionService.mjs
│       │       rolePermissionService.mjs
│       │       roleService.mjs
│       │
│       ├───basic - profile
│       │       index.mjs
│       │       userProfileService.mjs
│       │
│       ├───extended - profile
│       │       index.mjs
│       │       userMediaService.mjs
│       │
│       └───metrics - and - goals
│               healthMetricsService.mjs
│               index.mjs
│               userGoalProgressService.mjs
│               userGoalService.mjs
│
├───tests
│   │   runTests.mjs
│   │   test - config.mjs
│   │
│   ├───controllers
│   │   ├───groceries
│   │   │       addItem.test.mjs
│   │   │       comparePrices.test.mjs
│   │   │       generateList.test.mjs
│   │   │       removeItem.test.mjs
│   │   │       schedulePickup.test.mjs
│   │   │
│   │   ├───inventory
│   │   │       addItem.test.mjs
│   │   │       checkInventory.test.mjs
│   │   │       removeItem.test.mjs
│   │   │       scan.test.mjs
│   │   │
│   │   ├───mealplanning
│   │   │       addRecipe.test.mjs
│   │   │       filterRecipe.test.mjs
│   │   │       multiplyRecipe.test.mjs
│   │   │       removeRecipe.test.mjs
│   │   │       searchRecipe.test.mjs
│   │   │       updateRecipe.test.mjs
│   │   │
│   │   └───user
│   │           login.test.mjs
│   │           signup.test.mjs
│   │           verifyLoginLink.test.mjs
│   │
│   ├───fixtures
│   ├───middleware
│   │       auth.test.mjs
│   │       error.test.mjs
│   │       permissions.test.mjs
│   │
│   ├───mocks
│   │   ├───controllers
│   │   │   ├───grocery
│   │   │   ├───inventory
│   │   │   ├───mealplanning
│   │   │   │       mockRecipe.mjs
│   │   │   │
│   │   │   └───user
│   │   │           loginMocks.mjs
│   │   │           signupMocks.mjs
│   │   │
│   │   ├───middleware
│   │   │       authMock.mjs
│   │   │       rateLimiterMock.mjs
│   │   │
│   │   ├───models
│   │   │   ├───mongoose
│   │   │   │       fakeMongoUser.mjs
│   │   │   │
│   │   │   └───sequelize
│   │   │           fakeCartItem.mjs
│   │   │           fakeGroceryItem.mjs
│   │   │           fakeRecipe.mjs
│   │   │           fakeRecipe2.mjs
│   │   │           fakeRecipeLogic.mjs
│   │   │           fakeShoppingCart.mjs
│   │   │           fakeStore.mjs
│   │   │           fakeUser.mjs
│   │   │
│   │   └───services
│   │       └───user
│   │               authMocks.mjs
│   │
│   ├───models
│   │   ├───community
│   │   │       CommunityComment.test.mjs
│   │   │       CommunityPost.test.mjs
│   │   │
│   │   ├───finance
│   │   │       Expense.test.mjs
│   │   │       FinancialSummary.test.mjs
│   │   │       Receipt.test.mjs
│   │   │       ReceiptItem.test.mjs
│   │   │       Transaction.test.mjs
│   │   │
│   │   ├───foods
│   │   │       Food.test.mjs
│   │   │       FoodLabel.test.mjs
│   │   │       FoodNutrient.test.mjs
│   │   │       FoodSynomym.test.mjs
│   │   │
│   │   ├───groceries
│   │   │       CartItem.test.mjs
│   │   │       GroceryItem.test.js
│   │   │       GroceryList.test.mjs
│   │   │       GroceryListItem.test.mjs
│   │   │
│   │   ├───inventory
│   │   │       InventoryItem.test.mjs
│   │   │       PerishableItem.test.mjs
│   │   │       PurchaseHistory.test.mjs
│   │   │       UserInventory.test.mjs
│   │   │
│   │   ├───labels
│   │   │       Label.test.mjs
│   │   │
│   │   ├───mealplanning
│   │   │       MealPlanning.test.mjs
│   │   │
│   │   ├───recipes
│   │   │       Recipe.test.mjs
│   │   │       RecipeInstruction.test.mjs
│   │   │       RecipeLabel.test.mjs
│   │   │       RecipeMedia.test.mjs
│   │   │       RecipeSection.test.mjs
│   │   │       RecipeSectionFood.test.mjs
│   │   │
│   │   ├───stores
│   │   │       ShoppingCart.test.mjs
│   │   │       Store.test.mjs
│   │   │       StoreInventory.test.mjs
│   │   │       StorePrice.test.mjs
│   │   │
│   │   ├───units
│   │   │       Unit.test.mjs
│   │   │       UnitConversion.test.mjs
│   │   │
│   │   └───users
│   │           User.test.mjs
│   │           UserMedia.test.mjs
│   │
│   └───services
│       ├───auth
│       ├───community
│       ├───finance
│       ├───foods
│       ├───groceries
│       ├───inventory
│       ├───labels
│       ├───mealplanning
│       ├───recipes
│       │       recipeInstructionService.test.mjs
│       │       recipeSectionFoodService.test.mjs
│       │       recipeSectionService.test.mjs
│       │       recipeService.test.mjs
│       │
│       ├───stores
│       │       shoppingCartService.test.mjs
│       │       storeInventoryService.test.mjs
│       │       storePriceService.test.mjs
│       │       storeService.test.mjs
│       │
│       ├───units
│       │       unitConversionService.test.mjs
│       │       unitService.test.mjs
│       │
│       └───users
│               userMediaService.test.mjs
│               userService.test.mjs
│
├───utils
│   │   dataNormalization.mjs
│   │   errorHandling.mjs
│   │   helpers.mjs
│   │   index.mjs
│   │   pagination.mjs
│   │   priceFetcher.mjs
│   │   recipeImporter.mjs
│   │   sendEmail.mjs
│   │   sortDirection.mjs
│   │   tokenCleanup.mjs
│   │   tokenUtils.mjs
│   │   validations.mjs
│   │
│   └───errors
│           AuthenticationError.mjs
│           CustomError.mjs
│           index.mjs
│           NotFoundError.mjs
│           ValidationError.mjs
│
└───video
index.mjs
s3.mjs