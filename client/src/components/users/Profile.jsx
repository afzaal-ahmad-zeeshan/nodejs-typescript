import React from 'react';

// redux
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Profile() {
  // state
  const state = useSelector(_state => _state.user);

  if (!state.user) {
    return <div className="container">
        <p>User was not found. <Link to="/login">Login</Link> again.</p>
      </div>
  }

  return (
    <div className="container">
      <p><b>Username</b>: {state.user.username}</p>
      <p><b>Deposit</b>: {state.user.deposit}</p>
      <p><b>Roles</b>: {state.user.roles.map(role => {
        return role === 'ROLES:BUYER' ? 'Buyer' : 'Seller'
      }).join(',')}</p>
    </div>
  );
}

export default Profile;
