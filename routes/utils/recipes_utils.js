const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Gets basic recipe info from Spoonacular
 */
async function getRecipeInformation(recipe_id) {
  recipe_id = String(recipe_id).trim();
  if (!/^\d+$/.test(recipe_id)) {
    throw new Error(`Invalid recipe ID: ${recipe_id}`);
  }

  console.log("Getting recipe info for ID:", recipe_id);

  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

/**
 * Full recipe details for recipe page
 */
async function getRecipeDetails(recipe_id) {
  const recipe_info = await getRecipeInformation(recipe_id);
  return extractFullRecipePageData(recipe_info.data);
}

/**
 * Extracts basic preview for recipe search results
 */
function extractRecipePreviewData(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    aggregateLikes: recipe.aggregateLikes,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
    glutenFree: recipe.glutenFree,
    instructions: recipe.instructions || null // Preview includes instructions
  };
}

/**
 * Extracts full recipe data for the detailed recipe page
 */
function extractFullRecipePageData(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    popularity: recipe.aggregateLikes,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
    glutenFree: recipe.glutenFree,
    servings: recipe.servings,
    instructions: recipe.instructions,
    ingredients: recipe.extendedIngredients?.map(i => ({
      name: i.name,
      amount: i.amount,
      unit: i.unit
    }))
  };
}

/**
 * Search for recipes using Spoonacular API and return previews.
 * Supports optional filters (cuisine, diet, intolerances), limit (number),
 * and sorting (sort by 'popularity' or 'readyInMinutes').
 */
async function searchRecipes(query, cuisine, diet, intolerances, number = 5, sort = null) {
  const params = {
    apiKey: process.env.spooncular_apiKey,
    query,
    cuisine,
    diet,
    intolerances,
    number,
    addRecipeInformation: true
  };

  if (sort) {
    params.sort = sort; // 'popularity' or 'readyInMinutes'
  }

  const response = await axios.get(`${api_domain}/complexSearch`, { params });

  return response.data.results.map(extractRecipePreviewData);
}
/**
 * Get preview info for multiple recipes by ID list
 */
async function getRecipesPreview(recipe_ids_list) {
  const previewPromises = recipe_ids_list.map(id => getRecipeInformation(id));
  const results = await Promise.allSettled(previewPromises);

  return results
    .filter(r => r.status === "fulfilled")
    .map(r => extractRecipePreviewData(r.value.data));
}

/**
 * Get 3 random recipes for homepage (or other uses)
 */
async function getRandomRecipes() {
  const response = await axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      apiKey: process.env.spooncular_apiKey
    }
  });

  if (!response.data.recipes || response.data.recipes.length === 0) {
    throw new Error("No recipes returned from API");
  }

  const recipeIds = response.data.recipes.map(r => r.id);
  return await getRecipesPreview(recipeIds);
}



module.exports = {
  getRecipeInformation,
  getRecipeDetails,
  extractRecipePreviewData,
  extractFullRecipePageData,
  searchRecipes,
  getRecipesPreview,
  getRandomRecipes
};
