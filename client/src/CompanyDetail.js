import React, { Component } from 'react'
import { JobList } from './JobList'
// import { companies } from './fake-data'
import axios from 'axios'
const url = 'http://localhost:9000/graphql'
async function companyDetail (id) {
  const response = await axios.post(url, {
    query: `
    query companyDetail ($id: ID!){
      company(id: $id) {
        id,
        name,
        description,
        jobs {
        id,
        title,
        description
        }
      }
    }
   `,
    variables: {
      id
    }
  })
  return response
}
export class CompanyDetail extends Component {
  constructor (props) {
    super(props)
    this.state = { company: null }
  }

  async componentDidMount () {
    const { companyId } = this.props.match.params
    const { company } = await companyDetail(companyId)
    this.setState({ company })
    console.log('state is', this.state)
  }

  render () {
    const { company } = this.state
    if (!company) return null
    return (
      <div>
        <h1 className='title'>{company.name}</h1>
        <div className='box'>{company.description}</div>
        <h4 className='title'>Jobs at {company.name}</h4>
        <JobList jobs={company.jobs} />
      </div>
    )
  }
}
