import Landing from './components/Landing';
import Home from './components/Home';

import { Route } from 'react-router-dom';
import './App.css';
const App = () => {
  return (
     <div>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path='/home'>
            <Home />
          </Route>
     </div>
  );
 };

export default App;
