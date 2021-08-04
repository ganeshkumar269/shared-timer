import React from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from './Timer/Timer'
import { Switch, Route, Redirect, BrowserRouter} from 'react-router-dom'
import MainContainer from './MainContainer/MainContainer';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Switch>
            <Route exact path="/">
              <Redirect to="/timer" />
            </Route>
            <Route path="/timer/:timerId" component={Timer}/>
            <Route path="/timer" component={Timer}/>
        </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
