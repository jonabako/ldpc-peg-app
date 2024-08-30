# LDPC-PEG SIMULATION TOOL (ANGULAR-FLASK APPLICATION)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

## Installation

### Backend (Flask)
1. **Install Python**:
   - Download and install Python from the [Python website](https://www.python.org/downloads/).

2. **Install Flask**:
   - In the terminal:
     ```bash
     pip install Flask
     ```

### Frontend (Angular)
1. **Install Node.js and npm**:
   - Download and install Node.js from the [Node.js website](https://nodejs.org/).
   - npm is included with Node.js.

2. **Install Angular CLI**:
   - Open a terminal or command prompt.
   - Install Angular CLI globally:
     ```bash
     npm install -g @angular/cli
     ```

3. **Install Node.js Modules**:
   - Navigate to the frontend directory:
     ```bash
     cd angular-python-app
     ```
   - Install the required Node.js modules:
     ```bash
     npm install --force
     ```

## Running the Application

### Backend (Flask)
1. **Start the Flask Server**:
   - In the terminal:
     ```bash
     cd backend
     python app.py
     ```

2. The Flask server will start running at `http://localhost:5000`.

### Frontend (Angular)

1. **Start the Angular Development Server**:
   - In a new terminal or command prompt window:
     ```bash
     cd angular-python-app
     ng serve --open
     ```

2. The Angular app will be served at `http://localhost:4200`.

   - Note: Use `--force` if there are any issues with the port already being in use. This will force the server to start even if the port is occupied.

## Usage
- Open your web browser and navigate to `http://localhost:4200` to view the Angular app (if you use `--open` it will open the tab by default).
- The frontend communicates with the Flask backend running at `http://localhost:5000`.

## Directory Structure
- **src/**: Contains the Angular frontend code.
- **backend/**: Contains the Flask backend code.

## Additional Notes
- This is a basic setup for a 2-tier application.
- No database is used in this application.
- Make sure to stop both the Flask server and Angular development server when not in use.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
