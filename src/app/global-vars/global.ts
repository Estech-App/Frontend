import { HttpHeaders } from "@angular/common/http";

export const Constants = {
    BASE_URL: "http://localhost:8080/",
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}