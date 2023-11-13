import {IResolvers} from "@graphql-tools/utils";
import {Database, DuelResult, ResourceType, Person, Starship, Entity} from "../../../lib/types";

export const battleResolvers: IResolvers = {
    Query: {
        randomEntityDuel: async (
            _root: undefined,
            args: { resourceType: ResourceType },
            {db}: { db: Database }
        ): Promise<DuelResult> => {
            const collection = args.resourceType === ResourceType.PERSON ? db.people : db.starship;
            const entities = await collection.find().toArray();

            if (entities.length < 2) {
                throw Error('Not enough entities to compare.');
            }

            const selectedIndices = getRandomIndices(entities.length);
            const entity1 = entities[selectedIndices[0]];
            const entity2 = entities[selectedIndices[1]];

            const transformEntity = (entity: Entity) => ({
                ...entity,
                id: entity._id?.toHexString()
            });

            const player1 = transformEntity(entity1);
            const player2 = transformEntity(entity2);
            const winner = determineWinner(player1, player2, args.resourceType);
            return {
                player1,
                player2,
                winner: winner ? transformEntity(winner) : null
            };
        }
    }
};

export function getRandomIndices(length: number): number[] {
    const index1 = Math.floor(Math.random() * length);
    let index2 = Math.floor(Math.random() * length);
    while (index2 === index1) {
        index2 = Math.floor(Math.random() * length);
    }
    return [index1, index2];
}

export function determineWinner(entity1: Person | Starship, entity2: Person | Starship, resourceType: ResourceType): Person | Starship | null {
    if (resourceType === ResourceType.PERSON) {
        const person1 = entity1 as Person;
        const person2 = entity2 as Person;
        if (person1.mass === person2.mass) return null;
        return person1.mass > person2.mass ? person1 : person2;
    } else {
        const starship1 = entity1 as Starship;
        const starship2 = entity2 as Starship;
        const crew1 = parseCrewSize(starship1.crew);
        const crew2 = parseCrewSize(starship2.crew);
        if (crew1 === crew2) return null;
        return crew1 > crew2 ? starship1 : starship2;
    }
}

export function parseCrewSize(crew: string): number {
    if (crew && crew.includes('-')) {
        return Math.max(...crew.split('-').map(Number));
    }
    return Number(crew);
}
