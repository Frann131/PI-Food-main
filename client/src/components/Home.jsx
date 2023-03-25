import React, { useEffect } from "react";
import { connect } from "react-redux";
import { clearRecipes } from "../redux/actions.js";
import Cards from "./Cards";

function Home({ clearRecipes }) {
  useEffect(() => {
    clearRecipes(); // limpiar el estado de recetas
  }, [clearRecipes, ]);
  

  return (
    <div>
      <Cards />
    </div>
  );
}

const mapDispatchToProps = {
  clearRecipes,
};

export default connect(null, mapDispatchToProps)(Home);
