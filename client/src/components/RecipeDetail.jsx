import React, { useState, useEffect } from 'react';
import { getRecipesById } from '../redux/actions.js';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from '../cssModuleStyles/RecipeDetail.module.css'

function RecipeDetail(props) {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const id = props.match.params.id;
    console.log(id)
    props.getRecipesById(id).then((data) => {
      setRecipe(data.payload);
      console.log('data:', data.payload)
    });
  }, [props.match.params.id]);

  if (!recipe) {
    return <div>Cargando...</div>;
  }

  function removeTags(text) {
    text = text.toString();
    text = text.replace(/(<([^>]+)>)/gi, '')
    return text
  }
  const resume = removeTags(recipe.resume)
  const capitalDiets = recipe.diets.map((diet) => {
    return diet.charAt(0).toUpperCase() + diet.slice(1)
  })

  const healthScore = recipe.healthScore;
  const healthScoreColor = `hsl(${120 * healthScore / 100}, 100%, 50%)`

  return (
    <div className={styles.container}>
      <div className={styles.recipeDetail}>
        <h2>{recipe.name}</h2>
        <div className={styles.image}>
          <img src={recipe.image} alt={recipe.name} />
        </div>
        <div className={styles.cirContainer}>
          <div className={styles.circular} style={{ '--healthScore-color': healthScoreColor }}>
            <p className={styles.score}>{healthScore}</p>
          </div>
        </div>

        <p>{resume}</p>

        <div>
          Steps to follow to make the recipe:
          <ol>
            {recipe.steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </div>
        <div>
          This recipe is:
          <ul>
            {capitalDiets.map((diet) => (
              <li>{diet}</li>
            ))}
          </ul>
        </div>
        <p style={{ fontSize: '12px' }}>ID: {recipe.id}</p>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  getRecipesById,
};

export default withRouter(connect(null, mapDispatchToProps)(RecipeDetail));
