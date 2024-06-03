import { ModuleDTO } from "../module/ModuleDTO";

export interface Teacher {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    password: string;
    modules: ModuleDTO[];
}