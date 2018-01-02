import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import { ContentState, convertToRaw } from 'draft-js'
import { database } from '../firebase'

import SearchBar from './SearchBar'
import Note from './NoteCard'

class NotesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      showDelete: '',
      search: ''
    }
    this.toggleDelete = this.toggleDelete.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount() {
    database.ref().child(this.props.user.uid).on('value', snap => {
      const notesData = snap.val()
      const data = []
      for (let key in notesData) {
        notesData[key].id = key
        data.push(notesData[key])
      }
      this.setState({
        notes: data
      })
    })
  }

  search(e) {
    this.setState({
      search: e.target.value
    })
  }

  createNote() {
    const plainText = '';
    const content = ContentState.createFromText(plainText)
    const today = new Date();
    const date = 'm/d/Y'
      .replace('d', today.getDate())
      .replace('m', today.getMonth() + 1)
      .replace('Y', today.getFullYear().toString().substr(-2))
    database.ref().child(this.props.user.uid).push({
      title: '',
      content: JSON.stringify(convertToRaw(content)),
      date
    }).then((newNote) => {
      console.log(`/note/${newNote.key}`)
      this.props.history.push(`/note/${newNote.key}`)
    })
  }

  toggleDelete(noteId) {
    this.setState({
      showDelete: this.state.showDelete === null ? noteId : null
    })
  }

  deleteNote(noteId) {
    database.ref().child(this.props.user.uid).child(noteId).remove()
  }
  
  render() {
    const { search } = this.state
    const notes = this.state.notes.filter(note => note.title.toLowerCase().indexOf(search) !== -1 || note.content.toLowerCase().indexOf(search) !== -1)

    return (
      <div className="notes-list">   
        <div className="cards-wrapper">
          <div className="cards-header">
            <span onClick={this.createNote.bind(this)}>
              <i className="fas fa-plus-circle"></i>
            </span>
          </div>
          <div className="cards">
            {
              notes.map((note) => {
                const title = note.title !== '' ? note.title : 'Enter Note';
                const content = note.content !== '' ? note.content : 'Start your note';
                return (
                  <Note
                    key={note.id}
                    noteId={note.id}
                    noteTitle={title}
                    noteContent={content}
                    noteDate={note.date}
                    showDelete={this.toggleDelete}
                    deleteNote={this.deleteNote}
                    deleteId={this.state.showDelete}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(NotesList)
