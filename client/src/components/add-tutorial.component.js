import React, {Component} from "react";
import http from "../http-common";
import styles from "../styles.module.css"

export default class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onAddTutorialClick = this.onAddTutorialClick.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onAddTutorialClick() {
    this.props.onAddTutorial(this.state.title, this.state.description, this.state.published)
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Add tutorial!</h2>
          <div className={styles.tutorial_inputs}>
            <div className={styles.column}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>
            <div className={styles.column}>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>
            <div className={styles.column}>
              <label htmlFor="published">Published</label>
              <input
                type="text"
                id="published"
                name="published"
              />
            </div>
          </div>
          <div className={styles.submit_div}>
            <button onClick={this.onAddTutorialClick} className={styles.button}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
