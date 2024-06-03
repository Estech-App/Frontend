import { Room } from "../rooms/Room"
import { User } from "../users/User"

export interface FreeUsage {
    id: number | null
	start: string
	end: string
    status: string
    room: Room
    user: User
}
