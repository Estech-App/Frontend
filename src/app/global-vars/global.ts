import { HttpHeaders } from "@angular/common/http";

export const Constants = {
    BASE_URL: "http://192.168.192.108:8080/",
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}