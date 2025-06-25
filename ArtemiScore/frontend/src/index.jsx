import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

/*
ArtemiScore/
├── backend/
├──froontend/
│   ├── frontend-react/
│   │   ├── build/
│   │   ├── node_modules/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   ├── package.json
│   │   ├── package-lock.json
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   │   └── JogosList.jsx
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── index.html
│   ├── main.js
│   ├── package.json
│   └── build/   <-- vai ser criado após o build
├── main.js      <-- do Electron
├── package.json <-- do Electron
└── package-lock.json
*/
