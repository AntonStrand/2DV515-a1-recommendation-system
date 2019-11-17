import React, { Fragment } from 'react'
import { Table, Card, Heading } from 'evergreen-ui'

const Message = msg => () => <Heading align='center'>{msg}</Heading>

const TableTemplate = ({ heading, headerText, rows }) => (
  <>
    <Heading align='center' marginBottom={16}>
      {heading}
    </Heading>
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>{headerText[0]}</Table.TextHeaderCell>
        <Table.TextHeaderCell>{headerText[1]}</Table.TextHeaderCell>
        <Table.TextHeaderCell>{headerText[2]}</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {rows.map(row => (
          <Table.Row key={row.id}>
            <Table.TextCell>{row.title}</Table.TextCell>
            <Table.TextCell isNumber>{row.id}</Table.TextCell>
            <Table.TextCell isNumber>{row.score.toFixed(4)}</Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </>
)

const MovieTable = movies => (
  <TableTemplate
    heading='Movies'
    headerText={['Title', 'ID', 'Score']}
    rows={movies.map(m => ({ title: m.title, id: m.movie_id, score: m.score }))}
  />
)

const UserTable = users => (
  <TableTemplate
    heading='Users'
    headerText={['Name', 'ID', 'Simularity']}
    rows={users.map(u => ({
      title: u.name,
      id: u.user_id,
      score: u.simularity
    }))}
  />
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
