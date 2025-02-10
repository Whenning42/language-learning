import React, { Component } from "react";
import http from "../http-common";
import styles from "../styles.module.css"

export default class TutorialsList extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const table_rows = this.props.tutorials.map(tutorial => {
      return <tr key={tutorial["id"]}>
        <td>{tutorial["id"]}</td>
        <td>{tutorial["title"]}</td>
        <td>{tutorial["description"]}</td>
        <td>{tutorial["published"]}</td>
        <td><button onClick={() => this.props.deleteRow(tutorial["id"])}>Delete</button></td>
      </tr>
    });

    return (
      <div>
        <h2>Tutorial List</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Published</th>
              <th>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {table_rows}
          </tbody>
        </table>
      </div>
    )
  }
};
