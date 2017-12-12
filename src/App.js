import React, { Component } from 'react'
import * as firebase from 'firebase'

import NotesList from './components/NotesList'
import NotesContainer from './components/NotesContainer'

class App extends Component {
  constructor() {
    super()
    this.state = {
      notes: [],
      activeNote: ''
    }
    this.handleClick = this.handleClick.bind(this)

  }

  componentDidMount() {
    firebase.database().ref().on('value', snap => {
      const notesData = snap.val()
      const data = []
      for (let key in notesData) {
        notesData[key].id = key
        data.push(notesData[key])
      }
      this.setState({
        notes: data,
        activeNote: data[0]
      })
    })
  }

  handleClick(noteId) {
    const activeNote = this.state.notes.find((note) => { return note.id === noteId })
    console.log(activeNote)
    this.setState({
      activeNote
    })
  }

  render() {
    return (
      <div className="App">
        <div className="notes-list">
          {
            this.state.notes.map((note) => {
              return (
                <NotesList key={note.id} noteId={note.id} noteTitle={note.Title} noteText={note.Text} noteHighlight={this.state.activeNote.id === note.id ? true : false} handleClick={this.handleClick} />
              )
            })
          }
        </div>
        <NotesContainer note={this.state.activeNote} />
      </div >
    );
  }
}

export default App;
