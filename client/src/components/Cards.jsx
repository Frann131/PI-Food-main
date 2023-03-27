import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { getRecipes, getDiets } from '../redux/actions.js';
import Card from './Card';
import styles from '../cssModuleStyles/Cards.module.css'
import notfound from '../img/lupa not found.svg'
import Loading from './Loading'

function Cards({ recipes, getRecipes }) {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const name = queryParams.get('name')

  const [selectedDiets, setSelectedDiets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hsSort, setHsSort] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const lastPostIndex = currentPage * 9
  const firstPostIndex = lastPostIndex - 9
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      await getRecipes(name);
      setIsLoading(false);
    }
    fetchData();
  }, [getRecipes, name]);
  console.log('recipes:', recipes)
  const [diets, setDiets] = useState([]);

  useEffect(() => {
    dispatch(getDiets())
      .then((data) => setDiets(data.payload));

  }, [dispatch]);

  var totalPages = 0

  if (recipes.length > 0) {
    totalPages = Math.ceil(recipes.length / 9)
  } else {
    totalPages = 1
  }

  const totalPagesArray = []

  for (let i = 1; i <= totalPages; i++) {
    totalPagesArray.push(i)
  }

  let filteredRecipes = recipes;

  if (selectedDiets.length > 0) {
    filteredRecipes = recipes.filter(recipe => selectedDiets.every(diet => recipe.diets.includes(diet)));
  }

  let sortedRecipes = filteredRecipes;

  if (hsSort === 'Ascending') {
    sortedRecipes = filteredRecipes.sort((a, b) => a.healthScore - b.healthScore);
  } else if (hsSort === 'Descending') {
    sortedRecipes = filteredRecipes.sort((a, b) => b.healthScore - a.healthScore);
  } else if (hsSort === 'None') {
    sortedRecipes = filteredRecipes.sort((a, b) => a.id - b.id);
  }

  console.log('diets:', diets)

  return (
    <div className={styles.container}>
      <div className={styles.filtOrd}>
        <div className={styles.order}>
          <div style={{ marginRight: '5px', marginLeft: '15px' }}>
            Order by Healthscore:
          </div>
          <select style={{height: '20px'}} onChange={(e) => setHsSort(e.target.value)}>
            <option value="None">None</option>
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
        </div>
        <div className={styles.filter}>
          <div style={{marginRight: '5px', fontSize: '10pt'}}>
          Filter by Diets:
          </div>
            <select style={{marginRight: '35px'}} multiple onChange={(e) => setSelectedDiets([...e.target.selectedOptions].map(option => option.value))}>
              {diets.map(diet => <option key={diet.id} value={diet.name}>{diet.name}</option>)}
            </select>
        </div>
      </div>
      <div className={styles.cards}>
        {isLoading ? (
          <Loading />
        ) : sortedRecipes.slice(firstPostIndex, lastPostIndex).length === 0 ? (
          <div className={styles.notfound}>
            <img src={notfound} alt="" />
            No recipes found
          </div>
        ) : (
          sortedRecipes.slice(firstPostIndex, lastPostIndex).map((recipe) => (
            <Card
              id={recipe.id}
              name={recipe.name}
              healthScore={recipe.healthScore}
              image={recipe.image}
              diets={recipe.diets}
            />
          ))
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <button
          className={styles.btn}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <div style={{ display: 'flex' }}>
          {totalPagesArray.map((page) => (
            <button
              onClick={() => setCurrentPage(page)}
              className={`${styles.pages} ${currentPage === page ? styles.active : ''}`}
            >
              {page}
            </button>
          ))}

        </div>
        <button
          className={styles.btn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
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
    getRecipes: (name) => dispatch(getRecipes(name)),
    getDiets: () => dispatch(getDiets())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);