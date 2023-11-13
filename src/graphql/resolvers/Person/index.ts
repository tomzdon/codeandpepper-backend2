import {IResolvers} from '@graphql-tools/utils';
import {ObjectId, InsertOneResult} from 'mongodb';

import {Database, DeleteResult, PeopleConnection, Person} from '../../../lib/types';

export const personResolvers: IResolvers = {
    Query: {
        listPeople: async (
            _root: undefined,
            args: { limit?: number; nextToken?: string },
            {db}: { db: Database }
        ): Promise<PeopleConnection> => {
            const limit = args.limit || 10;
            const nextToken = args.nextToken ? parseInt(args.nextToken, 10) : 0;

            const people = await db.people.find({})
                .skip(nextToken)
                .limit(limit)
                .toArray();
            const transformedPeople = people.map((person) => ({
                id: person._id.toString(),
                ...person
            }));

            const newNextToken = transformedPeople.length === limit ? (nextToken + limit).toString() : null;

            return {
                items: transformedPeople,
                nextToken: newNextToken
            };
        },
    },
    Mutation: {
        createPerson: async (
            _root: undefined,
            args: { input: { name: string; birthYear: string; gender: string; height: number; mass: number } },
            {db}: { db: Database }
        ): Promise<Person> => {
            const result: InsertOneResult<Person> = await db.people.insertOne(args.input);
            if (!result.acknowledged || !result.insertedId) {
                throw new Error('Error adding person');
            }
            return {
                ...args.input,
                id: result.insertedId.toString()
            };
        },
        deletePerson: async (
            _root: undefined,
            args: { input: { id: string } },
            {db}: { db: Database }
        ): Promise<DeleteResult> => {
            const deleteRes = await db.people.findOneAndDelete({_id: new ObjectId(args.input.id)});

            if (!deleteRes.value) {
                throw new Error('failed to delete person');
            }
            return {
                id: deleteRes.value._id.toString(),
            };
        },
        updatePerson: async (
            _root: undefined,
            args: { input: { id: string; birthYear?: string; gender?: string; height?: number; mass?: number } },
            {db}: { db: Database }
        ): Promise<Person> => {
            const updateRes = await db.people.findOneAndUpdate(
                {_id: new ObjectId(args.input.id)},
                {$set: args.input},
                {returnDocument: 'after'}
            );

            if (!updateRes.value) {
                throw new Error('failed to update person');
            }

            return updateRes.value;
        },

    },

};
