const typeDefs = `#graphql
  
  type Continent {
    code: String!
    name: String!
    countries: [Country!]
  }

  type Country{
    code: String!
    name: String!
    emoji: String!
    native: String!
    capital: String
    currencies: [String!]
    languages: [Language!]
    continent: Continent!
  }

  type Language {
    code: String!
    name: String!
    native: String!
    rtl: Boolean!
  }

 
  type Query {
    continents: [Continent!]
    continent(code: String!): Continent
    countries: [Country!]
    country(code: String!): Country
    languages: [Language!]
    language(code: String!): Language
  }
`;

export default typeDefs;
