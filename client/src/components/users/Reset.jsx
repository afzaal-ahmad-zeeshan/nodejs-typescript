import axios from 'axios';
import React, { useState } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateDeposit } from '../../store/actions/user';

function Reset() {
  // state
  const [ problem, setProblem ] = useState(null);
  const auth = useSelector(store => store.auth);
  const state = useSelector(store => store.user);
  const dispatch = useDispatch();

  if (!state.user) {
    return <div className="container">
        <p>User was not found. <Link to="/login">Login</Link> again.</p>
      </div>
  }

  const reset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/reset', {}, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.data.statusCode === 200) {
        console.log(JSON.stringify(response.data));
        dispatch(updateDeposit({
          deposit: response.data.deposit,
        }));
      } else {
        setProblem(response.data.message);
      }
    } catch (e) {
      setProblem('Could not reset the deposit.');
    }
  }

  return (
    <div className="container">
      {/* {JSON.stringify(state)} */}
      <p><b>Username</b>: {state.user.username}</p>
      <p><b>Current deposit</b>: {"" + state.user.deposit} units</p>
      {problem && <div className="alert alert-danger">{problem}</div>}
      <input type="submit" className="btn btn-danger" value="Reset deposit (to zero)" onClick={reset} />
    </div>
  );
}

export default Reset;
