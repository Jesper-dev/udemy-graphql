const graphql = require('graphql');
const _ = require("lodash");
const { GraphQLSchema } = require("graphql");
const {
    GraphQLObjectType
} = graphql;

const users = [
    {id: '23', firstName: 'Bill', age: 20 },
    {id: '43', firstName: 'Henry', age: 32 },
    {id: '60', firstName: 'Sarah', age: 27 },
]

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: graphql.GraphQLString} ,
        firstName: {type: graphql.GraphQLString},
        age: {type: graphql.GraphQLInt}
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: graphql.GraphQLString } },
            resolve(parentValue, args) {
                return _.find(users, { id: args.id })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});