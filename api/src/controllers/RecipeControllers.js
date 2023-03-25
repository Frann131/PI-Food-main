const {Recipe, Diet} = require('../db.js')
const {API_KEY, SPOONACULAR} = require(process.env)

const getRecipesById = async function (recipeId) {
    const recipe = await Recipe.findOne({
        where: {
            id: recipeId // traigo de la DB la receta que tenga ese ID
        },
    })
    if (recipe) {
        return recipe;
    }
    else { // sino lo busca en la api
        try {
            const response = await axios.get(
                `${SPOONACULAR}/recipes/${recipeId}/information?includeNutrition=fals&apiKey=${API_KEY}`
                )
            const data = response.data
            const allDiets = data.diets
            const recipeData = { // solo me guardo las propiedades que necesito
                name: data.sourceName,
                image: data.image,
                resume: data.title,
                healthScore: data.healthScore,
                steps: data.sourceUrl,
                diets: allDiets,
            } 
            allDiets.forEach
            return recipeData
        } catch (error) {
            throw new Error({error: 'No se encontró'})
        }
    }
}

module.exports = { getRecipesById };