
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

export interface ConfirmedResponse {
    created_at: string;
    minutes: number;
    created_by: string;
    arrivalTime: Date;
    timeLeft: number;
  }