import { syncAdzuna } from "../lib/job-sync";
syncAdzuna().then(x=>{console.log(x);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)});
