import { Link } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div className="text-3xl font-bold underline">
      <Link className='block' to="notes/01basics">Basics</Link>

      <Link className='block' to="notes/02transformation2D">Transformation2D</Link>
    
    </div>
  )
}

export default App
