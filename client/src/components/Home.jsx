import React from 'react';
import { Link } from 'react-router-dom';

  function Home() {
    return (
      <div className="container">
        <p>Visit the <Link to="/products">products</Link> page to buy the product.</p>
      </div>
    );
  }

  export default Home;
