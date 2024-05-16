import { User } from "../users/User"

export interface GroupDTO {
    id: number
    name: string
    description: string
    year: number
    courseId: string
    roomId: string
    users: User[]
}

/*
    private Long id;

    @NotNull
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Integer year;

    @NotNull
    private Integer courseId;

    private Long roomId;

    private List<UserInfoDTO> users;
*/