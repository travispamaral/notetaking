import React, { Component } from 'react'
import * as firebase from 'firebase'

class App extends Component {
  constructor() {
    super()
    this.state = {
      comment: '',
      notes: []
    }
  }

  componentDidMount() {
    const database = firebase.database().ref()
    database.on('value', snap => {
      this.setState({
        notes: snap.val()
      })
    })
  }

  handleChange(e) {
    this.setState({ comment: e.target.value });
  }

  handleClick(postId, e) {
    console.log(this.state.comment);
  }

  render() {
    return (
      <div className="App">
        {this.state.comment}
        <input
          type="text"
          value={this.state.comment}
          onChange={this.handleChange.bind(this)}
          placeholder="Write a comment..." />

        <button
          className="button comments"
          onClick={this.handleClick.bind(this)}>Button</button>
      </div >
    );
  }
}

export default App;
