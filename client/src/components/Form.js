import React, { useState } from 'react'
import ifElse from 'crocks/logic/ifElse'
import isInteger from 'crocks/predicates/isInteger'

import { capitalize } from '../utils'
import { Combobox, Button, Card, TextInput, Heading } from 'evergreen-ui'

import { lensPath, set, path, compose } from 'ramda'

const SelectBox = ({ items, onChange, title }) => (
  <Combobox
    openOnFocus
    items={items}
    itemToString={item => (item ? capitalize(item.label) : '')}
    onChange={onChange}
    placeholder={title}
    autocompleteProps={{
      title
    }}
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
      margin={24}
      display='flex'
      justifyContent='center'
      flexDirection='column'
    >
      <Card flex={1} alignItems='center' display='flex' margin='auto'>
        <Heading>Search settings</Heading>
      </Card>
      <Card
        flex={1}
        alignItems='baseline'
        justifyContent='center'
        display='flex'
        margin='auto'
        paddingTop={16}
        paddingBottom={24}
      >
        <SelectBox
          items={formData.users}
          onChange={select('user')}
          title='User'
        />
        <SelectBox
          items={formData.metrics}
          onChange={select('metric')}
          title='Metric'
        />
        <TextInput
          placeholder='Number of results'
          isInvalid={!state.valid}
          onChange={setLimit}
        />
      </Card>
      <Card flex={1} alignItems='center' display='flex' margin='auto'>
        <Heading margin={8}>Find recommendations</Heading>
      </Card>
      <Card
        flex={1}
        alignItems='center'
        display='flex'
        margin='auto'
        flexFlow='wrap'
      >
        <Button margin={8}>Top matching users</Button>
        <Button margin={8}>Recommended movies</Button>
        <Button margin={8}>Item-based recommendations</Button>
      </Card>
    </Card>
  )
}

export default Form
