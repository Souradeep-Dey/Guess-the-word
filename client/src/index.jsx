import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import JoinRoom from './components/JoinRoom'
import InGame from './components/InGame'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
  Outlet,
  useParams,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom"
console.log('hello')
ReactDOM.createRoot(document.getElementById('root')).render(

  <Router>
    <Routes>
      <Route path="/" element={<JoinRoom />} />
      <Route path="/InGame/:details" element={<InGame />} />

    </Routes>
  </Router>
  // <JoinRoom/>
)