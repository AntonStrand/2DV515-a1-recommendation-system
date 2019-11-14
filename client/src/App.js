import React, { useState, useEffect } from 'react'
import './App.css'

import { Combobox } from 'evergreen-ui'
import { getFormData } from './model'

const SelectBox = ({ items, onChange, placeholder }) => (
  <Combobox
    openOnFocus
    items={items}
    itemToString={item => (item ? item.label : '')}
    onChange={onChange}
    placeholder={placeholder}
  />
)

function App () {
  const [formData, setFormData] = useState({ users: [], metrics: [] })
  const [input, setInput] = useState({})

  useEffect(() => {
    getFormData().then(setFormData)
  }, [])

  const select = key => ({ value }) => setInput({ ...input, [key]: value })

  console.log(input)

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <SelectBox
          items={formData.users}
          onChange={select('user')}
          placeholder='User'
        />
        <SelectBox
          items={formData.metrics}
          onChange={select('metric')}
          placeholder='Metric'
        />
      </header>
    </div>
  )
}

export default App
