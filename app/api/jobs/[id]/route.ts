import {NextResponse} from "next/server"; import {db} from "@/lib/db";
export async function GET(_:Request,{params}:{params:{id:string}}){const j=await db.job.findUnique({where:{id:params.id}});return j?NextResponse.json(j):NextResponse.json({error:"Not found"},{status:404})}
