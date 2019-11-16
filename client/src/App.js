import React, { useState, useEffect } from 'react'
// import './App.css'

import { getFormData, getRecommendations } from './model'
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

  function onSubmit (result) {
    result
      .map(getRecommendations)
      .either(
        _ => toaster.warning('The form is not correctly entered'),
        recommendations =>
          recommendations.fork(
            () => toaster.danger('Oops! Something went wrong'),
            console.log
          )
      )
  }

  return (
    <div className='App'>
      <Form formData={formData} onSubmit={onSubmit} />
    </div>
  )
}

export default App
