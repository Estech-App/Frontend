import { RoomTimeTable } from "./RoomTimeTable";

export interface Room {
    id: number | null
    name: string;
    description: string;
    mentoringRoom: boolean
    studyRoom: boolean
    timeTables: RoomTimeTable[]
}