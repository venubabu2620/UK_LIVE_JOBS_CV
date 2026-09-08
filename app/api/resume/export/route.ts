import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Document,Packer,Paragraph,TextRun,HeadingLevel } from "docx";
import PDFDocument from "pdfkit";
export const runtime="nodejs";
export async function POST(req:Request){
 try{
  const u=await requireUser(); const body=await req.json(); const format=body.format; const result=body.result;
  if(!["pdf","docx"].includes(format)||!result)return NextResponse.json({error:"Invalid export."},{status:400});
  const lines=[result.summary||"",...(result.bullets||[])].filter(Boolean);
  if(format==="docx"){
   const doc=new Document({sections:[{children:[new Paragraph({text:"UK Live IT Jobs — Optimized Resume",heading:HeadingLevel.TITLE}),new Paragraph(result.summary||""),...((result.bullets||[]).map((x:string)=>new Paragraph({children:[new TextRun({text:x})],bullet:{level:0}})))]}]});
const buf = await Packer.toBuffer(doc);

return new NextResponse(new Uint8Array(buf), {
  headers: {
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition":
      'attachment; filename="optimized-resume.docx"',
  },
});
  }
  const chunks:Buffer[]=[]; const pdf=new PDFDocument({margin:54}); pdf.on("data",(d:Buffer)=>chunks.push(d));
  pdf.fontSize(20).text("UK Live IT Jobs — Optimized Resume"); pdf.moveDown(); pdf.fontSize(11).text(lines.join("\n\n")); pdf.end();
  await new Promise<void>(r=>pdf.on("end",()=>r())); return new NextResponse(Buffer.concat(chunks),{headers:{"Content-Type":"application/pdf","Content-Disposition":"attachment; filename=\"optimized-resume.pdf\""}});
 }catch(e){return NextResponse.json({error:"Export failed."},{status:500});}
}
