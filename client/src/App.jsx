import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

// redux
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "./store/actions/auth";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Home from './components/Home';

import Profile from './components/users/Profile';

import Products from './components/products/Products';
import Product from "./components/products/Product";
import Deposit from "./components/users/Deposit";
import Reset from "./components/users/Reset";

function App() {
  // state
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">Express + TypeScript</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            {auth.loggedIn && <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => dispatch(logout())}>Logout</button>
              </li>
            </>}
            {!auth.loggedIn && <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>}
          </ul>
        </div>
      </nav>
      <div className={''}>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>

            {/* auth */}
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>

            {/* user */}
            <Route path="/profile" exact>
              <Profile />
            </Route>
            <Route path="/deposit" exact>
              <Deposit />
            </Route>
            <Route path="/reset" exact>
              <Reset />
            </Route>

            {/* product */}
            <Route path="/products" exact>
              <Products />
            </Route>
            <Route path="/product/:productId" exact>
              <Product />
            </Route>
          </Switch>
        </div>
        <hr />
        <footer className="container py-5">
          <div className="row">
            <div className="col-12 col-md">
              <small className="d-block mb-3 text-muted">© {new Date(Date.now()).getFullYear()} - Express + TypeScript</small>
            </div>
            <div className="col-6 col-md">
              <h5>Resources</h5>
              <ul className="list-unstyled text-small">
                <li><a className="text-muted" href="https://github.com/afzaal-ahmad-zeeshan/nodejs-typescript">GitHub repository</a></li>
                {process.env.NODE_ENV === 'development' && <li><a className="text-muted" href="http://localhost:1234/swagger.json" target="_blank" rel="noreferrer">Local API</a></li>}
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>Products</h5>
              <ul className="list-unstyled text-small">
                <li><Link className="text-muted" to="/products">Products</Link></li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>Users</h5>
              <ul className="list-unstyled text-small">
                {!auth.loggedIn && <li><Link className="text-muted" to="/register">Register</Link></li>}
                {!auth.loggedIn && <li><Link className="text-muted" to="/login">Login</Link></li>}
                {auth.loggedIn && <li><Link className="text-muted" to="/deposit">Deposit</Link></li>}
                {auth.loggedIn && <li><Link className="text-muted" to="/reset">Reset</Link></li>}
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
