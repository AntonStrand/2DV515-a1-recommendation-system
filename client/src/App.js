import React, { useState, useEffect } from 'react'
// import './App.css'

import { getFormData } from './model'
import Form from './components/Form'
import { toaster } from 'evergreen-ui'

function App () {
  const [formData, setFormData] = useState({ users: [], metrics: [] })

  useEffect(() => {
    getFormData.fork(
      () => toaster.danger('Oops! Something went wrong'),
      setFormData
    )
  }, [])

  return (
    <div className='App'>
      <Form formData={formData} onSubmit={console.log} />
    </div>
  )
}

export default App
