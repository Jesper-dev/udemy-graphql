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

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
                age: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
                companyId: {type: graphql.GraphQLString}
            },
            resolve(parentValue, {firstName, age}) {
                return axios.post('http://localhost:3000/users', { firstName, age })
                    .then(res => res.data);
            } 
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
            },
            resolve(parentValue, {id}) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(res => res.data);
            } 
        },
        editUser: {
            type: UserType,
            args: {
                id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
                firstName: {type: graphql.GraphQLString},
                age: {type: graphql.GraphQLInt},
                companyId: {type: graphql.GraphQLString}
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(res => res.data);
            } 
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});