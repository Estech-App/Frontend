import { Module } from "../modules/Module";

export interface Teacher {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    password: string;
    modules: Module[];
}