import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { jobs } from './fake-data'
import axios from 'axios'

// axios.interceptors.response.use(function (response) {
//   return response.data
// })
const url = 'http://localhost:9000/graphql'
async function getJob (id) {
  const response = await axios.post(url, {
    query: `
    query ($id: ID!) {
      job(id: $id) {
        title,
        description,
        company {
          id,
          name
        }
      }
    }
   `,
    variables: {
      id
    }
  })
  if (response.errors) {
    const message = response.errors.map(error => error.message).join('\n')
    throw new Error(message)
  }
  return response
}

export class JobDetail extends Component {
  constructor (props) {
    super(props)
    this.state = { job: null }
  }

  async componentDidMount () {
    const { jobId } = this.props.match.params
    const { job } = await getJob(jobId)
    this.setState({ job })
  }

  render () {
    const { job } = this.state
    if (!job) return null

    return (
      <div>
        <h1 className='title'>{job.title}</h1>
        <h2 className='subtitle'>
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className='box'>{job.description}</div>
      </div>
    )
  }
}
