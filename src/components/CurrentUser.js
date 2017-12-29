import React, { Component } from 'react';
import { auth } from '../firebase'

const CurrentUser = ({ user }) => {
  const firstName = user.displayName.split(' ')[0]
  return (
    <div className="current-user">
      <img src={user.photoURL} />
      <div className="message">
        <div className="username">Hello {firstName}!</div>
        <div className="logout"><a onClick={() => auth.signOut()}>Sign Out</a></div>
      </div>
    </div>
  )
}

export default CurrentUser
