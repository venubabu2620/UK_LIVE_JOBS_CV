import { db } from "@/lib/db";
import { fetchAdzunaPage, normalizeAdzuna } from "@/lib/adzuna";
export async function syncAdzuna(pages=3){
  const run=await db.jobSyncRun.create({data:{source:"adzuna",status:"RUNNING"}});
  let created=0,updated=0,skipped=0;
  try{
    for(let page=1;page<=pages;page++){
      const data=await fetchAdzunaPage(page);
      for(const raw of data.results){
        const j=normalizeAdzuna(raw); if(!j.isIT){skipped++;continue;}
        const where={source_externalId:{source:j.source,externalId:j.externalId}};
        const old=await db.job.findUnique({where});
        await db.job.upsert({where,create:{...j,isIT:undefined} as any,update:{title:j.title,company:j.company,location:j.location,category:j.category,description:j.description,applicationUrl:j.applicationUrl,salaryMin:j.salaryMin,salaryMax:j.salaryMax,employmentType:j.employmentType,postedAt:j.postedAt,itConfidence:j.itConfidence,lastSeenAt:new Date(),isActive:true}});
        old?updated++:created++;
      }
    }
    await db.jobSyncRun.update({where:{id:run.id},data:{status:"SUCCESS",finishedAt:new Date(),created,updated,skipped}});
    return {created,updated,skipped};
  }catch(e){await db.jobSyncRun.update({where:{id:run.id},data:{status:"FAILED",finishedAt:new Date(),created,updated,skipped,error:String(e)}});throw e;}
}
