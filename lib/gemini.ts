import { GoogleGenerativeAI } from "@google/generative-ai";
export async function optimizeWithGemini(resumeText:string,job:{title:string,company:string,description:string}){
  const key=process.env.GEMINI_API_KEY;if(!key)throw new Error("Gemini is not configured.");
  const gen=new GoogleGenerativeAI(key).getGenerativeModel({model:process.env.GEMINI_MODEL||"gemini-2.5-flash"});
  const prompt=`You are a truthful ATS resume optimizer. Return ONLY valid JSON with keys matchScore (0-100 integer), matchedKeywords (string[]), missingKeywords (string[]), summary (string), bullets (string[]), changes (string[]).
RULES: The resume is the only evidence. Never invent employers, degrees, certifications, skills, dates, metrics, tools, responsibilities, or years of experience. If a requirement is unsupported, put it in missingKeywords and do not add it to the resume. Improve wording only using facts present in the resume. Keep bullets concise and achievement-oriented without inventing numbers.
JOB TITLE: ${job.title}
COMPANY: ${job.company}
JOB DESCRIPTION:
${job.description}
MASTER RESUME:
${resumeText}`;
  const r=await gen.generateContent(prompt); const raw=r.response.text().replace(/^```json\s*|\s*```$/g,"").trim();
  const out=JSON.parse(raw);
  return {matchScore:Math.max(0,Math.min(100,Number(out.matchScore)||0)),matchedKeywords:Array.isArray(out.matchedKeywords)?out.matchedKeywords:[],missingKeywords:Array.isArray(out.missingKeywords)?out.missingKeywords:[],summary:String(out.summary||""),bullets:Array.isArray(out.bullets)?out.bullets.map(String):[],changes:Array.isArray(out.changes)?out.changes.map(String):[]};
}
