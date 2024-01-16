# Task Manager App

## Overview

The Task Manager App is a web-based application designed to help users organize their tasks based on four levels of priority: Do, Decide, Delegate, and Delete. This format follows the [Eisenhower Matrix](https://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method)
 strategy of task allocation. Users can log in with their Google account to save and retrieve their tasks.

## Features

- **User Authentication**: Users can log in securely using their Google account to save and access their tasks.

- **Task Organization**: Tasks are categorized into four sections—Do, Decide, Delegate, and Delete—allowing users to prioritize and manage their workload effectively. 

- **Mobile Responsive**: The web page is designed to be responsive, ensuring a consistent and user-friendly experience across various screen sizes and devices.

- **Intuitive User Interface**: The app provides a clean and intuitive user interface for a seamless task management experience. The top bar allows for easy navigation, allowing you to easily switch between the four task sections based on your preferences.
  
## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JamesSo1/TaskManagerApp.git
```
### 2. Set Up Firebase Configuration
- Open the index.js file and replace the empty firebaseConfig object with your Firebase project configuration details(shown below).
  
  <img width="772" alt="Screenshot 2024-01-15 at 9 13 09 PM" src="https://github.com/JamesSo1/TaskManagerApp/assets/99366647/4c17d894-aa59-408f-a8fd-917dd4d256f7">


### 3. Run the App
- Open the index.html file in a web browser.

### 4. Usage
- Log in using your Google account to start organizing your tasks.
- Note that your tasks will not be saved if you do not login first!


![TaskManagerAppDemo](https://github.com/JamesSo1/TaskManagerApp/assets/99366647/2ca25295-9db9-46b2-b9de-93c4310449d0)


## Dependencies
- Firebase Realtime Database
- Firebase Authentication
