var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// בדיקה שהשרת פועל
router.get("/", (req, res) => res.send("im here"));

/**
 * Search recipes using Spoonacular API
 * זה חייב להופיע לפני הנתיב הדינמי :recipeId כדי למנוע בלבול
 */
router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances } = req.query;

    if (!query) {
      return res.status(400).send({ message: "Search query is required", success: false });
    }

    const searchResults = await recipes_utils.searchRecipes(query, cuisine, diet, intolerances);
    res.status(200).send({ success: true, results: searchResults });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
