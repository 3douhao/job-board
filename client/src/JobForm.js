import React, { Component } from 'react'
import axios from 'axios'
import { getAccessToken, isLoggedIn } from './auth'

async function postJob (title, description) {
  const url = 'http://localhost:9000/graphql'
  const data = {
    query: `
    mutation ($title: String, $description: String){
    job:addJob(title: $title, description: $description) {
    id
    title
    description
    company {
    name
    }
    }
    }
    `,
    variables: {
      title,
      description
    }
  }
  const config = { headers: {} }
  if (isLoggedIn()) {
    config.headers.authorization = 'Bearer ' + getAccessToken()
  }

  const { job } = await axios.post(url, data, config)
  return job
}

export class JobForm extends Component {
  constructor (props) {
    super(props)
    this.state = { title: '', description: '' }
  }

  handleChange (event) {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleClick (event) {
    event.preventDefault()
    // const companyId = 'HJRa-DOuG'
    const { title, description } = this.state
    postJob(title, description).then(job => {
      this.props.history.push(`/jobs/${job.id}`)
    })
  }

  render () {
    const { title, description } = this.state
    return (
      <div>
        <h1 className='title'>New Job</h1>
        <div className='box'>
          <form>
            <div className='field'>
              <label className='label'>Title</label>
              <div className='control'>
                <input
                  className='input'
                  type='text'
                  name='title'
                  value={title}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
            </div>
            <div className='field'>
              <label className='label'>Description</label>
              <div className='control'>
                <textarea
                  className='input'
                  style={{ height: '10em' }}
                  name='description'
                  value={description}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <button
                  className='button is-link'
                  onClick={this.handleClick.bind(this)}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
