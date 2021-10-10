import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { useSelector, useDispatch } from 'react-redux';
import { updateDeposit } from '../../store/actions/user';

function Product() {
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const [ item, setItem ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ message, setMessage ] = useState(null);
  const { productId } = useParams();
  const dispatch = useDispatch();

  // refs
  const quantityRef = React.createRef();

  // load products
  useEffect(() => {
    axios.get(`/api/products/${productId}`).then(response => {
      console.log(JSON.stringify(response));
      if (response.data.statusCode === 200) {
        setItem(response.data.product);
      }
    }).catch(_error => {
      setError(true);
    })
  }, []);

  const buy = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/products/buy', {
        productId: productId,
        amount: quantityRef.current.value,
      }, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (response.data.statusCode === 200) {
        const receipt = response.data.receipt;
        console.log(JSON.stringify(response.data));
        setItem(receipt.product);
        setMessage(`You bought the product with ${receipt.cost * receipt.amount} units.`);
        dispatch(updateDeposit({
          deposit: receipt.change,
        }));
      } else {
        setError(response.data.message);
      }
    } catch (_e) {
      setError('Cannot buy the product right now.');
    }
  }

  if (!item) {
    return <>
      <div className="container">
        <p>Loading product...</p>
      </div>
    </>;
  }

  return (
    <div className="container">
      <h2>{item.productName}</h2>
      <p>SellerID: {item.sellerId}</p>
      <p>Cost: {item.cost} units</p>
      <p>{item.amountAvailable} items available.</p>

      <hr />
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {auth.loggedIn && <div>
          <form method="post">
            <label htmlFor="quantity">How many to buy?</label>
            <input type="number" className="form-control" name="quantity" id="quantity" ref={quantityRef} />
            {user && <small>You have {"" + user.user.deposit} units available.</small>}
            <br />
            <input type="submit" className="btn btn-default" disabled={user.user.deposit < item.cost} onClick={buy} />
          </form>
        </div>}
    </div>
  );
}

export default Product;
