import React, { Component } from 'react'
import { JobList } from './JobList'
import axios from 'axios'
// const { jobs } = require('./fake-data')
axios.interceptors.response.use(function (response) {
  return response.data.data
})
const url = 'http://localhost:9000/graphql'
async function getJobs () {
  const response = await axios.post(url, {
    query: `
    {
      jobs {
        id,
        title,
        description,
        company {
          name
        }
      }
    }
   `
  })
  return response
}
export class JobBoard extends Component {
  constructor (props) {
    super(props)
    this.state = { jobs: [] }
  }

  async componentDidMount () {
    const { jobs } = await getJobs()

    this.setState({ jobs })
  }

  render () {
    return (
      <div>
        <h1 className='title'>Job Board</h1>
        <JobList jobs={this.state.jobs} />
      </div>
    )
  }
}
