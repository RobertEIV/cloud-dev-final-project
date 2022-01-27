import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createEntry, deleteEntry, getEntries, patchEntry } from '../api/entries-api'
import Auth from '../auth/Auth'
import { Entry } from '../types/Entry'

interface EntriesProps {
  auth: Auth
  history: History
}

interface EntriesState {
  entries: Entry[]
  newEntryName: string
  newEntryLocation: string
  newEntryArchitect: string
  loadingEntries: boolean
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryName: '',
    newEntryLocation: '',
    newEntryArchitect: '',
    loadingEntries: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name] : event.target.value } as any)
  }

  onEditButtonClick = (entryId: string) => {
    this.props.history.push(`/entries/${entryId}/edit`)
  }

  onEntryCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const entryDate = this.calculateEntryDate()
      const newEntry = await createEntry(this.props.auth.getIdToken(), {
        name: this.state.newEntryName,
        location: this.state.newEntryLocation,
        architect: this.state.newEntryArchitect,
        entryDate: entryDate
      })
      this.setState({
        entries: [...this.state.entries, newEntry],
        newEntryName: '',
        newEntryLocation: '',
        newEntryArchitect: ''
      })
    } catch {
      alert('Entry creation failed. Please make sure task name is not empty.')
    }
  }

  onEntryDelete = async (entryId: string) => {
    try {
      await deleteEntry(this.props.auth.getIdToken(), entryId)
      this.setState({
        entries: this.state.entries.filter(entry => entry.entryId !== entryId)
      })
    } catch {
      alert('Entry deletion failed')
    }
  }

  onEntryCheck = async (pos: number) => {
    try {
      const entry = this.state.entries[pos]
      await patchEntry(this.props.auth.getIdToken(), entry.entryId, {
        name: entry.name,
        entryDate: entry.entryDate,
        done: !entry.done
      })
      this.setState({
        entries: update(this.state.entries, {
          [pos]: { done: { $set: !entry.done } }
        })
      })
    } catch {
      alert('Entry deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const entries = await getEntries(this.props.auth.getIdToken())
      this.setState({
        entries,
        loadingEntries: false
      })
    } catch (error) {
      let errorMessage = 'Failed to fetch entries!'
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Architecture Bucket List</Header>

        {this.renderCreateEntryInput()}

        {this.renderEntries()}
      </div>
    )
  }

  renderCreateEntryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            fluid
            name="newEntryName"
            actionPosition="left"
            placeholder="Structure..."
            value={this.state.newEntryName}
            onChange={this.handleNameChange}
          />
          <Input
            fluid
            name="newEntryLocation"
            actionPosition="left"
            placeholder="Location..."
            value={this.state.newEntryLocation}
            onChange={this.handleNameChange}
          />
          <Input
            fluid
            name="newEntryArchitect"
            actionPosition="left"
            placeholder="Architect..."
            value={this.state.newEntryArchitect}
            onChange={this.handleNameChange}
          />
          <Button
            color= 'blue'
            labelPosition= 'left'
            icon= 'add'
            content= 'New entry'
            onClick={this.onEntryCreate}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderEntries() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderEntriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Entries
        </Loader>
      </Grid.Row>
    )
  }

  renderEntriesList() {
    return (
      <Grid padded>
        <Grid.Column width={1} verticalAlign="middle" style={{fontWeight: "bold"}}>
          Visited
        </Grid.Column>
        <Grid.Column width={3} verticalAlign="middle" style={{fontWeight: "bold"}}>
          Name
        </Grid.Column>
        <Grid.Column width={3} verticalAlign="middle" style={{fontWeight: "bold"}}>
          Location
        </Grid.Column>
        <Grid.Column width={3} verticalAlign="middle" style={{fontWeight: "bold"}}>
          Architect
        </Grid.Column>
        <Grid.Column width={3} floated="right" style={{fontWeight: "bold"}}>
          Created
        </Grid.Column>
        <Grid.Column width={1} floated="right" style={{fontWeight: "bold"}}>
          Edit
        </Grid.Column>
        <Grid.Column width={1} floated="right" style={{fontWeight: "bold"}}>
          Delete
        </Grid.Column>
        {this.state.entries.map((entry, pos) => {
          return (
            <Grid.Row key={entry.entryId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onEntryCheck(pos)}
                  checked={entry.done}
                />
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {entry.name}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {entry.location}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {entry.architect}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {entry.entryDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(entry.entryId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEntryDelete(entry.entryId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {entry.attachmentUrl && (
                <Image src={entry.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateEntryDate(): string {
    const date = new Date()
    date.setDate(date.getDate())

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
