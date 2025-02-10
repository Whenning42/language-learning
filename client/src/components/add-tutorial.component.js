import React, {useState}  from "react";
import styles from "../styles.module.css"

function AddTutorial (props) {
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);

  const onChangeTitle = async (e) => {
    setTitle(e.target.value);
  }

  const onChangeDescription = async (e) => {
    setDescription(e.target.value);
  }

  const onAddTutorialClick = async () => {
    props.onAddTutorial(title, description, false);
  }

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
              value={title}
              onChange={onChangeTitle}
              name="title"
            />
          </div>
          <div className={styles.column}>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              required
              value={description}
              onChange={onChangeDescription}
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
          <button onClick={onAddTutorialClick} className={styles.button}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTutorial;
