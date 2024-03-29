import axios from 'axios'

const GET_RECIPES = 'GET_RECIPES'
const GET_BY_ID = 'GET_BY_ID'
const GET_DIETS = 'GET_DIETS'
const POST_RECIPE = 'POST_RECIPE'
const CLEAR_RECIPES = 'CLEAR_RECIPES'

export function getRecipes(name) {
    return async function (dispatch) {
        let url = 'http://localhost:3001/recipes';
        if (name) {
            url = `${url}?name=${name}`;
        }
        const response = await axios.get(url);
        return dispatch({
            type: GET_RECIPES,
            payload: response.data
        })
    }
}

export function getRecipesById(id) {
    return async function (dispatch) {
        console.log('Enviando solicitud al servidor...');
        const response = await axios.get(`http://localhost:3001/recipes/${id}`);
        console.log('Datos de respuesta recibidos:', response.data);
        return dispatch({
            type: GET_BY_ID,
            payload: response.data,
        })
    }
}


export function getDiets() {
    return async function (dispatch) {
        const response = await axios.get(`http://localhost:3001/diets`);
        return dispatch({
            type: GET_DIETS,
            payload: response.data
        })

    }
}
export function postRecipe(payload) {
    return async function (dispatch) {
        const response = await axios.post(`http://localhost:3001/recipes`, payload)
        dispatch({
            type: POST_RECIPE,
            payload: response.data
        });
        return response;
    }
}

export const clearRecipes = () => ({
    type: CLEAR_RECIPES,
})
