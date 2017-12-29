import React from 'react'
import { Link } from 'react-router-dom'

const Note = (props) => {
  // Parse saved data into JSON
  const contentObj = JSON.parse(props.noteContent)
  // Get just first text block from parse JSON
  const noteText = contentObj.blocks[0].text.length > 50
    ? contentObj.blocks[0].text.substring(0, 50) + '...' // If greater than 50 char cut off and append ...
    : contentObj.blocks[0].text + '...' // If not show entire message and append ...

  return <div className="cards__item">
    <div className="card">
      <div className="card__content">
        <div className={"card__delete " + (props.deleteId === props.noteId ? '--show' : '')}>
          <span onClick={() => props.deleteNote(props.noteId)}>
            <i className="far fa-trash-alt"></i> Delete note
          </span>
          <span onClick={() => props.showDelete(props.noteId)}>
            Cancel
          </span>
        </div>
        <span className="card__date">{props.noteDate}</span>
        <div className="card__title">
          <Link to={`/note/${props.noteId}`} id={props.noteId} >
            {props.noteTitle}
          </Link>
        </div>
        <p className="card__text">
          {noteText}
        </p>
        <span onClick={() => props.showDelete(props.noteId)}><i className="far fa-trash-alt"></i></span>
      </div>
    </div>
  </div>
}

export default Note
