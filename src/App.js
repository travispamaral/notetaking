import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { auth, provider } from './firebase'

import Sidebar from './components/Sidebar'
import NotesList from './components/NotesList'
import NotesContainer from './components/NotesContainer';

import './App.css'

const Welcome = () => <h1>Welcome, choose a note to edit</h1>

const ToDos = () => <h1>TODOs!</h1>

class AppLayout extends Component {

  constructor() {
    super()
    this.state = {
      currentUser: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({ currentUser })
    })
  }

  render() {
    return (
      this.state.currentUser ?
      <div className={"App " + this.props.location} >
        <Sidebar user={this.state.currentUser} />
        <NotesList user={this.state.currentUser} />
        <div className="main-wrapper">
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path='/note/:noteId' render={(props) => (
              <NotesContainer {...props} user={this.state.currentUser} />
            )} />  
            <Route path="/todo" component={ToDos} />
          </Switch>
        </div>
      </div> : <div className="App">
        <div className="logged-out-message">
          <h1>You must login</h1>
          <button className="primary" onClick={() => auth.signInWithPopup(provider)}>Login</button>
        </div>
      </div>
    )
  }
}

const App = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
)

export default App
