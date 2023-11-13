import {Collection, ObjectId} from "mongodb";

export interface Person {
    _id?: ObjectId;
    id?: string;
    name: string;
    birthYear: string;
    gender: string;
    height: number;
    mass: number;
}

export interface PeopleConnection {
    items: Person[];
    nextToken: string | null;
}

export interface Database {
    people: Collection<Person>;
    starship: Collection<Starship>;
}

export interface DeleteResult {
    id: string
}

export interface Starship {
    _id?: ObjectId;
    id?: string;
    name: string;
    model: string;
    length: number;
    crew: string;
}

export interface StarshipsConnection {
    items: Starship[];
    nextToken: string | null;
}

export enum ResourceType {
    PERSON = 'PERSON',
    STARSHIP = 'STARSHIP'
}

export type DuelResult = {
    player1: Entity
    player2: Entity
    winner: Entity | null
}
export type Entity = Person | Starship
