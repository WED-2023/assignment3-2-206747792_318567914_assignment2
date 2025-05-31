DROP TABLE IF EXISTS FavoriteRecipes;
DROP TABLE IF EXISTS ViewedRecipes;
DROP TABLE IF EXISTS UserRecipes;
DROP TABLE IF EXISTS FamilyRecipes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profilePic TEXT,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE FavoriteRecipes (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE ViewedRecipes (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    view_time DATETIME NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE UserRecipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    readyInMinutes INT,
    popularity INT,
    vegan BOOLEAN,
    vegetarian BOOLEAN,
    glutenFree BOOLEAN,
    servings INT,
    instructions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE FamilyRecipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    ingredients TEXT,
    instructions TEXT,
    tradition TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
