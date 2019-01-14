import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class index extends Component {
  render() {
    return (
      <div>
        <h1>Alesta</h1>
        <h2>Page d'accueil</h2>
        <p>1 - Best sellers</p>
        <p>2 - Tout voir</p>
        <Link to='/activities'>
          <p>
            Activités
          </p>
        </Link>
      </div>
    );
  }
}
