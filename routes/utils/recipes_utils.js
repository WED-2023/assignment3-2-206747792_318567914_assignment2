
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    console.log("Getting recipe info for ID:", recipe_id);

    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}
function extractRecipePreviewData(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    aggregateLikes: recipe.aggregateLikes,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
    glutenFree: recipe.glutenFree
  };
}




async function searchRecipes(query, cuisine, diet, intolerances) {
  const response = await axios.get(`${api_domain}/complexSearch`, {
    params: {
      apiKey: process.env.spoonacular_apiKey,
      query: query,
      cuisine: cuisine,
      diet: diet,
      intolerances: intolerances,
      number: 10,
      addRecipeInformation: true
    }
  });

  return response.data.results.map(extractRecipePreviewData);
}


async function getRecipesPreview(recipe_ids_list) {
  const previewPromises = recipe_ids_list.map((id) => getRecipeInformation(id));
  const previewResponses = await Promise.all(previewPromises);

  return previewResponses.map((response) =>
    extractRecipePreviewData(response.data)
  );
}


exports.getRecipeInformation = getRecipeInformation;
exports.getRecipeDetails = getRecipeDetails;
exports.extractRecipePreviewData = extractRecipePreviewData;
exports.searchRecipes = searchRecipes;
exports.getRecipesPreview = getRecipesPreview;


