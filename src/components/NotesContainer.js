import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { database } from '../firebase'
import Select from 'react-select'

import { EditorState, ContentState, convertToRaw, convertFromRaw, RichUtils } from 'draft-js'

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
});
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

class NotesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noteTitle: '',
      selectedOption: '',
      removeSelected: true,
      disabled: false,
      crazy: false,
      stayOpen: false,
      value: [],
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentDidMount() {
    const noteId = this.props.match.params.noteId 
    
    database.ref().child(noteId).on('value', (snap => {
      const content = EditorState.createWithContent(convertFromRaw(JSON.parse(snap.val().content)))
      this.setState({
        noteTitle: snap.val().Title,
        editorState: content
      })
    }))
    
  }

  onChangeTitle(e) {
    database.ref().child(this.props.match.params.noteId).update({
      Title: e.target.value
    })
    this.setState({
      noteTitle: e.target.value
    })
  }

  onEditorChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveNote(contentState);
    this.setState({
      editorState,
    });
  }

  saveNote() {
    const content = this.state.editorState.getCurrentContent()
    database.ref().child(this.props.match.params.noteId).update({
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
    database.ref().child(this.props.match.params.noteId).update({
      tags: value
    })
  }

  render() {
    const { crazy, disabled, stayOpen, value } = this.state
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
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to notes
        </Link>
        <div className="tags-container">
          <Select
            closeOnSelect={!stayOpen}
            disabled={disabled}
            multi
            onChange={this.handleSelectChange}
            options={options}
            placeholder="Select your favourite(s)"
            removeSelected={this.state.removeSelected}
            simpleValue
            value={value}
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
