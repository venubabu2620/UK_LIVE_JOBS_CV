import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";
import { titleMatches } from "@/lib/it-classifier";
export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams.get("q")||""; const location=req.nextUrl.searchParams.get("location")||"";
 try{
  const jobs=await db.job.findMany({where:{isActive:true, ...(location?{location:{contains:location,mode:"insensitive"}}:{})},orderBy:{updatedAt:"desc"},take:100});
  return NextResponse.json({jobs:jobs.filter(j=>titleMatches(j.title,q))});
 }catch(e){return NextResponse.json({error:"Search unavailable."},{status:500});}
}
