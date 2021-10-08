import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/actions/auth';
import { updateUser } from '../../store/actions/user';

function Login() {
  // state
  const loggedIn = useSelector(state => state.auth.loggedIn);
  const dispatch = useDispatch();
  const [ loginFailed, setLoginFailed ] = useState(false);
  const history = useHistory();

  if (loggedIn) {
    history.push('/profile');
  }

  // refs
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();

  // handlers
  const handleChange = async (e) => {
    e.preventDefault();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });

      console.log(JSON.stringify(response));
      const data = response.data;
      if (data.statusCode === 200) {
        dispatch(login({
          loggedIn: true,
          token: data.token.token,
          username: data.token.userId,
          activeUntil: data.token.activeUntil,
        }));

        // read the user by userId for local storage
        const userResponse = await axios.get(`/api/users/${data.token.userId}`);
        const userData = userResponse.data;
        if (userData.statusCode === 200) {
          dispatch(updateUser({
            user: userData.user,
          }));
        } else {
          setLoginFailed(true);
        }
      } else {
        setLoginFailed(true);
      }
    } catch (e) { // handle if login fails (due to network, or server issues)
      setLoginFailed(true);
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form method="post">
        <label>Username</label>
        <input type="text" name="username" id="username" className="form-control" onChange={handleChange} ref={usernameRef} />
        <label>Password</label>
        <input type="password" name="password" id="password" className="form-control" onChange={handleChange} ref={passwordRef} /><br />
        <input type="submit" value="Login" onClick={handleSubmit} className="btn btn-default" />
        <br />
        <br />
        {loginFailed && <div className="alert alert-danger">Login failed.</div>}
      </form>
    </div>
  );
}

export default Login;
