import React, { useState, useEffect } from "react";
import http from "../http-common";

import AddTutorial from "./add-tutorial.component.js"
import TutorialList from "./tutorial-list.component.js"

function TutorialViewer () {
    const [tutorials, setTutorials] = useState([]);

    useEffect(() => {
      retrieveTutorials();
    }, []);

    const retrieveTutorials = () => {
        http.get(`/tutorials`)
          .then(response => {
            setTutorials(response.data);
            console.log("Retrieved tutorials and set state: ", response.data);
        });
    }

    const refreshList = () => {
        retrieveTutorials();
    }

    const onAddTutorial = async (title, description, published) => {
        var data = {
          title: title,
          description: description,
          published: published
        }

        http.post(`/tutorials`, data)
          .then(response => {
            refreshList();
          }).catch(e => {
            console.log(e);
          });
    }

    const onDeleteTutorial = async (row) => {
        console.log("Want component to delete:", row)
        try {
            http.delete(`/tutorials/${row}`).then(response => {
                console.log("Delete response:", response);
                refreshList();
            });
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div>
        <AddTutorial onAddTutorial={onAddTutorial}/>
        <TutorialList tutorials={tutorials} deleteRow={onDeleteTutorial}/>
    </div>
  );
}

export default TutorialViewer;

