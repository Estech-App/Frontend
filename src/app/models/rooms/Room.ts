export interface Room {
    id: number | null
    name: string;
    description: string;
    mentoringRoom: boolean
    studyRoom: boolean
    freeUsages: [
        {
            id: number | null
        }
    ]
    mentorings: [
        {
            id: number | null
        }
    ]
    stocks: [
        {
            id: number | null
        }
    ]
    groups: [
        {
            id: number | null
        }
    ]
    roomTimeTables: [
        {
            id: number | null
        }
    ]
}