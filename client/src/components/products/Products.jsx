import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Products() {
  const [ items, setItems ] = useState(null);
  const [ error, setError ] = useState(null);

  // load products
  useEffect(() => {
    axios.get('/api/products').then(response => {
      console.log(JSON.stringify(response));
      if (response.data.statusCode === 200) {
        setItems(response.data.products);
      }
    }).catch(error => {
      setError(true);
    })
  }, []);

  if (!items) {
    return <>
      <div className="container">
        <p>Loading products...</p>
      </div>
    </>;
  }

  return (
    <div className="container">
      {error && <div className="alert alert-danger"></div>}
      {items.map(item => {
        return <div className="card">
          <div className="card-body">
            <p className="card-title">Title: {item.productName}</p>
            <p>Seller ID: {item.sellerId}</p>
            <p>Cost: {item.cost} &mdash; {item.amountAvailable} available.</p>
            <Link to={`/product/${item.id}`}>Buy</Link>
          </div>
        </div>
      })}
    </div>
  );
}

export default Products;
