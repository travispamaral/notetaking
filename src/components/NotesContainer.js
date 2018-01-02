import React, { Component } from 'react'
import { database } from '../firebase'
import Select from 'react-select'

import { EditorState, convertToRaw, convertFromRaw, RichUtils } from 'draft-js'

import Editor from 'draft-js-plugins-editor'
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons'

import '../../node_modules/draft-js-static-toolbar-plugin/lib/plugin.css'
import 'react-select/dist/react-select.css'

const staticToolbarPlugin = createToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ]
})
const { Toolbar } = staticToolbarPlugin
const plugins = [staticToolbarPlugin]

class NotesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noteTitle: '',
      selectedOption: '',
      removeSelected: true,
      stayOpen: false,
      value: [],
      tags: []

    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.onEditorChange = this.onEditorChange.bind(this)
  }

  componentDidMount() {
    const noteId = this.props.match.params.noteId 
    database.ref().child(this.props.user.uid).child(noteId).on('value', (snap => {
      const content = EditorState.createWithContent(convertFromRaw(JSON.parse(snap.val().content)))
      this.setState({
        noteTitle: snap.val().title,
        editorState: content,
        tags: snap.val().tags,
        value: snap.val().tags
      })
    }))
    database.ref('/tags').once('value').then((snapshot) => {
      // console.log(snapshot)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.noteId !== nextProps.match.params.noteId) {
      const noteId = nextProps.match.params.noteId
      database.ref().child(nextProps.user.uid).child(noteId).on('value', (snap => {
        const content = EditorState.createWithContent(convertFromRaw(JSON.parse(snap.val().content)))
        this.setState({
          noteTitle: snap.val().title,
          editorState: content
        })
      }))
    }
  }

  onChangeTitle(e) {
    database.ref().child(this.props.user.uid).child(this.props.match.params.noteId).update({
      title: e.target.value
    })
    this.setState({
      noteTitle: e.target.value
    })
  }

  onEditorChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveNote(contentState);
    this.setState({
      editorState
    })
  }

  saveNote() {
    const content = this.state.editorState.getCurrentContent()
    database.ref().child(this.props.user.uid).child(this.props.match.params.noteId).update({
      content: JSON.stringify(convertToRaw(content))
    })
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onEditorChange(newState)
      return 'handled';
    }
    return 'not-handled';
  }

  handleSelectChange(value) {
    this.setState({ value: value })
    database.ref().child(this.props.user.uid).child(this.props.match.params.noteId).update({
      tags: value
    })

  }

  toggleSidebar() {
    const app = document.querySelector('.App')
    app.classList.toggle('wide')
  }

  render() {
    const { stayOpen, value } = this.state
    const options = [
      { label: 'Chocolate', value: 'chocolate' },
      { label: 'Vanilla', value: 'vanilla' },
      { label: 'Strawberry', value: 'strawberry' },
      { label: 'Caramel', value: 'caramel' },
      { label: 'Cookies and Cream', value: 'cookiescream' },
      { label: 'Peppermint', value: 'peppermint' },
    ]
    

    if (!this.state.editorState) {
      return (
        <h3 className="loading">Loading...</h3>
      );
    }

    return (
      <div className="notes-container">
        <span className="expand-icon" onClick={this.toggleSidebar.bind(this)}></span>
        <div className="tags-container">
          <Select.Creatable
            multi
            searchable
            placeholder="Tags"
            options={options}
            value={value}
            onChange={this.handleSelectChange}
            closeOnSelect={stayOpen}
            removeSelected={this.state.removeSelected}
          />
        </div>
        <div className="note">
          <Toolbar />
          <input
            autoFocus  
            type="text"
            className="note-title"
            placeholder="Untitled"
            value={this.state.noteTitle}
            onChange={this.onChangeTitle.bind(this)}
          />

          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            plugins={plugins}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="Start your note..."
          />
        </div>
      </div>
    )
  }
}

export default NotesContainer;
