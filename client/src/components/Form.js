import React, { useState } from 'react'
import isInteger from 'crocks/predicates/isInteger'
import tryCatch from 'crocks/Result/tryCatch'

import { capitalize } from '../utils'
import { Combobox, Button, Card, TextInput, Heading } from 'evergreen-ui'

import { lensProp, set, path, compose } from 'ramda'

import { RecommendationType, Limit, RecommendationQuery } from '../types'

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

const isInvalidLimit = Limit.case({ Invalid: () => true, _: () => false })

const Form = ({ formData, onSubmit }) => {
  const [state, setState] = useState({ limit: Limit.Nothing })

  console.log('formData', formData)
  console.log('formData.users', formData.users)
  console.log('formData.metrics', formData.metrics)

  // select :: String -> { value :: a } -> State Event
  const select = key => ({ value }) =>
    setState(set(lensProp(key), value, state))

  // setLimit :: Event -> State Event
  const setLimit = compose(
    setState,
    limit => set(lensProp('limit'), limit, state),
    n =>
      n === 0
        ? Limit.Nothing
        : isInteger(n) && n > 0
          ? Limit.Valid(n)
          : Limit.Invalid,
    Number,
    path(['target', 'value'])
  )

  const submitForm = type => () =>
    onSubmit(
      tryCatch(RecommendationQuery.of)(
        state.user,
        state.metric,
        state.limit
      ).map(type)
    )

  return (
    <Card
      elevation={2}
      padding={24}
      display='flex'
      justifyContent='center'
      flexDirection='column'
      background='#fefefe'
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
          isInvalid={isInvalidLimit(state.limit)}
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
        <Button margin={8} onClick={submitForm(RecommendationType.TopUsers)}>
          Top matching users
        </Button>
        <Button margin={8} onClick={submitForm(RecommendationType.TopMovies)}>
          Recommended movies
        </Button>
        <Button margin={8}>Item-based recommendations</Button>
      </Card>
    </Card>
  )
}

export default Form
