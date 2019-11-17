import React, { useState, useEffect } from 'react'

import { getFormData, getRecommendations } from './model'
import Form from './components/Form'
import { toaster } from 'evergreen-ui'
import RecommendationTable from './components/RecommendationTable'
import { fork } from 'fluture/index'

import { Recommendations, FormData } from './types'

const danger = msg => () => toaster.danger(msg)
const warning = msg => () => toaster.warning(msg)

function App () {
  const [formData, setFormData] = useState(FormData.of([], []))
  const [recommendations, setRecommendations] = useState(
    Recommendations.Default
  )

  useEffect(() => {
    getFormData.fork(danger('Oops! Something went wrong'), setFormData)
  }, [])

  const onSubmit = result =>
    result
      .map(getRecommendations)
      .either(
        warning('The form is not correctly entered'),
        fork(danger('Oops! Something went wrong'), setRecommendations)
      )

  return (
    <main>
      <h1 style={{ marginLeft: '.5em' }}>A1 - Recommendations System</h1>
      <Form formData={formData} onSubmit={onSubmit} />
      <br />
      <RecommendationTable recommendations={recommendations} />
      <p style={{ marginLeft: '.5em' }}>
        Created by <a href='https://github.com/antonStrand'>Anton Strand</a>
      </p>
    </main>
  )
}

export default App
