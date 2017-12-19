import React, { Component } from 'react';

class NotesList extends Component {

  render() {
    return (
      <div className={"note-card " + (this.props.noteHighlight === true ? 'active' : '')} onClick={() => this.props.handleClick(this.props.noteId)}>
        <h4>{this.props.noteTitle}</h4>
      </div>
    );
  }
}

export default NotesList;
