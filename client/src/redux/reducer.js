import { combineReducers } from 'redux';

const recipesReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_RECIPES':
      return action.payload;
    case 'GET_BY_ID':
      return action.payload;
    case 'POST_RECIPE':
      return [...state, action.payload];
    case 'ORDER_BY_NAME':
      return action.payload;
    case 'ORDER_BY_HS':
      return action.payload;
    case 'FILTER_BY_DIET':
      return action.payload;
    case 'CLEAR_RECIPES':
      return {
        ...state,
        recipes:[]
      }
    default:
      return state;
  }
};

const dietsReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_DIETS':
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  recipes: recipesReducer,
  diets: dietsReducer,
});
