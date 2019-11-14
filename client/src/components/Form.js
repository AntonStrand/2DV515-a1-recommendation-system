import React, { useState } from 'react'
import ifElse from 'crocks/logic/ifElse'
import isInteger from 'crocks/predicates/isInteger'

import { Combobox, Button, Card, TextInput } from 'evergreen-ui'
import { capitalize } from '../utils'

import { lensPath, set, path, compose } from 'ramda'

const SelectBox = ({ items, onChange, placeholder }) => (
  <Combobox
    openOnFocus
    items={items}
    margin={8}
    marginBottom={16}
    itemToString={item => (item ? capitalize(item.label) : '')}
    onChange={onChange}
    placeholder={placeholder}
    display='flex'
  />
)

const Form = ({ formData }) => {
  const [state, setState] = useState({ valid: true, form: {} })

  // select :: String -> { value :: a } -> State Event
  const select = key => ({ value }) =>
    setState(set(lensPath(['form', key]), value, state))

  // updateLimit :: Booleam -> Number -> State
  const updateLimit = isValid => limit =>
    set(lensPath(['valid']), isValid)(
      set(lensPath(['form', 'limit']), limit, state)
    )

  // setLimit :: Event -> State Event
  const setLimit = compose(
    setState,
    ifElse(isInteger, updateLimit(true), () => updateLimit(false)()),
    Number,
    path(['target', 'value'])
  )

  console.log(state)
  return (
    <Card
      elevation={2}
      padding={24}
      display='flex'
      justifyContent='space-evenly'
    >
      <Card>
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
        <TextInput
          placeholder='Number of results'
          width={240}
          margin={8}
          marginTop={4}
          isInvalid={!state.valid}
          onChange={setLimit}
        />
      </Card>
      <Card>
        <Button margin={8}>Top matching users</Button>
        <Button margin={8}>Recommended movies</Button>
        <Button margin={8}>Item-based recommendations</Button>
      </Card>
    </Card>
  )
}

export default Form
