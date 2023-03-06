const typeDefs = `#graphql
  type Query {
    me: User
  }
  type Mutation {
    loginUser(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: savedBook!): User
    removeBook(bookId: ID!): User
  }
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  input savedBook {
    bookId: String
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
`;

module.exports = typeDefs;
