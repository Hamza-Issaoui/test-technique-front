export class Register {
    firstname: string;
    lastname: string;
    phone: number | null;
    email: string;
    password: string;
    role: string;

    constructor() {
        this.firstname = '';
        this.lastname = '';
        this.phone = null;
        this.email = '';
        this.password = '';
        this.role = '';
    }
}