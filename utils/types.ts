
export interface Alarm {
    id: number,
    created_at: string,
    description: string,
    location: string,
    units: string,
    status: number
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    number: number;
    phone: string;
};

export interface Response {
    id: number,
    status: string, 
    created_at: string, 
    minutes: number, 
    created_by: string
}

export interface ConfirmedResponse extends Response {
    arrivalTime: Date;
    timeLeft: number;
}

export interface PrettyDateOptions {
    date?: boolean; // Inkludera datum
    time?: boolean; // Inkludera tid
};