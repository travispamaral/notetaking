import React, { Component } from 'react'
import { ContentState, convertToRaw } from 'draft-js'
import { auth, database } from '../firebase'

import SignIn from './SignIn'
import CurrentUser from './CurrentUser'
import SearchBar from './SearchBar'
import Note from './NoteCard'

class NotesList extends Component {
  constructor() {
    super()
    this.state = {
      notes: [],
      currentUser: null,
      showDelete: '',
      search: ''
    }
    this.toggleDelete = this.toggleDelete.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({ currentUser })
    })
    database.ref().on('value', snap => {
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
    database.ref().push({
      title: '',
      content: JSON.stringify(convertToRaw(content)),
      date
    }).then((newNote) => {
      this.props.history.push(`/note/${newNote.key}`)
    })
  }

  toggleDelete(noteId) {
    this.setState({
      showDelete: this.state.showDelete === null ? noteId : null
    })
  }

  deleteNote(noteId) {
    database.ref().child(noteId).remove()

  }
  
  render() {
    const { currentUser, search } = this.state
    const notes = this.state.notes.filter(note => note.title.toLowerCase().indexOf(search) !== -1 || note.content.toLowerCase().indexOf(search) !== -1)

    return (
      <div className="App">
        <div className="sidebar"></div>
        <div className="main-wrapper">
          <div className="header">
            <SearchBar search={this.search}/>
            <div className="user-wrapper">
              {
                currentUser
                  ? <CurrentUser user={currentUser} />
                  : <SignIn />
              }
            </div>  
          </div>
          {
            currentUser
              ?
              <div className="cards-wrapper">
                <div className="cards-header">
                  <span onClick={this.createNote.bind(this)}>
                    <i className="fas fa-plus"></i> Add new note
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
              :
              <div className="welcome-message">
                <h1>Welcome to Note-taking. <br/>To get started login with you Gmail account.</h1>
              </div>
          } 
        </div>
      </div>
    )
  }
}

export default NotesList;
