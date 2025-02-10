import React, { Component } from "react";
import http from "../http-common";

import AddTutorial from "./add-tutorial.component.js"
import TutorialList from "./tutorial-list.component.js"

export default class TutorialViewer extends Component {
    constructor(props) {
        super(props);
        this.onAddTutorial = this.onAddTutorial.bind(this);
        this.onDeleteTutorial = this.onDeleteTutorial.bind(this);
        this.state = {
            tutorials: []
        };
    }

    componentDidMount() {
        this.retrieveTutorials();
    }

    refreshList() {
        this.retrieveTutorials();
    }

    retrieveTutorials() {
        http.get(`/tutorials`)
          .then(response => {
            this.setState({
                tutorials: response.data
            })
            console.log("Retrieved tutorials and set state: ", response.data);
        });
    }

    onAddTutorial(title, description, published) {
        var data = {
          title: title,
          description: description,
          published: published
        }

        http.post(`/tutorials`, data)
          .then(response => {
            this.refreshList();
          }).catch(e => {
            console.log(e);
          });
    }

    onDeleteTutorial(row) {
        console.log("Want component to delete:", row)
        try {
            http.delete(`/tutorials/${row}`).then(response => {
                console.log("Delete response:", response);
                this.refreshList();
            });
        } catch (error) {
            console.error(error);
        }
    }

  render() {
    return (
      <div>
          <AddTutorial onAddTutorial={this.onAddTutorial}/>
          <TutorialList tutorials={this.state.tutorials} deleteRow={this.onDeleteTutorial}/>
      </div>
    );
  }
}
