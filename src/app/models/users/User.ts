export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    course: {
        id: string
    }
    group: {
        id: string
    }
}