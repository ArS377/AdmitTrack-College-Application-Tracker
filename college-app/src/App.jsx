import './App.css'
import { HashRouter, Routes, Route} from 'react-router-dom'
import { First } from './pages/first.jsx'
import { Login } from './pages/login.jsx'
import { Home } from './pages/home.jsx'
import { MyColleges } from './pages/mycolleges.jsx'

function App () {
  return (
    <HashRouter>
      <Routes>
        <Route path ="/" element={<First/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path= "/home" element={<Home/>}/>
        <Route path = "/mycolleges" element={<MyColleges/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App