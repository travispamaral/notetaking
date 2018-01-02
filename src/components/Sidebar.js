import React from 'react'
import CurrentUser from "./CurrentUser";

const Sidebar = (props) => {
  return <div className="sidebar">
    <div className="logo-container">
      <i className="fas fa-pencil-alt" title="NoteTaking"></i>
    </div>
    <div className="sidebar-functions">
      <span><i className="fas fa-sticky-note" title="Notes"></i></span>
      <span><i className="fas fa-list-ul" title="ToDos"></i></span>
    </div>
    <div className="current-user">
      <CurrentUser user={props.user} />
    </div>
  </div>
}
export default Sidebar
