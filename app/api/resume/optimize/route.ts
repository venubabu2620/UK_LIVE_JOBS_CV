import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { optimizeWithGemini } from "@/lib/gemini";
export const runtime="nodejs";
export async function POST(req:Request){
 try{
  const u=await requireUser(); const {resumeId,jobId}=await req.json();
  const resume=await db.resume.findFirst({where:{id:resumeId,userId:(u as any).id}}); const job=await db.job.findUnique({where:{id:jobId}});
  if(!resume||!job)return NextResponse.json({error:"Resume or job not found."},{status:404});
  const result=await optimizeWithGemini(resume.sourceText,{title:job.title,company:job.company,description:job.description});
  const run=await db.aiRun.create({data:{userId:(u as any).id,resumeId,jobId,provider:"gemini",model:process.env.GEMINI_MODEL,resultJson:result,status:"SUCCESS"}});
  return NextResponse.json({id:run.id,result});
 }catch(e){return NextResponse.json({error:"AI optimization is temporarily unavailable."},{status:503});}
}
