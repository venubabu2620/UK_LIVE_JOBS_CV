const IT_TERMS = [
  "software","developer","engineer","engineering","frontend","front-end","backend","back-end",
  "full stack","full-stack","react","node.js","nodejs","typescript","javascript","python",
  "java developer","c#","dotnet",".net","php","ruby","golang","ios","android","mobile",
  "devops","cloud","aws","azure","gcp","data engineer","data scientist","machine learning",
  "artificial intelligence","ai engineer","cybersecurity","security engineer","qa engineer",
  "test automation","database","sql","solutions architect","technical architect","sre",
  "site reliability","platform engineer","systems administrator","network engineer",
  "it support","information technology","help desk","technical support","scrum master",
  "technical product manager","product manager technology"
];
const NON_IT_HINTS=["sales","retail","chef","nurse","driver","warehouse","care assistant","waiter","accountant","recruitment consultant"];
export function classifyIT(title:string,description:string,category?:string){
  const t=`${title} ${description} ${category||""}`.toLowerCase();
  const titleHit=IT_TERMS.some(x=>title.toLowerCase().includes(x));
  const contextHits=IT_TERMS.filter(x=>t.includes(x)).length;
  const non=NON_IT_HINTS.some(x=>title.toLowerCase().includes(x));
  let confidence=Math.min(0.99,(titleHit?0.72:0)+(contextHits>=2?0.2:contextHits===1?0.1:0)-(non?0.45:0));
  if(category?.toLowerCase().includes("it")) confidence=Math.max(confidence,0.9);
  return {isIT:confidence>=0.6,confidence};
}
export function titleMatches(title:string,q:string){return !q.trim()||title.toLocaleLowerCase().includes(q.trim().toLocaleLowerCase())}
