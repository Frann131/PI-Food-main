import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRecipes } from '../redux/actions.js';
import Card from './Card';
import styles from '../cssModuleStyles/Cards.module.css'
import notfound from '../img/lupa not found.svg'

function Cards({ recipes, getRecipes }) {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const name = queryParams.get('name')

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      await getRecipes(name);
      setIsLoading(false);
    }
    fetchData();
  }, [getRecipes, name]);

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {isLoading ? (
          <p>Cargando...</p>
        ) : recipes.length === 0 ? (
          <div className={styles.notfound}>
            <img src={notfound} alt="" />
            No hay ninguna receta que coincida con "{name}"
          </div>
        ) : (
          recipes.map((recipe) => (
            <Card
              id={recipe.id}
              name={recipe.title}
              healthScore={recipe.healthScore}
              image={recipe.image}
              diets={recipe.diets}
            />
          ))
        )}
      </div>
      <div>
        <button className={styles.btn}>Previous</button><button className={styles.btn}>Next</button>
      </div>
    </div>
  );
}


const mapStateToProps = (state) => {
  return {
    recipes: state.recipes
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRecipes: (name) => dispatch(getRecipes(name))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);