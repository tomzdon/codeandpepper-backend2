import {Database, DeleteResult, Starship, StarshipsConnection} from "../../../lib/types";
import {IResolvers} from "@graphql-tools/utils";
import {InsertOneResult, ObjectId} from "mongodb";

export const starshipResolvers: IResolvers = {
    Query: {
        listStarships: async (
            _root: undefined,
            args: { limit?: number; nextToken?: string },
            {db}: { db: Database }
        ): Promise<StarshipsConnection> => {
            const limit = args.limit || 10;
            const nextToken = args.nextToken ? parseInt(args.nextToken, 10) : 0;

            const starships = await db.starship.find({})
                .skip(nextToken)
                .limit(limit)
                .toArray();

            const transformedStarships = starships.map(starship => ({
                id: starship._id.toString(),
                ...starship
            }));

            const newNextToken = transformedStarships.length === limit ? (nextToken + limit).toString() : null;

            return {
                items: transformedStarships,
                nextToken: newNextToken
            };
        },
    },
    Mutation: {
        createStarship: async (
            _root: undefined,
            args: {
                input: {
                    name: string
                    model: string
                    length: number
                    crew: string
                }
            },
            {db}: { db: Database }
        ): Promise<Starship> => {
            const result: InsertOneResult<Starship> = await db.starship.insertOne(args.input);
            if (!result.acknowledged || !result.insertedId) {
                throw new Error('Error adding starship');
            }
            return {
                ...args.input,
                id: result.insertedId.toString()
            };
        },
        deleteStarship: async (
            _root: undefined,
            args: { input: { id: string } },
            {db}: { db: Database }
        ): Promise<DeleteResult> => {
            const deleteRes = await db.starship.findOneAndDelete({_id: new ObjectId(args.input.id)});

            if (!deleteRes.value) {
                throw new Error('Failed to delete starship');
            }

            return {
                id: deleteRes.value._id.toString(),
            };
        },
        updateStarship: async (
            _root: undefined,
            args: {
                input: {
                    id: string
                    name: string
                    model: string
                    length: number
                    crew: string
                }
            },
            {db}: { db: Database }
        ): Promise<Starship> => {
            const updateData = args.input;
            const updateRes = await db.starship.findOneAndUpdate(
                {_id: new ObjectId(args.input.id)},
                {$set: updateData},
                {returnDocument: 'after'}
            );

            if (!updateRes.value) {
                throw new Error('Failed to update starship');
            }

            return updateRes.value;
        },
    },
};
