import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Person{
        id: ID!
        name: String
        birthYear: String
        gender: String
        height: Int
        mass: Float
    }

    type Query {
        listPeople(limit: Int, nextToken: String): PeopleConnection!
        listStarships(limit: Int, nextToken: String): StarshipsConnection!
        randomEntityDuel(resourceType: ResourceType!): DuelResult

    }

    type PeopleConnection {
        items: [Person!]!
        nextToken: String
    }

    type Mutation {
        createPerson(input: CreatePersonInput): Person!
        deletePerson(input: DeletePersonInput!): DeleteResult!
        updatePerson(input: UpdatePersonInput!): Person!
        createStarship(input: CreateStarshipInput!): Starship!
        deleteStarship(input: DeleteStarshipInput!): DeleteResult!
        updateStarship(input: UpdateStarshipInput!): Starship!
    }

    input CreatePersonInput {
        name: String!
        birthYear: String!
        gender: String!
        height: Int!
        mass: Float!
    }

    input UpdatePersonInput {
        id: ID!
        name: String!
        birthYear: String!
        gender: String!
        height: Int!
        mass: Float!
    }

    input DeletePersonInput {
        id: String
    }

    type DeleteResult {
        id:String
    }


    type Starship {
        id: ID!
        name: String
        model: String
        length: Float
        crew: String
    }

    type StarshipsConnection {
        items: [Starship!]!
        nextToken: String
    }

    input CreateStarshipInput {
        name: String!
        model: String!
        length: Float!
        crew: String!
    }

    input UpdateStarshipInput {
        id: ID!
        name: String
        model: String
        length: Float
        crew: String
    }

    input DeleteStarshipInput {
        id: ID!
    }
    type DuelResult {
        player1: Entity
        player2: Entity
        winner: Entity
    }

    union Entity = Person | Starship

    enum ResourceType {
        PERSON
        STARSHIP
    }
`;
