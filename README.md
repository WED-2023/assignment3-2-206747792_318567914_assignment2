
name: Lital Kupchick, id:318567914 
name: Hadar Knafo, id:206747792


# Grandma's Recipes – Backend
This is the Node.js Express backend for the web application "Grandma's Recipes", a platform for searching, managing, and sharing recipes – including personal and traditional family recipes passed down through generations.

## Technologies Used
- Node.js and Express.js
- MySQL database (with connection pooling)
- Axios for external API requests
- Spoonacular API for external recipe data
- bcrypt for password encryption
- express-session for user session handling
- dotenv for environment configuration

## Project Structure
routes/
- auth.js – Authentication routes (register, login, logout)
- recipes.js – Public recipe routes (search, get by ID, random)
- user.js – Logged-in user routes (favorites, my recipes, family)
utils/
- DButils.js – Executes SQL queries via MySQL
- MySql.js – Creates and manages MySQL connection pool
- recipes_utils.js – Handles Spoonacular API and recipe formatting
- user_utils.js – Logic for favorite, viewed, personal and family recipes

## Authentication

### Register  
POST /auth/Register  
- Validates input (username, password, email, country)  
- Verifies country using restcountries.com  
- Encrypts password using bcrypt  
- Saves user in the database  

### Login  
POST /auth/Login  
- Checks user credentials  
- Creates session using express-session  

### Logout  
POST /auth/Logout  
- Resets user session  

## Public Recipe Routes
- GET /recipes/search – search with filters (query, diet, cuisine, etc.)
- GET /recipes/random – get 3 random recipes
- GET /recipes/:recipeId – get full details of a recipe

## Logged-in User Functionality
Requires authentication using req.session.user_id.

### Favorites
- POST /users/favorites – mark as favorite
- GET /users/favorites – get all favorite recipes
- GET /users/favorites/:recipeId – check if a recipe is marked as favorite

### Recently Viewed
- POST /users/viewed/:recipeId – mark recipe as viewed
- GET /users/lastViewed – get last 3 viewed recipes

### My Recipes
- POST /users/my-recipes – save a personal recipe
- GET /users/my-recipes – get all personal recipes
- GET /users/my-recipes/:id – get specific personal recipe

### Family Recipes
- POST /users/family-recipes – add family recipe (includes creator name and occasion)
- GET /users/family-recipes – get all family recipes

## Testing the API
You can use Postman or any HTTP client.
Make sure cookies or session headers are preserved between requests (especially after login).

## Future Improvements
- Add unit and integration tests
- Add JWT authentication
- Add image upload support
