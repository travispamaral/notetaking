import React from 'react';
import { auth } from '../firebase'

const CurrentUser = ({ user }) => {
  if (user) {
    return (
      <div className="current-user">
        <img src={user.photoURL} alt={`${user.displayName}`} />
        <div className="message">
          <div className="username">{user.displayName}</div>
          <a onClick={() => auth.signOut()}>Sign Out</a>
        </div>
      </div>
    )
  } else {
    return null
  }  
}

export default CurrentUser
