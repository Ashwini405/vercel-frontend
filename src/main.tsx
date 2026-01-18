import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)


// import React from "react"
// import ReactDOM from "react-dom/client"
// import { BrowserRouter } from "react-router-dom"
// import App from "./App"
// import { AppProvider } from "./context/AppContext"

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <AppProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </AppProvider>
//   </React.StrictMode>
// )

// import React from "react"
// import ReactDOM from "react-dom/client"
// import { BrowserRouter } from "react-router-dom"
// import App from "./App"
// import { AppProvider } from "./context/AppContext"

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AppProvider>
//         <App />
//       </AppProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// )
