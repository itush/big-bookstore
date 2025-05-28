import { Query } from "./query";
import { Mutation } from "./mutation";
import { Types } from "./types";

export const resolvers = { 
    Query, 
    Mutation, 
    ...Types,
 };