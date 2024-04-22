export interface Checkin {
    id: number | null
    date: string
    checkIn: boolean
    user: {
        id: string
    }
}