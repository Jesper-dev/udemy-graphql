const graphql = require('graphql');
const axios = require("axios");
const { GraphQLSchema } = require("graphql");
const {
    GraphQLObjectType
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: graphql.GraphQLString} ,
        firstName: {type: graphql.GraphQLString},
        age: {type: graphql.GraphQLInt}
    }
})

//Requesten är async
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: graphql.GraphQLString } },
            resolve(parentValue, args) {
                //Most return the data that represents a user object
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});