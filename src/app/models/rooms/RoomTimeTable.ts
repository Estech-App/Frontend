export interface RoomTimeTable {
    id: number | null | string
    status: string
    start: string
    end: string
    roomId: number | null | string
    reccurence: boolean
}