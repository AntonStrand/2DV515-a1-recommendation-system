import React, { useState, useEffect } from 'react'

import { getFormData, getRecommendations } from './model'
import Form from './components/Form'
import { toaster } from 'evergreen-ui'
import MovieTable from './components/RecommendationTable'

import { Recommendations, FormData } from './types'

function App () {
  const [formData, setFormData] = useState(FormData.of([], []))
  const [recommendations, setRecommendations] = useState(
    Recommendations.Default
  )

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
            setRecommendations
          )
      )
  }

  return (
    <main>
      <h1 style={{ marginLeft: '.5em' }}>A1 - Recommendations System</h1>
      <Form formData={formData} onSubmit={onSubmit} />
      <br />
      <MovieTable recommendations={recommendations} />
      <p style={{ marginLeft: '.5em' }}>
        Created by <a href='https://github.com/antonStrand'>Anton Strand</a>
      </p>
    </main>
  )
}

export default App
