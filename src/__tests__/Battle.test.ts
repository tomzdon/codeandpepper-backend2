import {ObjectId} from "mongodb";
import {battleResolvers} from "../graphql/resolvers/Battle";

jest.mock('../graphql/resolvers/Battle', () => ({
    ...jest.requireActual('../graphql/resolvers/Battle'),
    getRandomIndices: jest.fn(),
}));


describe('randomEntityDuel Query', () => {
    it('should return a duel result for two random entities', async () => {
        const mockEntities = [
            { _id: new ObjectId(), name: 'Entity1', mass: 100 },
            { _id: new ObjectId(), name: 'Entity2', mass: 150 },
        ];
        const db = {
            people: { find: jest.fn().mockReturnThis(), toArray: jest.fn().mockResolvedValue(mockEntities) },
            starship: { find: jest.fn().mockReturnThis(), toArray: jest.fn().mockResolvedValue([]) },
        };
        const getRandomIndices = require('../graphql/resolvers/Battle').getRandomIndices;
        getRandomIndices.mockReturnValue([0, 1]);

        const args = { resourceType: 'PERSON' };
        const result = await (battleResolvers as any).Query.randomEntityDuel(undefined, args, { db });

        expect(db.people.find).toHaveBeenCalled();
        expect(result.player1).toBeDefined();
        expect(result.player2).toBeDefined();
        expect(result.winner).toBeDefined();
    });
});
