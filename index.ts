import { Observable, from, of, pipe } from "rxjs";
import {map, startWith, mergeAll, filter, mapTo} from 'rxjs/operators';
import {OperatorFunction} from "rxjs/internal/types";

interface ResponseData<T> {
    data: T[]
}

interface MenuItem {
    name: string,
    price: number,
}

interface Restaurant {
    _id: string,
    name: string,
    slug: string,
//     address: {
//         street: string,
//         city: string,
//         state: string,
//         zip: string
//     },
//     images: {
//         thumbnail: string,
//         owner: string,
//         banner: string,
//     }
//     menu: {
//         lunch: Array<MenuItem>,
//         dinner: Array<MenuItem>
//     }
}

interface Status<T> {
    value?: T;
    status: string;
    isPending: boolean,
    isResolved: boolean,
    isRejected: boolean
}

function toStatus<T>(value: T) : Status<T> {
    return {
        status: "resolved",
        value: value,
        isPending: false,
        isResolved: true,
        isRejected: true
    };
}
const toStatusObject = map( toStatus );

function gettingData<T>(obj: ResponseData<T>, index: number):Array<T>{
    return obj.data;
}
//const responseToStatus = pipe(mapToData, toStatusObject, startPending);

const sampleData: ResponseData<Restaurant> = {
    data: [
        {
            _id: '123',
            name: 'foo-1',
            slug: 'foo-1'
        },
        {
            _id: '456',
            name: 'foo-2',
            slug: 'foo-2'
        },
    ]
};

const mapToData = map(gettingData);
const mapToStatus = map(toStatus);
const firstStatus = startWith<Status<any>>(
    {
        value: undefined,
        status: "waiting",
        isPending: false,
        isResolved: false,
        isRejected: false
    }
);
const resp:Observable<ResponseData<Restaurant>> = of(sampleData);
const processing = pipe(mapToData, mapToStatus, firstStatus);
const restArr = resp.pipe(processing);
restArr.subscribe((v) => {
    if (v.value && v.value.length) {
        // note that .name works without error, Restaurant type is being inferred correctly
        console.log(v.value[0].name);
    }
});

const data: string = 'something';
const mapToLength = map((data:string) => data.length);
const obs = of(data);
obs.pipe(mapToLength).subscribe((v) => {
   console.log(v.toExponential());
});