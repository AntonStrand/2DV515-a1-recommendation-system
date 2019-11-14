import React, { useState, useEffect } from 'react'
// import './App.css'

import { getFormData } from './model'
import Form from './components/Form'

function App () {
  const [formData, setFormData] = useState({ users: [], metrics: [] })

  useEffect(() => {
    getFormData().then(setFormData)
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
      <Form formData={formData} onSubmit={console.log} />
    </div>
  )
}

export default App
