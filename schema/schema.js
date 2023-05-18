const graphql = require('graphql');
const axios = require("axios");
const { GraphQLSchema } = require("graphql");
const {
    GraphQLObjectType
} = graphql;

//Need to use arrow function in fields beacause of closure scopes (JS)
const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: {type: graphql.GraphQLString} ,
        name: {type: graphql.GraphQLString},
        description: {type: graphql.GraphQLString},
        users: {
            type: new graphql.GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data);
            }
        }
    })
});

//Need to use arrow function in fields beacause of closure scopes (JS)
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: graphql.GraphQLString} ,
        firstName: {type: graphql.GraphQLString},
        age: {type: graphql.GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res => res.data)
            }
        }
    })
});

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
                .then(res => res.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: graphql.GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});