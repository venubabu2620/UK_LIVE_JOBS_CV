import { classifyIT } from "@/lib/it-classifier";
export type AdzunaJob = {
  id:string; title:string; description:string; redirect_url:string; company?:{display_name?:string};
  location?:{display_name?:string}; category?:{label?:string;tag?:string};
  created?:string; salary_min?:number; salary_max?:number; contract_type?:string; contract_time?:string;
};
export async function fetchAdzunaPage(page=1, params:Record<string,string|number>={}){
  const appId=process.env.ADZUNA_APP_ID, appKey=process.env.ADZUNA_APP_KEY;
  if(!appId||!appKey) throw new Error("Adzuna credentials are not configured.");
  const u=new URL(`https://api.adzuna.com/v1/api/jobs/gb/search/${page}`);
  u.searchParams.set("app_id",appId);u.searchParams.set("app_key",appKey);u.searchParams.set("content-type","application/json");
  u.searchParams.set("results_per_page",String(params.results_per_page??50));
  u.searchParams.set("category","it-jobs");
  for(const [k,v] of Object.entries(params)) if(k!=="results_per_page")u.searchParams.set(k,String(v));
  const r=await fetch(u,{cache:"no-store"}); if(!r.ok)throw new Error(`Adzuna ${r.status}`);
  return r.json() as Promise<{results:AdzunaJob[];count:number}>;
}
export function normalizeAdzuna(j:AdzunaJob){
  const category=j.category?.label||j.category?.tag||"IT Jobs";
  const cls=classifyIT(j.title,j.description,category);
  return {externalId:String(j.id),source:"adzuna",title:j.title.trim(),company:j.company?.display_name?.trim()||"Unknown company",location:j.location?.display_name,category,description:j.description,applicationUrl:j.redirect_url,postedAt:j.created?new Date(j.created):undefined,salaryMin:j.salary_min,salaryMax:j.salary_max,employmentType:[j.contract_time,j.contract_type].filter(Boolean).join(" / ")||undefined,itConfidence:cls.confidence,isIT:cls.isIT};
}
