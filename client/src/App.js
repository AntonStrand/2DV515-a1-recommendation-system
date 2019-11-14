import React, { useState, useEffect } from 'react'
import './App.css'

import { Combobox } from 'evergreen-ui'
import { getFormData } from './model'

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
        <Combobox
          openOnFocus
          items={formData.users}
          onChange={selected => console.log(selected)}
          placeholder='User'
        />
        <Combobox
          openOnFocus
          items={formData.metrics}
          onChange={selected => console.log(selected)}
          placeholder='Metric'
        />
      </header>
    </div>
  )
}

export default App
