import React from 'react'
import { Link } from 'react-router-dom'

const Note = (props) => {
  const contentObj = JSON.parse(props.noteContent)
  const noteText = contentObj.blocks[0].text
  return <div className="cards__item">
    <div className="card">
      <div className="card__content">
        <div className="card__title">
          <Link to={`/note/${props.noteId}`}>
            {props.noteTitle}
          </Link>
        </div>
        <p className="card__text">{noteText}</p>
      </div>
    </div>
  </div>
}

export default Note
