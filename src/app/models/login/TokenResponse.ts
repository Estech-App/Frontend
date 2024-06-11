export interface TokenResponse {
    token: string
    username: string
    roles: [
        {
            authority: string
        }
    ]
}