import React, { Component } from 'react';
import { auth, provider } from '../firebase'

class SignIn extends Component {
  render() {
    return (
      <div className="sign-in-wrapper">
        <a onClick={() => auth.signInWithPopup(provider)}>Login</a>
      </div>
    );
  }
}

export default SignIn;
