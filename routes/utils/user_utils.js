const DButils = require("./DButils");

// Route 7 - Get last viewed recipes
async function getLastViewedRecipes(user_id) {
  const recipe_ids = await DButils.execQuery(
    `SELECT recipe_id FROM ViewedRecipes WHERE user_id = ? ORDER BY view_time DESC LIMIT 3`,
    [user_id]
  );
  return recipe_ids.map(r => r.recipe_id);
}

// Route 8 - Save a recipe as viewed
async function saveViewedRecipe(user_id, recipe_id) {
  const existing = await DButils.execQuery(
    `SELECT * FROM ViewedRecipes WHERE user_id = ? AND recipe_id = ?`,
    [user_id, recipe_id]
  );

  if (existing.length > 0) {
    await DButils.execQuery(
      `UPDATE ViewedRecipes SET view_time = CURRENT_TIMESTAMP WHERE user_id = ? AND recipe_id = ?`,
      [user_id, recipe_id]
    );
  } else {
    await DButils.execQuery(
      `INSERT INTO ViewedRecipes (user_id, recipe_id, view_time) VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [user_id, recipe_id]
    );
  }
}


// Route 9a - Mark as favorite
async function markAsFavorite(user_id, recipe_id) {
  const result = await DButils.execQuery(
    `SELECT * FROM FavoriteRecipes WHERE user_id = ? AND recipe_id = ?`,
    [user_id, recipe_id]
  );
  if (result.length === 0) {
    await DButils.execQuery(
      `INSERT INTO FavoriteRecipes (user_id, recipe_id) VALUES (?, ?)`,
      [user_id, recipe_id]
    );
  }
}

// Route 9b - Get favorite recipes
async function getFavoriteRecipes(user_id) {
  return await DButils.execQuery(
    `SELECT recipe_id FROM FavoriteRecipes WHERE user_id = ?`,
    [user_id]
  );
}

// Route 9c - Check if recipe is favorite
async function isRecipeFavorite(user_id, recipe_id) {
  const result = await DButils.execQuery(
    `SELECT * FROM FavoriteRecipes WHERE user_id = ? AND recipe_id = ?`,
    [user_id, recipe_id]
  );
  return result.length > 0;
}

// Route 10 - Save personal recipe
async function saveUserRecipe(user_id, recipeData) {
  if (!recipeData.title || !recipeData.readyInMinutes || !recipeData.ingredients) {
    throw new Error("Missing required fields in personal recipe");
  }

  await DButils.execQuery(
    `INSERT INTO UserRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, servings, ingredients)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, recipeData.title, recipeData.image, recipeData.readyInMinutes, recipeData.popularity || 0,
     recipeData.vegan, recipeData.vegetarian, recipeData.glutenFree, recipeData.instructions,
     recipeData.servings, JSON.stringify(recipeData.ingredients)]
  );
}

// Route 11 - Get all personal recipes
async function getUserRecipes(user_id) {
  return await DButils.execQuery(
    `SELECT * FROM UserRecipes WHERE user_id = ?`,
    [user_id]
  );
}

// Route 12 - Save family recipe
async function saveFamilyRecipe(user_id, recipeData) {
  if (!recipeData.title || !recipeData.creatorName || !recipeData.ingredients) {
    throw new Error("Missing required fields in family recipe");
  }

  await DButils.execQuery(
    `INSERT INTO FamilyRecipes (user_id, title, image, readyInMinutes, popularity, creatorName, whenCooked, ingredients, instructions)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, recipeData.title, recipeData.image, recipeData.readyInMinutes, recipeData.popularity || 0,
     recipeData.creatorName, recipeData.whenCooked, JSON.stringify(recipeData.ingredients), recipeData.instructions]
  );
}

// Route 13 - Get all family recipes
async function getFamilyRecipes(user_id) {
  return await DButils.execQuery(
    `SELECT * FROM FamilyRecipes WHERE user_id = ?`,
    [user_id]
  );
}

// Route 14 - Get personal recipe by ID
async function getMyRecipeById(user_id, recipe_id) {
  const recipe = await DButils.execQuery(
    `SELECT * FROM UserRecipes WHERE user_id = ? AND id = ?`,
    [user_id, recipe_id]
  );
  return recipe[0];
}

// Route 15 - Get family recipe by ID
async function getFamilyRecipeById(user_id, recipe_id) {
  const recipe = await DButils.execQuery(
    `SELECT * FROM FamilyRecipes WHERE user_id = ? AND id = ?`,
    [user_id, recipe_id]
  );
  return recipe[0];
}


function extractUserRecipePreviewData(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    aggregateLikes: recipe.popularity,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
    glutenFree: recipe.glutenFree,
    instructions: recipe.instructions
  };
}

function extractFamilyRecipePreviewData(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    aggregateLikes: recipe.popularity,
    creatorName: recipe.creatorName,
    whenCooked: recipe.whenCooked
  };
}



module.exports = {
  getLastViewedRecipes,
  saveViewedRecipe,
  markAsFavorite,
  getFavoriteRecipes,
  isRecipeFavorite,
  saveUserRecipe,
  getUserRecipes,
  saveFamilyRecipe,
  getFamilyRecipes,
  getMyRecipeById,
  extractUserRecipePreviewData,
  extractFamilyRecipePreviewData,
  getFamilyRecipeById
};

