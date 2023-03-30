const { Router } = require('express');
const { Recipe, Diet } = require('../db.js')
const axios = require('axios')
const { API_KEY, SPOONACULAR } = process.env
const { Op } = require('sequelize')

const router = Router();

router.get('/:idRecipe', async (req, res, next) => {
    const recipeId = req.params.idRecipe;
    console.log(recipeId)
    if (recipeId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {

        const recipe = await Recipe.findOne({
            where: {
                id: recipeId
            },
            include: [{
                model: Diet,
                attributes: ['name']
            }]
        });
        console.log('recipe:', recipe)
        if (recipe) {
            const responseData = {
                ...recipe.toJSON(),
                diets: recipe.Diets.map(diet => diet.name)
            };
            res.status(200).json(responseData)
        }
        else {
            res.status(404).json({ error: 'Not found' })
        }
    }
    else { // sino lo busca en la api
        try {
            const response = await axios.get(
                `${SPOONACULAR}/recipes/${recipeId}/information?apiKey=${API_KEY}`
            )
            const recipeApi = response.data
            const responseB = await axios.get(
                `${SPOONACULAR}/recipes/${recipeId}/analyzedInstructions?apiKey=${API_KEY}`
            )
            const fullSteps = responseB.data[0].steps.map(({ number, step }) => ({ number, step }))
            const recipeData = { // solo me guardo las propiedades que necesito
                id: recipeApi.id,
                name: recipeApi.title,
                image: recipeApi.image,
                resume: recipeApi.summary,
                healthScore: recipeApi.healthScore,
                steps: fullSteps,
                diets: recipeApi.diets,
            }
            console.log(recipeData)
            return res.status(200).json(recipeData) // devuelvo la receta
        } catch (error) {
            res.status(404).json({ error: `No se encontró ninguna receta con el id ${recipeId}` }) // si no se encuentra, devuelve un 404
        }
    }
})

router.get('/', async (req, res, next) => {
    const { name } = req.query;
    if (name) {
        name.toLocaleLowerCase()
    }
    let recipes = [];
    try {

        // Buscar en la base de datos
        if (name) {
            const dbRecipes = await Recipe.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${name}%`,
                    },
                },
                include: {
                    model: Diet,
                    attributes: ['name'],
                },
            });
            recipes.push(...dbRecipes);
        }
        recipes = recipes.map((recipe) => {
            if (recipe.Diets) {
                recipe.dataValues.diets = recipe.Diets.map(diet => diet.name);
                delete recipe.dataValues.Diets;
            }

            return recipe
        });
        
        if (recipes.length < 100) {
            const query = name ? `query=${name}&` : '';
            const apiResponse = await axios.get(
                `${SPOONACULAR}/recipes/complexSearch?${query}addRecipeInformation=true&apiKey=${API_KEY}&number=${100 - recipes.length}`
            );
            const apiRecipes = apiResponse.data.results.map((r) => ({
                id: r.id,
                name: r.title,
                image: r.image,
                healthScore: r.healthScore,
                diets: r.diets,
            }));
            recipes.push(...apiRecipes.slice(0, 100 - recipes.length));
        }

        res.json(recipes.slice(0, 100));
        console.log(recipes)
    } catch (error) {
        if (!name) {
            res.status(404).json([])
        }
    }
});

router.post('/', async (req, res, next) => {
    const { name, image, resume, healthScore, steps, diets } = req.body
    try {
        const nameExists = await Recipe.findOne({ where: { name: name } })
        const imageExists = await Recipe.findOne({ where: { image: image } })
        if (nameExists && imageExists) {
            return res.status(403).json({ error: 'La receta ya existe' })
        }
        const newRecipeData = {
            name: name,
            image: image,
            resume: resume,
            healthScore: healthScore,
            steps: steps,
            createdInDB: true,
        }
        const newRecipe = await Recipe.create(newRecipeData)
        await newRecipe.addDiets(diets)
        return res.status(201).json({ success: 'Recipe created successfully' })
    } catch (error) {
        return res.status(500).json({ error: 'There was an error creating the recipe' })
    }
})

module.exports = router