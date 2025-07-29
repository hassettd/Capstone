<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->

# Watch Review Site

Live at https://cpastonedanhassett.netlify.app

This is a capstone project for the web developer course at Full Stack Academy. It utilizes seperate frontend and backend git files stored at GitHub to deliver the app to online users.
The PostgreSQL database and backend are mounted remotely on Render.com and the frontend is live on Netlify.com. The app utilizes SQl and Prisma on the backend, and React, Node.js, and the Bootstrap CSS style manager on the frontend. bcrypt and JWT are used to implement authentication. Redux Toolkit and RTK Query are effectively used to handle global state and communication with the API.

The theme and purpose is a model watch review site. Upon loading the URL, all users are presented with a variety of fine watches, can can use pagination to navigate the selection. Search functionality is also available to search for specific brands and models.
Clicking a "View Details" button brings up a detailed page of the selected watch, including photos, features, and average user rating.
Reviews and Comments are also available. In order to create, edit, or delete their reviews or comments, the user must create an account and log in.
After logging in, users can rate watches and leave reviews and comments. Also, they can access their account page and see a history of all their reviews and comments, and edit and delete as desired.

In order to download and edit/run the frontend locally, make sure VS Code has node_modules installed in the project folder as these are currently in the .gitignore file:

# Logs

logs
_.log
npm-debug.log_
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
\*.local

# Editor directories and files

.vscode/_
!.vscode/extensions.json
.idea
.DS_Store
_.suo
_.ntvs_
_.njsproj
_.sln
\*.sw?
