import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

import { useSelector, useDispatch } from 'react-redux';

function Product() {
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const [ item, setItem ] = useState(null);
  const [ error, setError ] = useState(null);
  const { productId } = useParams();

  // load products
  useEffect(() => {
    axios.get(`/api/products/${productId}`).then(response => {
      console.log(JSON.stringify(response));
      if (response.data.statusCode === 200) {
        setItem(response.data.product);
      }
    }).catch(error => {
      setError(true);
    })
  }, []);

  if (!item) {
    return <>
      <div className="container">
        <p>Loading product...</p>
      </div>
    </>;
  }

  return (
    <div className="container">
      {error && <div className="alert alert-danger"></div>}
      <h2>{item.productName}</h2>
      <p>SellerID: {item.sellerId}</p>
      <p>Cost: {item.cost} units</p>
      <p>{item.amountAvailable} items available.</p>

      <hr />
      {auth.loggedIn && <div>
          <form method="post">
            <label htmlFor="quantity">How many to buy?</label>
            <input type="number" className="form-control" name="quantity" id="quantity" />
            {user && <small>You have {"" + user.user.deposit} units available.</small>}
            <br />
            <input type="submit" className="btn btn-default" disabled={user.user.deposit <= item.cost} />
          </form>
        </div>}
    </div>
  );
}

export default Product;
