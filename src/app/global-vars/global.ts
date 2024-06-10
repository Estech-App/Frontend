import { HttpHeaders } from "@angular/common/http";

export const Constants = {
    BASE_URL: "https://app.escuelaestech.com.es/",
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}
