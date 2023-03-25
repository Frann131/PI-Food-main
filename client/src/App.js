import Landing from './components/Landing.jsx';
import Home from './components/Home.jsx';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import Form from './components/Form.jsx';
import Header from './components/Header.jsx';
import Cards from './components/Cards.jsx'
import RecipeDetail from './components/RecipeDetail.jsx';

function App() {
  
  const location = useLocation();
  return (
    <div>
      {location.pathname!=='/' && <Header/>}
      <Switch>
        
        <Route exact path="/"> 
          <Landing />
        </Route>
        
        <Route path="/home">
          <Home />
        </Route>

        <Route exact path="/recipes/new">
          <Form />
        </Route>

        <Route exact path='/recipes/:id'>
          <RecipeDetail />
        </Route>
        
        <Route path='/recipes' >
          <Cards />
        </Route>

     </Switch>
    </div>
  );
 };


export default App;
