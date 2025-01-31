
export interface Alarm {
    id: number,
    created_at: string,
    description: string,
    location: string,
    units: string,
    status: number
}

export interface User {
    id?: string | undefined;
    first_name: string;
    last_name: string;
    number: number;
    phone: string;
    truck?: boolean;
    smoke?: boolean;
};

export interface Response {
    id: number,
    status: string,
    created_at: string,
    minutes: number,
    created_by: string
}

export interface Unit {
    id: number,
    created_at: string,
    unit: string,
    alarm_id: number
}

export interface ConfirmedResponse extends Response {
    arrivalTime: Date;
    timeLeft: number;
}

export interface PrettyDateOptions {
    date?: boolean; // Inkludera datum
    time?: boolean; // Inkludera tid
};