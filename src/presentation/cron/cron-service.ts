import { CronJob } from 'cron';

type CronTime = string | Date;
type OnTick = () => void;
type TimeZone = string;


export class CronService  {


  static createJob( cronTime: CronTime, onTick: OnTick, timeZone: TimeZone ): CronJob {

    const job = new CronJob( cronTime,onTick, undefined, undefined, timeZone );
    
    job.start();
    
    return job;

  }


}

