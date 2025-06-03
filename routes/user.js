var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    try {
      const users = await DButils.execQuery("SELECT user_id FROM users");
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
});

/**
 * Route 7: Get last viewed recipes for the logged-in user
 */
router.get('/lastViewed', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_ids = await user_utils.getLastViewedRecipes(user_id);
    const results = await recipe_utils.getRecipesPreview(recipe_ids);
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
});

/**
 * Route 8: Save a recipe as viewed
 */
router.post('/viewed/:recipeId', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    if (!recipe_id) return res.status(400).send("Recipe ID is required");
    await user_utils.saveViewedRecipe(user_id, recipe_id);
    res.status(200).send("Recipe marked as viewed");
  } catch (err) {
    next(err);
  }
});

/**
 * Route 9a: Add recipe to favorites
 */
router.post('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    if (!recipe_id) return res.status(400).send("Recipe ID is required");
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The recipe was successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * Route 9b: Get favorite recipes of the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    const recipes_id_array = recipes_id.map((element) => element.recipe_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});
/**
 * Route 9c: Check if a recipe is marked as favorite
 */
router.get('/favorites/:recipeId', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    const isFav = await user_utils.isRecipeFavorite(user_id, recipe_id);
    res.status(200).send({ recipeId: recipe_id, isFavorite: isFav });
  } catch (error) {
    next(error);
  }
});


/**
 * Route 10: Save a new personal recipe
 */
router.post('/my-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipeData = req.body;
    await user_utils.saveUserRecipe(user_id, recipeData);
    res.status(201).send("Recipe saved successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * Route 11: Get all personal recipes created by the user
 */
router.get('/my-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getUserRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * Route 12: Save a new family recipe
 */
router.post('/family-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipeData = req.body;
    await user_utils.saveFamilyRecipe(user_id, recipeData);
    res.status(201).send("Family recipe saved successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * Route 13: Get all family recipes of the user
 */
router.get('/family-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getFamilyRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * Route 14: Get a specific personal recipe by ID
 */
router.get('/my-recipes/:id', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = await user_utils.getMyRecipeById(user_id, req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
