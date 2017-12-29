import React from 'react'

const SearchBar = (props) => {
  return <div className="search">
    <i className="fas fa-search"></i>  
    <input 
      type="text"
      placeholder="Search..."
      onChange={props.search}
    />
  </div>
}

export default SearchBar
