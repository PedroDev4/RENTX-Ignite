import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    dateNow(): Date {
        return dayjs().toDate();
    }
    compareInHours(start_date: Date, end_date: Date): number {
        const end_dateUTC = this.covertToUTC(end_date);
        const start_dateUTC = this.covertToUTC(start_date);

        return dayjs(end_dateUTC).diff(start_dateUTC, "hours");
    }

    covertToUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    compareInDays(start_date: Date, end_date: Date): number {
        const end_dateUTC = this.covertToUTC(end_date);
        const start_dateUTC = this.covertToUTC(start_date);

        return dayjs(end_dateUTC).diff(start_dateUTC, "days");
    }
}

export { DayjsDateProvider };
