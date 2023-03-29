const { Router } = require('express');
const { Diet } = require('../db.js')
const axios = require('axios')
const { API_KEY, SPOONACULAR } = process.env

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const allDbDiets = await Diet.findAll();

        if (allDbDiets.length === 10) {
            return res.status(200).json(allDbDiets);
        }

        const response = await axios.get(
            `${SPOONACULAR}/recipes/complexSearch?addRecipeInformation=true&analyzedInstructions=true&number=45&apiKey=${API_KEY}`
        );

        const preFilterDiets = response.data.results.map(({ diets }) => ({ diets }));

        const diets = [];

        preFilterDiets.forEach((item) => {
            item.diets.forEach((diet) => {
                if (!diets.includes(diet)) {
                    diets.push(diet);
                }

            })
        });


        for (let i = 0; i < diets.length; i++) {
            const diet = diets[i];
            await Diet.findOrCreate({ where: { name: diet } });
        }

        const updatedDiets = await Diet.findAll();
        return res.status(200).json(updatedDiets);
    } catch (error) {
        return res.status(500).json([]);
    }
});

module.exports = router;