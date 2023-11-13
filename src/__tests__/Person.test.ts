import {Database} from "../lib/types";
import {personResolvers} from "../graphql/resolvers/Person";
import {ObjectId} from "mongodb";

describe('listPeople Query', () => {
    it('should return a list of people', async () => {
        const mockFind = jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            toArray: jest.fn().mockResolvedValue([{_id: '1', name: 'John Doe'}]),
        });
        const mockDB = {people: {find: mockFind}} as unknown as Database;

        const args = {limit: 1, nextToken: '0'};
        const result = await (personResolvers as any).Query.listPeople(undefined, args, { db: mockDB });


        expect(mockFind).toHaveBeenCalled();
        expect(result.items).toHaveLength(1);
        expect(result.items[0].name).toBe('John Doe');
    });
});

describe('createPerson Mutation', () => {
    it('should create a new person', async () => {
        const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: '1' });
        const mockDB = { people: { insertOne: mockInsertOne } } as unknown as Database;

        const args = { input: { name: 'Jane Doe', birthYear: '1990', gender: 'female', height: 170, mass: 60 } };
        const result = await (personResolvers as any).Mutation.createPerson(undefined, args, { db: mockDB });

        expect(mockInsertOne).toHaveBeenCalledWith(args.input);
        expect(result.id).toBe('1');
    });

});

describe('deletePerson Mutation', () => {
    it('should delete a person', async () => {
        const mockFindOneAndDelete = jest.fn().mockResolvedValue({ value: { _id: '507f1f77bcf86cd799439011', name: 'John Doe' } });
        const mockDB = { people: { findOneAndDelete: mockFindOneAndDelete } } as unknown as Database;

        const args = { input: { id: '507f1f77bcf86cd799439011' } };
        const result = await (personResolvers as any).Mutation.deletePerson(undefined, args, { db: mockDB });

        expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: new ObjectId('507f1f77bcf86cd799439011') });
        expect(result.id).toBe('507f1f77bcf86cd799439011');
    });
});

describe('updatePerson Mutation', () => {
    it('should update a person', async () => {
        const mockFindOneAndUpdate = jest.fn().mockResolvedValue({ value: { _id: '507f1f77bcf86cd799439011', name: 'Jane Doe' } });
        const mockDB = { people: { findOneAndUpdate: mockFindOneAndUpdate } } as unknown as Database;

        const args = { input: { id: '507f1f77bcf86cd799439011', name: 'Jane Doe' } };
        const result = await (personResolvers as any).Mutation.updatePerson(undefined, args, { db: mockDB });

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: new ObjectId('507f1f77bcf86cd799439011') },
            { $set: args.input },
            { returnDocument: 'after' }
        );
        expect(result.name).toBe('Jane Doe');
    });

    // Additional tests for scenarios where update fails
});
