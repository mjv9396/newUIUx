export class ResponseModel {
    authority: string;
    token: string;
    type: string;
    username: string;
    constructor(){
        this.authority = "";
        this.token = ""; 
        this.type = "";
        this.username = ""; 
    }
}