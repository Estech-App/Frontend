import { RoomTimeTable } from "./RoomTimeTable";

export interface Room {
    id: number | null
    name: string;
    description: string;
    mentoringRoom: boolean
    studyRoom: boolean
    //TODO: Change to Group[]
    groups: [
        {
            id: number | null
        }
    ]
    timeTables: RoomTimeTable[]
}