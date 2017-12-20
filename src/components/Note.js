import React from 'react'

const Note = (props) => {
  return <div className="cards__item">
    <div className="card">
      <div className="card__content">
        <div className="card__title">Flex</div>
        <p className="card__text">This is the shorthand for flex-grow, flex-shrink and flex-basis combined. The second and third parameters (flex-shrink and flex-basis) are optional. Default is 0 1 auto. </p>
      </div>
    </div>
  </div>
}

export default Note
