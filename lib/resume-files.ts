import pdfParse from "pdf-parse";
export async function extractPdf(buffer:Buffer){const r=await pdfParse(buffer);return r.text.trim();}
export async function extractDocx(buffer:Buffer){
  // DOCX is a ZIP/XML container. A production deployment should use a hardened DOCX parser.
  const { unzipSync } = await import("fflate");
  const files=unzipSync(new Uint8Array(buffer)); const xml=files["word/document.xml"];
  if(!xml)throw new Error("Invalid DOCX");
  const text=new TextDecoder().decode(xml).replace(/<w:tab\/>/g," ").replace(/<\/w:p>/g,"\n").replace(/<[^>]+>/g," ");
  return text.replace(/\s+/g," ").trim();
}
