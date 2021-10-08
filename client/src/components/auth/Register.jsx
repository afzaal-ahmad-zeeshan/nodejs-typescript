import React, { useState } from 'react';

function Register() {
  // state
  const [ formValid, setFormValid ] = useState(false);

  // refs
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const cPasswordRef = React.createRef();
  const buyerRef = React.createRef();
  const sellerRef = React.createRef();

  // handlers
  const handleChange = async (e) => {
    e.preventDefault();

    setFormValid(
      (usernameRef.current.value && usernameRef.current.value.length > 0) &&  // username has a value
      (passwordRef.current.value && passwordRef.current.value.length > 5) &&  // password at least 5 characters long
      (cPasswordRef.current.value === passwordRef.current.value) &&           // passwords match
      (buyerRef.current.checked || sellerRef.current.checked)                 // at least one role checked
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form method="post">
        <label>Username</label>
        <input type="text" name="username" id="username" className="form-control" onChange={handleChange} ref={usernameRef} />
        <label>Password</label>
        <input type="text" name="username" id="username" className="form-control" onChange={handleChange} ref={passwordRef} />
        <label>Confirm Password</label>
        <input type="text" name="username" id="username" className="form-control" onChange={handleChange} ref={cPasswordRef} />
        <label>Roles</label><br />
        <label htmlFor="buyerRole">
          <input type="checkbox" name="buyerRole" id="buyerRole" className="" ref={buyerRef} onChange={handleChange} /> Buyer
        </label><br />
        <label htmlFor="sellerRole">
          <input type="checkbox" name="sellerRole" id="sellerRole" className="" ref={sellerRef} onChange={handleChange} /> Seller
        </label><br />
        <input type="submit" value="Register" disabled={!formValid} onClick={handleSubmit} className="btn btn-default" />
      </form>
    </div>
  );
}

export default Register;
