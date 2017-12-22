import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import NotesList from './components/NotesList'
import NotesContainer from './components/NotesContainer';

import './App.css'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path='/' component={NotesList} />
            <Route path='/note/:noteId' component={NotesContainer} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
