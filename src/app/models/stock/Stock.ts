import { Room } from "../rooms/Room"

export interface Stock {
    id: number | null
    name: string
    description: string
    quantity: number
    room: {
        id: number | null,
        name: string
    }
}