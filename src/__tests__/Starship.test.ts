import {ObjectId} from "mongodb";
import {starshipResolvers} from "../graphql/resolvers/Starship";

describe('listStarships Query', () => {
    it('should return a list of starships', async () => {
        const mockStarships = [
            {_id: new ObjectId(), name: 'Starship1', model: 'Model1', length: 100, crew: 'Crew1'},
            {_id: new ObjectId(), name: 'Starship1', model: 'Model2', length: 101, crew: 'Crew2'},
        ];
        const db = {
            starship: {
                find: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                toArray: jest.fn().mockResolvedValue(mockStarships),
            },
        };

        const args = {limit: 2, nextToken: '0'};
        const result = await (starshipResolvers as any).Query.listStarships(undefined, args, {db});

        expect(db.starship.find).toHaveBeenCalled();
        expect(result.items).toHaveLength(2);
        expect(result.items[0].name).toBe('Starship1');
    });

});


describe('createStarship Mutation', () => {
    it('should create a starship', async () => {
        const mockInput = {name: 'New Starship', model: 'ModelX', length: 200, crew: 'CrewX'};
        const mockResult = {acknowledged: true, insertedId: new ObjectId()};
        const db = {
            starship: {
                insertOne: jest.fn().mockResolvedValue(mockResult),
            },
        };

        const result = await (starshipResolvers as any).Mutation.createStarship(undefined, {input: mockInput}, {db});

        expect(db.starship.insertOne).toHaveBeenCalledWith(mockInput);
        expect(result.name).toBe('New Starship');
    });

});


describe('deleteStarship Mutation', () => {
    it('should delete a starship', async () => {
        const mockId = new ObjectId().toString();
        const db = {
            starship: {
                findOneAndDelete: jest.fn().mockResolvedValue({value: {_id: mockId, name: 'Starship1'}}),
            },
        };

        const result = await (starshipResolvers as any).Mutation.deleteStarship(undefined, {input: {id: mockId}}, {db});

        expect(db.starship.findOneAndDelete).toHaveBeenCalledWith({_id: new ObjectId(mockId)});
        expect(result.id).toBe(mockId);
    });

});


describe('updateStarship Mutation', () => {
    it('should update a starship', async () => {
        const mockId = new ObjectId().toString();
        const mockInput = {id: mockId, name: 'Updated Starship', model: 'ModelY', length: 300, crew: 'CrewY'};
        const db = {
            starship: {
                findOneAndUpdate: jest.fn().mockResolvedValue({value: mockInput}),
            },
        };

        const result = await (starshipResolvers as any).Mutation.updateStarship(undefined, {input: mockInput}, {db});

        expect(db.starship.findOneAndUpdate).toHaveBeenCalledWith(
            {_id: new ObjectId(mockId)},
            {$set: mockInput},
            {returnDocument: 'after'}
        );
        expect(result.name).toBe('Updated Starship');
    });

    // Additional tests for different update scenarios and error handling
});

