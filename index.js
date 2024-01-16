import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Add your Firebase Real Time Database config details here!!
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

// Stores the username of the user after signing in with Google Auth
let userName;

// Allow the user to login using Google Auth
const googleLogin = document.getElementById("google-login-btn");

googleLogin.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

function updateUserProfile(user) {
  const displayName = user.displayName;
  const userEmail = user.email;
  // The username is derived from the user's gmail
  userName = userEmail.split("@")[0];

  // Make the "Welcome" message include the user's name
  document.getElementById("displayName").textContent = " " + displayName;

  let reference = ref(db, "users/" + userName);

  get(reference).then((snapshot) => {
    // Initialize nodes in the DB if the user is a first time user
    if (!snapshot.exists()) {
      const taskData = {
        do: ["Dummy Node"],
        delegate: ["Dummy Node"],
        decide: ["Dummy Node"],
        delete: ["Dummy Node"],
      };
      set(reference, taskData);
    }
  });
}

//Add event listeners for each section's add task button
let taskTypes = ["do", "decide", "delegate", "delete"];

for (let i = 0; i < taskTypes.length; i++) {
  let currTaskType = taskTypes[i];
  const addTaskBtn = document.getElementById(`${currTaskType}-btn`);
  addTaskBtn.addEventListener("click", function () {
    addTask(currTaskType);
  });
}

//After logging in, render the tasks saved under the user's account
function renderSavedTasks() {
  // Note that taskTypes is an array declared earlier in the code
  for (let i = 0; i < taskTypes.length; i++) {
    let taskType = taskTypes[i];
    let currTaskRef = ref(db, "users/" + userName + `/${taskType}`);
    get(currTaskRef).then((snapshot) => {
      let isFirstIteration = true;

      snapshot.forEach(function (childSnapshot) {
        //Skip first list item since it's a dummy node
        if (isFirstIteration) {
          isFirstIteration = false;
          return;
        }
        // Populate each task list with saved tasks
        const taskList = document.getElementById(`${taskType}-task-list`);
        const newTask = document.createElement("li");
        newTask.id = childSnapshot.key;
        newTask.innerHTML = `<span class="task-name">${childSnapshot.val()}</span><div class="buttons-container"><button id="cross-out-btn">Cross Out</button>
<button id="remove-btn">Remove</button></div>`;

        //Add event listeners to the two buttons attached to each task
        newTask
          .querySelector("#remove-btn")
          .addEventListener("click", function () {
            removeTask(this, taskType);
          });

        newTask
          .querySelector("#cross-out-btn")
          .addEventListener("click", function () {
            crossOutTask(this);
          });
        taskList.appendChild(newTask);
      });
    });
  }
}

// Add a new task to one of the task lists
function addTask(selection) {
  const taskInput = document.getElementById(`${selection}-task-input`);
  const taskList = document.getElementById(`${selection}-task-list`);
  const newTask = document.createElement("li");

  if (taskInput.value.length > 50) {
    alert(`Character limit exceeded! Please limit your task to 50 characters.`);
    return;
  }

  // Make sure that the user doesn't a task item that is blank
  if (taskInput.value.trim().length > 0) {
    newTask.innerHTML = `<span class="task-name">${taskInput.value}</span><div class="buttons-container"><button id="cross-out-btn">Cross Out</button>
  <button id="remove-btn">Remove</button></div>`;

    //Add event listeners to the two buttons attached to each task
    newTask.querySelector("#remove-btn").addEventListener("click", function () {
      removeTask(this, selection);
    });

    newTask
      .querySelector("#cross-out-btn")
      .addEventListener("click", function () {
        crossOutTask(this);
      });

    taskList.appendChild(newTask);

    // Construct the full path to a task list under the user node
    const taskReference = ref(db, "users/" + userName + `/${selection}`);

    const newTaskItem = push(taskReference);
    set(newTaskItem, taskInput.value).then(() => {
      // Access the key of the newly created node and associate it with the corresponding list element by making the key the id of the list element
      const newTaskItemId = newTaskItem.key;
      newTask.id = newTaskItemId;
    });

    // Reset the task entry text box to be blank
    taskInput.value = "";
  }
}

// Cross out a specific task on a task list
function crossOutTask(button) {
  const task = button.parentNode.parentNode;
  const taskName = task.querySelector(".task-name");
  taskName.classList.toggle("crossed-out");
}

// Removes a task from a task list both on the webpage and the database
function removeTask(button, taskType) {
  // Use the parent node twice since we first need to break out of the buttons div before targeting the task list element
  const taskToRemove = button.parentNode.parentNode;
  let taskRef = ref(
    db,
    "users/" + userName + `/${taskType}/` + taskToRemove.id
  );

  //Remove item from database
  remove(taskRef);

  //Remove item from list on page
  taskToRemove.parentNode.removeChild(taskToRemove);
}

// Update the webpage after a user logs in
onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUserProfile(user);
    renderSavedTasks();
    const uid = user.uid;
    return uid;
  } else {
    alert("Create Account and Login");
  }
});
