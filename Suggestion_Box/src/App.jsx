import { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'

function App() {
  //const [loading, setLoatding] = useState(true)
  //const dispatch = useDispatch()

  /*useDispatch(() => {
    //auth service request for backed 
    .then((userDate) => {
      if(userDate) {
        dispatch(login({userDate}))
      }
      else{
        dispatch(logout())
      }
    })
      .finally(() =>(setLoatding(false)))
  })*/

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <h1>Suggestiob Box</h1>
      </div>
    </div>
  ) : null
}

export default App
