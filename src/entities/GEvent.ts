import { Moment } from "moment";

export enum EventType {
    Work = 'work', // Production metre
    Break =  'break', // Launch or end of the work
}

export enum EventStatus {
    Initiated = 0,
    Start,
    Pause,
    Finish
}
export default class GEvent {
    next?: GEvent;
    startAt: Moment;
    name: String;
    type: EventType;

    constructor(type: EventType, startAt: Moment, name: string ) {
        this.startAt = startAt;
        this.name = name;
        this.type = type;
        this.next = undefined;
    }
}