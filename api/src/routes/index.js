const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const recipesRoutes = require('./recipesRoutes.js')
const dietsRoutes = require('./dietsRoutes.js')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/recipes', recipesRoutes)
router.use('/diets', dietsRoutes)


module.exports = router;
