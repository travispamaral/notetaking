import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'
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
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
  }

  componentDidMount() {
    const noteId = this.props.match.params.noteId
    firebase.database().ref().child(noteId).on('value', (snap => {
      const content = EditorState.createWithContent(convertFromRaw(JSON.parse(snap.val().content)))
      this.setState({
        noteTitle: snap.val().Title,
        editorState: content
      })
    }))
  }

  onChangeTitle(e) {
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
    firebase.database().ref().child(this.props.match.params.noteId).update({
      Title: this.state.noteTitle,
      content: JSON.stringify(convertToRaw(content))
    })
  }

  deleteNote() {
    firebase.database().ref().child(this.props.note.id).remove()
      .then(() => console.log('deleted'))
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onEditorChange(newState)
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    if (!this.state.editorState) {
      return (
        <h3 className="loading">Loading...</h3>
      );
    }
    return (
      <div className="notes-container">
        <Link to="/">Back to notes</Link>
        <button className="delete" onClick={this.deleteNote.bind(this)}>Delete</button>
        <div className="note">
          <Toolbar />
          <input type="text"
            value={this.state.noteTitle}
            onChange={this.onChangeTitle.bind(this)}
          />

          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            plugins={plugins}
            handleKeyCommand={this.handleKeyCommand}
          />
        </div>
      </div>
    )
  }
}

export default NotesContainer;
