const { Router } = require('express');
const { Recipe, Diet } = require('../db.js')
const { conn } = require('../db.js');
const axios = require('axios')
const { API_KEY, SPOONACULAR } = process.env
const { Op } = require('sequelize')

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
// const recipeRoutes = require('./recipeRoutes')
// const dietRoutes = require('./dietRoutes')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// router.use('/', recipeRoutes)
// router.use('/diets', dietRoutes)

// router.get('/recipes', async (req, res) => {

// }) 

router.get('/recipes/:idRecipe', async (req, res) => {
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
            // for (let i=0; i<recipeApi.diets; i++) {
            //     const diet = recipeApi.diets[i]
            //     await Diet.findOrCreate({ where: { name: diet } });
            // }
            console.log(recipeData)
            return res.status(200).json(recipeData) // devuelvo la receta
        } catch (error) {
            res.status(404).json({ error: `No se encontró ninguna receta con el id ${recipeId}` }) // si no se encuentra, devuelve un 404
        }
    }
})

router.get('/recipes', async (req, res) => {
    const { name } = req.query;
    let recipes = [];
    
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
        console.log(recipe)
        return recipe
    });
    // Si no se encontraron suficientes recetas en la base de datos, buscar en la API
    if (recipes.length < 9) {
        const query = name ? `query=${name}&` : '';
        const apiResponse = await axios.get(
            `${SPOONACULAR}/recipes/complexSearch?${query}addRecipeInformation=true&apiKey=${API_KEY}&number=${9 - recipes.length}`
        );
        const apiRecipes = apiResponse.data.results.map((r) => ({
            id: r.id,
            title: r.title,
            image: r.image,
            healthScore: r.healthScore,
            diets: r.diets,
        }));
        recipes.push(...apiRecipes.slice(0, 9 - recipes.length));
    }

    res.json(recipes.slice(0, 9));
    console.log(recipes)
});



// router.get('/recipes/', async (req, res) => {
//     var { name } = req.query; //guardo el name recibido por query en una constante
//     if (!name) {
//         name=''
//     }
//     const recipes = await Recipe.findAll({
//         where: {
//             name: name.toLowerCase() // busco todas las recetas que incluyan la palabra pasada por query en su nombre
//         },
//         include: [{
//             model: Diet,
//             attributes: ['name']
//         }]
//     })
//     if (recipes.length > 0) {
//         res.status(200).json(recipes);
//     }
//     else {
//         try {
//             const response = await axios.get(
//                 `${SPOONACULAR}/recipes/complexSearch?query=${name}&addRecipeInformation=true&apiKey=${API_KEY}`
//                 )
//             const recipes = response.data.results.map(
//                     ({ id, title, image, healthScore, diets }) => ({ id, title, image, healthScore, diets })
//                 )
//             return res.status(200).json({recipes})
//         } catch (error) {
//             res.status(404).json({error:`No se encontró ninguna receta`})
//         }
//     }
// })

router.post('/recipes', async (req, res) => {
    const { name, image, resume, healthScore, steps, diets } = req.body
    console.log(name, image, resume, healthScore, steps, diets)
    try {
        const newRecipeData = {
            name: name,
            image: image,
            resume: resume,
            healthScore: healthScore,
            steps: steps,
            createdInDB: true,
        }
        // console.log(newRecipeData)
        const newRecipe = await Recipe.create(newRecipeData)
        await newRecipe.addDiets(diets)
        console.log(newRecipeData)
        console.log(newRecipe)
        res.status(201).json(newRecipe instanceof Recipe)
    } catch (error) {
        res.status(400).json({ error: 'No se pudo crear' })
    }
})
router.get('/diets/', async (req, res) => {
    try {
        const response = await axios.get(
            `${SPOONACULAR}/recipes/complexSearch?addRecipeInformation=true&analyzedInstructions=true&number=5000&apiKey=${API_KEY}`
        );
        const preFilterDiets = response.data.results.map(({ diets }) => ({ diets })
        )

        const diets = [];

        preFilterDiets.forEach((item) => {
            item.diets.forEach((diet) => {
                switch (diet) {
                    case "paleolithic":
                    case "primal":
                    case "whole 30":
                    case "lacto ovo vegetarian":
                    case "vegan":
                    case "vegetarian":
                        if (!diets.includes(diet)) {
                            diets.push(diet);
                        }
                        break;
                    case "dairy free":
                        const ovoDiet = "ovo vegetarian";
                        if (!diets.includes(ovoDiet)) {
                            diets.push(ovoDiet);
                        }
                        break;
                    case "egg free":
                        const lactoDiet = "lacto vegetarian";
                        if (!diets.includes(lactoDiet)) {
                            diets.push(lactoDiet);
                        }
                        break;
                    default:
                        if (!diets.includes(diet)) {
                            diets.push(diet);
                        }
                        break;
                }
            });
        });

        for (let i = 0; i < diets.length; i++) {
            const diet = diets[i]
            await Diet.findOrCreate({ where: { name: diet } });
        }
        const allDbDiets = await Diet.findAll()
        res.status(200).json(allDbDiets)


    } catch (error) {
        res.json({ error: 'error' })
    }
})


module.exports = router;
