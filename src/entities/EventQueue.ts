import GEvent from './GEvent';
import moment, { Moment } from 'moment';
import { EventType } from './GEvent';

export const GE_METRE_TIME_REMAIN = 'GE_METRE_TIME_REMAIN';
// export const METRE_DURATION = 18000;

// const TIME_WORK_START = [8, 40, 0];
// const TIME_MORNING_REST_START = [10, 15, 0];
// const TIME_WORK_RESUME = [10, 30, 0];
// const TIME_LANUCH_START = [11, 30, 0];
// const TIME_AFTERNOOT_WORK_START = [12, 30, 0];
// const TIME_AFTERNOON_REST_START = [15, 15, 0];
// const TIME_AFTERNOON_WORK_RESUME = [15, 30, 0];
// const TIME_END_OF_WORK_DAY = [17, 30, 0];
let testHour = 19;
let testMinutes = 45;
export const METRE_DURATION = 10;
const TIME_WORK_START = [testHour, testMinutes, 0];
const TIME_MORNING_REST_START = [testHour, testMinutes, 30];
const TIME_WORK_RESUME = [testHour, testMinutes + 1, 0];
const TIME_LANUCH_START = [testHour, testMinutes + 1, 30];
const TIME_AFTERNOOT_WORK_START = [testHour, testMinutes + 2, 0];
const TIME_AFTERNOON_REST_START = [testHour, testMinutes + 2, 30];
const TIME_AFTERNOON_WORK_RESUME = [testHour, testMinutes + 3, 0];
const TIME_END_OF_WORK_DAY = [testHour, testMinutes + 3, 30];

const morningWorkStartAt = moment().hour(TIME_WORK_START[0]).minute(TIME_WORK_START[1]).second(TIME_WORK_START[2]);
const morningRestStartAt = moment().hour(TIME_MORNING_REST_START[0]).minute(TIME_MORNING_REST_START[1]).second(TIME_MORNING_REST_START[2]);
const morningWorkResumeAt = moment().hour(TIME_WORK_RESUME[0]).minute(TIME_WORK_RESUME[1]).second(TIME_WORK_RESUME[2]);
const LanuchStartAt = moment().hour(TIME_LANUCH_START[0]).minute(TIME_LANUCH_START[1]).second(TIME_LANUCH_START[2]);
const afternoonWorkStartAt = moment().hour(TIME_AFTERNOOT_WORK_START[0]).minute(TIME_AFTERNOOT_WORK_START[1]).second(TIME_AFTERNOOT_WORK_START[2]);
const afternoonRestStartAt = moment().hour(TIME_AFTERNOON_REST_START[0]).minute(TIME_AFTERNOON_REST_START[1]).second(TIME_AFTERNOON_REST_START[2]);
const afternoonWorkResumeAt = moment().hour(TIME_AFTERNOON_WORK_RESUME[0]).minute(TIME_AFTERNOON_WORK_RESUME[1]).second(TIME_AFTERNOON_WORK_RESUME[2]);
const workEndAt = moment().hour(TIME_END_OF_WORK_DAY[0]).minute(TIME_END_OF_WORK_DAY[1]).second(TIME_END_OF_WORK_DAY[2]);


export default class EventQueue {
    private _queue: GEvent;
    private _list: GEvent[];
    constructor() {

        const morningWorkStart = new GEvent(EventType.Work, morningWorkStartAt, 'Work in the morning');
        this._queue = morningWorkStart ;

        const morningRest = new GEvent(EventType.Break, morningRestStartAt, 'Break in the morning');
        morningWorkStart.next = morningRest;

        const morningWorkResume = new GEvent(EventType.Work, morningWorkResumeAt, 'Work in the morning');
        morningRest.next = morningWorkResume ;

        const launch = new GEvent(EventType.Break, LanuchStartAt, 'Launch time');
        morningWorkResume.next = launch;

        const afternoonWorkStart = new GEvent(EventType.Work, afternoonWorkStartAt, 'Work in the afternoon');
        launch.next = afternoonWorkStart;

        const afternoonRest = new GEvent(EventType.Break, afternoonRestStartAt, 'Break in the afternoon');
        afternoonWorkStart.next = afternoonRest;

        const afternooWorkResume = new GEvent(EventType.Work, afternoonWorkResumeAt, 'Work in the afternoon');
        afternoonRest.next = afternooWorkResume;

        const workEnd = new GEvent(EventType.Break, workEndAt, 'Let\'s call it a day');
        afternooWorkResume.next = workEnd;

        this._list = [morningWorkStart, morningRest, morningWorkResume, launch, afternoonWorkStart, afternoonRest, afternooWorkResume, workEnd]
    }

    getCurrentEvent(time?: Moment) {
        time = time ? time : moment();
        let event = this._queue;
        while(event && event.next) {
            if (time.diff(event.startAt) >= 0 && event.next.startAt.diff(time) > 0) {
                return event;
            }
            event = event.next;
        }
        return null;
    }

    getEventList () {
        return this._list;
    }
}