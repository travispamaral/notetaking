import React, { Component } from 'react';

class NotesList extends Component {

  render() {
    console.log(this.props)
    return (
      <div className={"note-card " + (this.props.noteHighlight === true ? 'active' : '')} onClick={() => this.props.handleClick(this.props.noteId)}>
        <h4>{this.props.noteTitle}</h4>
        <p>{this.props.noteText}</p>
      </div>
    );
  }
}

export default NotesList;
