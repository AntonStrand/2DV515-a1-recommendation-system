import React, { Fragment } from 'react'
import { Table, Card, Heading } from 'evergreen-ui'

const Message = msg => () => <Heading align='center'>{msg}</Heading>

const MovieTable = movies => (
  <Fragment>
    <Heading align='center' marginBottom={16}>
      Movies
    </Heading>
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>Title</Table.TextHeaderCell>
        <Table.TextHeaderCell>ID</Table.TextHeaderCell>
        <Table.TextHeaderCell>Score</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {movies.map(movie => (
          <Table.Row key={movie.movie_id}>
            <Table.TextCell>{movie.title}</Table.TextCell>
            <Table.TextCell isNumber>{movie.movie_id}</Table.TextCell>
            <Table.TextCell isNumber>{movie.score.toFixed(4)}</Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Fragment>
)

const UserTable = users => (
  <Fragment>
    <Heading align='center' marginBottom={16}>
      Users
    </Heading>
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>ID</Table.TextHeaderCell>
        <Table.TextHeaderCell>Simularity</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {users.map(user => (
          <Table.Row key={user.user_id}>
            <Table.TextCell>{user.name}</Table.TextCell>
            <Table.TextCell isNumber>{user.user_id}</Table.TextCell>
            <Table.TextCell isNumber>
              {user.simularity.toFixed(4)}
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Fragment>
)

const RecommendationTable = ({ recommendations }) => (
  <Card elevation={2} padding={24} background='#fefefe'>
    {recommendations.case({
      Users: UserTable,
      Movies: MovieTable,
      Nothing: Message('No results'),
      Default: Message('Fill in the form above to find recommendations')
    })}
  </Card>
)

export default RecommendationTable
