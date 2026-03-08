import { useState, useEffect, useRef } from "react";

// ── נתונים ───────────────────────────────────────────────────────────────────

const ITEMS = {
  contracts: [
    { id:1, title:"DIU Counter-UAS Open Call 2025", source:"Defense Innovation Unit", url:"https://www.diu.mil/work-with-us/solicitations", country:"ארה״ב", flag:"🇺🇸", budget:"$8M", budgetNum:8, deadline:"15.04.2025", urgency:"critical", fitScore:96, tag:"OTA", domain:"Counter-UAS", why:"Aerosentry (TRL 7) ו-Sky Fort (TRL 5) עונות ישירות. גבעון היחידה עם שתי מערכות C-UAS מקבילות.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["Aerosentry TRL 7 — התאמה טכנולוגית מלאה","Sky Fort TRL 5 — C-UAS נחיל","OTA = מסלול רכש מהיר","DIU = שותף אסטרטגי"] },
    { id:2, title:"מפא״ת — הגנת נקודה נגד נחילים", source:"מלמ״ב / מפא״ת", url:"https://www.mod.gov.il", country:"ישראל", flag:"🇮🇱", budget:"₪12M", budgetNum:12, deadline:"20.04.2025", urgency:"critical", fitScore:98, tag:"מלמ״ב", domain:"Counter-UAS", why:"Sky Fort + Aerosentry — stack מלא DTID. אין מתחרה ישראלי.", status:"בבדיקה", bookmarked:true, isNew:false, fitReasons:["Sky Fort + Aerosentry — stack מלא","מפא״ת = קשר אישי","אין מתחרה ישראלי","TRL 7 — בשל לפריסה"] },
    { id:3, title:"EDF — ISR רב-תחומי", source:"European Defence Fund", url:"https://defence-industry-space.ec.europa.eu", country:"אירופה", flag:"🇪🇺", budget:"€12M", budgetNum:12, deadline:"20.05.2025", urgency:"medium", fitScore:82, tag:"EDF", domain:"Aerial ISR", why:"Daya IRIS-20 — כיסוי 100 ק״מ, עלות נמוכה ב-80%. ישראל זכאית.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["Daya IRIS-20 — כיסוי 100 ק״מ","ישראל זכאית ל-EDF","עלות נמוכה ב-80%","EDF = מימון אירופי"] },
    { id:4, title:"מלמ״ב — אנרגיה שדה הקרב", source:"מלמ״ב", url:"https://www.mod.gov.il", country:"ישראל", flag:"🇮🇱", budget:"₪8M", budgetNum:8, deadline:"28.03.2025", urgency:"critical", fitScore:97, tag:"מלמ״ב", domain:"Tactical Energy", why:"DFM Power TRL 9 — הפתרון הבשל ביותר. אין מתחרה.", status:"בבדיקה", bookmarked:true, isNew:false, fitReasons:["DFM Power TRL 9 — בשל לשוק","מלמ״ב = קשר אישי","אין מתחרה ישראלי","300 ק״ג nano-grid"] },
    { id:5, title:"UK MOD — ניטור גבולות AI", source:"UK Ministry of Defence", url:"https://www.find-tender.service.gov.uk", country:"בריטניה", flag:"🇬🇧", budget:"£5.5M", budgetNum:5.5, deadline:"10.06.2025", urgency:"high", fitScore:88, tag:"MOD", domain:"Border Security", why:"Guardian Angel TRL 7 + guaRdF — bundle שלם עם NATO compliance.", status:"פתוח", bookmarked:false, isNew:false, fitReasons:["Guardian Angel TRL 7","guaRdF RF sensing","NATO compliance","UK DASA פתוחה לישראל"] },
    { id:6, title:"AFWERX SBIR — Vision ללא GPS", source:"AFWERX / USAF", url:"https://afwerx.com/sbir/", country:"ארה״ב", flag:"🇺🇸", budget:"$1.5M", budgetNum:1.5, deadline:"30.04.2025", urgency:"high", fitScore:89, tag:"SBIR", domain:"Vision AI", why:"iCit + Cyberbee — שניהם ב-Solutions. AFWERX = transition מהיר.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["iCit Vision Agents","Cyberbee GNSS-denied","AFWERX = מסלול מהיר","SBIR Phase II funding"] },
    { id:9, title:"DIU — Tactical Energy OTA", source:"Defense Innovation Unit", url:"https://www.diu.mil", country:"ארה״ב", flag:"🇺🇸", budget:"$3.5M", budgetNum:3.5, deadline:"10.05.2025", urgency:"high", fitScore:93, tag:"OTA", domain:"Tactical Energy", why:"DFM Power TRL 9 — field-ready. OTA = ללא תהליך רכש ארוך.", status:"פתוח", bookmarked:true, isNew:false, fitReasons:["DFM Power TRL 9","OTA = ללא רכש ארוך","DIU = שותף מרכזי","field-ready"] },
    { id:100, title:"ארה״ב — RFI C-UAV בעלות-נמוכה (סיבט)", source:"US Army / סיבט", url:"https://sibatexprt.mod.gov.il/businessinfo/Pages/default.aspx?indexTab=מכרזים", country:"ארה״ב", flag:"🇺🇸", budget:"TBD", budgetNum:0, deadline:"25.03.2026", urgency:"critical", fitScore:95, tag:"RFI", domain:"Counter-UAS", why:"Aerosentry TRL 7 ו-Sky Fort TRL 5 עונות בדיוק. הצבא מחפש פתרון שגבעון יכולה לספק עכשיו.", status:"פתוח", bookmarked:true, isNew:true, fitReasons:["Aerosentry TRL 7","Sky Fort TRL 5","בעלות-נמוכה","deadline 25/03"] },
    { id:101, title:"ארה״ב — RFI HMIF חבילות חימוש אוטונומיות (סיבט)", source:"US Army / סיבט", url:"https://sibatexprt.mod.gov.il/businessinfo/Pages/default.aspx?indexTab=מכרזים", country:"ארה״ב", flag:"🇺🇸", budget:"TBD", budgetNum:0, deadline:"09.03.2026", urgency:"critical", fitScore:91, tag:"RFI", domain:"Swarm AI", why:"HMIF מחפש autonomous modular munition packages — Crebain decentralized swarm הוא המוצר המדויק.", status:"פתוח", bookmarked:true, isNew:true, fitReasons:["Crebain hardware-agnostic","OTA = מסלול מהיר","deadline 09/03"] },
    { id:102, title:"איטליה — 50 רחפני VTOL EO/IR €22.3M (סיבט)", source:"חימוש אווירי איטליה / סיבט", url:"https://sibatexprt.mod.gov.il/businessinfo/Pages/default.aspx?indexTab=מכרזים", country:"איטליה", flag:"🇮🇹", budget:"€22.3M", budgetNum:22.3, deadline:"09.03.2026", urgency:"critical", fitScore:88, tag:"RFP", domain:"Aerial ISR", why:"Daya IRIS-20 עם עלות נמוכה ב-80%. €22.3M חוזה משמעותי.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["Daya IRIS-20","€22.3M","EO/IR/LIDAR","NATO"] },
    { id:103, title:"ארה״ב — RFSB CAML רכב מוביל אוטונומי (סיבט)", source:"US Army / סיבט", url:"https://sibatexprt.mod.gov.il/businessinfo/Pages/default.aspx?indexTab=מכרזים", country:"ארה״ב", flag:"🇺🇸", budget:"TBD", budgetNum:0, deadline:"27.03.2026", urgency:"high", fitScore:85, tag:"RFSB", domain:"Swarm AI", why:"CAML Leader — Mokoushla + Crebain Leader-Follower = פתרון מושלם.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["Mokoushla UGV","Crebain swarm","Leader-Follower"] },
    { id:104, title:"ארה״ב — DARPA CyPhER Forge Digital Twin (סיבט)", source:"DARPA / סיבט", url:"https://sibatexprt.mod.gov.il/businessinfo/Pages/default.aspx?indexTab=מכרזים", country:"ארה״ב", flag:"🇺🇸", budget:"TBD", budgetNum:0, deadline:"01.06.2026", urgency:"high", fitScore:82, tag:"DARPA", domain:"Vision AI", why:"Digital Twin + AI — D-COE ישירות רלוונטי. DARPA = credibility.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["D-COE סימולציה","DARPA credibility","Visual Layer"] },
    { id:105, title:"הונגריה — 14 רחפנים תרמיים + עיבוד נתונים (סיבט)", source:"משטרה הונגריה / סיבט", url:"https://sibatexprt.mod.gov.il/businessinfo/Pages/default.aspx?indexTab=מכרזים", country:"הונגריה", flag:"🇭🇺", budget:"TBD", budgetNum:0, deadline:"09.04.2026", urgency:"high", fitScore:78, tag:"RFP", domain:"Aerial ISR", why:"ISR UAV thermal + data processing — Daya IRIS-20 + iCit. מזרח אירופה buying mode.", status:"פתוח", bookmarked:false, isNew:true, fitReasons:["Daya IRIS-20 thermal","iCit data","NATO מזרח אירופה"] },
  ],
  partners: [
    { id:10, title:"Rheinmetall — C-UAS לאירופה", source:"Rheinmetall AG", url:"https://www.rheinmetall.com/en", country:"גרמניה", flag:"🇩🇪", type:"שותפות טכנולוגית", status:"לבדיקה", bookmarked:false, fit:93, why:"Aerosentry + Sky Fort מדברות לצרכים שלהם. שיתוף = אירופה כולה.", signal:"פרסמה דרושים C-UAS System Integration — 3 שבועות" },
    { id:11, title:"Anduril — נחיל אוטונומי", source:"Anduril Industries", url:"https://www.anduril.com", country:"ארה״ב", flag:"🇺🇸", type:"שותפות מוצר", status:"לבדיקה", bookmarked:false, fit:88, why:"Lattice OS + Crebain = שילוב טבעי. פותח DoD ישירות.", signal:"השיקה Roadrunner — מחפשת swarm AI partners — 2 שבועות" },
    { id:12, title:"KNDS — פלטפורמות קרקע", source:"KNDS Group", url:"https://www.knds.com", country:"אירופה", flag:"🇪🇺", type:"שילוב מערכות", status:"חדש", bookmarked:true, fit:91, why:"Mokoushla + Daya = שילוב מדויק לפלטפורמות החדשות.", signal:"פרסמה RFI autonomous ground systems — שבוע" },
  ],
  investors: [
    { id:20, title:"Shield Capital — Fund III $250M", source:"Shield Capital", url:"https://www.shieldcap.com", country:"ארה״ב", flag:"🇺🇸", focus:"Defense Deep-Tech", stage:"Series A–C", bookmarked:false, fit:95, why:"Counter-UAS + Autonomy = התאמה מדויקת. סגרו fund חדש — מחפשים actively.", signal:"סגרו $250M Fund III — חודש" },
    { id:21, title:"NATO Innovation Fund", source:"NATO Innovation Fund", url:"https://www.natoinnovationfund.nato.int", country:"נאט״ו", flag:"🏛️", focus:"Dual-Use Deep-Tech", stage:"Seed–Series B", bookmarked:true, fit:90, why:"NIF משקיע ב-Israeli associated companies. Crebain + Daya = fit.", signal:"פתחו קול קורא לחברות ישראליות — 2 שבועות" },
    { id:22, title:"In-Q-Tel — Emerging Tech", source:"In-Q-Tel", url:"https://www.iqt.org", country:"ארה״ב", flag:"🇺🇸", focus:"Intelligence AI", stage:"Early Stage", bookmarked:false, fit:82, why:"iCit + Visual Layer מועמדות חזקות. IQT = פתח לקהילת המודיעין.", signal:"פרסמו RFI Computer Vision for ISR — חודשיים" },
  ],
  grants: [
    { id:30, title:"NATO DIANA — אתגר נגד-נחיל", source:"NATO DIANA", url:"https://www.diana.nato.int/challenges", country:"נאט״ו", flag:"🏛️", prize:"€3.5M", budgetNum:3.5, deadline:"01.04.2025", urgency:"high", bookmarked:true, fitScore:94, why:"Crebain (TRL 5) decentralized swarm — מועמדת מושלמת. ישראל זכאית.", status:"בבדיקה" },
    { id:31, title:"EIC Accelerator — Dual-Use Defense", source:"European Innovation Council", url:"https://eic.ec.europa.eu", country:"אירופה", flag:"🇪🇺", prize:"€2.5M + equity", budgetNum:2.5, deadline:"15.05.2025", urgency:"medium", bookmarked:false, fitScore:88, why:"Guardian Angel + DFM dual-use. EIC מממנת TRL 5→9. ישראל זכאית.", status:"פתוח" },
    { id:32, title:"AFWERX — אנרגיה טקטית", source:"AFWERX / USAF", url:"https://afwerx.com/challenges/", country:"ארה״ב", flag:"🇺🇸", prize:"$1.2M", budgetNum:1.2, deadline:"30.04.2025", urgency:"high", bookmarked:false, fitScore:92, why:"DFM TRL 9 — הפתרון הבשל ביותר. ניצחון = חוזה DoD ישיר.", status:"פתוח" },
  ],
  ventures: [
    { id:40, title:"אין C-Drone solution עירוני", source:"ניתוח שוק", url:"https://www.rand.org/topics/drones.html", urgency:"critical", bookmarked:true, gap:"פער מבצעי", why:"non-kinetic + acoustic + visual AI = שוק מיליארדים. אף אחד לא שם.", signals:["עלייה 340% בתקיפות דרונים — RAND","NATO מחפש non-kinetic urban C-UAS","DIU פרסמה RFI ספציפי"] },
    { id:41, title:"ISR זול לרמת גדוד — לא קיים", source:"ניתוח שוק", url:"https://www.ukdasa.com/challenges", urgency:"high", bookmarked:false, gap:"פער טכנולוגי", why:"Daya מכסה חטיבה. ברמת גדוד — אין. עשרות מדינות NATO צריכות.", signals:["פולין מחפשת ISR גדוד","Baltic states RFI tactical","UK DASA Tactical ISR"] },
    { id:42, title:"אנרגיה ייעודית ל-C-UAS ניידים", source:"ניתוח שוק", url:"https://www.diu.mil", urgency:"medium", bookmarked:false, gap:"סינרגיה פנימית", why:"DFM + Sky Fort — שניהם בפורטפוליו. Venture שמשלב power management.", signals:["DIU OTA Tactical Energy","SOCOM BAA Mobile Power"] },
  ],
  competitors: [
    { id:50, title:"Anduril — Roadrunner C-UAS", source:"Anduril Industries", url:"https://www.anduril.com", country:"ארה״ב", flag:"🇺🇸", type:"מוצר חדש", urgency:"high", bookmarked:true, why:"תחרות ישירה עם Aerosentry. Anduril יקרה ו-DoD בלבד — גבעון צריכה להאיץ NATO.", signal:"$200M contract USAF — 3 שבועות" },
    { id:51, title:"Rheinmetall — רכישת Swarm AI", source:"Rheinmetall AG", url:"https://www.rheinmetall.com/en/media/news", country:"גרמניה", flag:"🇩🇪", type:"רכישה", urgency:"medium", bookmarked:false, why:"לחץ על Crebain לזרז. גם הזדמנות — Rheinmetall תחפש ISR ישראלי.", signal:"רכישת חברת swarm גרמנית — חודש" },
    { id:52, title:"Shield AI — Hivemind V6", source:"Shield AI", url:"https://www.shield.ai", country:"ארה״ב", flag:"🇺🇸", type:"התרחבות שוק", urgency:"medium", bookmarked:false, why:"מתחרה ב-ISR autonomy אבל יקר. Daya עם 80% חיסכון = המענה לשוקי NATO.", signal:"Hivemind V6 + לקוחות NATO — חודשיים" },
  ],
};

const DOMAIN_ICONS = {
  "Counter-UAS":"🛡️","Swarm AI":"🐝","Aerial ISR":"🔍","Tactical Energy":"⚡",
  "Border Security":"🚧","Vision AI":"👁️","Robotics":"🤖","Cyber-RF":"📡",
  "Industry":"🏭","News":"📰","Analysis":"📊",
};
const getDomainIcon = (domain) => {
  if (!domain) return "📌";
  for (const [key, icon] of Object.entries(DOMAIN_ICONS)) {
    if (domain.includes(key)) return icon;
  }
  return "📌";
};

const U = {
  critical:{ border:"#ef4444", text:"#f87171", bg:"#ef444412", label:"קריטי", pulse:true },
  high:    { border:"#f97316", text:"#fb923c", bg:"#f9731612", label:"גבוה",  pulse:false },
  medium:  { border:"#eab308", text:"#facc15", bg:"#eab30812", label:"בינוני",pulse:false },
  low:     { border:"#22c55e", text:"#4ade80", bg:"#22c55e12", label:"נמוך",  pulse:false },
};

const fitCol = s => s>=90?"#22c55e":s>=75?"#eab308":s>=60?"#f97316":"#ef4444";

const ALL_COUNTRIES = [
  { flag:"🇮🇱", label:"ישראל" },{ flag:"🇺🇸", label:"ארה״ב" },
  { flag:"🇪🇺", label:"אירופה" },{ flag:"🇬🇧", label:"בריטניה" },
  { flag:"🏛️", label:"נאט״ו" },{ flag:"🇩🇪", label:"גרמניה" },
];

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  return Math.ceil((d - new Date()) / (1000*60*60*24));
};

const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Roboto+Mono:wght@400;700&display=swap');
@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
  70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}
@keyframes fadeSlideIn {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.card-new { animation: fadeSlideIn 0.4s ease; }
.pulse-critical { animation: pulse-ring 2s infinite; }
.domain-icon { transition: transform 0.2s; }
.domain-icon:hover { transform: scale(1.2); }
`;

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,direction:"ltr"}}>
      <div style={{background:"linear-gradient(135deg,#1d4ed8,#1e40af)",padding:"5px 13px",borderRadius:"7px",boxShadow:"0 0 20px #1d4ed835",display:"flex",alignItems:"center",gap:7}}>
        <span style={{color:"#fff",fontFamily:"Georgia,serif",fontSize:"17px",fontWeight:900,letterSpacing:"1px"}}>GIV<span style={{fontSize:"21px",fontStyle:"italic"}}>/</span>ON</span>
        <div style={{width:1,height:13,background:"#ffffff40"}}/>
        <span style={{color:"#93c5fd",fontSize:"8px",fontWeight:700,letterSpacing:"0.3em"}}>DEFENSE</span>
      </div>
    </div>
  );
}

function Tag({label,color="#475569"}){
  return <span style={{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${color}50`,background:`${color}15`,color,fontFamily:"Roboto Mono,monospace"}}>{label}</span>;
}

function WhyBox({text}){
  return (
    <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a35",borderRadius:"7px",padding:"9px 12px"}}>
      <div style={{fontSize:"10px",color:"#4ade80",fontWeight:700,marginBottom:4,letterSpacing:"0.08em"}}>🎯 מדוע רלוונטי לגבעון</div>
      <div style={{fontSize:"12px",color:"#86efac",lineHeight:1.65}}>{text}</div>
    </div>
  );
}

function FitScoreCircle({score, reasons}) {
  const [show, setShow] = useState(false);
  const fc = fitCol(score);
  return (
    <div style={{position:"relative"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:42,height:42,borderRadius:"50%",flexShrink:0,border:`2px solid ${fc}`,background:`${fc}15`,fontSize:"12px",fontWeight:800,color:fc,fontFamily:"Roboto Mono,monospace",cursor:"help"}}>
        {score}
      </div>
      {show && reasons && (
        <div style={{position:"absolute",left:"50%",top:"calc(100% + 8px)",transform:"translateX(-50%)",background:"#0a0f1e",border:`1px solid ${fc}40`,borderRadius:"8px",padding:"10px 12px",minWidth:200,zIndex:100,boxShadow:`0 8px 24px rgba(0,0,0,0.5)`}}>
          <div style={{fontSize:"10px",color:fc,fontWeight:700,marginBottom:6}}>למה {score}?</div>
          {reasons.map((r,i) => (
            <div key={i} style={{fontSize:"10px",color:"#94a3b8",padding:"2px 0",borderBottom:i<reasons.length-1?"1px solid #1e293b":"none",display:"flex",gap:5}}>
              <span style={{color:fc}}>✓</span>{r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BudgetBar({budgetStr, budgetNum}) {
  if (!budgetStr) return null;
  const pct = Math.min((budgetNum/15)*100, 100);
  const color = budgetNum>=10?"#22c55e":budgetNum>=5?"#38bdf8":"#64748b";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:"9px",color:"#475569"}}>תקציב</span>
        <span style={{fontSize:"13px",fontWeight:700,color,fontFamily:"Roboto Mono,monospace"}}>{budgetStr}</span>
      </div>
      <div style={{background:"#1e293b",borderRadius:3,height:4,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${color}80,${color})`,borderRadius:3,transition:"width 0.6s ease"}}/>
      </div>
    </div>
  );
}

function DeadlineBadge({deadline}) {
  if (!deadline) return null;
  const days = daysUntil(deadline);
  if (days === null) return <span style={{fontSize:"12px",fontFamily:"Roboto Mono,monospace",color:"#94a3b8"}}>{deadline}</span>;
  const color = days<=14?"#ef4444":days<=30?"#f97316":"#64748b";
  const label = days<=0?"פג תוקף":days<=30?`${days} ימים`:deadline;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      <span style={{fontSize:"9px",color:"#475569"}}>דדליין</span>
      <span style={{fontSize:"12px",fontWeight:700,color,fontFamily:"Roboto Mono,monospace"}}>{label}</span>
    </div>
  );
}

function Card({item, borderColor, children, isCritical, isNew}){
  const [h,setH]=useState(false);
  return (
    <div onClick={()=>item.url&&window.open(item.url,"_blank")}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      className={isNew?"card-new":""}
      style={{background:"#0f172a",borderRadius:"10px",padding:"18px",border:`1px solid ${borderColor}20`,borderRight:`3px solid ${borderColor}`,display:"flex",flexDirection:"column",gap:11,cursor:item.url?"pointer":"default",transform:h?"translateY(-3px)":"none",boxShadow:isCritical?(h?`0 8px 32px ${borderColor}35`:`0 0 16px ${borderColor}20`):(h?`0 6px 24px ${borderColor}20`:"none"),transition:"transform .18s, box-shadow .18s",position:"relative"}}>
      {isCritical&&<div className="pulse-critical" style={{position:"absolute",top:10,left:10,width:8,height:8,borderRadius:"50%",background:"#ef4444"}}/>}
      {isNew&&<div style={{position:"absolute",top:10,left:isCritical?26:10,background:"#22c55e",color:"#000",fontSize:"8px",fontWeight:800,padding:"1px 6px",borderRadius:"3px"}}>NEW</div>}
      {item.url&&<div style={{position:"absolute",top:9,left:isNew||isCritical?50:11,fontSize:"9px",color:h?"#60a5fa":"#1e3a5f",fontFamily:"Roboto Mono,monospace",transition:"color .2s"}}>↗ פתח מקור</div>}
      {children}
    </div>
  );
}

function FocusModal({item, onClose}) {
  const u = U[item.urgency]||U.medium;
  useEffect(()=>{
    const handleKey=(e)=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
  },[onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(2,6,23,0.9)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d1629",border:`1px solid ${u.border}30`,borderRadius:14,padding:28,maxWidth:600,width:"100%",maxHeight:"85vh",overflowY:"auto",boxShadow:`0 24px 80px rgba(0,0,0,0.7)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <div style={{display:"flex",gap:6,marginBottom:6}}>
              <span style={{fontSize:18}}>{item.flag||"📌"}</span>
              <Tag label={u.label} color={u.border}/>
              {item.tag&&<Tag label={item.tag} color="#475569"/>}
              {item.domain&&<Tag label={`${getDomainIcon(item.domain)} ${item.domain}`} color="#3b82f6"/>}
            </div>
            <div style={{fontSize:"18px",fontWeight:800,color:"#f1f5f9",lineHeight:1.3}}>{item.title}</div>
            <div style={{fontSize:"11px",color:"#475569",marginTop:3}}>{item.source}</div>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"6px 12px",borderRadius:"6px",cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        <WhyBox text={item.why}/>
        {(item.budget||item.prize)&&<div style={{marginTop:12}}><BudgetBar budgetStr={item.budget||item.prize} budgetNum={item.budgetNum||0}/></div>}
        {item.deadline&&<div style={{marginTop:10}}><DeadlineBadge deadline={item.deadline}/></div>}
        {item.fitReasons&&(
          <div style={{marginTop:12,background:"#0a0f1e",borderRadius:8,padding:12}}>
            <div style={{fontSize:"10px",color:fitCol(item.fitScore),fontWeight:700,marginBottom:6}}>למה Fit {item.fitScore}?</div>
            {item.fitReasons.map((r,i)=>(
              <div key={i} style={{fontSize:"11px",color:"#94a3b8",padding:"3px 0",borderBottom:i<item.fitReasons.length-1?"1px solid #1e293b":"none",display:"flex",gap:6}}>
                <span style={{color:fitCol(item.fitScore)}}>✓</span>{r}
              </div>
            ))}
          </div>
        )}
        {item.signals&&(
          <div style={{marginTop:12,background:"#0c1a2e",borderRadius:8,padding:12}}>
            <div style={{fontSize:"10px",color:"#60a5fa",fontWeight:700,marginBottom:6}}>📡 סיגנלים</div>
            {item.signals.map((s,i)=><div key={i} style={{fontSize:"11px",color:"#93c5fd",padding:"2px 0"}}>· {s}</div>)}
          </div>
        )}
        {item.url&&<button onClick={()=>window.open(item.url,"_blank")} style={{marginTop:16,width:"100%",background:`${u.border}18`,border:`1px solid ${u.border}40`,color:u.border,padding:"8px",borderRadius:8,fontSize:"12px",fontWeight:700,cursor:"pointer"}}>↗ פתח מקור</button>}
      </div>
    </div>
  );
}

function ContractCard({item,onUpdate,onFocus}){
  const u=U[item.urgency]||U.medium;
  return (
    <Card item={item} borderColor={u.border} isCritical={item.urgency==="critical"} isNew={item.isNew}>
      <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:14}}>{item.flag}</span>
            <span className="domain-icon" style={{fontSize:14}}>{getDomainIcon(item.domain)}</span>
            <Tag label={u.label} color={u.border}/>
            <Tag label={item.tag} color="#475569"/>
            {item.bookmarked&&<Tag label="⭐" color="#eab308"/>}
          </div>
          <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",lineHeight:1.35,marginBottom:2}}>{item.title}</div>
          <div style={{fontSize:"10px",color:"#475569"}}>{item.source}</div>
        </div>
        <FitScoreCircle score={item.fitScore} reasons={item.fitReasons}/>
      </div>
      <WhyBox text={item.why}/>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-end"}}>
        <div style={{flex:1,minWidth:120}}><BudgetBar budgetStr={item.budget} budgetNum={item.budgetNum||0}/></div>
        <DeadlineBadge deadline={item.deadline}/>
      </div>
      <div style={{display:"flex",gap:5,borderTop:"1px solid #1e293b",paddingTop:9}} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>onUpdate(item.id,{bookmarked:!item.bookmarked})} style={{background:item.bookmarked?"#854d0e30":"transparent",border:`1px solid ${item.bookmarked?"#eab308":"#1e293b"}`,color:item.bookmarked?"#eab308":"#475569",padding:"3px 9px",borderRadius:"5px",fontSize:"11px",cursor:"pointer"}}>⭐</button>
        {["פתוח","בבדיקה","הוגש","בוטל"].map(s=>(
          <button key={s} onClick={()=>onUpdate(item.id,{status:s})} style={{background:item.status===s?"#1e293b":"transparent",border:`1px solid ${item.status===s?"#475569":"#1e293b"}`,color:item.status===s?"#f1f5f9":"#475569",padding:"3px 8px",borderRadius:"5px",fontSize:"10px",cursor:"pointer"}}>{s}</button>
        ))}
        <button onClick={()=>onFocus(item)} style={{marginRight:"auto",background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"3px 10px",borderRadius:"5px",fontSize:"10px",cursor:"pointer"}}>⛶ הרחב</button>
      </div>
    </Card>
  );
}

function PartnerCard({item,onFocus}){
  const sc={"לבדיקה":"#06b6d4","חדש":"#a855f7","פעיל":"#22c55e"};
  return (
    <Card item={item} borderColor="#3b82f6">
      <div style={{display:"flex",gap:5,marginBottom:2,alignItems:"center"}}><span style={{fontSize:14}}>{item.flag}</span><Tag label={item.type} color="#3b82f6"/><Tag label={item.status} color={sc[item.status]||"#475569"}/></div>
      <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",marginBottom:1}}>{item.title}</div>
      <div style={{fontSize:"10px",color:"#475569",marginBottom:2}}>{item.source}</div>
      <WhyBox text={item.why}/>
      <div style={{background:"#0c1a2e",border:"1px solid #1e40af30",borderRadius:"6px",padding:"7px 11px"}}>
        <div style={{fontSize:"9px",color:"#60a5fa",marginBottom:3,fontWeight:700}}>📡 סיגנל</div>
        <div style={{fontSize:"11px",color:"#93c5fd"}}>{item.signal}</div>
      </div>
      <button onClick={(e)=>{e.stopPropagation();onFocus(item);}} style={{background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"4px 10px",borderRadius:"5px",fontSize:"10px",cursor:"pointer",alignSelf:"flex-end"}}>⛶ הרחב</button>
    </Card>
  );
}

function InvestorCard({item,onFocus}){
  return (
    <Card item={item} borderColor="#a855f7">
      <div style={{display:"flex",gap:5,marginBottom:2,alignItems:"center"}}><span style={{fontSize:14}}>{item.flag}</span><Tag label={item.focus} color="#a855f7"/><Tag label={item.stage} color="#6366f1"/></div>
      <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",marginBottom:1}}>{item.title}</div>
      <div style={{fontSize:"10px",color:"#475569",marginBottom:2}}>{item.source}</div>
      <WhyBox text={item.why}/>
      <div style={{background:"#150b2e",border:"1px solid #7c3aed30",borderRadius:"6px",padding:"7px 11px"}}>
        <div style={{fontSize:"9px",color:"#c084fc",marginBottom:3,fontWeight:700}}>📡 סיגנל</div>
        <div style={{fontSize:"11px",color:"#d8b4fe"}}>{item.signal}</div>
      </div>
    </Card>
  );
}

function GrantCard({item}){
  const u=U[item.urgency]||U.medium;
  return (
    <Card item={item} borderColor={u.border} isCritical={item.urgency==="critical"}>
      <div style={{display:"flex",gap:5,marginBottom:2,alignItems:"center"}}><span style={{fontSize:14}}>{item.flag}</span><Tag label={u.label} color={u.border}/><Tag label={item.status} color="#22c55e"/></div>
      <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",marginBottom:1}}>{item.title}</div>
      <div style={{fontSize:"10px",color:"#475569",marginBottom:2}}>{item.source}</div>
      <WhyBox text={item.why}/>
      <div style={{display:"flex",gap:18,alignItems:"flex-end"}}>
        <div style={{flex:1}}><BudgetBar budgetStr={item.prize} budgetNum={item.budgetNum||0}/></div>
        <DeadlineBadge deadline={item.deadline}/>
      </div>
    </Card>
  );
}

function VentureCard({item}){
  const u=U[item.urgency]||U.medium;
  return (
    <Card item={item} borderColor="#f97316">
      <div style={{display:"flex",gap:5,marginBottom:2,alignItems:"center"}}><Tag label={item.gap} color="#f97316"/><Tag label={u.label} color={u.border}/></div>
      <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",marginBottom:1}}>{item.title}</div>
      <div style={{fontSize:"10px",color:"#475569",marginBottom:2}}>{item.source}</div>
      <WhyBox text={item.why}/>
      <div>
        <div style={{fontSize:"9px",color:"#475569",marginBottom:4,fontWeight:700}}>📡 סיגנלים</div>
        {item.signals.map((s,i)=><div key={i} style={{fontSize:"11px",color:"#94a3b8",padding:"3px 0",borderBottom:i<item.signals.length-1?"1px solid #1e293b":"none"}}>· {s}</div>)}
      </div>
    </Card>
  );
}

function CompetitorCard({item}){
  const u=U[item.urgency]||U.medium;
  return (
    <Card item={item} borderColor="#ef4444" isCritical={item.urgency==="critical"}>
      <div style={{display:"flex",gap:5,marginBottom:2,alignItems:"center"}}><span style={{fontSize:14}}>{item.flag}</span><Tag label={item.type} color="#ef4444"/><Tag label={u.label} color={u.border}/></div>
      <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",marginBottom:1}}>{item.title}</div>
      <div style={{fontSize:"10px",color:"#475569",marginBottom:2}}>{item.source}</div>
      <WhyBox text={item.why}/>
      <div style={{background:"#1c0a0a",border:"1px solid #ef444428",borderRadius:"6px",padding:"7px 11px"}}>
        <div style={{fontSize:"9px",color:"#f87171",marginBottom:3,fontWeight:700}}>⚠️ סיגנל</div>
        <div style={{fontSize:"11px",color:"#fca5a5"}}>{item.signal}</div>
      </div>
    </Card>
  );
}

// ── Hero Strip ────────────────────────────────────────────────────────────────
function HeroStrip({data}) {
  const allItems = Object.values(data).flat();
  const critical = allItems.filter(i=>i.urgency==="critical");
  const newItems = allItems.filter(i=>i.isNew);
  const domainCount = {};
  allItems.forEach(i=>{if(i.domain)domainCount[i.domain]=(domainCount[i.domain]||0)+1;});
  const spikeDomain = Object.entries(domainCount).sort((a,b)=>b[1]-a[1])[0];
  const competitorMoves = data.competitors.filter(i=>i.urgency==="high"||i.urgency==="critical");
  const tickerItems = [
    ...critical.map(i=>`🔴 קריטי: ${i.title}`),
    spikeDomain?`📈 Domain Spike: ${spikeDomain[0]} — ${spikeDomain[1]} הזדמנויות`:null,
    ...competitorMoves.map(i=>`⚠️ מהלך מתחרה: ${i.title}`),
    ...newItems.map(i=>`🆕 חדש: ${i.title}`),
  ].filter(Boolean);
  const tickerText = tickerItems.join("  ·  ")+"  ·  "+tickerItems.join("  ·  ");
  return (
    <div style={{background:"linear-gradient(135deg,#0a0a0a,#0d1117)",borderBottom:"1px solid #1e293b",overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:"1px solid #0f172a"}}>
        {[
          {icon:"🔴",val:critical.length,label:"Critical This Week",color:"#ef4444"},
          {icon:"📈",val:spikeDomain?spikeDomain[0]:"—",label:"Domain Spike",color:"#3b82f6",isText:true},
          {icon:"⚠️",val:competitorMoves.length,label:"Competitive Moves",color:"#f97316"},
          {icon:"🆕",val:newItems.length,label:"New This Scan",color:"#22c55e"},
        ].map(({icon,val,label,color,isText},i)=>(
          <div key={i} style={{flex:1,padding:"8px 16px",borderRight:i<3?"1px solid #1e293b":"none",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13}}>{icon}</span>
            <div>
              <div style={{fontSize:isText?"10px":"16px",fontWeight:800,color,fontFamily:isText?"inherit":"Roboto Mono,monospace",lineHeight:1}}>{val}</div>
              <div style={{fontSize:"9px",color:"#334155",marginTop:1}}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{overflow:"hidden",padding:"6px 0"}}>
        <div style={{whiteSpace:"nowrap",animation:"ticker 40s linear infinite"}}>
          <span style={{fontSize:"10px",color:"#334155",paddingLeft:20,fontFamily:"Roboto Mono,monospace"}}>{tickerText}</span>
        </div>
      </div>
    </div>
  );
}

// ── Deadline Timeline ─────────────────────────────────────────────────────────
function DeadlineTimeline({data}) {
  const allWithDeadlines = [...data.contracts,...data.grants]
    .filter(i=>i.deadline&&i.status!=="בוטל")
    .map(i=>({...i,days:daysUntil(i.deadline)}))
    .filter(i=>i.days!==null&&i.days>0)
    .sort((a,b)=>a.days-b.days);
  const urgent = allWithDeadlines.filter(i=>i.days<=14);
  const soon   = allWithDeadlines.filter(i=>i.days>14&&i.days<=30);
  const later  = allWithDeadlines.filter(i=>i.days>30);
  const Pill = ({item})=>{
    const color=item.days<=14?"#ef4444":item.days<=30?"#f97316":"#64748b";
    return (
      <div onClick={()=>item.url&&window.open(item.url,"_blank")} style={{background:`${color}12`,border:`1px solid ${color}30`,borderRadius:6,padding:"4px 10px",cursor:"pointer",display:"flex",gap:6,alignItems:"center"}}>
        <span style={{fontSize:11}}>{item.flag}</span>
        <div>
          <div style={{fontSize:"10px",fontWeight:600,color:"#e2e8f0",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
          <div style={{fontSize:"9px",color,fontFamily:"Roboto Mono,monospace",fontWeight:700}}>{item.days}d</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{padding:"12px 24px",background:"#020617",borderBottom:"1px solid #0f172a"}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <div style={{fontSize:"10px",color:"#334155",fontWeight:700,marginBottom:8}}>⏱ DEADLINE TIMELINE</div>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:"9px",color:"#ef4444",fontWeight:700,background:"#ef444415",padding:"2px 6px",borderRadius:3}}>{"< 14 ימים"}</span>
            {urgent.length===0?<span style={{fontSize:"9px",color:"#1e293b"}}>—</span>:urgent.map(i=><Pill key={i.id} item={i}/>)}
          </div>
          <div style={{width:1,height:24,background:"#1e293b"}}/>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:"9px",color:"#f97316",fontWeight:700,background:"#f9731615",padding:"2px 6px",borderRadius:3}}>14–30 ימים</span>
            {soon.length===0?<span style={{fontSize:"9px",color:"#1e293b"}}>—</span>:soon.map(i=><Pill key={i.id} item={i}/>)}
          </div>
          <div style={{width:1,height:24,background:"#1e293b"}}/>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:"9px",color:"#64748b",fontWeight:700,background:"#64748b15",padding:"2px 6px",borderRadius:3}}>30+ ימים</span>
            {later.length===0?<span style={{fontSize:"9px",color:"#1e293b"}}>—</span>:later.map(i=><Pill key={i.id} item={i}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── World Map (Fixed) ─────────────────────────────────────────────────────────
const COUNTRY_COORDS = {
  "ארה״ב":   {cx:180,cy:200},"אירופה":  {cx:490,cy:175},
  "ישראל":   {cx:558,cy:213},"בריטניה": {cx:455,cy:152},
  "גרמניה":  {cx:498,cy:158},"נאט״ו":   {cx:490,cy:140},
};
const MAP_FLAGS = {"ארה״ב":"🇺🇸","ישראל":"🇮🇱","אירופה":"🇪🇺","בריטניה":"🇬🇧","גרמניה":"🇩🇪","נאט״ו":"🏛️"};
const LAND_PATHS = [
  "M 80,100 L 200,90 L 260,110 L 280,160 L 260,200 L 240,230 L 200,240 L 160,220 L 120,200 L 90,170 Z",
  "M 200,250 L 230,245 L 250,270 L 245,320 L 230,350 L 210,355 L 195,330 L 190,290 Z",
  "M 420,100 L 560,95 L 590,115 L 585,155 L 565,175 L 540,185 L 500,190 L 460,175 L 435,155 L 430,130 Z",
  "M 445,110 L 468,105 L 472,130 L 458,140 L 443,130 Z",
  "M 450,195 L 530,190 L 560,210 L 565,270 L 550,320 L 520,340 L 490,335 L 460,310 L 445,265 L 440,225 Z",
  "M 555,175 L 600,170 L 620,185 L 615,215 L 590,225 L 560,220 L 548,205 Z",
  "M 595,85 L 740,80 L 780,110 L 775,175 L 740,195 L 680,200 L 630,185 L 600,160 L 592,120 Z",
  "M 680,270 L 760,265 L 775,295 L 765,325 L 735,335 L 700,325 L 682,300 Z",
];

function WorldMap({data, filterDomain, filterUrgency}) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const allItems = Object.values(data).flat();
  const countryData = {};
  Object.keys(COUNTRY_COORDS).forEach(country=>{
    const items = allItems.filter(i=>{
      if(!i.country&&!i.flag)return false;
      const match=i.country===country||
        (country==="ישראל"&&i.flag==="🇮🇱")||(country==="ארה״ב"&&i.flag==="🇺🇸")||
        (country==="אירופה"&&i.flag==="🇪🇺")||(country==="בריטניה"&&i.flag==="🇬🇧")||
        (country==="גרמניה"&&i.flag==="🇩🇪")||(country==="נאט״ו"&&i.flag==="🏛️");
      if(!match)return false;
      if(filterDomain&&i.domain!==filterDomain)return false;
      if(filterUrgency&&i.urgency!==filterUrgency)return false;
      return true;
    });
    const hasCritical=items.some(i=>i.urgency==="critical");
    const hasHigh=items.some(i=>i.urgency==="high");
    const color=hasCritical?"#ef4444":hasHigh?"#f97316":items.length>0?"#22c55e":"#1e293b";
    const maxFit=items.length?Math.max(...items.map(i=>i.fitScore||i.fit||0)):0;
    countryData[country]={items,color,hasCritical,maxFit};
  });
  const selectedData=selected?countryData[selected]:null;
  return (
    <div style={{position:"relative",background:"#020617",borderRadius:12,border:"1px solid #1e293b",overflow:"hidden",minHeight:400}}>
      <svg viewBox="0 0 800 400" style={{width:"100%",display:"block"}}>
        <rect width="800" height="400" fill="#020617"/>
        {[0,80,160,240,320,400].map(y=><line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#0f172a" strokeWidth="1"/>)}
        {[0,100,200,300,400,500,600,700,800].map(x=><line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" stroke="#0f172a" strokeWidth="1"/>)}
        {LAND_PATHS.map((d,i)=><path key={i} d={d} fill="#0d1f35" stroke="#1e3a5f" strokeWidth="0.8"/>)}
        {Object.entries(COUNTRY_COORDS).map(([country,{cx,cy}])=>{
          const cd=countryData[country];
          const count=cd?.items.length||0;
          const color=cd?.color||"#1e293b";
          const r=Math.max(16,Math.min(34,16+count*5));
          const isHov=hovered===country;
          const isSel=selected===country;
          const rr=isHov||isSel?r+4:r;
          return (
            <g key={country} style={{cursor:"pointer"}}
              onClick={()=>setSelected(selected===country?null:country)}
              onMouseEnter={()=>setHovered(country)} onMouseLeave={()=>setHovered(null)}>
              {cd?.hasCritical&&<circle cx={cx} cy={cy} r={rr+10} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.25" style={{animation:"pulse-ring 2s infinite"}}/>}
              {isSel&&<line x1={cx} y1={cy} x2={cx<400?260:540} y2={cy} stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.4"/>}
              <circle cx={cx} cy={cy} r={rr} fill={`${color}18`} stroke={color} strokeWidth={isSel?2.5:1.5} style={{transition:"r 0.2s"}}/>
              {count>0?<text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={count>9?"10":"13"} fontWeight="800" fontFamily="Roboto Mono,monospace" style={{pointerEvents:"none"}}>{count}</text>:<circle cx={cx} cy={cy} r={3} fill={color} opacity="0.5"/>}
              <text x={cx} y={cy+rr+14} textAnchor="middle" fill={isHov||isSel?"#e2e8f0":"#475569"} fontSize="10" fontFamily="sans-serif" style={{pointerEvents:"none",transition:"fill 0.2s"}}>{MAP_FLAGS[country]} {country}</text>
              {isHov&&!isSel&&count>0&&(
                <g>
                  <rect x={cx-60} y={cy-rr-38} width="120" height="28" rx="5" fill="#0d1629" stroke={`${color}50`} strokeWidth="1"/>
                  <text x={cx} y={cy-rr-28} textAnchor="middle" fill={color} fontSize="10" fontWeight="700" fontFamily="Roboto Mono,monospace" style={{pointerEvents:"none"}}>{count} הזדמנויות</text>
                  <text x={cx} y={cy-rr-16} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif" style={{pointerEvents:"none"}}>Max Fit: {cd?.maxFit||0}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {selected&&selectedData&&(
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:270,background:"rgba(8,12,28,0.97)",borderLeft:"1px solid #1e293b",padding:16,overflowY:"auto",animation:"fadeSlideIn 0.2s ease",zIndex:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:"15px",fontWeight:800,color:"#f1f5f9"}}>{MAP_FLAGS[selected]} {selected}</div>
            <button onClick={()=>setSelected(null)} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:6,padding:"6px 10px",textAlign:"center",flex:1}}>
              <div style={{fontSize:"18px",fontWeight:800,color:selectedData.color,fontFamily:"Roboto Mono,monospace"}}>{selectedData.items.length}</div>
              <div style={{fontSize:"9px",color:"#334155"}}>הזדמנויות</div>
            </div>
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:6,padding:"6px 10px",textAlign:"center",flex:1}}>
              <div style={{fontSize:"18px",fontWeight:800,color:fitCol(selectedData.maxFit),fontFamily:"Roboto Mono,monospace"}}>{selectedData.maxFit||"—"}</div>
              <div style={{fontSize:"9px",color:"#334155"}}>Max Fit</div>
            </div>
          </div>
          {selectedData.items.length===0
            ?<div style={{fontSize:"11px",color:"#334155",fontStyle:"italic"}}>אין הזדמנויות</div>
            :selectedData.items.map(item=>(
              <div key={item.id} onClick={()=>item.url&&window.open(item.url,"_blank")} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:7,padding:"8px 10px",marginBottom:6,cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#3b82f650"} onMouseLeave={e=>e.currentTarget.style.borderColor="#1e293b"}>
                <div style={{fontSize:"11px",fontWeight:600,color:"#e2e8f0",marginBottom:3,lineHeight:1.3}}>{item.title}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  {item.urgency&&<Tag label={U[item.urgency]?.label||item.urgency} color={U[item.urgency]?.border||"#475569"}/>}
                  {(item.fitScore||item.fit)&&<span style={{fontSize:"9px",color:fitCol(item.fitScore||item.fit||0),fontFamily:"Roboto Mono,monospace"}}>fit {item.fitScore||item.fit}</span>}
                  {(item.budget||item.prize)&&<span style={{fontSize:"9px",color:"#38bdf8",fontFamily:"Roboto Mono,monospace"}}>{item.budget||item.prize}</span>}
                </div>
              </div>
            ))
          }
        </div>
      )}
      <div style={{position:"absolute",bottom:12,left:12,display:"flex",gap:10}}>
        {[["#ef4444","קריטי"],["#f97316","גבוה"],["#22c55e","פעיל"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",gap:4,alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
            <span style={{fontSize:"9px",color:"#475569"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapView({data}) {
  const [domainFilter,setDomainFilter]=useState("all");
  const [urgencyFilter,setUrgencyFilter]=useState("all");
  const allDomains=[...new Set(Object.values(data).flat().map(i=>i.domain).filter(Boolean))];
  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"24px"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:"20px",fontWeight:800,color:"#f1f5f9",marginBottom:4}}>🗺️ מפת הזדמנויות עולמית</div>
        <div style={{fontSize:"12px",color:"#475569"}}>לחץ על נעץ לראות הזדמנויות לפי מדינה</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:"10px",color:"#334155"}}>Domain:</span>
        {["all",...allDomains].map(d=>(
          <button key={d} onClick={()=>setDomainFilter(d)} style={{background:domainFilter===d?"#1e3a5f":"transparent",border:`1px solid ${domainFilter===d?"#3b82f6":"#1e293b"}`,color:domainFilter===d?"#60a5fa":"#475569",padding:"3px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>
            {d==="all"?"הכל":`${getDomainIcon(d)} ${d}`}
          </button>
        ))}
        <div style={{width:1,height:14,background:"#1e293b"}}/>
        <span style={{fontSize:"10px",color:"#334155"}}>עדיפות:</span>
        {[["all","הכל"],["critical","קריטי"],["high","גבוה"],["medium","בינוני"]].map(([v,l])=>(
          <button key={v} onClick={()=>setUrgencyFilter(v)} style={{background:urgencyFilter===v?"#1e293b":"transparent",border:`1px solid ${urgencyFilter===v?"#475569":"#1e293b"}`,color:urgencyFilter===v?"#f1f5f9":"#475569",padding:"3px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      <WorldMap data={data} filterDomain={domainFilter==="all"?null:domainFilter} filterUrgency={urgencyFilter==="all"?null:urgencyFilter}/>
    </div>
  );
}

// ── Daily Briefing (Fixed) ────────────────────────────────────────────────────
function DailyBriefing({data}) {
  const money=[...data.contracts,...data.grants].filter(i=>i.urgency==="critical"||i.urgency==="high").sort((a,b)=>(b.fitScore||0)-(a.fitScore||0)).slice(0,3);
  const gaps=[...data.ventures,...data.competitors].filter(i=>i.urgency==="critical"||i.urgency==="high").slice(0,3);
  const talk=[...data.partners,...data.investors].filter(i=>i.signal||i.why).sort((a,b)=>(b.fit||0)-(a.fit||0)).slice(0,3);
  const missing=[...data.contracts,...data.grants].filter(i=>!i.assignee&&(i.fitScore||0)>=85&&i.status==="פתוח").sort((a,b)=>(b.fitScore||0)-(a.fitScore||0)).slice(0,3);
  const QUESTIONS=[
    {q:"💰 איפה יש כסף עכשיו?",items:money,color:"#22c55e",hint:"הזדמנויות חוזיות פתוחות לפי fit ואקוטיות"},
    {q:"🔍 איפה נוצר פער?",items:gaps,color:"#f97316",hint:"פערים מבצעיים וסיגנלים ממתחרים"},
    {q:"🤝 עם מי כדאי לדבר?",items:talk,color:"#3b82f6",hint:"שותפים ומשקיעים עם סיגנל פעיל"},
    {q:"⚠️ איפה אנחנו מפספסים?",items:missing,color:"#ef4444",hint:"Fit גבוה — אין בעל תפקיד, אין מעקב"},
  ];
  return (
    <div style={{padding:"28px 24px 0"}}>
      <div style={{marginBottom:20,display:"flex",alignItems:"baseline",gap:10}}>
        <div style={{fontSize:"22px",fontWeight:800,color:"#f1f5f9"}}>בריפינג יומי</div>
        <div style={{fontSize:"12px",color:"#334155"}}>{new Date().toLocaleDateString("he-IL",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:28}}>
        {QUESTIONS.map(({q,items,color,hint})=>(
          <div key={q} style={{background:"#0a0f1e",border:`1px solid ${color}25`,borderTop:`3px solid ${color}`,borderRadius:"10px",padding:"16px"}}>
            <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9",marginBottom:3}}>{q}</div>
            <div style={{fontSize:"10px",color:"#334155",marginBottom:12}}>{hint}</div>
            {items.length===0
              ?<div style={{fontSize:"12px",color:"#334155",fontStyle:"italic"}}>אין פריטים עכשיו</div>
              :items.map(item=>(
                <div key={item.id} onClick={()=>item.url&&window.open(item.url,"_blank")} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 0",borderBottom:"1px solid #1e293b",cursor:item.url?"pointer":"default"}} onMouseEnter={e=>e.currentTarget.style.opacity=".75"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <span style={{fontSize:14,marginTop:1,flexShrink:0}}>{item.flag||"📌"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"12px",fontWeight:600,color:"#e2e8f0",lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
                    <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
                      {item.budget&&<span style={{fontSize:"10px",color:"#22c55e",fontFamily:"Roboto Mono,monospace",fontWeight:700}}>{item.budget}</span>}
                      {item.deadline&&<span style={{fontSize:"10px",color:"#f87171",fontFamily:"Roboto Mono,monospace"}}>{item.deadline}</span>}
                      {(item.fitScore||item.fit)&&<span style={{fontSize:"10px",color:fitCol(item.fitScore||item.fit),fontFamily:"Roboto Mono,monospace"}}>fit {item.fitScore||item.fit}</span>}
                      {(item.signal||item.why)&&<span style={{fontSize:"10px",color:"#93c5fd"}}>{(item.signal||item.why||"").split("—")[0].slice(0,60)}</span>}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Conferences ───────────────────────────────────────────────────────────────
const CONFERENCES = [
  {id:"c1",name:"DSEI 2025",location:"London, UK",flag:"🇬🇧",date:"09.09.2025",daysAway:null,category:"prime",domains:["Counter-UAS","Robotics","ISR"],why:"הכנס הגדול ביותר לביטחון בבריטניה. L3Harris, Rheinmetall, Leonardo — כולם שם.",url:"https://www.dsei.co.uk",budget:"HIGH",relevance:95},
  {id:"c2",name:"Milipol Paris 2025",location:"Paris, France",flag:"🇫🇷",date:"18.11.2025",daysAway:null,category:"prime",domains:["Border Security","Vision AI","Counter-UAS"],why:"הכנס הגלובלי לביטחון פנים. EU buyers + Guardian Angel fit מושלם.",url:"https://www.milipol.com",budget:"HIGH",relevance:88},
  {id:"c3",name:"IDEX 2025",location:"Abu Dhabi, UAE",flag:"🇦🇪",date:"17.02.2025",daysAway:null,category:"prime",domains:["Counter-UAS","Swarm AI","Aerial ISR"],why:"הכנס הגדול ביותר במזרח התיכון. הזדמנות לאברהם אקורדים.",url:"https://www.idexuae.ae",budget:"HIGH",relevance:82},
  {id:"c4",name:"Eurosatory 2026",location:"Paris, France",flag:"🇫🇷",date:"15.06.2026",daysAway:null,category:"prime",domains:["Counter-UAS","Robotics","Tactical Energy","ISR"],why:"כנס הגנה קרקעית הגדול בעולם. KNDS, Rheinmetall, Thales — תוצאות מידיות.",url:"https://www.eurosatory.com",budget:"HIGH",relevance:96},
  {id:"c5",name:"AUSA Annual Meeting 2025",location:"Washington DC, USA",flag:"🇺🇸",date:"13.10.2025",daysAway:null,category:"prime",domains:["Counter-UAS","Tactical Energy","Robotics"],why:"כנס הצבא האמריקאי הגדול ביותר. Leidos, SAIC, Booz Allen — כולם שם.",url:"https://ausameetings.org",budget:"HIGH",relevance:92},
  {id:"c6",name:"CANSEC 2025",location:"Ottawa, Canada",flag:"🇨🇦",date:"28.05.2025",daysAway:null,category:"niche",domains:["Counter-UAS","ISR","Border Security"],why:"כנס ביטחון קנדי עם NATO alignment. גישה לחברי Five Eyes.",url:"https://www.cansec.ca",budget:"MEDIUM",relevance:74},
  {id:"c7",name:"MSPO 2025",location:"Kielce, Poland",flag:"🇵🇱",date:"02.09.2025",daysAway:null,category:"emerging",domains:["Counter-UAS","ISR","Robotics"],why:"פולין — הכנס הגדול ביותר במזרח אירופה. $30B defense budget. ISR ו-C-UAS בעדיפות עליונה.",url:"https://www.mspo.pl",budget:"MEDIUM",relevance:86},
  {id:"c8",name:"EURO NATO Industry Conference",location:"Brussels, Belgium",flag:"🇧🇪",date:"03.12.2025",daysAway:null,category:"niche",domains:["NATO","EDF","Grants"],why:"קשרים ישירים עם NATO procurement. EIC ו-EDF buyers בחדר אחד.",url:"https://www.enicforum.org",budget:"MEDIUM",relevance:79},
  {id:"c9",name:"IAV 2026",location:"Esher, UK",flag:"🇬🇧",date:"21.01.2026",daysAway:null,category:"niche",domains:["Robotics","Tactical Energy","Counter-UAS"],why:"International Armoured Vehicles — KNDS, Rheinmetall, Leonardo. Mokoushla fit.",url:"https://www.iqpc.com/events-internationalarmoured",budget:"MEDIUM",relevance:77},
  {id:"c10",name:"SOFIC 2025",location:"Tampa, FL, USA",flag:"🇺🇸",date:"19.05.2025",daysAway:null,category:"prime",domains:["Counter-UAS","ISR","Vision AI","Swarm AI"],why:"Special Operations Forces Industry Conference. SOCOM buyers ישירים.",url:"https://www.sofic.org",budget:"HIGH",relevance:93},
  {id:"c11",name:"NATO Edge 2025",location:"Tampa, FL, USA",flag:"🏛️",date:"02.12.2025",daysAway:null,category:"prime",domains:["Counter-UAS","ISR","Swarm AI"],why:"NATO innovation showcase. DIANA, NIF — ומנהלי תוכניות בחדר אחד.",url:"https://natoedge.com",budget:"HIGH",relevance:90},
  {id:"c13",name:"XPONENTIAL Europe 2026",location:"Düsseldorf, Germany",flag:"🇩🇪",date:"24.03.2026",daysAway:23,category:"prime",domains:["Counter-UAS","Swarm AI","Aerial ISR","Robotics"],why:"הכנס המרכזי למערכות אוטונומיות באירופה. Rheinmetall, Quantum Systems, Helsing — כולם שם. Hall 1 = C-UAS ו-ISR. גבעון: Aerosentry, Crebain, Daya, Sky Fort — fit מושלם לכל הפורטפוליו.",url:"https://www.xponential-europe.com",budget:"HIGH",relevance:99},
  {id:"c12",name:"HLS & Cyber World Summit",location:"Tel Aviv, Israel",flag:"🇮🇱",date:"10.06.2025",daysAway:null,category:"emerging",domains:["Cyber-RF","Border Security","Vision AI"],why:"כנס הדגל של ישראל. מפא״ת, מלמ״ב, ומשקיעים בינלאומיים בחדר אחד.",url:"https://www.hls-cyber.com",budget:"HIGH",relevance:91},
  {id:"c14",name:"SOF Week 2026",location:"Tampa, FL, USA",flag:"🇺🇸",date:"19.05.2026",daysAway:null,category:"prime",domains:["Counter-UAS","Swarm AI","Border Security"],why:"SOCOM buyers ישירים. Crebain, Aerosentry ו-Guardian Angel = sweet spot של SOF.",url:"https://www.sofweek.org/",budget:"HIGH",relevance:97},
  {id:"c15",name:"AUVSI XPONENTIAL 2026",location:"Michigan, USA",flag:"🇺🇸",date:"11.05.2026",daysAway:null,category:"prime",domains:["Counter-UAS","Swarm AI","Aerial ISR"],why:"הכנס הגדול בעולם לכטב״מים — DoD, DIU, AFWERX, NATO buyers. Daya ו-Crebain מושלמים.",url:"https://www.auvsi.org/",budget:"HIGH",relevance:95},
  {id:"c16",name:"Farnborough Airshow 2026",location:"England, UK",flag:"🇬🇧",date:"20.06.2026",daysAway:null,category:"prime",domains:["Counter-UAS","Aerial ISR"],why:"UK MOD, RAF וקניינים בינלאומיים. Aerosentry ו-Daya מתאימים. UK DASA C-UAS מואץ.",url:"https://www.farnboroughairshow.com/",budget:"HIGH",relevance:82},
  {id:"c17",name:"GSOF Europe 2026",location:"Rome, Italy",flag:"🇮🇹",date:"20.10.2026",daysAway:null,category:"prime",domains:["Counter-UAS","Swarm AI","Border Security"],why:"כוחות מיוחדים אירופאיים — UK SAS, KSK, GIGN. לקוחות Guardian Angel ו-Aerosentry.",url:"https://www.gsofeurope.org/",budget:"HIGH",relevance:88},
  {id:"c18",name:"AUSA Annual Meeting 2026",location:"Washington DC, USA",flag:"🇺🇸",date:"12.10.2026",daysAway:null,category:"prime",domains:["Counter-UAS","Swarm AI","Robotics"],why:"Army Futures Command נוכח. מנהל CAML, HMIF, Autonomous Systems. follow-up לאחר RFSB.",url:"https://www.ausa.org",budget:"HIGH",relevance:85},
  {id:"c19",name:"UMEX 2026",location:"Abu Dhabi, UAE",flag:"🇦🇪",date:"20.01.2026",daysAway:null,category:"niche",domains:["Counter-UAS","Aerial ISR"],why:"UAE, Saudi, Qatar. EDGE Group פעיל. GCC מחפש C-UAS אחרי Houthi. Abraham Accords = window.",url:"https://umexabudhabi.ae",budget:"MEDIUM",relevance:78},
  {id:"c20",name:"Border Security Expo 2026",location:"Arizona, USA",flag:"🇺🇸",date:"05.05.2026",daysAway:null,category:"niche",domains:["Border Security","Counter-UAS"],why:"CBP ו-DHS נוכחים — Guardian Angel ו-GuaRdF נוצרו לשוק הזה. תקציב border security גדל.",url:"https://www.bordersecurityexpo.com/",budget:"MEDIUM",relevance:76},
];

CONFERENCES.forEach(c=>{
  const parts=c.date.split(".");
  if(parts.length===3){const d=new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);c.daysAway=Math.ceil((d-new Date())/(1000*60*60*24));}
});
const CAT_COLORS={prime:"#3b82f6",niche:"#a855f7",emerging:"#f97316"};
const CAT_LABELS={prime:"Prime",niche:"Niche",emerging:"Emerging"};

// ── Expo Outreach Engine Data ─────────────────────────────────────────────────
const EXPO_TARGETS = [

  // ── קבוצה א׳: המכפילים — חברות פלטפורמה ──

  { id:"e1", tier:1, name:"Quantum-Systems", flag:"🇩🇪", country:"גרמניה",
    poc:"Florian Seibel", pocTitle:"CEO", linkedin:"https://www.linkedin.com/in/florianseibel/",
    offer:"Daya כפיילוד מובנה ב-Vector VTOL + DFM Power להארכת זמן טיסה.",
    product:"Daya + DFM Power", fitScore:96, theme:"primes",
    hook:"Quantum-Systems' Vector is NATO's go-to VTOL — but endurance is the ceiling. Givon's Daya payload adds 100km ISR coverage and DFM nano-grid extends mission time by 40%. Two integrations, one meeting in Düsseldorf?",
    reasons:["Vector מחפש פיילוד ISR מובנה — Daya fit מושלם","DFM Power = הארכת זמן טיסה ישירה","~250 עובדים — גודל נכון לשותפות","NATO customers משותפים"],
    status:"טרם פנינו", url:"https://quantum-systems.com" },

  { id:"e2", tier:1, name:"Milrem Robotics", flag:"🇪🇪", country:"אסטוניה",
    poc:"Kuldar Väärsi", pocTitle:"CEO", linkedin:"https://www.linkedin.com/in/kuldar-vaarsi/",
    offer:"DFM Power לניהול אנרגיה טקטי על Themis UGV + Aerosentry להגנת C-UAS.",
    product:"DFM Power + Aerosentry", fitScore:95, theme:"primes",
    hook:"Milrem's Themis is deployed across 6 NATO nations — no power management, no C-UAS. Givon's DFM nano-grid extends mission time and Aerosentry mounts on existing power rails. Baltic states are buying now.",
    reasons:["Themis = UGV מוביל באירופה","DFM Power = הארכת משימה ישירה","Aerosentry fit לרכבת החשמל הקיימת","~200 עובדים — גודל נכון"],
    status:"טרם פנינו", url:"https://milremrobotics.com" },

  { id:"e3", tier:1, name:"Helsing", flag:"🇩🇪", country:"גרמניה",
    poc:"Gundbert Scherf", pocTitle:"Co-CEO", linkedin:"https://www.linkedin.com/in/gundbert-scherf/",
    offer:"שילוב iCit Vision AI בתוכנית השותפויות הפתוחה של Helsing.",
    product:"iCit Vision AI", fitScore:94, theme:"primes",
    hook:"Helsing has an open partnership program for edge AI components. iCit Vision AI runs on constrained hardware without cloud dependency — exactly what their tactical vision layer needs. Let's talk.",
    reasons:["תוכנית שותפויות פתוחה — דלת פתוחה","iCit = edge vision ללא ענן","~300 עובדים, יוניקורן — יש תקציב","לא מתחרים — משלימים"],
    status:"טרם פנינו", url:"https://helsing.ai" },

  { id:"e4", tier:1, name:"Echodyne", flag:"🇺🇸", country:"ארה״ב",
    poc:"Eben Frankenberg", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/echodyne/",
    offer:"AerOS כמרכז השליטה והאינטגרציה של מכ״מי Echodyne.",
    product:"AerOS C2 for Radar", fitScore:93, theme:"primes",
    hook:"Echodyne radar detects — AerOS decides and defeats. Together: detect-to-defeat in under 3 seconds. ~150 employees, no C2 layer — that's the gap Givon fills.",
    reasons:["Echodyne = radar בלבד, אין defeat layer","AerOS = החסר שלהם בדיוק","~150 עובדים — גודל נכון","joint GTM כפיל כוח מכירות"],
    status:"טרם פנינו", url:"https://echodyne.com" },

  { id:"e5", tier:1, name:"Ghost Robotics", flag:"🇺🇸", country:"ארה״ב",
    poc:"Jiren Parikh", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/ghost-robotics/",
    offer:"מארזי חומרים מרוכבים קלים ומיגון Nanoprom לרובוטים ההולכים של Ghost.",
    product:"Composites + Nanoprom", fitScore:87, theme:"manufacturing",
    hook:"Ghost Robotics' Vision 60 carries a heavy payload penalty. Givon's carbon composite housings reduce structural weight by 22% with Nanoprom armor. Two upgrades, one supplier, zero redesign.",
    reasons:["Vision 60 = בעיית משקל ידועה","חומרים מרוכבים = פחות 22% משקל","Nanoprom = מיגון קל — ייחודי","~100 עובדים — גודל נכון"],
    status:"טרם פנינו", url:"https://www.ghostrobotics.io" },

  { id:"e6", tier:1, name:"Skydio", flag:"🇺🇸", country:"ארה״ב",
    poc:"Adam Bry", pocTitle:"CEO", linkedin:"https://www.linkedin.com/in/adam-bry-skydio/",
    offer:"שילוב Crebain בתוכנית שותפי תוכנה X2 Ecosystem — נחילי ISR אוטונומיים.",
    product:"Crebain on X2 Ecosystem", fitScore:85, theme:"primes",
    hook:"Skydio's X2 Ecosystem is open for software partners. Crebain's decentralized swarm intelligence turns a fleet of X2s into a coordinated ISR swarm with no single point of failure.",
    reasons:["X2 Ecosystem = תוכנית שותפים פתוחה","Crebain = swarm layer מושלם","~450 עובדים, Blue UAS certified","DoD customers משותפים"],
    status:"טרם פנינו", url:"https://www.skydio.com" },

  { id:"e7", tier:1, name:"Doodle Labs", flag:"🇺🇸", country:"ארה״ב",
    poc:"Dustin Kenyon", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/doodle-labs/",
    offer:"Mesh Rider Radio כ-backbone תקשורת לנחיל Crebain.",
    product:"Crebain + Mesh Rider", fitScore:88, theme:"primes",
    hook:"Crebain's decentralized swarm needs resilient mesh comms. Doodle Labs' Mesh Rider is certified on 40+ NATO platforms. Together: a complete swarm solution. Co-demo at XPONENTIAL?",
    reasons:["Crebain צריך mesh comms מוכח","Mesh Rider certified ב-40+ NATO platforms","~100 עובדים — גודל נכון","co-demo = חשיפה משותפת בכנס"],
    status:"טרם פנינו", url:"https://doodlelabs.com" },

  { id:"e8", tier:1, name:"Teal Drones", flag:"🇺🇸", country:"ארה״ב",
    poc:"George Matus", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/teal-drones/",
    offer:"ייצור מארזים ורכיבים מדויקים בסטנדרט AS9100 לרחפני Blue UAS של Teal.",
    product:"AS9100 Manufacturing", fitScore:83, theme:"manufacturing",
    hook:"Teal Drones is scaling Blue UAS production and needs AS9100-certified composite suppliers. Givon's facility provides certified components with Israeli quality and competitive lead times.",
    reasons:["Blue UAS = DoD certified — שוק מובטח","AS9100 = סטנדרט נדרש","~120 עובדים — גודל נכון","supply chain מחוץ לארה״ב — יתרון"],
    status:"טרם פנינו", url:"https://tealdrones.com" },

  { id:"e9", tier:1, name:"Ascent AeroSystems", flag:"🇺🇸", country:"ארה״ב",
    poc:"Todd Doyle", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/ascent-aerosystems/",
    offer:"ייצור רכיבי חומרה מדויקים לרחפנים הקואקסיאליים העמידים של Ascent.",
    product:"Precision Manufacturing", fitScore:80, theme:"manufacturing",
    hook:"Ascent AeroSystems builds ruggedized coaxial drones for harsh environments. Givon's precision machining delivers the tight-tolerance components they need — certified, reliable, cost-competitive.",
    reasons:["רחפנים עמידים = דרישות דיוק גבוהות","~50 עובדים — גמיש ונגיש","precision machining = specialty של גבעון","potential volume = סדרתי"],
    status:"טרם פנינו", url:"https://ascentaerosystems.com" },

  { id:"e10", tier:1, name:"BRINC Drones", flag:"🇺🇸", country:"ארה״ב",
    poc:"Blake Resnick", pocTitle:"CEO", linkedin:"https://www.linkedin.com/in/blakeresnick/",
    offer:"iCit Vision AI לניווט אוטונומי ולזיהוי איומים בסביבות indoor.",
    product:"iCit for Indoor ISR", fitScore:82, theme:"primes",
    hook:"BRINC drones enter buildings — iCit Vision AI tells them what they're looking at. Automatic threat classification, person detection, weapon identification — on-device, no cloud, no latency.",
    reasons:["BRINC = indoor ISR ללא analytics","iCit = on-device, no cloud","~100 עובדים — גודל נכון","Law enforcement + military = שוק דואלי"],
    status:"טרם פנינו", url:"https://brincdrones.com" },

  // ── קבוצה ב׳: המשלימים — מכירה משותפת ──

  { id:"e11", tier:2, name:"infiniDome", flag:"🇮🇱", country:"ישראל",
    poc:"Omer Sharar", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/infinidome/",
    offer:"GPSdome + Cyberbee = פתרון ניווט חסין לחלוטין.",
    product:"Cyberbee + GPSdome", fitScore:90, theme:"primes",
    hook:"infiniDome protects GPS — Cyberbee navigates without it. Together: a complete GPS-resilience solution. Both Israeli, both NATO-ready. Co-sell makes sense.",
    reasons:["שתי חברות ישראליות — אמון מהיר","GPSdome + Cyberbee = פתרון מלא","~50 עובדים — גמיש","Ukraine = הוכחת ביקוש מיידי"],
    status:"טרם פנינו", url:"https://infinidome.com" },

  { id:"e12", tier:2, name:"Septentrio", flag:"🇧🇪", country:"בלגיה",
    poc:"Jan Van Hees", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/septentrio/",
    offer:"GNSS מדויק של Septentrio כמשלים ל-Cyberbee במכרזי ניווט טקטי.",
    product:"Cyberbee + GNSS", fitScore:82, theme:"supply",
    hook:"Septentrio's precision GNSS and Cyberbee's visual navigation cover each other's blind spots. One handles open sky, the other handles GPS-denied. Together: a complete nav solution.",
    reasons:["~150 עובדים — גודל נכון","GNSS + visual nav = complete solution","מכרזי ניווט טקטי = שוק משותף","co-sell = ללא עלות פיתוח"],
    status:"טרם פנינו", url:"https://www.septentrio.com" },

  { id:"e13", tier:2, name:"Fortem Technologies", flag:"🇺🇸", country:"ארה״ב",
    poc:"Timothy Bean", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/fortem-technologies/",
    offer:"מכירה משותפת: TrueView radar + Aerosentry = פתרון הגנה היקפי שלם.",
    product:"Aerosentry + TrueView", fitScore:87, theme:"primes",
    hook:"Fortem's TrueView radar detects — Aerosentry defeats. Together: a complete perimeter defense solution. ~150 employees, complementary tech, same customers.",
    reasons:["TrueView = detection בלבד","Aerosentry = defeat layer — משלים","~150 עובדים — גודל נכון","airports + bases = שוק ברור"],
    status:"טרם פנינו", url:"https://fortemtech.com" },

  { id:"e14", tier:2, name:"WhiteFox Defense", flag:"🇺🇸", country:"ארה״ב",
    poc:"Theresa Stadheim", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/whitefox-defense/",
    offer:"GuaRdF + WhiteFox = כיסוי RF מלא — signatures ידועים + לא ידועים.",
    product:"GuaRdF + WhiteFox RF", fitScore:84, theme:"primes",
    hook:"WhiteFox detects known RF signatures — GuaRdF detects unknown protocols. Together: full RF coverage. ~100 employees, same customer base.",
    reasons:["WhiteFox = known signatures","GuaRdF = unknown/anomaly — משלים","~100 עובדים — גודל נכון","Homeland Security = שוק ברור"],
    status:"טרם פנינו", url:"https://whitefoxdefense.com" },

  { id:"e15", tier:2, name:"Tomahawk Robotics", flag:"🇺🇸", country:"ארה״ב",
    poc:"Jacob Kaplan", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/tomahawk-robotics/",
    offer:"הטמעת Daya ו-Sky Fort ב-Kinesis — שליטה אחודה על מערכות גבעון.",
    product:"Daya + Sky Fort via Kinesis", fitScore:81, theme:"primes",
    hook:"Tomahawk's Kinesis is the unified controller for DoD autonomous systems. Daya and Sky Fort integrated means one operator controls ISR and C-UAS simultaneously. SOCOM loves this.",
    reasons:["Kinesis = unified C2 ל-DoD","Daya + Sky Fort = payload מושלם","~80 עובדים — גודל נכון","SOCOM = customer משותף"],
    status:"טרם פנינו", url:"https://tomahawkrobotics.com" },

  { id:"e16", tier:2, name:"Persistent Systems", flag:"🇺🇸", country:"ארה״ב",
    poc:"Herbert Rubens", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/persistent-systems-llc/",
    offer:"Wave Relay כתשתית לשידור נתונים ממערכות Daya ו-Guardian Angel.",
    product:"Daya + Wave Relay", fitScore:84, theme:"primes",
    hook:"Persistent Systems' Wave Relay is on 200+ DoD programs. Daya and Guardian Angel as certified payloads means immediate access to that installed base.",
    reasons:["Wave Relay = 200+ DoD programs","Daya + Guardian Angel = certified payloads","~200 עובדים — גודל נכון","installed base מוכן"],
    status:"טרם פנינו", url:"https://www.persistentsystems.com" },

  { id:"e17", tier:2, name:"Silvus Technologies", flag:"🇺🇸", country:"ארה״ב",
    poc:"Raju Pudota", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/silvus-technologies/",
    offer:"StreamCaster MIMO כשותף OEM למערכות ISR של גבעון.",
    product:"ISR + StreamCaster OEM", fitScore:82, theme:"primes",
    hook:"Silvus StreamCaster is SOF communications standard. Givon's ISR systems certified compatible means an OEM agreement puts Givon inside every Silvus deployment. ~150 employees.",
    reasons:["StreamCaster = תקשורת SOF סטנדרט","OEM = הכנסה פסיבית לגבעון","~150 עובדים — גודל נכון","SOF channel = SOCOM access"],
    status:"טרם פנינו", url:"https://silvustechnologies.com" },

  { id:"e18", tier:2, name:"Septier", flag:"🇮🇱", country:"ישראל",
    poc:"Dror Fixler", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/septier/",
    offer:"מודיעין RF של Septier כמשלים ל-GuaRdF במכרזי Homeland Security.",
    product:"GuaRdF + Septier RF", fitScore:86, theme:"primes",
    hook:"Septier provides RF intelligence — GuaRdF provides RF tracking. Both Israeli, both targeting Homeland Security. A joint offering to European ministries makes both stronger.",
    reasons:["שתי חברות ישראליות — אמון מהיר","RF intel + RF tracking = complete","~100 עובדים — גודל נכון","Homeland Security EU = שוק משותף"],
    status:"טרם פנינו", url:"https://www.septier.com" },

  { id:"e19", tier:2, name:"Visual Layer", flag:"🇮🇱", country:"ישראל",
    poc:"Gal Almog", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/visual-layer/",
    offer:"ניהול דאטה ויזואלי לאופטימיזציה של מודלי iCit.",
    product:"iCit + Visual Layer data", fitScore:84, theme:"primes",
    hook:"Visual Layer manages visual datasets at scale — exactly what training iCit Vision AI models requires. Both Israeli, ~40 employees, natural R&D partnership.",
    reasons:["Visual Layer = dataset management","iCit = צריך visual data מאורגן","~40 עובדים — R&D קל","שתי חברות ישראליות"],
    status:"טרם פנינו", url:"https://www.visual-layer.com" },

  { id:"e20", tier:2, name:"Improbable Defence", flag:"🇬🇧", country:"בריטניה",
    poc:"Peter Ingram", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/improbable-defence/",
    offer:"נתונים מבצעיים של גבעון לבניית Digital Twin של C-UAS.",
    product:"D-COE + Digital Twin", fitScore:83, theme:"primes",
    hook:"Improbable builds the synthetic environment — Givon provides the operational data. Together: the most accurate C-UAS training simulation in NATO. ~400 employees, UK MOD contracts.",
    reasons:["Improbable = synthetic env","גבעון = operational data אמיתי","~400 עובדים, UK MOD contracts","UK DASA funding path"],
    status:"טרם פנינו", url:"https://www.improbable.io/defence" },

  // ── קבוצה ג׳: שותפי ייצור ואספקה ──

  { id:"e21", tier:3, name:"Mistral Inc", flag:"🇺🇸", country:"ארה״ב",
    poc:"Ron Friedmann", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/mistral-inc/",
    offer:"שער כניסה למכירת Daya ו-Aerosentry ל-SOCOM.",
    product:"SOCOM Channel Partner", fitScore:93, theme:"primes",
    hook:"Mistral has placed Israeli technologies into SOCOM programs. Givon's Daya and Aerosentry fit active BAA topics right now. Fastest path to a SOCOM contract. ~100 employees.",
    reasons:["ניסיון עם חברות ישראליות ב-SOCOM","BAA topics פעילים","~100 עובדים — גודל נכון","6 חודשים לחוזה — הכי מהיר"],
    status:"טרם פנינו", url:"https://www.mistralinc.com" },

  { id:"e22", tier:3, name:"Volz Servos", flag:"🇩🇪", country:"גרמניה",
    poc:"Andreas Volz", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/volz-servos/",
    offer:"מנועי סרוו לייצור מערכות היגוי ב-Daya.",
    product:"Daya Servo Components", fitScore:78, theme:"supply",
    hook:"Volz Servos builds the most reliable UAV servos in Europe. Daya's guidance system requires exactly their spec. ~60 employees, German quality, NATO-certified.",
    reasons:["Daya = צריך סרוואים אמינים","Volz = מוביל אירופי בסרוואים","~60 עובדים — supply chain נכון","גרמניה = NATO-certified"],
    status:"טרם פנינו", url:"https://www.volz-servos.com" },

  { id:"e23", tier:3, name:"Sky Power GmbH", flag:"🇩🇪", country:"גרמניה",
    poc:"Stefan Geis", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/sky-power-gmbh/",
    offer:"מנועי heavy-fuel לשילוב במערכות ISR ארוכות טווח.",
    product:"Daya Long-Range Engines", fitScore:76, theme:"supply",
    hook:"Sky Power builds heavy-fuel engines for long-endurance UAVs. Daya ISR requires exactly their spec for extended range missions. ~40 employees, proven supply chain.",
    reasons:["Daya ארוך טווח = צריך heavy-fuel","Sky Power = מומחי מנועים ל-UAV","~40 עובדים — גמיש","German engineering = אמינות"],
    status:"טרם פנינו", url:"https://sky-power.de" },

  { id:"e24", tier:3, name:"Acutronic Group", flag:"🇨🇭", country:"שווייץ",
    poc:"Beat Kaufmann", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/acutronic/",
    offer:"הנעה וסימולציה ל-D-COE — שותף אסטרטגי לסימולטורים טקטיים.",
    product:"D-COE Simulation Platform", fitScore:80, theme:"supply",
    hook:"Acutronic builds motion systems and simulation platforms. D-COE needs exactly their hardware for realistic drone training scenarios. ~200 employees, Swiss precision, NATO customers.",
    reasons:["D-COE = צריך motion systems","Acutronic = מוביל ב-motion simulation","~200 עובדים — גודל נכון","NATO customers משותפים"],
    status:"טרם פנינו", url:"https://www.acutronic.com" },

  { id:"e25", tier:3, name:"Glenair", flag:"🇺🇸", country:"ארה״ב",
    poc:"Chris Toomey", pocTitle:"VP Business Development", linkedin:"https://www.linkedin.com/company/glenair/",
    offer:"מחברים mil-spec לייצור סדרתי של מערכות Aerosentry.",
    product:"Aerosentry Connectors", fitScore:75, theme:"supply",
    hook:"Glenair's ruggedized connectors are in every NATO ground system. Aerosentry scaling to production requires their mil-spec connectors. European branch ~400 employees, fast certification.",
    reasons:["Aerosentry = צריך mil-spec connectors","Glenair = מוביל ב-mil connectors","סניף אירופי — delivery מהיר","NATO-certified = אין approval נוסף"],
    status:"טרם פנינו", url:"https://www.glenair.com" },

  { id:"e26", tier:3, name:"Blue Canyon Tech", flag:"🇺🇸", country:"ארה״ב",
    poc:"George Stafford", pocTitle:"President", linkedin:"https://www.linkedin.com/company/blue-canyon-technologies/",
    offer:"ייצור רכיבים מדויקים מחומרים מרוכבים לתוכניות UAV וחלל.",
    product:"Precision Composites", fitScore:74, theme:"manufacturing",
    hook:"Blue Canyon Tech needs precision composite components for their growing UAV programs. Givon's AS9100 facility delivers certified components at scale. ~300 employees, growing DoD portfolio.",
    reasons:["צמיחה מהירה בייצור","AS9100 composites = נדרש","~300 עובדים — שוק מעניין","DoD portfolio גדל"],
    status:"טרם פנינו", url:"https://bluecanyontech.com" },

  { id:"e27", tier:3, name:"UAVOS", flag:"🇺🇸", country:"ארה״ב",
    poc:"Aliaksei Stratsilatau", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/uavos/",
    offer:"הטמעת Crebain בכלים של UAVOS — swarm intelligence על גבי מערכות הבקרה שלהם.",
    product:"Crebain on UAVOS", fitScore:79, theme:"primes",
    hook:"UAVOS builds UAV control systems. Crebain's swarm intelligence runs on top of their existing autopilot — no hardware change. ~100 employees, international customer base.",
    reasons:["UAVOS = control systems ללא swarm","Crebain = swarm layer — no hardware change","~100 עובדים — גודל נכון","international base = שווקים חדשים"],
    status:"טרם פנינו", url:"https://www.uavos.com" },

  { id:"e28", tier:3, name:"Shield Capital", flag:"🇺🇸", country:"ארה״ב",
    poc:"Philip Bilden", pocTitle:"Managing Partner", linkedin:"https://www.linkedin.com/company/shield-capital/",
    offer:"שותפות הון אסטרטגית — מכירת מודל ה-Venture Building של גבעון.",
    product:"Strategic Equity Partnership", fitScore:91, theme:"primes",
    hook:"Shield Capital's fund targets dual-use, counter-UAS, swarm AI with DoD validation — exactly what Givon has built. TRL 7 hardware, NATO-tested software. 30 minutes for a portfolio review?",
    reasons:["Shield = קרן defense מובילה","Aerosentry TRL 7 + Crebain TRL 5","~50 עובדים — נגיש ומוכוון CVC","מודל Venture Building = ייחודי"],
    status:"טרם פנינו", url:"https://www.shieldcap.com" },

  { id:"e29", tier:3, name:"Ondas Holdings", flag:"🇺🇸", country:"ארה״ב",
    poc:"Eric Brock", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/ondas-holdings/",
    offer:"Aerosentry כמועמד הטבעי הבא לרכישה/שותפות — precedent של Sentrycs.",
    product:"Aerosentry M&A", fitScore:88, theme:"primes",
    hook:"Ondas acquired Sentrycs — an Israeli C-UAS company — and it worked. Givon's Aerosentry is the next logical step: same thesis, stronger technology. ~200 employees, active M&A strategy.",
    reasons:["רכשו Sentrycs ישראלית — precedent","Aerosentry = אותה קטגוריה, TRL גבוה","~200 עובדים, public company","M&A אסטרטגית פעילה"],
    status:"טרם פנינו", url:"https://www.ondas.com" },
{ id:"e30", tier:3, name:"HawkEye 360", flag:"🇺🇸", country:"ארה״ב", poc:"John Serafini", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/hawkeye-360/", offer:"נתוני קצה מ-GuaRdF + RF מהחלל של HawkEye = תמונת מודיעין RF מלאה.", product:"GuaRdF + Space RF Intel", fitScore:85, theme:"primes", hook:"HawkEye 360 sees RF from space — GuaRdF sees it from the ground. Together: complete RF intelligence.", reasons:["RF מהחלל","RF מהקצה — משלים","Homeland Security"], status:"טרם פנינו", url:"https://www.he360.com" },
  { id:"e31", tier:2, name:"Xer Technologies", flag:"🇨🇭", country:"שווייץ", poc:"To Research", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/xer-technologies/", offer:"שילוב Daya ו-Guardian Angel כפיילוד ISR בפלטפורמות Heavy-lift של Xer.", product:"Daya + Guardian Angel", fitScore:88, theme:"primes", hook:"Xer Technologies integrates heavy-lift drones for long-endurance missions across Europe. Givon's Daya payload (TRL 7) is exactly what their integrator contracts need.", reasons:["מחפשות שותפי סנסורים TRL 7","חוזים קיימים באירופה","~50 עובדים","ביטחון + תשתית"], status:"טרם פנינו", url:"https://www.xer-technologies.com" },
    poc:"To Research", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/xer-technologies/",
    offer:"שילוב Daya ו-Guardian Angel כפיילוד ISR בפלטפורמות Heavy-lift של Xer.",
    product:"Daya + Guardian Angel", fitScore:88, theme:"primes",
    hook:"Xer Technologies integrates heavy-lift drones for long-endurance missions across Europe. Givon's Daya payload (TRL 7) is exactly what their integrator contracts need — sensor-ready, NATO-compatible. One meeting in Düsseldorf?",
    reasons:["מחפשות שותפי סנסורים TRL 7","חוזים קיימים באירופה — כניסה מהירה","~50 עובדים — גמיש","ביטחון + תשתית = שוק דואלי"],
    status:"טרם פנינו", url:"https://www.xer-technologies.com" },

  { id:"e32", tier:1, name:"DTC — Domo Tactical Comms", flag:"🇬🇧", country:"בריטניה",
    poc:"To Research", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/domo-tactical-communications/",
    offer:"Crebain כשכבת AI מעל רשת ה-C2 של DTC — פתרון אוטונומי שלם ל-DoD.",
    product:"Crebain on DTC C2", fitScore:92, theme:"primes",
    hook:"DTC holds active DoD C2 network contracts and is actively looking for autonomous AI layers. Crebain's decentralized swarm intelligence sits perfectly on top of their mesh network. Complete solution, zero hardware change.",
    reasons:["חוזי DoD פעילים — כניסה מיידית","Crebain = AI layer מעל הרשת שלהם","~250 עובדים — גודל נכון","co-sell = ללא עלות פיתוח"],
    status:"טרם פנינו", url:"https://www.domotactical.com" },

  { id:"e33", tier:2, name:"DeltaQuad", flag:"🇳🇱", country:"הולנד",
    poc:"To Research", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/deltaquad/",
    offer:"OEM sub-contracting — Daya ו-Aerosentry כפתרון הגנה קולקטיבית על פלטפורמות DeltaQuad.",
    product:"Daya + Aerosentry OEM", fitScore:86, theme:"primes",
    hook:"DeltaQuad just received strategic investment to expand in European defense. They need OEM partners for collective defense solutions. Givon's Daya + Aerosentry is the complete package — ISR and C-UAS in one integration.",
    reasons:["השקעה אסטרטגית חדשה — יש תקציב","מחפשות OEM sub-contracting — מודל גבעון","~100 עובדים — גודל נכון","שוק ביטחוני אירופאי"],
    status:"טרם פנינו", url:"https://www.deltaquad.com" },

  { id:"e34", tier:2, name:"Anello Photonics", flag:"🇺🇸", country:"ארה״ב",
    poc:"To Research", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/anello-photonics/",
    offer:"Cyberbee + Anello IMU = פתרון ניווט GPS-denied שלם ל-Navy ו-SOCOM.",
    product:"Cyberbee + Anello IMU", fitScore:89, theme:"primes",
    hook:"Anello Photonics bridges to Navy and SOCOM navigation contracts. Cyberbee's visual navigation + Anello's IMU = complete GPS-denied solution. They're already in the room — Givon just needs to be the software layer.",
    reasons:["גישה ישירה ל-Navy + SOCOM","Cyberbee = visual nav — משלים ל-IMU","~80 עובדים — גודל נכון","חוזי ניווט פעילים"],
    status:"טרם פנינו", url:"https://www.anellophotonics.com" },

  { id:"e35", tier:2, name:"HawkEye 360", flag:"🇺🇸", country:"ארה״ב",
    poc:"John Serafini", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/hawkeye-360/",
    offer:"נתוני קצה מ-GuaRdF + RF מהחלל של HawkEye = תמונת מודיעין RF מלאה ל-Homeland Security.",
    product:"GuaRdF + Space RF Intel", fitScore:85, theme:"primes",
    hook:"HawkEye 360 sees RF from space — GuaRdF sees it from the ground. Together: complete RF intelligence from orbit to edge. Same Homeland Security customers, zero overlap. Co-sell opportunity.",
    reasons:["HawkEye = RF מהחלל","GuaRdF = RF מהקצה — משלים","~250 עובדים","Homeland Security = שוק משותף"],
    status:"טרם פנינו", url:"https://www.he360.com" },

  { id:"e36", tier:3, name:"Mistral Solutions", flag:"🇮🇳", country:"הודו",
    poc:"To Research", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/mistral-solutions/",
    offer:"ייצור ואינטגרציה של Aerosentry ב-Scale לשווקים מחוץ לארה״ב.",
    product:"Aerosentry Manufacturing Scale", fitScore:82, theme:"manufacturing",
    hook:"Mistral Solutions specializes in ISR electronics manufacturing and system integration. Aerosentry at scale for non-US markets — India, Southeast Asia, Gulf — needs exactly their capabilities. Sister company already proven with US DoD.",
    reasons:["התמחות ISR electronics","Scale ייצור מחוץ לארה״ב","חברת אחות Mistral Inc מוכחת ב-DoD","שווקים חדשים — הודו, GCC, SE Asia"],
    status:"טרם פנינו", url:"https://www.mistralsolutions.com" },
    poc:"John Serafini", pocTitle:"CEO", linkedin:"https://www.linkedin.com/company/hawkeye-360/",
    offer:"נתוני קצה מ-GuaRdF + RF מהחלל של HawkEye = מודיעין RF מלא.",
    product:"GuaRdF + Space RF Intel", fitScore:77, theme:"primes",
    hook:"HawkEye 360 sees RF from space — GuaRdF sees it from the ground. Together: RF intelligence from orbit to edge. Same customers, no overlap. Co-sell for Homeland Security.",
    reasons:["HawkEye = RF מהחלל","GuaRdF = RF מהקצה — משלים","אותם customers","co-sell = ללא עלות פיתוח"],
    status:"טרם פנינו", url:"https://www.he360.com" },
];


const TIER_CONFIG = {
  1:{ label:"Alpha — Must Meet", color:"#ef4444", bg:"#ef444412", icon:"🔴" },
  2:{ label:"Strategic Partners", color:"#f97316", bg:"#f9731612", icon:"🟠" },
  3:{ label:"Tech Synergy", color:"#eab308", bg:"#eab30812", icon:"🟡" },
  4:{ label:"Strategy & Growth", color:"#64748b", bg:"#64748b12", icon:"⚪" },
};
const THEME_LABELS = { primes:"🎯 Primes & Systems", manufacturing:"🏭 Manufacturing & Materials", supply:"⚙️ Supply Chain" };
const STATUS_FLOW = ["טרם פנינו","נשלחה פנייה","נקבעה פגישה"];
const STATUS_COLORS = {"טרם פנינו":"#475569","נשלחה פנייה":"#f97316","נקבעה פגישה":"#22c55e"};

function ExpoTargetCard({target, onStatusChange}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const tier = TIER_CONFIG[target.tier];
  const sc = STATUS_COLORS[target.status];
  const fc = fitCol(target.fitScore);

  const copyHook = () => {
    navigator.clipboard.writeText(target.hook);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const nextStatus = () => {
    const idx = STATUS_FLOW.indexOf(target.status);
    if (idx < STATUS_FLOW.length-1) onStatusChange(target.id, STATUS_FLOW[idx+1]);
  };

  return (
    <div style={{background:"#0f172a",borderRadius:10,padding:16,border:`1px solid ${tier.color}20`,borderRight:`3px solid ${tier.color}`,display:"flex",flexDirection:"column",gap:10}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
            <span style={{fontSize:14}}>{target.flag}</span>
            <span style={{fontSize:"9px",fontWeight:700,padding:"2px 6px",borderRadius:3,background:tier.bg,border:`1px solid ${tier.color}40`,color:tier.color}}>{tier.icon} {tier.label}</span>
            <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:3,background:`${sc}15`,border:`1px solid ${sc}40`,color:sc,fontWeight:700}}>{target.status}</span>
          </div>
          <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9",marginBottom:2}}>{target.name}</div>
          <div style={{fontSize:"10px",color:"#475569"}}>{target.country} · {target.product}</div>
        </div>
        <div style={{width:38,height:38,borderRadius:"50%",border:`2px solid ${fc}`,background:`${fc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:fc,fontFamily:"Roboto Mono,monospace",flexShrink:0}}>{target.fitScore}</div>
      </div>

      {/* POC */}
      <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:7,padding:"8px 11px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:"9px",color:"#475569",fontWeight:700,marginBottom:2}}>👤 איש קשר</div>
          <div style={{fontSize:"12px",fontWeight:700,color:"#e2e8f0"}}>{target.poc}</div>
          <div style={{fontSize:"10px",color:"#64748b"}}>{target.pocTitle}</div>
        </div>
        <a href={target.linkedin} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{background:"#1e3a5f",border:"1px solid #3b82f640",color:"#60a5fa",padding:"5px 10px",borderRadius:6,fontSize:"10px",fontWeight:700,textDecoration:"none"}}>LinkedIn ↗</a>
      </div>

      {/* Offer */}
      <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a25",borderRadius:7,padding:"8px 11px"}}>
        <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:3}}>🎯 מה מציעים</div>
        <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.55}}>{target.offer}</div>
      </div>

      {/* Fit Reasons */}
      <div style={{background:"#0a0f1e",borderRadius:7,padding:"8px 11px"}}>
        <div style={{fontSize:"9px",color:fc,fontWeight:700,marginBottom:5}}>✅ למה Fit {target.fitScore}</div>
        {target.reasons.map((r,i)=>(
          <div key={i} style={{fontSize:"10px",color:"#94a3b8",padding:"2px 0",borderBottom:i<target.reasons.length-1?"1px solid #1e293b":"none",display:"flex",gap:5}}>
            <span style={{color:fc}}>·</span>{r}
          </div>
        ))}
      </div>

      {/* Hook — expandable */}
      {expanded && (
        <div style={{background:"#0c1a2e",border:"1px solid #1e40af30",borderRadius:7,padding:"10px 12px"}}>
          <div style={{fontSize:"9px",color:"#60a5fa",fontWeight:700,marginBottom:6}}>💬 Strategic Hook — מוכן להעתקה</div>
          <div style={{fontSize:"11px",color:"#cbd5e1",lineHeight:1.65,fontStyle:"italic",marginBottom:8}}>"{target.hook}"</div>
          <button onClick={copyHook} style={{background:copied?"#16a34a":"#1e3a5f",border:`1px solid ${copied?"#22c55e":"#3b82f6"}40`,color:copied?"#4ade80":"#60a5fa",padding:"5px 14px",borderRadius:5,fontSize:"10px",fontWeight:700,cursor:"pointer",width:"100%"}}>
            {copied?"✓ הועתק!":"📋 העתק Hook"}
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{display:"flex",gap:6,borderTop:"1px solid #1e293b",paddingTop:8}}>
        <button onClick={()=>setExpanded(!expanded)} style={{flex:1,background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"5px",borderRadius:6,fontSize:"10px",cursor:"pointer"}}>
          {expanded?"▲ סגור":"💬 Hook"}
        </button>
        {target.status !== "נקבעה פגישה" && (
          <button onClick={()=>nextStatus()} style={{flex:2,background:`${STATUS_COLORS[STATUS_FLOW[STATUS_FLOW.indexOf(target.status)+1]]}18`,border:`1px solid ${STATUS_COLORS[STATUS_FLOW[STATUS_FLOW.indexOf(target.status)+1]]}40`,color:STATUS_COLORS[STATUS_FLOW[STATUS_FLOW.indexOf(target.status)+1]],padding:"5px 10px",borderRadius:6,fontSize:"10px",fontWeight:700,cursor:"pointer"}}>
            → {STATUS_FLOW[STATUS_FLOW.indexOf(target.status)+1]}
          </button>
        )}
        {target.status === "נקבעה פגישה" && (
          <div style={{flex:2,background:"#16a34a18",border:"1px solid #22c55e40",color:"#4ade80",padding:"5px 10px",borderRadius:6,fontSize:"10px",fontWeight:700,textAlign:"center"}}>✓ פגישה בלו״ז!</div>
        )}
        <a href={target.url} target="_blank" rel="noreferrer" style={{background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"5px 10px",borderRadius:6,fontSize:"10px",textDecoration:"none"}}>↗</a>
      </div>
    </div>
  );
}

function ExpoOutreachEngine({onClose}) {
  const [targets, setTargets] = useState(EXPO_TARGETS);
  const [themeFilter, setThemeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const updateStatus = (id, newStatus) => {
    setTargets(prev => prev.map(t => t.id===id ? {...t, status:newStatus} : t));
  };

  const filtered = targets.filter(t => {
    if(themeFilter!=="all" && t.theme!==themeFilter) return false;
    if(tierFilter!=="all" && t.tier!==parseInt(tierFilter)) return false;
    if(statusFilter!=="all" && t.status!==statusFilter) return false;
    return true;
  }).sort((a,b)=>b.fitScore-a.fitScore);

  const meetings = targets.filter(t=>t.status==="נקבעה פגישה").length;
  const sent = targets.filter(t=>t.status==="נשלחה פנייה").length;
  const pending = targets.filter(t=>t.status==="טרם פנינו").length;
  const daysToConf = Math.ceil((new Date("2026-03-24") - new Date()) / (1000*60*60*24));

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(2,6,23,0.97)",zIndex:300,overflowY:"auto",direction:"rtl"}}>
      <div style={{maxWidth:1300,margin:"0 auto",padding:"24px"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{fontSize:"10px",color:"#f97316",fontWeight:700,letterSpacing:"0.15em",marginBottom:4}}>🎪 XPONENTIAL EUROPE 2026 · DÜSSELDORF</div>
            <div style={{fontSize:"22px",fontWeight:800,color:"#f1f5f9",marginBottom:3}}>🎯 הכנה לקראת הכנס — Outreach Engine</div>
            <div style={{fontSize:"12px",color:"#475569"}}>{targets.length} מטרות · {daysToConf} ימים לכנס · 24–26 מרץ 2026</div>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"8px 16px",borderRadius:8,fontSize:"12px",cursor:"pointer"}}>✕ חזור לכנסים</button>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}}>
          {[
            ["🗓️ ימים לכנס", daysToConf, "#f97316"],
            ["🎯 מטרות", targets.length, "#3b82f6"],
            ["📬 נשלחה פנייה", sent, "#f97316"],
            ["✅ נקבעה פגישה", meetings, "#22c55e"],
            ["⏳ טרם פנינו", pending, "#ef4444"],
          ].map(([l,v,c])=>(
            <div key={l} style={{background:"#0a0f1e",border:`1px solid ${c}20`,borderTop:`2px solid ${c}`,borderRadius:8,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:"22px",fontWeight:800,color:c,fontFamily:"Roboto Mono,monospace",lineHeight:1}}>{v}</div>
              <div style={{fontSize:"9px",color:"#334155",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:8,padding:"12px 16px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:"10px",color:"#475569",fontWeight:700}}>התקדמות Outreach</span>
            <span style={{fontSize:"10px",color:"#22c55e",fontFamily:"Roboto Mono,monospace"}}>{Math.round((meetings/targets.length)*100)}% פגישות נסגרו</span>
          </div>
          <div style={{background:"#1e293b",borderRadius:4,height:8,display:"flex",overflow:"hidden"}}>
            <div style={{width:`${(meetings/targets.length)*100}%`,background:"#22c55e",transition:"width 0.4s"}}/>
            <div style={{width:`${(sent/targets.length)*100}%`,background:"#f97316",transition:"width 0.4s"}}/>
          </div>
          <div style={{display:"flex",gap:12,marginTop:6}}>
            {[["#22c55e","נקבעה פגישה"],["#f97316","נשלחה פנייה"],["#475569","טרם פנינו"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",gap:4,alignItems:"center"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:"9px",color:"#475569"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:"10px",color:"#334155"}}>דרג:</span>
          {[["all","הכל"],["1","🔴 Alpha"],["2","🟠 Strategic"],["3","🟡 Tech"],["4","⚪ Strategy"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTierFilter(v)} style={{background:tierFilter===v?"#1e293b":"transparent",border:`1px solid ${tierFilter===v?"#475569":"#1e293b"}`,color:tierFilter===v?"#f1f5f9":"#475569",padding:"4px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{l}</button>
          ))}
          <div style={{width:1,height:14,background:"#1e293b"}}/>
          <span style={{fontSize:"10px",color:"#334155"}}>זרוע:</span>
          {[["all","הכל"],["primes","🎯 Primes"],["manufacturing","🏭 Manufacturing"],["supply","⚙️ Supply"]].map(([v,l])=>(
            <button key={v} onClick={()=>setThemeFilter(v)} style={{background:themeFilter===v?"#1e3a5f":"transparent",border:`1px solid ${themeFilter===v?"#3b82f6":"#1e293b"}`,color:themeFilter===v?"#60a5fa":"#475569",padding:"4px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{l}</button>
          ))}
          <div style={{width:1,height:14,background:"#1e293b"}}/>
          <span style={{fontSize:"10px",color:"#334155"}}>סטטוס:</span>
          {[["all","הכל"],["טרם פנינו","⏳"],["נשלחה פנייה","📬"],["נקבעה פגישה","✅"]].map(([v,l])=>(
            <button key={v} onClick={()=>setStatusFilter(v)} style={{background:statusFilter===v?"#1e293b":"transparent",border:`1px solid ${statusFilter===v?"#475569":"#1e293b"}`,color:statusFilter===v?"#f1f5f9":"#475569",padding:"4px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{l}</button>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:14}}>
          {filtered.map(t=><ExpoTargetCard key={t.id} target={t} onStatusChange={updateStatus}/>)}
        </div>
      </div>
    </div>
  );
}

function ConferenceCard({conf, onExpoClick}){
  const [h,setH]=useState(false);
  const color=CAT_COLORS[conf.category]||"#475569";
  const days=conf.daysAway;
  const isPast=days!==null&&days<0;
  const isSoon=days!==null&&days<=60&&days>=0;
  const isXPO = conf.id==="c13";
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#0f172a",borderRadius:10,padding:16,border:`1px solid ${isXPO?"#f97316":color}20`,borderTop:`3px solid ${isPast?"#334155":isXPO?"#f97316":color}`,transition:"transform .15s, box-shadow .15s",opacity:isPast?0.5:1,transform:h?"translateY(-2px)":"none",boxShadow:h?`0 6px 20px ${isXPO?"#f97316":color}20`:"none"}}>
      <div onClick={()=>conf.url&&window.open(conf.url,"_blank")} style={{cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:5,marginBottom:5,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:14}}>{conf.flag}</span>
              <span style={{fontSize:"9px",fontWeight:700,padding:"2px 6px",borderRadius:3,background:`${color}15`,border:`1px solid ${color}40`,color,fontFamily:"Roboto Mono,monospace"}}>{CAT_LABELS[conf.category]}</span>
              {isSoon&&<span style={{fontSize:"9px",fontWeight:700,padding:"2px 6px",borderRadius:3,background:"#22c55e15",border:"1px solid #22c55e40",color:"#22c55e"}}>בקרוב!</span>}
              {isPast&&<span style={{fontSize:"9px",color:"#334155"}}>עבר</span>}
              {isXPO&&<span style={{fontSize:"9px",fontWeight:700,padding:"2px 6px",borderRadius:3,background:"#f9731615",border:"1px solid #f9731640",color:"#f97316"}}>🎯 מוכן לכנס</span>}
            </div>
            <div style={{fontSize:"13px",fontWeight:800,color:"#f1f5f9",marginBottom:2}}>{conf.name}</div>
            <div style={{fontSize:"10px",color:"#475569"}}>{conf.location}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
            <div style={{width:36,height:36,borderRadius:"50%",border:`2px solid ${fitCol(conf.relevance)}`,background:`${fitCol(conf.relevance)}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:fitCol(conf.relevance),fontFamily:"Roboto Mono,monospace"}}>{conf.relevance}</div>
            <div style={{fontSize:"8px",color:"#334155"}}>relevance</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:"11px",color:"#94a3b8",fontFamily:"Roboto Mono,monospace"}}>{conf.date}</span>
          {days!==null&&days>=0&&<span style={{fontSize:"10px",color:days<=60?"#f97316":"#475569",fontFamily:"Roboto Mono,monospace",fontWeight:days<=60?700:400}}>{days} ימים</span>}
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
          {conf.domains.map(d=><span key={d} style={{fontSize:"9px",background:"#1e293b",color:"#64748b",padding:"2px 6px",borderRadius:3,fontFamily:"Roboto Mono,monospace"}}>{getDomainIcon(d)} {d}</span>)}
        </div>
        <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a25",borderRadius:6,padding:"6px 10px",marginBottom:isXPO?10:0}}>
          <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:2}}>🎯 למה ללכת</div>
          <div style={{fontSize:"10px",color:"#86efac",lineHeight:1.5}}>{conf.why}</div>
        </div>
      </div>
      {isXPO&&(
        <button onClick={e=>{e.stopPropagation();onExpoClick();}}
          style={{width:"100%",background:"linear-gradient(135deg,#431407,#7c2d12)",border:"1px solid #f9731640",borderRadius:8,padding:"10px",color:"#fed7aa",fontSize:"12px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.05em"}}>
          🎯 הכנה לקראת הכנס — 20 מטרות · Outreach Engine
        </button>
      )}
    </div>
  );
}

function ConferencesView(){
  const [catFilter,setCatFilter]=useState("all");
  const [showPast,setShowPast]=useState(false);
  const [domainFilter,setDomainFilter]=useState("all");
  const [showExpo,setShowExpo]=useState(false);
  const allDomains=[...new Set(CONFERENCES.flatMap(c=>c.domains))].sort();
  const filtered=CONFERENCES.filter(c=>{
    if(!showPast&&c.daysAway!==null&&c.daysAway<0)return false;
    if(catFilter!=="all"&&c.category!==catFilter)return false;
    if(domainFilter!=="all"&&!c.domains.includes(domainFilter))return false;
    return true;
  }).sort((a,b)=>(a.daysAway||9999)-(b.daysAway||9999));
  const nextConf=CONFERENCES.filter(c=>c.daysAway>0).sort((a,b)=>a.daysAway-b.daysAway)[0];

  if(showExpo) return <ExpoOutreachEngine onClose={()=>setShowExpo(false)}/>;

  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"24px"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:"20px",fontWeight:800,color:"#f1f5f9",marginBottom:4}}>🎪 כנסים רלוונטיים 2025–2026</div>
        <div style={{fontSize:"12px",color:"#475569"}}>כנסי ביטחון עולמיים — הזדמנויות לפגישות, שותפויות וחשיפה</div>
      </div>
      {nextConf&&(
        <div style={{background:"linear-gradient(135deg,#0a1628,#0c1f35)",border:"1px solid #1e40af25",borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{fontSize:"28px"}}>{nextConf.flag}</div>
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontSize:"10px",color:"#60a5fa",fontWeight:700,marginBottom:2}}>⏭ הכנס הבא</div>
            <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9"}}>{nextConf.name}</div>
            <div style={{fontSize:"11px",color:"#475569"}}>{nextConf.location} · {nextConf.date}</div>
          </div>
          {nextConf.id==="c13"&&(
            <button onClick={()=>setShowExpo(true)} style={{background:"linear-gradient(135deg,#431407,#7c2d12)",border:"1px solid #f9731660",borderRadius:8,padding:"10px 18px",color:"#fed7aa",fontSize:"12px",fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>
              🎯 הכנה לקראת הכנס
            </button>
          )}
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:800,color:"#f97316",fontFamily:"Roboto Mono,monospace",lineHeight:1}}>{nextConf.daysAway}</div>
            <div style={{fontSize:"9px",color:"#475569"}}>ימים</div>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:16}}>
        {[["🏆 Prime",CONFERENCES.filter(c=>c.category==="prime").length,"#3b82f6"],["📅 השנה",CONFERENCES.filter(c=>c.daysAway&&c.daysAway>0&&c.daysAway<365).length,"#22c55e"],["⚡ 60 יום",CONFERENCES.filter(c=>c.daysAway&&c.daysAway>0&&c.daysAway<=60).length,"#f97316"],["🌍 מדינות",[...new Set(CONFERENCES.map(c=>c.flag))].length,"#a855f7"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#0a0f1e",border:`1px solid ${c}20`,borderTop:`2px solid ${c}`,borderRadius:8,padding:"10px",textAlign:"center"}}>
            <div style={{fontSize:"20px",fontWeight:800,color:c,fontFamily:"Roboto Mono,monospace"}}>{v}</div>
            <div style={{fontSize:"9px",color:"#334155",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:"10px",color:"#334155"}}>קטגוריה:</span>
        {[["all","הכל"],["prime","Prime"],["niche","Niche"],["emerging","Emerging"]].map(([v,l])=>(
          <button key={v} onClick={()=>setCatFilter(v)} style={{background:catFilter===v?"#1e3a5f":"transparent",border:`1px solid ${catFilter===v?"#3b82f6":"#1e293b"}`,color:catFilter===v?"#60a5fa":"#475569",padding:"4px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{l}</button>
        ))}
        <div style={{width:1,height:14,background:"#1e293b"}}/>
        <span style={{fontSize:"10px",color:"#334155"}}>Domain:</span>
        {["all",...allDomains.slice(0,6)].map(d=>(
          <button key={d} onClick={()=>setDomainFilter(d)} style={{background:domainFilter===d?"#1e293b":"transparent",border:`1px solid ${domainFilter===d?"#475569":"#1e293b"}`,color:domainFilter===d?"#f1f5f9":"#475569",padding:"4px 8px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{d==="all"?"הכל":`${getDomainIcon(d)} ${d}`}</button>
        ))}
        <div style={{width:1,height:14,background:"#1e293b"}}/>
        <button onClick={()=>setShowPast(!showPast)} style={{background:showPast?"#1e293b":"transparent",border:"1px solid #1e293b",color:showPast?"#f1f5f9":"#475569",padding:"4px 10px",borderRadius:5,fontSize:"10px",cursor:"pointer"}}>{showPast?"הסתר עבר":"הצג עבר"}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}}>
        {filtered.map(c=><ConferenceCard key={c.id} conf={c} onExpoClick={()=>setShowExpo(true)}/>)}
      </div>
    </div>
  );
}

// ── Trends ────────────────────────────────────────────────────────────────────
const TECH_TRENDS = [
  {id:"counter-uas",icon:"🛡️",domain:"Counter-UAS & Anti-Swarm",market:"$6.2B",cagr:"+23%",momentum:"🔥 רותח",givonFit:97,recColor:"#22c55e",rec:"להיכנס",hypeReal:85,whitespace:"Non-kinetic urban C-UAS — אפס פתרונות בסביבה עירונית בלי collateral damage.",reality:"Ukraine שינתה הכל. כל צבא NATO קונה עכשיו. מימון כפול ב-2023-24.",hype:"חברות קטנות יתמזגו. Window להיכנס לפני קונסולידציה.",givonAssets:["Aerosentry TRL 7","Sky Fort TRL 5","GuaRdF RF tracking"],signals:["DIU $400M ב-2024","NATO DIANA — 3 אתגרים פתוחים","UK MOD הכפילה תקציב"]},
  {id:"swarm",icon:"🐝",domain:"נחילים אוטונומיים",market:"$2.8B",cagr:"+41%",momentum:"🔥 רותח",givonFit:90,recColor:"#22c55e",rec:"להיכנס",hypeReal:65,whitespace:"Decentralized swarm intelligence hardware-agnostic — Crebain היחידה בשוק.",reality:"DARPA + DIU ממנות actively. קצב צמיחה הגבוה ביותר בסקטור.",hype:"Fully autonomous lethal swarms רחוק. הכסף: C2, ISR, logistics swarms.",givonAssets:["Crebain TRL 5 — decentralized"],signals:["DIANA swarm challenge €3.5M","Anduril Roadrunner — תחרות ישירה","DARPA OFFSET program"]},
  {id:"isr",icon:"🔍",domain:"ISR טקטי וצירוף חיישנים",market:"$15B",cagr:"+16%",momentum:"📈 גדל",givonFit:88,recColor:"#22c55e",rec:"להיכנס",hypeReal:80,whitespace:"ISR ברמת גדוד — עלות נמוכה ב-80%. כל מדינת NATO שצריכה פתרון זול ומהיר.",reality:"Ukraine: Bayraktar, Mavic שינו את המלחמה. ביקוש עצום לפתרונות זולים.",hype:"Satellite ISR מקבל buzz יתר. הכסף: טקטי, זול, מהיר.",givonAssets:["Daya IRIS-20 TRL 5","iCit Vision Agents","D-Fence sensors"],signals:["EDF €12M ISR call פתוח","פולין + Baltic RFI גדוד","SOCOM ISR BAA"]},
  {id:"energy",icon:"⚡",domain:"אנרגיה טקטית שדה קרב",market:"$3.1B",cagr:"+31%",momentum:"📈 גדל",givonFit:95,recColor:"#22c55e",rec:"להיכנס",hypeReal:88,whitespace:"Power-as-a-Service ל-C-UAS ניידת — אין פתרון משולב DFM+Sky Fort.",reality:"Electrification של הצבא — מגמה בלתי הפיכה. קצב גדילה מהיר ביותר.",hype:"'Green military' — marketing. הכסף: operational energy.",givonAssets:["DFM Power TRL 9","nano-grid 300 ק״ג"],signals:["DIU OTA Tactical Energy","SOCOM BAA Mobile Power","DFM מוכן לשוק"]},
  {id:"simulators",icon:"🎮",domain:"סימולציה והכשרה AI",market:"$8.1B",cagr:"+19%",momentum:"📈 גדל",givonFit:62,recColor:"#f59e0b",rec:"לחקור",hypeReal:70,whitespace:"סימולציה ל-Swarm warfare ו-Counter-UAS — הכשרה לתרחישים שאין להם סימולטור.",reality:"DoD $8B+ בשנה על training. AI מוסיף ערך אמיתי. שוק יציב.",hype:"Metaverse הרג כמה חברות. הכסף: live-virtual-constructive.",givonAssets:["D-COE בפורטפוליו","ניסיון הכשרה דרונים"],signals:["SOCOM RFI drone warfare simulator","Army STE $2B program"]},
  {id:"robotics",icon:"🤖",domain:"רובוטיקה קרקעית",market:"$4.4B",cagr:"+28%",momentum:"📈 גדל",givonFit:78,recColor:"#22c55e",rec:"להיכנס",hypeReal:75,whitespace:"Logistics & Resupply autonomy — Mokoushla + DFM = פתרון שלם.",reality:"Ukraine הוכיחה: ground robots חוסכים חיים. תקציבים קפצו.",hype:"Full autonomy עדיין רחוק. הכסף: supervised autonomy.",givonAssets:["Mokoushla — מוכח בשדה","DFM power integration"],signals:["KNDS RFI autonomous ground","Rheinmetall קנתה 3 חברות robotic"]},
  {id:"cyber-ew",icon:"📡",domain:"לוחמה אלקטרונית וסייבר",market:"$22B",cagr:"+12%",momentum:"🔵 יציב",givonFit:55,recColor:"#3b82f6",rec:"לעקוב",hypeReal:60,whitespace:"RF-Cyber convergence — GuaRdF + Elite Minds יכולים לבנות פתרון משולב.",reality:"שוק ענק אבל מרוכז — L3, Elbit, Rafael שולטות.",hype:"'AI cyber' buzz. הכסף: EW platforms בודדות.",givonAssets:["GuaRdF RF sensing","Elite Minds cyber"],signals:["DARPA EW $300M","NATO Cognitive EW challenge"]},
  {id:"space",icon:"🛸",domain:"ביטחון חלל",market:"$11B",cagr:"+14%",momentum:"🔵 יציב",givonFit:22,recColor:"#ef4444",rec:"לא עכשיו",hypeReal:45,whitespace:"אין white space לגבעון — barriers גבוהים, אין leverage מהפורטפוליו.",reality:"שוק אמיתי — SpaceX, L3Harris שולטות. כניסה יקרה מאוד.",hype:"Starshield buzz. הכסף: SAR, GPS alternatives. לא לגבעון.",givonAssets:[],signals:["Space Force $2B+","אין leverage מפורטפוליו"]},
];

const GEO_TRENDS = [
  {id:"usa",flag:"🇺🇸",country:"ארה״ב",budget:"$886B",defenseShare:"3.5% GDP",momentum:"🔥",givonAccess:"גבוה — DIU, AFWERX, SBIR פתוחות לישראל",accessColor:"#22c55e",hotDomains:["Counter-UAS","Swarm AI","Tactical Energy","Vision AI"],whitespace:"OTA contracts — ללא תהליך רכש ארוך. DIU + AFWERX = כניסה מהירה לDoD.",keyBuyers:["DIU","AFWERX","DARPA","SOCOM","Army Futures"],trend:"הגדלת תקציב C-UAS ו-Autonomous systems ב-40% ב-2024",signals:["DIU OTA open calls — שוטף","SBIR Phase II — funding מוגדל","Ukraine lesson: כל platform צריך counter-UAS"]},
  {id:"nato-eu",flag:"🇪🇺",country:"נאט״ו / אירופה",budget:"€58B EDF 2021-27",defenseShare:"2% GDP ↑",momentum:"🔥",givonAccess:"בינוני-גבוה — ישראל associated country ב-Horizon",accessColor:"#f59e0b",hotDomains:["Counter-UAS","ISR","Robotics","Dual-Use"],whitespace:"EDF + NATO DIANA פתוחים לחברות ישראליות. שוק ענק לא מנוצל.",keyBuyers:["EDF","NATO DIANA","EIC","KNDS","Rheinmetall"],trend:"אירופה מכפילה תקציב ביטחון. פולין, Baltics, גרמניה — קניות ענק.",signals:["EDF calls פתוחים €12M+","NATO DIANA אתגרים פעילים","פולין — $30B defense budget 2024"]},
  {id:"israel",flag:"🇮🇱",country:"ישראל",budget:"₪100B+",defenseShare:"5.3% GDP",momentum:"🔥",givonAccess:"מקסימלי — בית",accessColor:"#22c55e",hotDomains:["Counter-UAS","ISR","C2","Electronic Warfare"],whitespace:"מפא״ת ומלמ״ב — הזדמנויות בית. ניסיון מלחמה = TRL טבעי.",keyBuyers:["מפא״ת","מלמ״ב","צה״ל","מודיעין"],trend:"Post-Oct 7: תקציב ביטחון הוכפל. Counter-UAS ו-ISR בעדיפות עליונה.",signals:["מפא״ת — קולות קוראים שוטפים","מלמ״ב — אנרגיה וC-UAS","IDF — robotic platoon program"]},
  {id:"uk",flag:"🇬🇧",country:"בריטניה",budget:"£54B",defenseShare:"2.3% GDP",momentum:"📈",givonAccess:"גבוה — DASA פתוחה לישראל",accessColor:"#22c55e",hotDomains:["Counter-UAS","AI Defense","Border Security","ISR"],whitespace:"DASA — מנגנון מהיר ופתוח. UK MOD מחפשת פתרונות ISR ו-border security.",keyBuyers:["UK DASA","MOD","Home Office","Border Force"],trend:"UK הגדילה תקציב ביטחון ב-£75B. DASA — הכי open innovation בNATO.",signals:["DASA challenges פתוחים שוטף","MOD border AI RFI","UK — C-UAS national program"]},
  {id:"eastern-europe",flag:"🇵🇱",country:"מזרח אירופה",budget:"$35B+ (פולין בלבד)",defenseShare:"4% GDP ↑",momentum:"🔥",givonAccess:"בינוני — מסלול דרך NATO",accessColor:"#f59e0b",hotDomains:["Counter-UAS","ISR","Ground Robotics","Tactical Energy"],whitespace:"פולין, בלטיים, רומניה — קניות ענק עם כסף אמיתי. ISR זול ו-C-UAS בעדיפות עליונה.",keyBuyers:["Polish Armament Agency","Lithuanian MOD","Estonian MOD"],trend:"פולין — תקציב ביטחון הגבוה ביותר ב-GDP ב-NATO.",signals:["Polish BAA — C-UAS פתוח","Baltic states RFI ISR","Rheinmetall בונה factory בפולין"]},
  {id:"gulf",flag:"🇦🇪",country:"מפרץ פרסי",budget:"$100B+",defenseShare:"5-8% GDP",momentum:"📈",givonAccess:"נמוך-בינוני — תלוי ביחסים דיפלומטיים",accessColor:"#f97316",hotDomains:["Counter-UAS","Border Security","ISR","Force Protection"],whitespace:"אברהם אקורדים = window אסטרטגי. UAE, בחריין, מרוקו. C-UAS + Border Security = fit מושלם.",keyBuyers:["UAE EDGE Group","Saudi GAMI","Bahrain MOD"],trend:"Abraham Accords פתחו שווקים. UAE מגדילה רכישות defense tech ישראלי.",signals:["EDGE Group RFI — C-UAS","UAE-Israel defense MOU","IDEX 2025 — הזדמנות"]},
];

function TrendsView(){
  const [tab,setTab]=useState("tech");
  const [expanded,setExpanded]=useState(null);
  const [recFilter,setRecFilter]=useState("all");
  const toggle=id=>setExpanded(e=>e===id?null:id);
  const filteredTech=recFilter==="all"?TECH_TRENDS:TECH_TRENDS.filter(t=>t.rec===recFilter);
  const topPicks=TECH_TRENDS.filter(t=>t.rec==="להיכנס").sort((a,b)=>b.givonFit-a.givonFit).slice(0,3);
  const hotGeo=GEO_TRENDS.filter(g=>g.momentum==="🔥");

  const TechCard=({t})=>{
    const fc=t.givonFit>=85?"#22c55e":t.givonFit>=65?"#eab308":"#f97316";
    const isExpanded=expanded===t.id;
    return (
      <div onClick={()=>toggle(t.id)} style={{background:"#0f172a",border:`1px solid ${t.recColor}20`,borderTop:`3px solid ${t.recColor}`,borderRadius:"10px",padding:"16px",cursor:"pointer",boxShadow:isExpanded?`0 4px 20px ${t.recColor}18`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <span style={{fontSize:17}}>{t.icon}</span>
              <div style={{fontSize:"13px",fontWeight:800,color:"#f1f5f9"}}>{t.domain}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:"11px",color:"#22c55e",fontFamily:"Roboto Mono,monospace",fontWeight:700}}>{t.market}</span>
              <span style={{fontSize:"11px",color:"#38bdf8",fontFamily:"Roboto Mono,monospace"}}>{t.cagr}</span>
              <span style={{fontSize:"10px",color:"#475569"}}>{t.momentum}</span>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
            <div style={{background:`${t.recColor}18`,border:`1px solid ${t.recColor}50`,borderRadius:"5px",padding:"2px 9px",fontSize:"10px",fontWeight:800,color:t.recColor}}>{t.rec}</div>
            <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${fc}`,background:`${fc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:fc,fontFamily:"Roboto Mono,monospace"}}>{t.givonFit}</div>
          </div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontSize:"9px",color:"#475569"}}>Hype vs Reality</span>
            <span style={{fontSize:"9px",color:t.hypeReal>=75?"#22c55e":t.hypeReal>=55?"#f59e0b":"#ef4444",fontWeight:700}}>{t.hypeReal>=75?"מגובה":t.hypeReal>=55?"בינוני":"Hype יתר"}</span>
          </div>
          <div style={{background:"#1e293b",borderRadius:3,height:4}}>
            <div style={{width:`${t.hypeReal}%`,height:"100%",background:`linear-gradient(90deg,#ef4444,${t.hypeReal>=75?"#22c55e":t.hypeReal>=55?"#f59e0b":"#ef4444"})`,borderRadius:3}}/>
          </div>
        </div>
        <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a25",borderRadius:"6px",padding:"7px 10px",marginBottom:8}}>
          <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:2}}>🎯 White Space לגבעון</div>
          <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.55}}>{t.whitespace}</div>
        </div>
        {t.givonAssets.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>{t.givonAssets.map(a=><span key={a} style={{fontSize:"9px",background:"#1e3a5f",border:"1px solid #3b82f625",color:"#60a5fa",padding:"2px 7px",borderRadius:"4px",fontFamily:"Roboto Mono,monospace"}}>{a}</span>)}</div>}
        {isExpanded&&(
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              <div style={{background:"#0a0f1e",borderRadius:"6px",padding:"9px"}}>
                <div style={{fontSize:"9px",color:"#22c55e",fontWeight:700,marginBottom:4}}>✅ מה קורה בפועל</div>
                <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.55}}>{t.reality}</div>
              </div>
              <div style={{background:"#0a0f1e",borderRadius:"6px",padding:"9px"}}>
                <div style={{fontSize:"9px",color:"#f87171",fontWeight:700,marginBottom:4}}>⚠️ מה מוגזם</div>
                <div style={{fontSize:"11px",color:"#fca5a5",lineHeight:1.55}}>{t.hype}</div>
              </div>
            </div>
            <div style={{background:"#0c1a2e",border:"1px solid #1e40af20",borderRadius:"6px",padding:"9px"}}>
              <div style={{fontSize:"9px",color:"#60a5fa",fontWeight:700,marginBottom:5}}>📡 סיגנלים</div>
              {t.signals.map((s,i)=><div key={i} style={{fontSize:"10px",color:"#93c5fd",padding:"2px 0",borderBottom:i<t.signals.length-1?"1px solid #1e293b":"none"}}>· {s}</div>)}
            </div>
            <div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center"}}>▲ סגור</div>
          </div>
        )}
        {!isExpanded&&<div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center",marginTop:4}}>▼ פרטים</div>}
      </div>
    );
  };

  const GeoCard=({g})=>{
    const isExpanded=expanded===g.id;
    return (
      <div onClick={()=>toggle(g.id)} style={{background:"#0f172a",border:"1px solid #1e293b",borderTop:`3px solid ${g.accessColor}`,borderRadius:"10px",padding:"16px",cursor:"pointer",boxShadow:isExpanded?`0 4px 20px ${g.accessColor}18`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <span style={{fontSize:20}}>{g.flag}</span>
              <div>
                <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9"}}>{g.country}</div>
                <div style={{fontSize:"10px",color:"#475569"}}>{g.defenseShare} תקציב ביטחון</div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:"12px",color:"#22c55e",fontFamily:"Roboto Mono,monospace",fontWeight:700}}>{g.budget}</span>
              <span style={{fontSize:"13px"}}>{g.momentum}</span>
            </div>
          </div>
          <div style={{background:`${g.accessColor}15`,border:`1px solid ${g.accessColor}40`,borderRadius:"6px",padding:"4px 10px",fontSize:"10px",fontWeight:700,color:g.accessColor,textAlign:"center",maxWidth:100}}>{g.givonAccess}</div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{g.hotDomains.map(d=><span key={d} style={{fontSize:"9px",background:"#1e293b",color:"#94a3b8",padding:"2px 7px",borderRadius:"4px",fontFamily:"Roboto Mono,monospace"}}>{d}</span>)}</div>
        <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a25",borderRadius:"6px",padding:"7px 10px"}}>
          <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:2}}>🎯 White Space</div>
          <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.55}}>{g.whitespace}</div>
        </div>
        {isExpanded&&(
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{background:"#0a0f1e",borderRadius:"6px",padding:"10px"}}>
              <div style={{fontSize:"9px",color:"#94a3b8",fontWeight:700,marginBottom:6}}>📈 טרנד</div>
              <div style={{fontSize:"11px",color:"#cbd5e1",lineHeight:1.55,marginBottom:8}}>{g.trend}</div>
              <div style={{fontSize:"9px",color:"#475569",fontWeight:700,marginBottom:4}}>קונים מרכזיים</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{g.keyBuyers.map(b=><span key={b} style={{fontSize:"9px",background:"#1e3a5f",border:"1px solid #3b82f620",color:"#93c5fd",padding:"2px 8px",borderRadius:"4px"}}>{b}</span>)}</div>
            </div>
            <div style={{background:"#0c1a2e",border:"1px solid #1e40af20",borderRadius:"6px",padding:"9px"}}>
              <div style={{fontSize:"9px",color:"#60a5fa",fontWeight:700,marginBottom:5}}>📡 סיגנלים</div>
              {g.signals.map((s,i)=><div key={i} style={{fontSize:"10px",color:"#93c5fd",padding:"2px 0",borderBottom:i<g.signals.length-1?"1px solid #1e293b":"none"}}>· {s}</div>)}
            </div>
            <div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center"}}>▲ סגור</div>
          </div>
        )}
        {!isExpanded&&<div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center",marginTop:6}}>▼ פרטים</div>}
      </div>
    );
  };

  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"24px"}}>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:"20px",fontWeight:800,color:"#f1f5f9",marginBottom:3}}>📈 מגמות אסטרטגיות</div>
        <div style={{fontSize:"12px",color:"#475569"}}>לאן זורם כסף הביטחון הגלובלי — לפי טכנולוגיה ולפי אזור גיאוגרפי</div>
      </div>
      <div style={{background:"linear-gradient(135deg,#0a1628,#0c1f35)",border:"1px solid #1e40af25",borderRadius:"10px",padding:"14px 16px",marginBottom:18}}>
        <div style={{fontSize:"10px",color:"#60a5fa",fontWeight:700,marginBottom:8}}>⚡ להיכנס עכשיו — Fit גבוה + שוק פתוח</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {topPicks.map(t=>(
            <div key={t.id} onClick={()=>{setTab("tech");toggle(t.id);}} style={{background:"#0f172a",border:`1px solid ${t.recColor}35`,borderRadius:"7px",padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1,minWidth:180}}>
              <span style={{fontSize:15}}>{t.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"11px",fontWeight:700,color:"#f1f5f9"}}>{t.domain}</div>
                <div style={{fontSize:"10px",color:"#22c55e",fontFamily:"Roboto Mono,monospace"}}>{t.market} · {t.cagr}</div>
              </div>
              <div style={{width:28,height:28,borderRadius:"50%",border:"2px solid #22c55e",background:"#22c55e15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:800,color:"#22c55e",fontFamily:"Roboto Mono,monospace"}}>{t.givonFit}</div>
            </div>
          ))}
          {hotGeo.slice(0,2).map(g=>(
            <div key={g.id} onClick={()=>{setTab("geo");toggle(g.id);}} style={{background:"#0f172a",border:"1px solid #f9731625",borderRadius:"7px",padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1,minWidth:160}}>
              <span style={{fontSize:18}}>{g.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"11px",fontWeight:700,color:"#f1f5f9"}}>{g.country}</div>
                <div style={{fontSize:"10px",color:"#fb923c",fontFamily:"Roboto Mono,monospace"}}>{g.budget} · {g.momentum}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,alignItems:"center"}}>
        {[["tech","🔬 טכנולוגיות ומוצרים"],["geo","🌍 אזורים גיאוגרפיים"]].map(([v,l])=>(
          <button key={v} onClick={()=>{setTab(v);setExpanded(null);}} style={{background:tab===v?"#1e3a5f":"transparent",border:`1px solid ${tab===v?"#3b82f6":"#1e293b"}`,color:tab===v?"#60a5fa":"#475569",padding:"7px 16px",borderRadius:"7px",fontSize:"12px",fontWeight:tab===v?700:400,cursor:"pointer"}}>{l}</button>
        ))}
        {tab==="tech"&&(
          <div style={{display:"flex",gap:4,marginRight:8}}>
            {[["all","הכל"],["להיכנס","להיכנס"],["לחקור","לחקור"],["לעקוב","לעקוב"],["לא עכשיו","לא עכשיו"]].map(([v,l])=>(
              <button key={v} onClick={()=>setRecFilter(v)} style={{background:recFilter===v?"#1e293b":"transparent",border:`1px solid ${recFilter===v?"#475569":"#1e293b"}`,color:recFilter===v?"#f1f5f9":"#475569",padding:"4px 10px",borderRadius:"5px",fontSize:"10px",cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:13}}>
        {tab==="tech"&&filteredTech.map(t=><TechCard key={t.id} t={t}/>)}
        {tab==="geo"&&GEO_TRENDS.map(g=><GeoCard key={g.id} g={g}/>)}
      </div>
    </div>
  );
}

// ── Partnerships (Fixed — statusColor defined BEFORE use) ─────────────────────
const statusColor={"לפנות":"#22c55e","בתהליך":"#3b82f6","לחקור":"#f59e0b","פעיל":"#a855f7"};

const PARTNERSHIP_TYPES={
  idiq:{label:"IDIQ & Primes",color:"#3b82f6",icon:"📋",desc:"חוזי IDIQ פעילים מול DoD — כניסה מהירה ללא תהליך רכש"},
  integrator:{label:"Mission Integrators",color:"#a855f7",icon:"⚙️",desc:"משלבי מערכות מול DoD — מחפשים טכנולוגיה ישראלית לשלב"},
  ma:{label:"M&A / Strategic",color:"#f97316",icon:"🤝",desc:"מיזוגים ורכישות Defense Tech — רלוונטיים לפורטפוליו גבעון"},
};

const PARTNERSHIPS=[
  {id:"p1",type:"idiq",flag:"🇺🇸",country:"ארה״ב",title:"Booz Allen Hamilton",url:"https://www.boozallen.com",oneLiner:"הדרך המהירה ביותר לתוך תקציבי DoD ומודיעין.",why:"מחזיקת IDIQ ענקית מול DoD ו-IC — שיתוף פעולה פותח גישה ישירה לתוכניות מודיעין ו-C-UAS.",signal:"זכתה ב-IDIQ $1.7B Army AI/ML — ינואר 2025",status:"לפנות",priority:"high",fit:92},
  {id:"p2",type:"idiq",flag:"🇺🇸",country:"ארה״ב",title:"SAIC",url:"https://www.saic.com",oneLiner:"IDIQ ב-ISR ו-C2 — כיסוי מדויק לפורטפוליו.",why:"SAIC מחזיקת IDIQ רחבה מול DoD עם מיקוד ב-ISR ו-C2 — תחומי הליבה של גבעון.",signal:"חתמה IDIQ $700M NRO ISR — פברואר 2025",status:"לפנות",priority:"high",fit:89},
  {id:"p6",type:"integrator",flag:"🇺🇸",country:"ארה״ב",title:"L3Harris Technologies",url:"https://www.l3harris.com",oneLiner:"אינטגרטור ISR+EW הגדול בעולם — Daya ו-GuaRdF נכנסים ישר.",why:"L3Harris מובילה שילוב מערכות ISR ו-EW ב-DoD — Daya IRIS-20 ו-GuaRdF מושלמים לפלטפורמות שלהם.",signal:"הכריזה על תוכנית שילוב ISR חדשה $2.3B — פברואר 2025",status:"לפנות",priority:"high",fit:94},
  {id:"p9",type:"integrator",flag:"🇩🇪",country:"גרמניה",title:"Rheinmetall AG",url:"https://www.rheinmetall.com",oneLiner:"שער לשוק הגנה האירופי עם תיאבון רכישה פעיל.",why:"Rheinmetall אינטגרטור הגנה מוביל באירופה עם תיאבון M&A — Aerosentry ו-Sky Fort לאירופה כולה.",signal:"הכריזה על תוכנית שיתופי פעולה ישראלים — פברואר 2025",status:"בתהליך",priority:"high",fit:93},
  {id:"p11",type:"ma",flag:"🇺🇸",country:"ארה״ב",title:"Axon Enterprise (Dedrone)",url:"https://www.axon.com",oneLiner:"רכשה Dedrone ומחפשת עוד — Aerosentry הוא המועמד הבא.",why:"Axon רכשה Dedrone ב-2024 — מחפשת טכנולוגיה ישראלית נוספת ב-C-UAS. Aerosentry = target מושלם.",signal:"רכשה Dedrone ב-$250M — הכריזה על הרחבה ישראלית",status:"לפנות",priority:"high",fit:95},
  {id:"p12",type:"ma",flag:"🇺🇸",country:"ארה״ב",title:"Ondas Holdings",url:"https://www.ondasholdings.com",oneLiner:"כבר קנתה חברה ישראלית — מודל רכישה מוכח ורלוונטי.",why:"Ondas רכשה Sentrycs הישראלית ב-$200M — פעילה ברכישות defense tech ישראלי. מודל מוכח.",signal:"רכשה Sentrycs הישראלית ב-$200M — ספטמבר 2024",status:"לחקור",priority:"high",fit:91},
  {id:"p16",type:"integrator",flag:"🇩🇪",country:"גרמניה",title:"Helsing AI",url:"https://helsing.ai",oneLiner:"AI לביטחון — הסטארטאפ הכי חם באירופה, מחפש שותפי sensors.",why:"Helsing גייסה €600M ועובדת עם Saab ו-Eurofighter — מחפשת שותפי sensors ו-ISR. Daya ו-iCit = fit מושלם.",signal:"גייסה €600M — הכריזה על בניית hardware layer חדש",status:"לפנות",priority:"high",fit:91},
  {id:"p24",type:"ma",flag:"🇺🇸",country:"ארה״ב",title:"Mistral Inc.",url:"https://www.mistralsolutions.com",oneLiner:"הוציאה לפועל $982M deal ל-DoD עם UVision — מסלול מוכח.",why:"Mistral סיפקה suicide drones ישראלים של UVision לצבא האמריקאי ב-$982M — מודל מוכח.",signal:"סגרה $982M deal UVision לArmy — ממשיכה לחפש מוצרים ישראלים",status:"לפנות",priority:"high",fit:94},
];

function PartnershipCard({p}){
  const [expanded,setExpanded]=useState(false);
  const t=PARTNERSHIP_TYPES[p.type];
  const sc=statusColor[p.status]||"#475569";
  return (
    <div style={{background:"#0f172a",borderRadius:"10px",padding:"18px",border:`1px solid ${t.color}20`,borderRight:`3px solid ${t.color}`,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:13}}>{p.flag}</span>
            <span style={{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${t.color}50`,background:`${t.color}15`,color:t.color,fontFamily:"Roboto Mono,monospace"}}>{t.icon} {t.label}</span>
            <span style={{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${sc}50`,background:`${sc}15`,color:sc,fontFamily:"Roboto Mono,monospace"}}>{p.status}</span>
          </div>
          <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9",marginBottom:5}}>{p.title}</div>
          <div style={{fontSize:"12px",color:"#94a3b8",fontStyle:"italic",lineHeight:1.5,borderRight:`2px solid ${t.color}`,paddingRight:8}}>{p.oneLiner}</div>
        </div>
        <FitScoreCircle score={p.fit}/>
      </div>
      <WhyBox text={p.why}/>
      <div style={{background:"#0c1a2e",border:"1px solid #1e40af25",borderRadius:"6px",padding:"7px 11px",display:"flex",gap:6}}>
        <div style={{fontSize:"9px",color:"#60a5fa",fontWeight:700,flexShrink:0,marginTop:1}}>📡</div>
        <div style={{fontSize:"11px",color:"#93c5fd"}}>{p.signal}</div>
      </div>
      <div style={{display:"flex",gap:6,borderTop:"1px solid #1e293b",paddingTop:8}}>
        <button onClick={()=>window.open(p.url,"_blank")} style={{flex:1,background:`${t.color}18`,border:`1px solid ${t.color}40`,color:t.color,padding:"5px 10px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer"}}>↗ פתח אתר</button>
        <button onClick={()=>setExpanded(!expanded)} style={{background:"transparent",border:"1px solid #1e293b",color:"#475569",padding:"5px 12px",borderRadius:"6px",fontSize:"10px",cursor:"pointer"}}>{expanded?"▲":"▼ אסטרטגיה"}</button>
      </div>
      {expanded&&(
        <div style={{background:"#0a0f1e",borderRadius:"7px",padding:"12px"}}>
          <div style={{fontSize:"10px",color:"#475569",fontWeight:700,marginBottom:6}}>💡 מהלך מומלץ</div>
          <div style={{fontSize:"11px",color:"#cbd5e1",lineHeight:1.6}}>
            {p.type==="idiq"?"לפנות לתוכנית השותפות שלהם ולבקש להיכנס כ-subcontractor ב-IDIQ הבא. להכין תיק טכני ממוקד עם TRL ו-fit לתוכנית הספציפית.":
             p.type==="integrator"?"לזהות את ה-BD contact הרלוונטי ולשלוח one-pager טכני. להציע POC משותף — פרויקט קטן שמוכיח את הסינרגיה.":
             "לחקור CVC arm שלהם ולשלוח executive summary. להבין timeline ו-criteria לרכישה."}
          </div>
        </div>
      )}
    </div>
  );
}

function PartnershipOpportunities(){
  const [typeFilter,setTypeFilter]=useState("all");
  const [statusFilter,setStatusFilter]=useState("all");
  const filtered=PARTNERSHIPS.filter(p=>{
    if(typeFilter!=="all"&&p.type!==typeFilter)return false;
    if(statusFilter!=="all"&&p.status!==statusFilter)return false;
    return true;
  });
  const counts={idiq:PARTNERSHIPS.filter(p=>p.type==="idiq").length,integrator:PARTNERSHIPS.filter(p=>p.type==="integrator").length,ma:PARTNERSHIPS.filter(p=>p.type==="ma").length};
  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"24px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:"22px",fontWeight:800,color:"#f1f5f9",marginBottom:4}}>🎯 הזדמנויות לשותפות</div>
        <div style={{fontSize:"12px",color:"#475569"}}>IDIQ holders, Mission Integrators ו-M&A Defense Tech — ארה״ב וגרמניה</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
        {[["🎯 עדיפות גבוהה",PARTNERSHIPS.filter(p=>p.priority==="high").length,"#ef4444"],["📋 IDIQ & Primes",counts.idiq,"#3b82f6"],["⚙️ Integrators",counts.integrator,"#a855f7"],["🤝 M&A",counts.ma,"#f97316"],["📬 לפנות",PARTNERSHIPS.filter(p=>p.status==="לפנות").length,"#22c55e"],["⚡ בתהליך",PARTNERSHIPS.filter(p=>p.status==="בתהליך").length,"#fbbf24"]].map(([label,val,color])=>(
          <div key={label} style={{background:"#0a0f1e",border:`1px solid ${color}20`,borderTop:`2px solid ${color}`,borderRadius:"8px",padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:"22px",fontWeight:800,color,fontFamily:"Roboto Mono,monospace",lineHeight:1}}>{val}</div>
            <div style={{fontSize:"9px",color:"#334155",marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10,marginBottom:20}}>
        {Object.entries(PARTNERSHIP_TYPES).map(([key,t])=>(
          <div key={key} style={{background:"#0a0f1e",border:`1px solid ${t.color}20`,borderRight:`3px solid ${t.color}`,borderRadius:"8px",padding:"12px 14px"}}>
            <div style={{fontSize:"12px",fontWeight:700,color:t.color,marginBottom:3}}>{t.icon} {t.label}</div>
            <div style={{fontSize:"11px",color:"#64748b"}}>{t.desc}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{fontSize:"10px",color:"#334155",marginLeft:4}}>סוג:</div>
        {[["all","הכל"],["idiq","IDIQ & Primes"],["integrator","Integrators"],["ma","M&A"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTypeFilter(v)} style={{background:typeFilter===v?"#1e3a5f":"transparent",border:`1px solid ${typeFilter===v?"#3b82f6":"#1e293b"}`,color:typeFilter===v?"#60a5fa":"#475569",padding:"5px 12px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"}}>{l}</button>
        ))}
        <div style={{width:1,height:16,background:"#1e293b",margin:"0 4px"}}/>
        <div style={{fontSize:"10px",color:"#334155"}}>סטטוס:</div>
        {[["all","הכל"],["לפנות","לפנות"],["בתהליך","בתהליך"],["לחקור","לחקור"]].map(([v,l])=>(
          <button key={v} onClick={()=>setStatusFilter(v)} style={{background:statusFilter===v?"#1e293b":"transparent",border:`1px solid ${statusFilter===v?"#475569":"#1e293b"}`,color:statusFilter===v?"#f1f5f9":"#475569",padding:"5px 10px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(390px,1fr))",gap:14}}>
        {filtered.map(p=><PartnershipCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
const CATEGORIES=[
  {id:"contracts",icon:"📋",label:"הזדמנויות"},
  {id:"partners",icon:"🤝",label:"שותפים"},
  {id:"investors",icon:"💰",label:"משקיעים"},
  {id:"grants",icon:"🏆",label:"מענקים"},
  {id:"ventures",icon:"🚀",label:"ונצ׳רים"},
  {id:"competitors",icon:"🔭",label:"מתחרים"},
];

export default function App(){
  const [view,setView]=useState("briefing");
  const [activeCat,setActiveCat]=useState("contracts");
  const [data,setData]=useState(ITEMS);
  const [countryFilter,setCountryFilter]=useState(null);
  const [focusItem,setFocusItem]=useState(null);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=GLOBAL_STYLES;
    document.head.appendChild(style);
    return ()=>document.head.removeChild(style);
  },[]);

  const update=(cat,id,ch)=>setData(p=>({...p,[cat]:p[cat].map(o=>o.id===id?{...o,...ch}:o)}));
  const filterByCountry=(items)=>{
    if(!countryFilter)return items;
    return items.filter(i=>i.country===countryFilter||i.flag===countryFilter);
  };
  const critical=data.contracts.filter(i=>i.urgency==="critical").length+data.grants.filter(i=>i.urgency==="critical").length;

  const NAV_ITEMS=[
    ["briefing","📊 בריפינג"],["catalog","📋 קטלוג"],["trends","📈 מגמות"],
    ["map","🗺️ מפה"],["partnerships","🎯 שותפויות"],["conferences","🎪 כנסים"],
  ];

  return (
    <div style={{minHeight:"100vh",background:"#020617",color:"#e2e8f0",fontFamily:"'Inter','Segoe UI',Tahoma,sans-serif",direction:"rtl"}}>
      {focusItem&&<FocusModal item={focusItem} onClose={()=>setFocusItem(null)}/>}

      <div style={{background:"rgba(10,15,30,0.85)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 24px",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo/>
            <div style={{width:1,height:24,background:"#1e293b"}}/>
            {NAV_ITEMS.map(([v,label])=>(
              <button key={v} onClick={()=>setView(v)} style={{background:view===v?"rgba(0,242,254,0.08)":"transparent",border:"none",borderBottom:view===v?"2px solid #00f2fe":"2px solid transparent",color:view===v?"#e2e8f0":"#475569",padding:"0 12px",height:60,fontSize:"12px",fontWeight:view===v?700:400,cursor:"pointer",transition:"all .2s",textShadow:view===v?"0 0 12px rgba(0,242,254,0.9)":"none",borderRadius:"4px 4px 0 0",whiteSpace:"nowrap"}}>{label}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {[
              ["🔴 קריטי",critical,"#f87171"],
              ["🎯 Fit 85+",Object.values(data).flat().filter(i=>(i.fitScore||i.fit||0)>=85).length,"#22c55e"],
              ["⭐ אסטרטגי",Object.values(data).flat().filter(i=>i.bookmarked).length,"#fbbf24"],
              ["🎪 כנסים",CONFERENCES.filter(c=>c.daysAway&&c.daysAway>0&&c.daysAway<=90).length,"#a855f7"],
            ].map(([label,val,color])=>(
              <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                <div style={{fontSize:"16px",fontWeight:800,color,fontFamily:"Roboto Mono,monospace",lineHeight:1}}>{val}</div>
                <div style={{fontSize:"8px",color:"#334155"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(view==="briefing"||view==="catalog")&&<><HeroStrip data={data}/><DeadlineTimeline data={data}/></>}

      {view==="briefing"&&<DailyBriefing data={data}/>}
      {view==="trends"&&<TrendsView/>}
      {view==="partnerships"&&<PartnershipOpportunities/>}
      {view==="map"&&<MapView data={data}/>}
      {view==="conferences"&&<ConferencesView/>}

      {view==="catalog"&&(
        <div style={{maxWidth:1300,margin:"0 auto",padding:"20px 24px"}}>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            {CATEGORIES.map(cat=>{
              const count=filterByCountry(data[cat.id]).length;
              const on=activeCat===cat.id;
              return (
                <button key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{background:on?"#1e3a5f":"#0a0f1e",border:`1px solid ${on?"#3b82f6":"#1e293b"}`,color:on?"#60a5fa":"#475569",padding:"7px 14px",borderRadius:"8px",fontSize:"12px",fontWeight:on?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all .15s"}}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                  <span style={{background:on?"#1d3a60":"#1e293b",color:on?"#60a5fa":"#475569",fontSize:"10px",padding:"1px 5px",borderRadius:"8px",fontFamily:"Roboto Mono,monospace"}}>{count}</span>
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:5,marginBottom:20,alignItems:"center"}}>
            <div style={{fontSize:"10px",color:"#334155",marginLeft:4}}>סנן לפי מדינה:</div>
            {ALL_COUNTRIES.map(({flag,label})=>(
              <button key={flag} onClick={()=>setCountryFilter(countryFilter===label?null:label)} title={label} style={{background:countryFilter===label?"#1e3a5f":"transparent",border:`1px solid ${countryFilter===label?"#3b82f6":"#1e293b"}`,borderRadius:"6px",padding:"4px 8px",fontSize:"16px",cursor:"pointer",transition:"all .15s",lineHeight:1,display:"flex",alignItems:"center",gap:4}}>
                {flag}
                {countryFilter===label&&<span style={{fontSize:"9px",color:"#60a5fa",fontFamily:"Roboto Mono,monospace"}}>{label}</span>}
              </button>
            ))}
            {countryFilter&&<button onClick={()=>setCountryFilter(null)} style={{background:"transparent",border:"1px solid #334155",borderRadius:"6px",padding:"3px 9px",fontSize:"10px",color:"#475569",cursor:"pointer"}}>✕ נקה</button>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(390px,1fr))",gap:14}}>
            {activeCat==="contracts"&&filterByCountry(data.contracts).map(i=><ContractCard key={i.id} item={i} onUpdate={(id,ch)=>update("contracts",id,ch)} onFocus={setFocusItem}/>)}
            {activeCat==="partners"&&filterByCountry(data.partners).map(i=><PartnerCard key={i.id} item={i} onFocus={setFocusItem}/>)}
            {activeCat==="investors"&&filterByCountry(data.investors).map(i=><InvestorCard key={i.id} item={i} onFocus={setFocusItem}/>)}
            {activeCat==="grants"&&filterByCountry(data.grants).map(i=><GrantCard key={i.id} item={i}/>)}
            {activeCat==="ventures"&&data.ventures.map(i=><VentureCard key={i.id} item={i}/>)}
            {activeCat==="competitors"&&filterByCountry(data.competitors).map(i=><CompetitorCard key={i.id} item={i}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
