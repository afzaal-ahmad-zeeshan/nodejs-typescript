import axios from 'axios';
import React, { useState } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUser } from '../../store/actions/user';

function Deposit() {
  // state
  const auth = useSelector(state => state.auth);
  const state = useSelector(state => state.user);
  const [problem, setProblem] = useState(null);
  const [response, setResponse] = useState(null);
  const dispatch = useDispatch();

  // refs
  const quantityRef = React.createRef();

  const deposit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/deposit', {
        deposit: quantityRef.current.value,
      }, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.data.statusCode === 200) {
        const userResponse = await axios.get(`/api/users/${state.user.id}`);
        if (userResponse.data.statusCode === 200) {
          dispatch(updateUser({
            user: userResponse.data.user,
          }));
        }
      }
    } catch (e) {
      setProblem('Cannot deposit the amount right now.');
    }
  }

  if (!state.user) {
    return <div className="container">
      <p>User was not found. <Link to="/login">Login</Link> again.</p>
    </div>
  }

  return (
    <div className="container">
      {/* {JSON.stringify(state)} */}
      <p><b>Username</b>: {state.user.username}</p>
      <p><b>Deposit</b>: {state.user.deposit}</p>
      <hr />
      {problem && <div className="alert alert-danger">{problem}</div>}
      <form method="post">
        <label htmlFor="quantity">
          Quantity
        </label>
        <input type="number" id="quantity" name="quantity" className="form-control" ref={quantityRef} /><br />
        <input type="submit" value="Deposit" className="btn btn-default" onClick={deposit} />
      </form>
    </div>
  );
}

export default Deposit;