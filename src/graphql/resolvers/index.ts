import merge from "lodash.merge";
import {personResolvers} from "./Person";
import {starshipResolvers} from "./Starship";
import {battleResolvers} from "./Battle";
import {Entity} from "../../lib/types";

const entityResolvers = {
    Entity: {
        __resolveType(entity: Entity) {
            if (entity.hasOwnProperty('mass')) {
                return 'Person';
            } else if (entity.hasOwnProperty('crew')) {
                return 'Starship';
            }

            return null;
        },
    },
};
export const resolvers = merge(personResolvers, starshipResolvers, entityResolvers, battleResolvers)
