Demo link - https://altertodotaskmanager.vercel.app/

Features -
1. Google sign in and authentication
2. Add tasks with title, date, status, delete tasks
3. Can change status of tasks - To do, In Process, Completed
4. Filter tasks according to categories(work or professional) or due dates(3 days or 7 days)
5. List and Board view also avaiable
6. Mobile responsive
7. Popup Modal for Edit and Add tasks
8. Sort the task according to Dates column in ascending or descending order

Steps to run them locally -
1. git clone the repo
2. Enter in the directory and run command - npm install and npm run dev
3. Other commands -
   1. npm i react-router-dom
   2. npm i react-icons
   3. npm i firebase
   4. Install Tailwind CSS for vite -
        1. npm install -D tailwindcss postcss autoprefixer
        2. npx tailwindcss init -p
4. Create .env file in root directory
   Add these in .env file
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
5. To get these values go to firebase login - go to console - create new project - then go to authentication and name project and select google authentication then you will get these value and just paste in .env file
6. Now go to firestore database in the firebase project you just created and create new database with name tasks and save it
7. Now you can see database here
