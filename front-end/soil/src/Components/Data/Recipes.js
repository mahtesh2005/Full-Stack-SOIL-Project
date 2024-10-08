import axios from "axios";

// API credentials
const apiKey = 'noapikeyBOZO';
const appID = '4af0c5dc';

// Global variables for query string and URL
let queryString;
let url;

// Function to get recipes based on user information
const getRecipes = async (limit, userInfo) => {
    // Calculate target calories and protein based on user info and health goals
    let calories = calculateCalories(userInfo.age, userInfo.height, userInfo.weight, userInfo.activityLevel, userInfo.gender);
    let protein = userInfo.weight;

    // Adjust calories and protein based on health goals
    if (userInfo.healthGoals === 'Weight Loss') {
        calories = (calories - 500) / 3;
        protein = protein / 3;
    }
    if (userInfo.healthGoals === 'Muscle Growth') {
        calories = (calories + 400) / 3;
        protein = (1.5 * userInfo.weight) / 3;
    }
    if (userInfo.healthGoals === 'Overall Health') {
        calories = calories / 3;
        protein = protein / 3;
    }

    // Define ranges for calories and protein
    let calorieRange = (calories - 50) + '-' + (calories + 50);
    let proteinRange = (protein - 5) + '-' + (protein + 5);

    // Log information for debugging
    console.log(proteinRange);
    console.log(calorieRange);
    console.log(userInfo.healthGoals);

    try {
        // Query recipes for breakfast, lunch, and dinner
        const breakfastRecipes = await queryRecipes('breakfast', proteinRange, calorieRange, userInfo.dietReq, limit);
        const lunchRecipes = await queryRecipes('lunch', proteinRange, calorieRange, userInfo.dietReq, limit);
        const dinnerRecipes = await queryRecipes('dinner', proteinRange, calorieRange, userInfo.dietReq, limit);

        // Combine recipes into combinations
        const recipesCombinations = [];

        for (let i = 0; i < limit; i++) {
            recipesCombinations.push({
                breakfast: breakfastRecipes[i],
                lunch: lunchRecipes[i],
                dinner: dinnerRecipes[i]
            });
        }

        return recipesCombinations;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return null;
    }
};

// Function to query recipes for a specific meal type
const queryRecipes = async (mealType, proteinRange, calorieRange, dietReq, limit) => {
    // Define query parameters
    const queryParams = {
        app_key: apiKey,
        app_id: appID,
        type: 'any',
        mealType: mealType,
        calories: calorieRange,
        random: true,
    };

    // Construct query string and URL
    queryString = new URLSearchParams(queryParams).toString();
    url = `https://api.edamam.com/api/recipes/v2?${queryString}&nutrients%5BPROCNT%5D=${proteinRange}`;

    // Make API request to get recipes
    const response = await axios.get(url);
    const recipesData = response.data.hits;

    // Extract limited recipes
    const limitedRecipes = recipesData.slice(0, limit);

    // Extract required information for each recipe
    const recipesInfo = limitedRecipes.map(recipe => {
        const { label, image, calories, totalNutrients, yield: servings, url } = recipe.recipe;
        const caloriesPerServing = totalNutrients.ENERC_KCAL ? totalNutrients.ENERC_KCAL.quantity / servings : 0;
        const proteinPerServing = totalNutrients.PROCNT ? totalNutrients.PROCNT.quantity / servings : 0; // Calculate protein per serving
        return { label, image, calories, caloriesPerServing, proteinPerServing, url }; 
    });

    // Log recipe info for debugging
    console.log(`${mealType} Recipes:`, recipesInfo);
    return recipesInfo; // Return the recipe info data
};

// Function to calculate daily calories based on user information
const calculateCalories = (age, height, weight, activityLevel, gender) => {
    let BMR = 0;
    let calories = 0;
    let activityFactor = 0;

    // Determine activity factor based on activity level
    if (activityLevel === "low") {
        activityFactor = 1.375;
    } else if (activityLevel === "medium") {
        activityFactor = 1.55;
    } else if (activityLevel === "high") {
        activityFactor = 1.725;
    }

    // Calculate Basal Metabolic Rate (BMR) based on gender
    if (gender === "male") {
        BMR = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
        calories = activityFactor * BMR;
    } else if (gender === "female") {
        BMR = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        calories = activityFactor * BMR;
    }

    // Log calculated calories and user info for debugging
    console.log("Calories:", calories);
    console.log("Age:", age);
    console.log("Height:", height);
    console.log("Weight:", weight);
    console.log("Activity Level:", activityLevel);
    console.log("Gender:", gender);

    return calories;
};

export default getRecipes;