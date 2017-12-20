import React, { Component } from 'react'
import * as firebase from 'firebase'

import Note from './NoteCard'

class NotesList extends Component {
  constructor() {
    super()
    this.state = {
      notes: [],
      activeNote: '',
      closeSidebar: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.createNote = this.createNote.bind(this)
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

  createNote() {
    firebase.database().ref().push({
      Title: '',
      content: '',
    }).then((newNote) => {
      const activeNote = this.state.notes.find((note) => { return note.id === newNote.key })
      this.setState({
        activeNote,
      })
    })
  }

  render() {
    return (
      <div className="App">
        <div className="cards">
          {
            this.state.notes.map((note) => {
              return (
                <Note key={note.id} noteId={note.id} noteTitle={note.Title} noteContent={note.content} />
              )
            })
          }
        </div>
        {/* <div className={"notes-sidebar " + (this.state.closeSidebar === true ? 'close' : '')}>
          <div className="notes-header">
            <h1>Notes</h1>
            <button className="primary" onClick={this.createNote}>Create a new Note</button>
          </div>
          <div className="notes-list">
            {
              this.state.notes.map((note) => {
                return (
                  <NotesList key={note.id} noteId={note.id} noteTitle={note.Title} noteContent={note.content} noteHighlight={this.state.activeNote.id === note.id ? true : false} handleClick={this.handleClick} />
                )
              })
            }
          </div>
        </div>
        <NotesContainer note={this.state.activeNote} /> */}
      </div>
    )
  }
}

export default NotesList;
