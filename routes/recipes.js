var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// Check server status
router.get("/", (req, res) => res.send("im here"));


/**
 * Search recipes using Spoonacular API with filters and sorting
 */
router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances, number, sort } = req.query;

    if (!query) {
      return res.status(400).send({ message: "Search query is required", success: false });
    }

    const searchResults = await recipes_utils.searchRecipes(
      query,
      cuisine,
      diet,
      intolerances,
      number || 5, // default 5
      sort // optional: "popularity" or "readyInMinutes"
    );

    if (searchResults.length === 0) {
      return res.status(200).send({ message: "No matching recipes found", results: [], success: true });
    }

    res.status(200).send({ success: true, results: searchResults });
  } catch (error) {
    next(error);
  }
});


/**
 * Get 3 random recipes from Spoonacular API
 */
router.get("/random", async (req, res, next) => {
  try {
    const preview = await recipes_utils.getRandomRecipes();
    res.send(preview);
  } catch (error) {
    next(error);
  }
});

/**
 * Get full recipe details by ID
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);

    if (req.session && req.session.user_id) {
      await require("./utils/user_utils").saveViewedRecipe(req.session.user_id, req.params.recipeId);
    }

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
