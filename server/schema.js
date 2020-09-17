const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require('graphql')

const db = require('./db')

const JobType = new GraphQLObjectType({
  name: 'Job',
  fields: () => {
    return {
      id: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
      company: {
        type: CompanyType,
        resolve: job => {
          return db.companies.get(job.companyId)
        }
      },
      description: { type: GraphQLString }
    }
  }
})

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => {
    return {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      jobs: {
        type: new GraphQLList(JobType),
        resolve: company => {
          return db.jobs.list().filter(job => job.companyId === company.id)
        }
      }
    }
  }
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    jobs: {
      type: new GraphQLList(JobType),
      resolve: () => {
        return db.jobs.list()
      }
    },
    job: {
      type: JobType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (root, { id }) => {
        return db.jobs.get(id)
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (root, { id }) => {
        return db.companies.get(id)
      }
    }
  }
})

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addJob: {
      type: JobType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve: (root, args, context) => {
        const companyid =
          context.user && db.users.get(context.user.sub).companyId
        if (!context.user) {
          throw new Error('u R not authorized')
        }
        const id = db.jobs.create({ companyId: companyid, ...args })
        return db.jobs.get(id)
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

module.exports = { schema }
