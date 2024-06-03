import { Group } from "../groups/Group";

export interface Student {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    password: string;
    groups: Group[];
}