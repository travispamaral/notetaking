import React, { Component } from 'react'
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
      editorState: EditorState.createEmpty()
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
  }

  componentWillReceiveProps(props) {
    const content = props.note.content !== '' ? EditorState.createWithContent(convertFromRaw(JSON.parse(props.note.content))) : EditorState.createWithContent(ContentState.createFromText('Start typing note...'))
    this.setState({
      editorState: content,
      noteTitle: props.note.Title !== '' ? props.note.Title : 'Title your Note',
    })
  }

  onChangeTitle(e) {
    this.setState({
      noteTitle: e.target.value
    })
  }

  onEditorChange = (editorState) => {
    // const contentState = editorState.getCurrentContent();
    // this.saveNote(contentState);
    this.setState({
      editorState,
    });
  }

  saveNote() {
    const content = this.state.editorState.getCurrentContent()
    firebase.database().ref().child(this.props.note.id).update({
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
    return (
      <div className="notes-container">
        <button className="primary" onClick={this.saveNote.bind(this)}>Save</button>
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
