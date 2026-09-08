import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email().transform(x=>x.toLowerCase()),password:z.string().min(8).max(100)});
export async function POST(req:Request){
  const p=schema.safeParse(await req.json()); if(!p.success)return NextResponse.json({error:"Invalid details."},{status:400});
  const {name,email,password}=p.data; if(await db.user.findUnique({where:{email}}))return NextResponse.json({error:"Account already exists."},{status:409});
  const user=await db.user.create({data:{name,email,passwordHash:await bcrypt.hash(password,12),profile:{create:{desiredTitles:[],skills:[],preferredLocations:[],employmentTypes:[]}}},select:{id:true,email:true,name:true}});
  return NextResponse.json({user},{status:201});
}
