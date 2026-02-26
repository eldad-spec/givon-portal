import { useState } from "react";

// ── נתונים ───────────────────────────────────────────────────────────────────

const ITEMS = {
  contracts: [
    { id:1, title:"DIU Counter-UAS Open Call 2025", source:"Defense Innovation Unit", url:"https://www.diu.mil/work-with-us/solicitations", country:"ארה״ב", flag:"🇺🇸", budget:"$8M", deadline:"15.04.2025", urgency:"critical", fitScore:96, tag:"OTA", why:"Aerosentry (TRL 7) ו-Sky Fort (TRL 5) עונות ישירות. גבעון היחידה עם שתי מערכות C-UAS מקבילות.", status:"פתוח", bookmarked:false },
    { id:2, title:"מפא״ת — הגנת נקודה נגד נחילים", source:"מלמ״ב / מפא״ת", url:"https://www.mod.gov.il", country:"ישראל", flag:"🇮🇱", budget:"₪12M", deadline:"20.04.2025", urgency:"critical", fitScore:98, tag:"מלמ״ב", why:"Sky Fort + Aerosentry — stack מלא DTID. אין מתחרה ישראלי.", status:"בבדיקה", bookmarked:true },
    { id:3, title:"EDF — ISR רב-תחומי", source:"European Defence Fund", url:"https://defence-industry-space.ec.europa.eu", country:"אירופה", flag:"🇪🇺", budget:"€12M", deadline:"20.05.2025", urgency:"medium", fitScore:82, tag:"EDF", why:"Daya IRIS-20 — כיסוי 100 ק״מ, עלות נמוכה ב-80%. ישראל זכאית.", status:"פתוח", bookmarked:false },
    { id:4, title:"מלמ״ב — אנרגיה שדה הקרב", source:"מלמ״ב", url:"https://www.mod.gov.il", country:"ישראל", flag:"🇮🇱", budget:"₪8M", deadline:"28.03.2025", urgency:"critical", fitScore:97, tag:"מלמ״ב", why:"DFM Power TRL 9 — הפתרון הבשל ביותר. אין מתחרה.", status:"בבדיקה", bookmarked:true },
    { id:5, title:"UK MOD — ניטור גבולות AI", source:"UK Ministry of Defence", url:"https://www.find-tender.service.gov.uk", country:"בריטניה", flag:"🇬🇧", budget:"£5.5M", deadline:"10.06.2025", urgency:"high", fitScore:88, tag:"MOD", why:"Guardian Angel TRL 7 + guaRdF — bundle שלם עם NATO compliance.", status:"פתוח", bookmarked:false },
    { id:6, title:"AFWERX SBIR — Vision ללא GPS", source:"AFWERX / USAF", url:"https://afwerx.com/sbir/", country:"ארה״ב", flag:"🇺🇸", budget:"$1.5M", deadline:"30.04.2025", urgency:"high", fitScore:89, tag:"SBIR", why:"iCit + Cyberbee — שניהם ב-Solutions. AFWERX = transition מהיר.", status:"פתוח", bookmarked:false },
    { id:9, title:"DIU — Tactical Energy OTA", source:"Defense Innovation Unit", url:"https://www.diu.mil", country:"ארה״ב", flag:"🇺🇸", budget:"$3.5M", deadline:"10.05.2025", urgency:"high", fitScore:93, tag:"OTA", why:"DFM Power TRL 9 — field-ready. OTA = ללא תהליך רכש ארוך.", status:"פתוח", bookmarked:true },
  ],
  partners: [
    { id:10, title:"Rheinmetall — C-UAS לאירופה", source:"Rheinmetall AG", url:"https://www.rheinmetall.com/en", country:"גרמניה", flag:"🇩🇪", type:"שותפות טכנולוגית", status:"לבדיקה", bookmarked:false, why:"Aerosentry + Sky Fort מדברות לצרכים שלהם. שיתוף = אירופה כולה.", signal:"פרסמה דרושים C-UAS System Integration — 3 שבועות" },
    { id:11, title:"Anduril — נחיל אוטונומי", source:"Anduril Industries", url:"https://www.anduril.com", country:"ארה״ב", flag:"🇺🇸", type:"שותפות מוצר", status:"לבדיקה", bookmarked:false, why:"Lattice OS + Crebain = שילוב טבעי. פותח DoD ישירות.", signal:"השיקה Roadrunner — מחפשת swarm AI partners — 2 שבועות" },
    { id:12, title:"KNDS — פלטפורמות קרקע", source:"KNDS Group", url:"https://www.knds.com", country:"אירופה", flag:"🇪🇺", type:"שילוב מערכות", status:"חדש", bookmarked:true, why:"Mokoushla + Daya = שילוב מדויק לפלטפורמות החדשות.", signal:"פרסמה RFI autonomous ground systems — שבוע" },
  ],
  investors: [
    { id:20, title:"Shield Capital — Fund III $250M", source:"Shield Capital", url:"https://www.shieldcap.com", country:"ארה״ב", flag:"🇺🇸", focus:"Defense Deep-Tech", stage:"Series A–C", bookmarked:false, why:"Counter-UAS + Autonomy = התאמה מדויקת. סגרו fund חדש — מחפשים actively.", signal:"סגרו $250M Fund III — חודש" },
    { id:21, title:"NATO Innovation Fund", source:"NATO Innovation Fund", url:"https://www.natoinnovationfund.nato.int", country:"נאט״ו", flag:"🏛️", focus:"Dual-Use Deep-Tech", stage:"Seed–Series B", bookmarked:true, why:"NIF משקיע ב-Israeli associated companies. Crebain + Daya = fit.", signal:"פתחו קול קורא לחברות ישראליות — 2 שבועות" },
    { id:22, title:"In-Q-Tel — Emerging Tech", source:"In-Q-Tel", url:"https://www.iqt.org", country:"ארה״ב", flag:"🇺🇸", focus:"Intelligence AI", stage:"Early Stage", bookmarked:false, why:"iCit + Visual Layer מועמדות חזקות. IQT = פתח לקהילת המודיעין.", signal:"פרסמו RFI Computer Vision for ISR — חודשיים" },
  ],
  grants: [
    { id:30, title:"NATO DIANA — אתגר נגד-נחיל", source:"NATO DIANA", url:"https://www.diana.nato.int/challenges", country:"נאט״ו", flag:"🏛️", prize:"€3.5M", deadline:"01.04.2025", urgency:"high", bookmarked:true, why:"Crebain (TRL 5) decentralized swarm — מועמדת מושלמת. ישראל זכאית.", status:"בבדיקה" },
    { id:31, title:"EIC Accelerator — Dual-Use Defense", source:"European Innovation Council", url:"https://eic.ec.europa.eu", country:"אירופה", flag:"🇪🇺", prize:"€2.5M + equity", deadline:"15.05.2025", urgency:"medium", bookmarked:false, why:"Guardian Angel + DFM dual-use. EIC מממנת TRL 5→9. ישראל זכאית.", status:"פתוח" },
    { id:32, title:"AFWERX — אנרגיה טקטית", source:"AFWERX / USAF", url:"https://afwerx.com/challenges/", country:"ארה״ב", flag:"🇺🇸", prize:"$1.2M", deadline:"30.04.2025", urgency:"high", bookmarked:false, why:"DFM TRL 9 — הפתרון הבשל ביותר. ניצחון = חוזה DoD ישיר.", status:"פתוח" },
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

// ── עיצוב ───────────────────────────────────────────────────────────────────

const U = {
  critical:{ border:"#ef4444", text:"#f87171", bg:"#ef444412", label:"קריטי" },
  high:    { border:"#f97316", text:"#fb923c", bg:"#f9731612", label:"גבוה" },
  medium:  { border:"#eab308", text:"#facc15", bg:"#eab30812", label:"בינוני" },
  low:     { border:"#22c55e", text:"#4ade80", bg:"#22c55e12", label:"נמוך" },
};
const fitCol = s => s>=90?"#22c55e":s>=75?"#eab308":s>=60?"#f97316":"#ef4444";

const ALL_COUNTRIES = [
  { flag:"🇮🇱", label:"ישראל" },
  { flag:"🇺🇸", label:"ארה״ב" },
  { flag:"🇪🇺", label:"אירופה" },
  { flag:"🇬🇧", label:"בריטניה" },
  { flag:"🏛️", label:"נאט״ו" },
  { flag:"🇩🇪", label:"גרמניה" },
];

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
  return <span style={{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${color}50`,background:`${color}15`,color,fontFamily:""Roboto Mono",monospace"}}>{label}</span>;
}

function WhyBox({text}){
  return (
    <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a35",borderRadius:"7px",padding:"9px 12px"}}>
      <div style={{fontSize:"10px",color:"#4ade80",fontWeight:700,marginBottom:4,letterSpacing:"0.08em"}}>🎯 מדוע רלוונטי לגבעון</div>
      <div style={{fontSize:"12px",color:"#86efac",lineHeight:1.65}}>{text}</div>
    </div>
  );
}

function Card({item,borderColor,children}){
  const [h,setH]=useState(false);
  return (
    <div onClick={()=>item.url&&window.open(item.url,"_blank")}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#0f172a",borderRadius:"10px",padding:"18px",border:`1px solid ${borderColor}20`,borderRight:`3px solid ${borderColor}`,display:"flex",flexDirection:"column",gap:11,cursor:item.url?"pointer":"default",transform:h?"translateY(-2px)":"none",boxShadow:h?`0 6px 24px ${borderColor}20`:"none",transition:"transform .18s,box-shadow .18s",position:"relative"}}>
      {item.url&&<div style={{position:"absolute",top:9,left:11,fontSize:"9px",color:h?"#60a5fa":"#1e3a5f",fontFamily:""Roboto Mono",monospace",transition:"color .2s"}}>↗ פתח מקור</div>}
      {children}
    </div>
  );
}

// ── Daily Briefing ────────────────────────────────────────────────────────────

function DailyBriefing({data}) {
  // חשב תשובות לכל שאלה אוטומטית
  const allItems = Object.values(data).flat();

  // 1. איפה יש כסף עכשיו — הזדמנויות קריטיות/high עם דדליין קרוב
  const money = [...data.contracts, ...data.grants]
    .filter(i => i.urgency === "critical" || i.urgency === "high")
    .sort((a,b) => (b.fitScore||0)-(a.fitScore||0))
    .slice(0,3);

  // 2. איפה נוצר פער — ונצ׳רים + סיגנלים חדשים ממתחרים
  const gaps = [...data.ventures, ...data.competitors]
    .filter(i => i.urgency === "critical" || i.urgency === "high")
    .slice(0,3);

  // 3. עם מי כדאי לדבר — שותפים + משקיעים עם סיגנל פעיל
  const talk = [...data.partners, ...data.investors]
    .filter(i => i.signal)
    .slice(0,3);

  // 4. איפה מפספסים — פריטים לא מוקצים עם fitScore גבוה
  const missing = [...data.contracts, ...data.grants]
    .filter(i => !i.assignee && (i.fitScore||0) >= 85 && i.status === "פתוח")
    .sort((a,b) => (b.fitScore||0)-(a.fitScore||0))
    .slice(0,3);

  const QUESTIONS = [
    { q:"💰 איפה יש כסף עכשיו?", items:money, color:"#22c55e", hint:"הזדמנויות חוזיות פתוחות לפי fit ואקוטיות" },
    { q:"🔍 איפה נוצר פער?", items:gaps, color:"#f97316", hint:"פערים מבצעיים וסיגנלים ממתחרים" },
    { q:"🤝 עם מי כדאי לדבר?", items:talk, color:"#3b82f6", hint:"שותפים ומשקיעים עם סיגנל פעיל" },
    { q:"⚠️ איפה אנחנו מפספסים?", items:missing, color:"#ef4444", hint:"Fit גבוה — אין בעל תפקיד, אין מעקב" },
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
              ? <div style={{fontSize:"12px",color:"#334155",fontStyle:"italic"}}>אין פריטים עכשיו</div>
              : items.map(item=>(
                <div key={item.id} onClick={()=>item.url&&window.open(item.url,"_blank")}
                  style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 0",borderBottom:"1px solid #1e293b",cursor:item.url?"pointer":"default"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".75"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <span style={{fontSize:14,marginTop:1,flexShrink:0}}>{item.flag||"📌"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"12px",fontWeight:600,color:"#e2e8f0",lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
                    <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
                      {item.budget&&<span style={{fontSize:"10px",color:"#22c55e",fontFamily:""Roboto Mono",monospace",fontWeight:700}}>{item.budget}</span>}
                      {item.prize&&<span style={{fontSize:"10px",color:"#22c55e",fontFamily:""Roboto Mono",monospace",fontWeight:700}}>{item.prize}</span>}
                      {item.deadline&&<span style={{fontSize:"10px",color:"#f87171",fontFamily:""Roboto Mono",monospace"}}>{item.deadline}</span>}
                      {item.fitScore&&<span style={{fontSize:"10px",color:fitCol(item.fitScore),fontFamily:""Roboto Mono",monospace"}}>fit {item.fitScore}</span>}
                      {item.signal&&<span style={{fontSize:"10px",color:"#93c5fd"}}>{item.signal.split("—")[0]}</span>}
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

// ── Catalog ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id:"contracts",   icon:"📋", label:"הזדמנויות" },
  { id:"partners",    icon:"🤝", label:"שותפים" },
  { id:"investors",   icon:"💰", label:"משקיעים" },
  { id:"grants",      icon:"🏆", label:"מענקים" },
  { id:"ventures",    icon:"🚀", label:"ונצ׳רים" },
  { id:"competitors", icon:"🔭", label:"מתחרים" },
];

function ContractCard({item,onUpdate}){
  const u=U[item.urgency]||U.medium;
  return (
    <Card item={item} borderColor={u.border}>
      <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:14}}>{item.flag}</span>
            <Tag label={u.label} color={u.border}/>
            <Tag label={item.tag} color="#475569"/>
            {item.bookmarked&&<Tag label="🔖" color="#eab308"/>}
          </div>
          <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",lineHeight:1.35,marginBottom:2}}>{item.title}</div>
          <div style={{fontSize:"10px",color:"#475569"}}>{item.source}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:42,height:42,borderRadius:"50%",flexShrink:0,border:`2px solid ${fitCol(item.fitScore)}`,background:`${fitCol(item.fitScore)}15`,fontSize:"12px",fontWeight:800,color:fitCol(item.fitScore),fontFamily:""Roboto Mono",monospace"}}>{item.fitScore}</div>
      </div>
      <WhyBox text={item.why}/>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        {item.budget&&<div><div style={{fontSize:"9px",color:"#475569",marginBottom:1}}>תקציב</div><div style={{fontSize:"13px",fontWeight:700,color:"#38bdf8",fontFamily:""Roboto Mono",monospace"}}>{item.budget}</div></div>}
        <div><div style={{fontSize:"9px",color:"#475569",marginBottom:1}}>דדליין</div><div style={{fontSize:"12px",fontWeight:700,color:item.urgency==="critical"?"#f87171":"#94a3b8",fontFamily:""Roboto Mono",monospace"}}>{item.deadline}</div></div>
      </div>
      <div style={{display:"flex",gap:5,borderTop:"1px solid #1e293b",paddingTop:9}} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>onUpdate(item.id,{bookmarked:!item.bookmarked})} style={{background:item.bookmarked?"#854d0e30":"transparent",border:`1px solid ${item.bookmarked?"#eab308":"#1e293b"}`,color:item.bookmarked?"#eab308":"#475569",padding:"3px 9px",borderRadius:"5px",fontSize:"11px",cursor:"pointer"}}>🔖</button>
        {["פתוח","בבדיקה","הוגש","בוטל"].map(s=>(
          <button key={s} onClick={()=>onUpdate(item.id,{status:s})} style={{background:item.status===s?"#1e293b":"transparent",border:`1px solid ${item.status===s?"#475569":"#1e293b"}`,color:item.status===s?"#f1f5f9":"#475569",padding:"3px 8px",borderRadius:"5px",fontSize:"10px",cursor:"pointer"}}>{s}</button>
        ))}
      </div>
    </Card>
  );
}

function PartnerCard({item}){
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
    </Card>
  );
}

function InvestorCard({item}){
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
    <Card item={item} borderColor={u.border}>
      <div style={{display:"flex",gap:5,marginBottom:2,alignItems:"center"}}><span style={{fontSize:14}}>{item.flag}</span><Tag label={u.label} color={u.border}/><Tag label={item.status} color="#22c55e"/></div>
      <div style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9",marginBottom:1}}>{item.title}</div>
      <div style={{fontSize:"10px",color:"#475569",marginBottom:2}}>{item.source}</div>
      <WhyBox text={item.why}/>
      <div style={{display:"flex",gap:18}}>
        <div><div style={{fontSize:"9px",color:"#475569",marginBottom:1}}>פרס</div><div style={{fontSize:"14px",fontWeight:700,color:"#4ade80",fontFamily:""Roboto Mono",monospace"}}>{item.prize}</div></div>
        <div><div style={{fontSize:"9px",color:"#475569",marginBottom:1}}>דדליין</div><div style={{fontSize:"12px",fontWeight:700,color:"#94a3b8",fontFamily:""Roboto Mono",monospace"}}>{item.deadline}</div></div>
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
    <Card item={item} borderColor="#ef4444">
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

// ── App ───────────────────────────────────────────────────────────────────────

// ── נתוני מגמות ──────────────────────────────────────────────────────────────

const TECH_TRENDS = [
  {
    id:"counter-uas", icon:"🛡️", domain:"Counter-UAS & Anti-Swarm",
    market:"$6.2B", cagr:"+23%", momentum:"🔥 רותח",
    givonFit:97, recColor:"#22c55e", rec:"להיכנס",
    hypeReal:85,
    whitespace:"Non-kinetic urban C-UAS — אפס פתרונות בסביבה עירונית בלי collateral damage. שוק טריוויאלי שאף אחד עוד לא פתר.",
    reality:"Ukraine שינתה הכל. כל צבא NATO קונה עכשיו. מימון כפול ב-2023-24.",
    hype:"חברות קטנות יתמזגו. Window להיכנס לפני קונסולידציה.",
    givonAssets:["Aerosentry TRL 7","Sky Fort TRL 5","GuaRdF RF tracking"],
    signals:["DIU $400M ב-2024","NATO DIANA — 3 אתגרים פתוחים","UK MOD הכפילה תקציב"],
  },
  {
    id:"swarm", icon:"🐝", domain:"נחילים אוטונומיים",
    market:"$2.8B", cagr:"+41%", momentum:"🔥 רותח",
    givonFit:90, recColor:"#22c55e", rec:"להיכנס",
    hypeReal:65,
    whitespace:"Decentralized swarm intelligence hardware-agnostic — Crebain היחידה בשוק. Window של 18-24 חודש לפני שהשוק מתמלא.",
    reality:"DARPA + DIU ממנות actively. קצב צמיחה הגבוה ביותר בסקטור.",
    hype:"Fully autonomous lethal swarms רחוק. הכסף: C2, ISR, logistics swarms.",
    givonAssets:["Crebain TRL 5 — decentralized"],
    signals:["DIANA swarm challenge €3.5M","Anduril Roadrunner — תחרות ישירה","DARPA OFFSET program"],
  },
  {
    id:"isr", icon:"🔍", domain:"ISR טקטי וצירוף חיישנים",
    market:"$15B", cagr:"+16%", momentum:"📈 גדל",
    givonFit:88, recColor:"#22c55e", rec:"להיכנס",
    hypeReal:80,
    whitespace:"ISR ברמת גדוד — עלות נמוכה ב-80%. כל מדינת NATO שצריכה פתרון זול ומהיר.",
    reality:"Ukraine: Bayraktar, Mavic שינו את המלחמה. ביקוש עצום לפתרונות זולים.",
    hype:"Satellite ISR מקבל buzz יתר. הכסף: טקטי, זול, מהיר.",
    givonAssets:["Daya IRIS-20 TRL 5","iCit Vision Agents","D-Fence sensors"],
    signals:["EDF €12M ISR call פתוח","פולין + Baltic RFI גדוד","SOCOM ISR BAA"],
  },
  {
    id:"energy", icon:"⚡", domain:"אנרגיה טקטית שדה קרב",
    market:"$3.1B", cagr:"+31%", momentum:"📈 גדל",
    givonFit:95, recColor:"#22c55e", rec:"להיכנס",
    hypeReal:88,
    whitespace:"Power-as-a-Service ל-C-UAS ניידת — אין פתרון משולב DFM+Sky Fort. גבעון יכולה לבנות Venture ייחודי.",
    reality:"Electrification של הצבא — מגמה בלתי הפיכה. קצב גדילה מהיר ביותר.",
    hype:"'Green military' — marketing. הכסף: operational energy.",
    givonAssets:["DFM Power TRL 9","nano-grid 300 ק״ג"],
    signals:["DIU OTA Tactical Energy","SOCOM BAA Mobile Power","DFM מוכן לשוק"],
  },
  {
    id:"simulators", icon:"🎮", domain:"סימולציה והכשרה AI",
    market:"$8.1B", cagr:"+19%", momentum:"📈 גדל",
    givonFit:62, recColor:"#f59e0b", rec:"לחקור",
    hypeReal:70,
    whitespace:"סימולציה ל-Swarm warfare ו-Counter-UAS — הכשרה לתרחישים שאין להם סימולטור. D-COE יכולה להוביל.",
    reality:"DoD $8B+ בשנה על training. AI מוסיף ערך אמיתי. שוק יציב ומצמיח.",
    hype:"Metaverse הרג כמה חברות. הכסף: live-virtual-constructive, לא VR.",
    givonAssets:["D-COE בפורטפוליו","ניסיון הכשרה דרונים"],
    signals:["SOCOM RFI drone warfare simulator","Army STE $2B program","NATO CWIX training"],
  },
  {
    id:"robotics", icon:"🤖", domain:"רובוטיקה קרקעית",
    market:"$4.4B", cagr:"+28%", momentum:"📈 גדל",
    givonFit:78, recColor:"#22c55e", rec:"להיכנס",
    hypeReal:75,
    whitespace:"Logistics & Resupply autonomy — לא sexy אבל מיליארדים. Mokoushla + DFM = פתרון שלם שאין בשוק.",
    reality:"Ukraine הוכיחה: ground robots חוסכים חיים. תקציבים קפצו.",
    hype:"Full autonomy עדיין רחוק. הכסף: supervised autonomy.",
    givonAssets:["Mokoushla — מוכח בשדה","DFM power integration"],
    signals:["KNDS RFI autonomous ground","Rheinmetall קנתה 3 חברות robotic","IDF robotic platoon 2025"],
  },
  {
    id:"cyber-ew", icon:"📡", domain:"לוחמה אלקטרונית וסייבר",
    market:"$22B", cagr:"+12%", momentum:"🔵 יציב",
    givonFit:55, recColor:"#3b82f6", rec:"לעקוב",
    hypeReal:60,
    whitespace:"RF-Cyber convergence — GuaRdF + Elite Minds יכולים לבנות פתרון משולב שאין בשוק. Entry point קיים.",
    reality:"שוק ענק אבל מרוכז — L3, Elbit, Rafael שולטות. קשה לחברה קטנה.",
    hype:"'AI cyber' buzz. הכסף: EW platforms בודדות, לא AI startups.",
    givonAssets:["GuaRdF RF sensing","Elite Minds cyber"],
    signals:["DARPA EW $300M","NATO Cognitive EW challenge","אין RFI ישיר לגבעון כרגע"],
  },
  {
    id:"space", icon:"🛸", domain:"ביטחון חלל",
    market:"$11B", cagr:"+14%", momentum:"🔵 יציב",
    givonFit:22, recColor:"#ef4444", rec:"לא עכשיו",
    hypeReal:45,
    whitespace:"אין white space לגבעון — barriers גבוהים, אין leverage מהפורטפוליו, שוק מרוכז.",
    reality:"שוק אמיתי — SpaceX, L3Harris שולטות. כניסה יקרה מאוד.",
    hype:"Starshield buzz. הכסף: SAR, GPS alternatives. לא לגבעון.",
    givonAssets:[],
    signals:["Space Force $2B+","אין leverage מפורטפוליו","Barriers to entry גבוהים"],
  },
];

const GEO_TRENDS = [
  {
    id:"usa", flag:"🇺🇸", country:"ארה״ב",
    budget:"$886B", defenseShare:"3.5% GDP", momentum:"🔥",
    givonAccess:"גבוה — DIU, AFWERX, SBIR פתוחות לישראל",
    accessColor:"#22c55e",
    hotDomains:["Counter-UAS","Swarm AI","Tactical Energy","Vision AI"],
    whitespace:"OTA contracts — ללא תהליך רכש ארוך. DIU + AFWERX = כניסה מהירה לDoD.",
    keyBuyers:["DIU","AFWERX","DARPA","SOCOM","Army Futures"],
    trend:"הגדלת תקציב C-UAS ו-Autonomous systems ב-40% ב-2024",
    signals:["DIU OTA open calls — שוטף","SBIR Phase II — funding מוגדל","Ukraine lesson: כל platform צריך counter-UAS"],
  },
  {
    id:"nato-eu", flag:"🇪🇺", country:"נאט״ו / אירופה",
    budget:"€58B EDF 2021-27", defenseShare:"2% GDP ↑", momentum:"🔥",
    givonAccess:"בינוני-גבוה — ישראל associated country ב-Horizon",
    accessColor:"#f59e0b",
    hotDomains:["Counter-UAS","ISR","Robotics","Dual-Use"],
    whitespace:"EDF + NATO DIANA פתוחים לחברות ישראליות. רגולציה נוחה יחסית. שוק ענק לא מנוצל.",
    keyBuyers:["EDF","NATO DIANA","EIC","KNDS","Rheinmetall"],
    trend:"אירופה מכפילה תקציב ביטחון. פולין, Baltics, גרמניה — קניות ענק.",
    signals:["EDF calls פתוחים €12M+","NATO DIANA אתגרים פעילים","פולין — $30B defense budget 2024"],
  },
  {
    id:"israel", flag:"🇮🇱", country:"ישראל",
    budget:"₪100B+", defenseShare:"5.3% GDP", momentum:"🔥",
    givonAccess:"מקסימלי — בית",
    accessColor:"#22c55e",
    hotDomains:["Counter-UAS","ISR","C2","Electronic Warfare"],
    whitespace:"מפא״ת ומלמ״ב — הזדמנויות בית. ניסיון מלחמה = TRL טבעי. הכל מוכן.",
    keyBuyers:["מפא״ת","מלמ״ב","צה״ל","מודיעין"],
    trend:"Post-Oct 7: תקציב ביטחון הוכפל. Counter-UAS ו-ISR בעדיפות עליונה.",
    signals:["מפא״ת — קולות קוראים שוטפים","מלמ״ב — אנרגיה וC-UAS","IDF — robotic platoon program"],
  },
  {
    id:"uk", flag:"🇬🇧", country:"בריטניה",
    budget:"£54B", defenseShare:"2.3% GDP", momentum:"📈",
    givonAccess:"גבוה — DASA פתוחה לישראל",
    accessColor:"#22c55e",
    hotDomains:["Counter-UAS","AI Defense","Border Security","ISR"],
    whitespace:"DASA — מנגנון מהיר ופתוח. UK MOD מחפשת פתרונות ISR ו-border security. Guardian Angel fit מדויק.",
    keyBuyers:["UK DASA","MOD","Home Office","Border Force"],
    trend:"UK הגדילה תקציב ביטחון ב-£75B. DASA — הכי open innovation בNATO.",
    signals:["DASA challenges פתוחים שוטף","MOD border AI RFI","UK — C-UAS national program"],
  },
  {
    id:"eastern-europe", flag:"🇵🇱", country:"מזרח אירופה",
    budget:"$35B+ (פולין בלבד)", defenseShare:"4% GDP ↑", momentum:"🔥",
    givonAccess:"בינוני — מסלול דרך NATO",
    accessColor:"#f59e0b",
    hotDomains:["Counter-UAS","ISR","Ground Robotics","Tactical Energy"],
    whitespace:"פולין, בלטיים, רומניה — קניות ענק עם כסף אמיתי. ISR זול ו-C-UAS בעדיפות עליונה. White space ענק.",
    keyBuyers:["Polish Armament Agency","Lithuanian MOD","Estonian MOD","Romanian MOD"],
    trend:"פולין — תקציב ביטחון הגבוה ביותר ב-GDP ב-NATO. בלטיים — 3-4% GDP.",
    signals:["Polish BAA — C-UAS פתוח","Baltic states RFI ISR","Rheinmetall בונה factory בפולין"],
  },
  {
    id:"gulf", flag:"🇦🇪", country:"מפרץ פרסי",
    budget:"$100B+", defenseShare:"5-8% GDP", momentum:"📈",
    givonAccess:"נמוך-בינוני — תלוי ביחסים דיפלומטיים",
    accessColor:"#f97316",
    hotDomains:["Counter-UAS","Border Security","ISR","Force Protection"],
    whitespace:"אברהם אקורדים = window אסטרטגי. UAE, בחריין, מרוקו. C-UAS + Border Security = fit מושלם.",
    keyBuyers:["UAE EDGE Group","Saudi GAMI","Bahrain MOD"],
    trend:"Abraham Accords פתחו שווקים. UAE מגדילה רכישות defense tech ישראלי.",
    signals:["EDGE Group RFI — C-UAS","UAE-Israel defense MOU","IDEX 2025 — הזדמנות"],
  },
];

// ── TrendsView ────────────────────────────────────────────────────────────────

function MiniBar({val, color="#3b82f6", label}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      {label&&<span style={{fontSize:"10px",color:"#64748b",width:36,flexShrink:0,textAlign:"left"}}>{label}</span>}
      <div style={{flex:1,background:"#1e293b",borderRadius:3,height:5,overflow:"hidden"}}>
        <div style={{width:`${val}%`,height:"100%",background:color,borderRadius:3}}/>
      </div>
      <span style={{fontSize:"9px",color:"#475569",fontFamily:""Roboto Mono",monospace",width:28}}>{val}%</span>
    </div>
  );
}

function TechCard({t, expanded, onToggle}){
  const fc = t.givonFit>=85?"#22c55e":t.givonFit>=65?"#eab308":"#f97316";
  return (
    <div onClick={onToggle} style={{background:"#0f172a",border:`1px solid ${t.recColor}20`,borderTop:`3px solid ${t.recColor}`,borderRadius:"10px",padding:"16px",cursor:"pointer",transition:"box-shadow .2s",boxShadow:expanded?`0 4px 20px ${t.recColor}18`:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
            <span style={{fontSize:17}}>{t.icon}</span>
            <div style={{fontSize:"13px",fontWeight:800,color:"#f1f5f9"}}>{t.domain}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:"11px",color:"#22c55e",fontFamily:""Roboto Mono",monospace",fontWeight:700}}>{t.market}</span>
            <span style={{fontSize:"11px",color:"#38bdf8",fontFamily:""Roboto Mono",monospace"}}>{t.cagr}</span>
            <span style={{fontSize:"10px",color:"#475569"}}>{t.momentum}</span>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
          <div style={{background:`${t.recColor}18`,border:`1px solid ${t.recColor}50`,borderRadius:"5px",padding:"2px 9px",fontSize:"10px",fontWeight:800,color:t.recColor}}>{t.rec}</div>
          <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${fc}`,background:`${fc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:fc,fontFamily:""Roboto Mono",monospace"}}>{t.givonFit}</div>
        </div>
      </div>

      {/* Hype bar */}
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:"9px",color:"#475569"}}>Hype vs Reality</span>
          <span style={{fontSize:"9px",color:t.hypeReal>=75?"#22c55e":t.hypeReal>=55?"#f59e0b":"#ef4444",fontWeight:700}}>{t.hypeReal>=75?"מגובה":t.hypeReal>=55?"בינוני":"Hype יתר"}</span>
        </div>
        <div style={{background:"#1e293b",borderRadius:3,height:4}}>
          <div style={{width:`${t.hypeReal}%`,height:"100%",background:`linear-gradient(90deg,#ef4444,${t.hypeReal>=75?"#22c55e":t.hypeReal>=55?"#f59e0b":"#ef4444"})`,borderRadius:3}}/>
        </div>
      </div>

      {/* White space */}
      <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a25",borderRadius:"6px",padding:"7px 10px",marginBottom:8}}>
        <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:2}}>🎯 White Space לגבעון</div>
        <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.55}}>{t.whitespace}</div>
      </div>

      {/* Assets */}
      {t.givonAssets.length>0&&(
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
          {t.givonAssets.map(a=><span key={a} style={{fontSize:"9px",background:"#1e3a5f",border:"1px solid #3b82f625",color:"#60a5fa",padding:"2px 7px",borderRadius:"4px",fontFamily:""Roboto Mono",monospace"}}>{a}</span>)}
        </div>
      )}

      {/* Expanded */}
      {expanded&&(
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
      {!expanded&&<div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center",marginTop:4}}>▼ פרטים</div>}
    </div>
  );
}

function GeoCard({g, expanded, onToggle}){
  return (
    <div onClick={onToggle} style={{background:"#0f172a",border:"1px solid #1e293b",borderTop:`3px solid ${g.accessColor}`,borderRadius:"10px",padding:"16px",cursor:"pointer",transition:"box-shadow .2s",boxShadow:expanded?`0 4px 20px ${g.accessColor}18`:"none"}}>
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
            <span style={{fontSize:"12px",color:"#22c55e",fontFamily:""Roboto Mono",monospace",fontWeight:700}}>{g.budget}</span>
            <span style={{fontSize:"13px"}}>{g.momentum}</span>
          </div>
        </div>
        <div style={{background:`${g.accessColor}15`,border:`1px solid ${g.accessColor}40`,borderRadius:"6px",padding:"4px 10px",fontSize:"10px",fontWeight:700,color:g.accessColor,textAlign:"center",maxWidth:100}}>{g.givonAccess}</div>
      </div>

      {/* Hot domains */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
        {g.hotDomains.map(d=><span key={d} style={{fontSize:"9px",background:"#1e293b",color:"#94a3b8",padding:"2px 7px",borderRadius:"4px",fontFamily:""Roboto Mono",monospace"}}>{d}</span>)}
      </div>

      {/* White space */}
      <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a25",borderRadius:"6px",padding:"7px 10px"}}>
        <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:2}}>🎯 White Space</div>
        <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.55}}>{g.whitespace}</div>
      </div>

      {expanded&&(
        <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
          <div style={{background:"#0a0f1e",borderRadius:"6px",padding:"10px"}}>
            <div style={{fontSize:"9px",color:"#94a3b8",fontWeight:700,marginBottom:6}}>📈 טרנד</div>
            <div style={{fontSize:"11px",color:"#cbd5e1",lineHeight:1.55,marginBottom:8}}>{g.trend}</div>
            <div style={{fontSize:"9px",color:"#475569",fontWeight:700,marginBottom:4}}>קונים מרכזיים</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {g.keyBuyers.map(b=><span key={b} style={{fontSize:"9px",background:"#1e3a5f",border:"1px solid #3b82f620",color:"#93c5fd",padding:"2px 8px",borderRadius:"4px"}}>{b}</span>)}
            </div>
          </div>
          <div style={{background:"#0c1a2e",border:"1px solid #1e40af20",borderRadius:"6px",padding:"9px"}}>
            <div style={{fontSize:"9px",color:"#60a5fa",fontWeight:700,marginBottom:5}}>📡 סיגנלים</div>
            {g.signals.map((s,i)=><div key={i} style={{fontSize:"10px",color:"#93c5fd",padding:"2px 0",borderBottom:i<g.signals.length-1?"1px solid #1e293b":"none"}}>· {s}</div>)}
          </div>
          <div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center"}}>▲ סגור</div>
        </div>
      )}
      {!expanded&&<div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center",marginTop:6}}>▼ פרטים</div>}
    </div>
  );
}

function TrendsView(){
  const [tab, setTab] = useState("tech"); // "tech" | "geo"
  const [expanded, setExpanded] = useState(null);
  const [recFilter, setRecFilter] = useState("all");
  const toggle = id => setExpanded(e=>e===id?null:id);

  const filteredTech = recFilter==="all" ? TECH_TRENDS : TECH_TRENDS.filter(t=>t.rec===recFilter);
  const topPicks = TECH_TRENDS.filter(t=>t.rec==="להיכנס").sort((a,b)=>b.givonFit-a.givonFit).slice(0,3);
  const hotGeo = GEO_TRENDS.filter(g=>g.momentum==="🔥");

  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"24px"}}>

      {/* כותרת */}
      <div style={{marginBottom:18}}>
        <div style={{fontSize:"20px",fontWeight:800,color:"#f1f5f9",marginBottom:3}}>📈 מגמות אסטרטגיות</div>
        <div style={{fontSize:"12px",color:"#475569"}}>לאן זורם כסף הביטחון הגלובלי — לפי טכנולוגיה ולפי אזור גיאוגרפי</div>
      </div>

      {/* Top Picks strip */}
      <div style={{background:"linear-gradient(135deg,#0a1628,#0c1f35)",border:"1px solid #1e40af25",borderRadius:"10px",padding:"14px 16px",marginBottom:18}}>
        <div style={{fontSize:"10px",color:"#60a5fa",fontWeight:700,marginBottom:8,letterSpacing:"0.06em"}}>⚡ להיכנס עכשיו — Fit גבוה + שוק פתוח</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {topPicks.map(t=>(
            <div key={t.id} onClick={()=>{setTab("tech");toggle(t.id);}}
              style={{background:"#0f172a",border:`1px solid ${t.recColor}35`,borderRadius:"7px",padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1,minWidth:180}}>
              <span style={{fontSize:15}}>{t.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"11px",fontWeight:700,color:"#f1f5f9"}}>{t.domain}</div>
                <div style={{fontSize:"10px",color:"#22c55e",fontFamily:""Roboto Mono",monospace"}}>{t.market} · {t.cagr}</div>
              </div>
              <div style={{width:28,height:28,borderRadius:"50%",border:"2px solid #22c55e",background:"#22c55e15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:800,color:"#22c55e",fontFamily:""Roboto Mono",monospace"}}>{t.givonFit}</div>
            </div>
          ))}
          {/* Hot geo strip */}
          {hotGeo.slice(0,2).map(g=>(
            <div key={g.id} onClick={()=>{setTab("geo");toggle(g.id);}}
              style={{background:"#0f172a",border:"1px solid #f9731625",borderRadius:"7px",padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1,minWidth:160}}>
              <span style={{fontSize:18}}>{g.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"11px",fontWeight:700,color:"#f1f5f9"}}>{g.country}</div>
                <div style={{fontSize:"10px",color:"#fb923c",fontFamily:""Roboto Mono",monospace"}}>{g.budget} · {g.momentum}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs tech/geo */}
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

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:13}}>
        {tab==="tech" && filteredTech.map(t=><TechCard key={t.id} t={t} expanded={expanded===t.id} onToggle={()=>toggle(t.id)}/>)}
        {tab==="geo" && GEO_TRENDS.map(g=><GeoCard key={g.id} g={g} expanded={expanded===g.id} onToggle={()=>toggle(g.id)}/>)}
      </div>
    </div>
  );
}

const TRENDS = [
  {
    id: "counter-uas",
    domain: "Counter-UAS & Anti-Swarm",
    icon: "🛡️",
    market: "$6.2B",
    cagr: "+23%",
    horizon: "2024–2028",
    recommendation: "להיכנס",
    recColor: "#22c55e",
    hypeReal: 85, // 0-100: כמה ה-hype מגובה במימון אמיתי
    givonFit: 97,
    spending: [
      { label:"DoD", val:78 }, { label:"NATO", val:65 }, { label:"EU EDF", val:55 }, { label:"Israel", val:90 },
    ],
    whitespace: "Non-kinetic urban C-UAS — אין פתרון עירוני בלי collateral damage. גבעון יכולה להיות ראשונה.",
    reality: "מימון אמיתי, גדל בכל שנה. Ukraine שינתה הכל — כל צבא NATO ברמה.",
    hype: "הרבה חברות קטנות בשוק, רוב יתמזגו. Window להיכנס לפני קונסולידציה.",
    signals: ["DIU השקיעה $400M ב-2024","NATO DIANA — 3 אתגרים פתוחים בC-UAS","UK MOD הכפילה תקציב C-UAS"],
  },
  {
    id: "simulators",
    domain: "סימולציה והכשרה מבוססת AI",
    icon: "🎮",
    market: "$8.1B",
    cagr: "+19%",
    horizon: "2024–2028",
    recommendation: "לחקור",
    recColor: "#f59e0b",
    hypeReal: 70,
    givonFit: 62,
    spending: [
      { label:"DoD", val:82 }, { label:"NATO", val:60 }, { label:"EU", val:45 }, { label:"Israel", val:70 },
    ],
    whitespace: "סימולציה ל-Swarm warfare ו-Counter-UAS — הכשרה לתרחישים שעוד לא קיימים. D-COE יכולה להוביל.",
    reality: "שוק ענק ויציב. DoD מוציאה $8B+ בשנה על training. AI מוסיף ערך אמיתי.",
    hype: "טרנד ה-Metaverse הרג כמה חברות. הכסף האמיתי הוא ב-live-virtual-constructive, לא VR.",
    signals: ["SOCOM — RFI לסימולטור drone warfare","Army Futures — Synthetic Training Environment $2B","D-COE בפורטפוליו — leverage ישיר"],
  },
  {
    id: "autonomous-ground",
    domain: "רובוטיקה קרקעית אוטונומית",
    icon: "🤖",
    market: "$4.4B",
    cagr: "+28%",
    horizon: "2024–2029",
    recommendation: "להיכנס",
    recColor: "#22c55e",
    hypeReal: 75,
    givonFit: 78,
    spending: [
      { label:"DoD", val:70 }, { label:"NATO", val:72 }, { label:"EU", val:58 }, { label:"Israel", val:85 },
    ],
    whitespace: "Logistics & Resupply autonomy — לא sexy אבל $מיליארדים. Mokoushla + DFM = פתרון שלם.",
    reality: "Ukraine הוכיחה: ground robots חוסכים חיים. תקציבים קפצו ב-2023-24.",
    hype: "Full autonomy עדיין רחוק. הכסף הוא ב-supervised autonomy, לא self-driving tanks.",
    signals: ["KNDS RFI autonomous ground — שבוע","Rheinmetall קנתה 3 חברות robotic ב-2024","IDF — תוכנית robotic platoon 2025"],
  },
  {
    id: "cyber-electronic",
    domain: "לוחמה אלקטרונית וסייבר טקטי",
    icon: "📡",
    market: "$22B",
    cagr: "+12%",
    horizon: "2024–2028",
    recommendation: "לעקוב",
    recColor: "#3b82f6",
    hypeReal: 60,
    givonFit: 55,
    spending: [
      { label:"DoD", val:90 }, { label:"NATO", val:75 }, { label:"EU", val:50 }, { label:"Israel", val:95 },
    ],
    whitespace: "RF-Cyber convergence — GuaRdF + Elite Minds יכולים לבנות פתרון משולב שאין בשוק.",
    reality: "שוק ענק אבל מרוכז — L3, Elbit, Rafael שולטות. קשה להיכנס כחברה קטנה.",
    hype: "'AI cyber' — buzz word. הכסף האמיתי הוא ב-EW platforms, לא AI startups.",
    signals: ["DARPA — EW program חדש $300M","guaRdF בפורטפוליו — נקודת כניסה","NATO — Cognitive EW challenge פתוח"],
  },
  {
    id: "isr-intelligence",
    domain: "ISR ומודיעין מרחוק",
    icon: "🔍",
    market: "$15B",
    cagr: "+16%",
    horizon: "2024–2028",
    recommendation: "להיכנס",
    recColor: "#22c55e",
    hypeReal: 80,
    givonFit: 88,
    spending: [
      { label:"DoD", val:85 }, { label:"NATO", val:68 }, { label:"EU EDF", val:62 }, { label:"Israel", val:80 },
    ],
    whitespace: "Tactical ISR ברמת גדוד — Daya IRIS-20 ממוקמת מושלם. עלות נמוכה ב-80%.",
    reality: "Ukraine: Bayraktar, Mavic — ISR שינה את המלחמה. כל גדוד צריך ISR. ביקוש עצום.",
    hype: "Satellite ISR מקבל buzz יתר. הכסף האמיתי: תקטי, זול, מהיר. בדיוק Daya.",
    signals: ["EDF — €12M ISR call פתוח","NATO — ISR sensor fusion challenge","פולין + Baltic states — RFI ISR גדוד"],
  },
  {
    id: "energy-power",
    domain: "אנרגיה טקטית ושדה קרב",
    icon: "⚡",
    market: "$3.1B",
    cagr: "+31%",
    horizon: "2024–2029",
    recommendation: "להיכנס",
    recColor: "#22c55e",
    hypeReal: 88,
    givonFit: 95,
    spending: [
      { label:"DoD", val:75 }, { label:"NATO", val:60 }, { label:"EU", val:50 }, { label:"Israel", val:72 },
    ],
    whitespace: "Power-as-a-Service לפעילות C-UAS ניידת — אין מישהו שמשלב DFM + Sky Fort כפתרון אחד.",
    reality: "קצב צמיחה מהיר ביותר ב-defense. Electrification של הצבא — מגמה בלתי הפיכה.",
    hype: "'Green military' — הרבה marketing. הכסף האמיתי: operational energy, לא sustainability.",
    signals: ["DIU OTA Tactical Energy","SOCOM BAA Mobile Power","DFM TRL 9 — מוכן לשוק"],
  },
  {
    id: "swarm-autonomous",
    domain: "נחילים אוטונומיים",
    icon: "🐝",
    market: "$2.8B",
    cagr: "+41%",
    horizon: "2025–2030",
    recommendation: "להיכנס",
    recColor: "#22c55e",
    hypeReal: 65,
    givonFit: 90,
    spending: [
      { label:"DoD", val:72 }, { label:"NATO", val:58 }, { label:"EU", val:48 }, { label:"Israel", val:75 },
    ],
    whitespace: "Decentralized swarm intelligence hardware-agnostic — Crebain היחידה בשוק. TRL נמוך אבל window פתוח.",
    reality: "DARPA + DIU מממנות actively. Ukraine הוכיחה ערך. קצב הצמיחה הגבוה ביותר בסקטור.",
    hype: "Fully autonomous lethal swarms — רחוק מ-reality ורגולציה. הכסף: C2, ISR, logistics swarms.",
    signals: ["NATO DIANA — swarm challenge €3.5M","Anduril Roadrunner — תחרות ישירה","DARPA — OFFensive Swarm-Enabled Tactics"],
  },
  {
    id: "space-defense",
    domain: "ביטחון חלל",
    icon: "🛸",
    market: "$11B",
    cagr: "+14%",
    horizon: "2024–2028",
    recommendation: "לא עכשיו",
    recColor: "#ef4444",
    hypeReal: 45,
    givonFit: 22,
    spending: [
      { label:"DoD", val:88 }, { label:"NATO", val:55 }, { label:"EU", val:60 }, { label:"Israel", val:40 },
    ],
    whitespace: "אין white space לגבעון — שוק מרוכז, barriers גבוהים, אין leverage מהפורטפוליו.",
    reality: "שוק אמיתי וגדל — אבל SpaceX, L3Harris, Northrop שולטות. כניסה יקרה מאוד.",
    hype: "הרבה buzz על SpaceX Starshield. הכסף האמיתי: SAR satellites, GPS alternatives. לא לגבעון.",
    signals: ["Space Force — $2B+ תקציב חדש","אין leverage מפורטפוליו גבעון","Barriers to entry גבוהים מאוד"],
  },
];

// ── TrendsView ────────────────────────────────────────────────────────────────

function SpendingBar({label, val, color="#3b82f6"}) {
  return (
    <div style={{marginBottom:6}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:"10px",color:"#64748b"}}>{label}</span>
        <span style={{fontSize:"10px",color:"#94a3b8",fontFamily:""Roboto Mono",monospace"}}>{val}%</span>
      </div>
      <div style={{background:"#1e293b",borderRadius:3,height:5,overflow:"hidden"}}>
        <div style={{width:`${val}%`,height:"100%",background:color,borderRadius:3,transition:"width .6s ease"}}/>
      </div>
    </div>
  );
}

function HypeBar({val}) {
  const color = val>=75?"#22c55e":val>=55?"#f59e0b":"#ef4444";
  const label = val>=75?"מגובה במציאות":val>=55?"בינוני":"Hype יתר";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:"9px",color:"#475569"}}>Hype vs Reality</span>
        <span style={{fontSize:"9px",color,fontWeight:700}}>{label}</span>
      </div>
      <div style={{background:"#1e293b",borderRadius:3,height:4,overflow:"hidden"}}>
        <div style={{width:`${val}%`,height:"100%",background:`linear-gradient(90deg, #ef4444, ${color})`,borderRadius:3}}/>
      </div>
    </div>
  );
}

function TrendCard({t, expanded, onToggle}) {
  const fitColor = t.givonFit>=85?"#22c55e":t.givonFit>=65?"#eab308":"#f97316";
  return (
    <div onClick={onToggle} style={{background:"#0f172a",border:`1px solid ${t.recColor}20`,borderTop:`3px solid ${t.recColor}`,borderRadius:"10px",padding:"18px",cursor:"pointer",transition:"box-shadow .2s",boxShadow:expanded?`0 4px 24px ${t.recColor}15`:"none"}}>

      {/* שורה עליונה */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9"}}>{t.domain}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:"11px",color:"#22c55e",fontFamily:""Roboto Mono",monospace",fontWeight:700}}>{t.market}</span>
            <span style={{fontSize:"11px",color:"#38bdf8",fontFamily:""Roboto Mono",monospace"}}>{t.cagr} CAGR</span>
            <span style={{fontSize:"10px",color:"#475569"}}>{t.horizon}</span>
          </div>
        </div>

        {/* המלצה + fit */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
          <div style={{background:`${t.recColor}18`,border:`1px solid ${t.recColor}50`,borderRadius:"6px",padding:"3px 10px",fontSize:"11px",fontWeight:800,color:t.recColor}}>{t.recommendation}</div>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:"9px",color:"#475569"}}>Fit לגבעון</span>
            <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${fitColor}`,background:`${fitColor}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:fitColor,fontFamily:""Roboto Mono",monospace"}}>{t.givonFit}</div>
          </div>
        </div>
      </div>

      {/* HypeBar תמיד נראה */}
      <HypeBar val={t.hypeReal}/>

      {/* White space */}
      <div style={{marginTop:10,background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a30",borderRadius:"6px",padding:"8px 11px"}}>
        <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:3}}>🎯 White space לגבעון</div>
        <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.6}}>{t.whitespace}</div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>

          {/* Spending bars */}
          <div style={{background:"#0a0f1e",borderRadius:"7px",padding:"12px"}}>
            <div style={{fontSize:"10px",color:"#475569",fontWeight:700,marginBottom:8}}>📊 עוצמת מימון ממשלתי</div>
            {t.spending.map(s=>(
              <SpendingBar key={s.label} label={s.label} val={s.val} color={s.val>=75?"#22c55e":s.val>=55?"#f59e0b":"#ef4444"}/>
            ))}
          </div>

          {/* Hype vs Reality */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"#0a0f1e",borderRadius:"7px",padding:"10px"}}>
              <div style={{fontSize:"9px",color:"#22c55e",fontWeight:700,marginBottom:5}}>✅ מה קורה בפועל</div>
              <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.6}}>{t.reality}</div>
            </div>
            <div style={{background:"#0a0f1e",borderRadius:"7px",padding:"10px"}}>
              <div style={{fontSize:"9px",color:"#f87171",fontWeight:700,marginBottom:5}}>⚠️ מה מוגזם</div>
              <div style={{fontSize:"11px",color:"#fca5a5",lineHeight:1.6}}>{t.hype}</div>
            </div>
          </div>

          {/* Signals */}
          <div style={{background:"#0c1a2e",border:"1px solid #1e40af25",borderRadius:"7px",padding:"10px"}}>
            <div style={{fontSize:"9px",color:"#60a5fa",fontWeight:700,marginBottom:6}}>📡 סיגנלים אחרונים</div>
            {t.signals.map((s,i)=>(
              <div key={i} style={{fontSize:"11px",color:"#93c5fd",padding:"3px 0",borderBottom:i<t.signals.length-1?"1px solid #1e293b":"none"}}>· {s}</div>
            ))}
          </div>

          <div style={{fontSize:"9px",color:"#1e3a5f",textAlign:"center"}}>לחץ לסגור</div>
        </div>
      )}

      {!expanded && (
        <div style={{marginTop:8,fontSize:"9px",color:"#1e3a5f",textAlign:"center"}}>לחץ לפרטים ▼</div>
      )}
    </div>
  );
}


// ── PARTNERSHIP OPPORTUNITIES ─────────────────────────────────────────────────

const PARTNERSHIP_TYPES = {
  idiq:       { label:"IDIQ & Primes",       color:"#3b82f6", icon:"📋", desc:"חוזי IDIQ פעילים מול DoD — כניסה מהירה ללא תהליך רכש" },
  integrator: { label:"Mission Integrators", color:"#a855f7", icon:"⚙️", desc:"משלבי מערכות מול DoD — מחפשים טכנולוגיה ישראלית לשלב" },
  ma:         { label:"M&A / Strategic",     color:"#f97316", icon:"🤝", desc:"מיזוגים ורכישות Defense Tech — רלוונטיים לפורטפוליו גבעון" },
};

const PARTNERSHIPS = [
  { id:"p1",  type:"idiq",       flag:"🇺🇸", country:"ארה״ב",   title:"Booz Allen Hamilton",       url:"https://www.boozallen.com/markets/defense.html",   oneLiner:"הדרך המהירה ביותר לתוך תקציבי DoD ומודיעין.",                           why:"מחזיקת IDIQ ענקית מול DoD ו-IC — שיתוף פעולה פותח גישה ישירה לתוכניות מודיעין ו-C-UAS.",            signal:"זכתה ב-IDIQ $1.7B Army AI/ML — ינואר 2025",                         status:"לפנות",    priority:"high",   fit:92 },
  { id:"p2",  type:"idiq",       flag:"🇺🇸", country:"ארה״ב",   title:"SAIC",                       url:"https://www.saic.com/what-we-do/defense",           oneLiner:"IDIQ ב-ISR ו-C2 — כיסוי מדויק לפורטפוליו.",                            why:"SAIC מחזיקת IDIQ רחבה מול DoD עם מיקוד ב-ISR ו-C2 — תחומי הליבה של גבעון.",                        signal:"חתמה IDIQ $700M NRO ISR — פברואר 2025",                             status:"לפנות",    priority:"high",   fit:89 },
  { id:"p3",  type:"idiq",       flag:"🇺🇸", country:"ארה״ב",   title:"Leidos",                     url:"https://www.leidos.com/markets/defense",             oneLiner:"פלטפורמת autonomous systems הגדולה ביותר ב-DoD.",                       why:"Leidos מובילה תחום ה-autonomous systems ב-DoD ומחפשת אינטגרציה עם ספקים ישראלים.",                  signal:"פרסמה RFI autonomous ISR — דצמבר 2024",                            status:"לפנות",    priority:"medium", fit:85 },
  { id:"p4",  type:"idiq",       flag:"🇺🇸", country:"ארה״ב",   title:"CACI International",         url:"https://www.caci.com/defense",                      oneLiner:"EW ומודיעין — fit ישיר ל-GuaRdF ו-Elite Minds.",                       why:"CACI מתמחה ב-EW ומודיעין — GuaRdF ו-Elite Minds מתאימים ישירות לתיק שלהם.",                        signal:"זכתה ב-IDIQ $6.7B SITE III DoD IT — 2024",                          status:"לחקור",    priority:"medium", fit:81 },
  { id:"p5",  type:"idiq",       flag:"🇺🇸", country:"ארה״ב",   title:"Peraton",                    url:"https://www.peraton.com/markets/defense",            oneLiner:"שער ל-SOCOM וSpecial Operations עם הפורטפוליו שלנו.",                  why:"Peraton מחזיקת IDIQ ב-Special Operations ו-Intel — מסלול מצוין ל-SOCOM עם DFM ו-Daya.",            signal:"זכתה IDIQ $3B SOCOM — ינואר 2025",                                  status:"לפנות",    priority:"high",   fit:88 },
  { id:"p6",  type:"integrator", flag:"🇺🇸", country:"ארה״ב",   title:"L3Harris Technologies",      url:"https://www.l3harris.com/all-capabilities/defense", oneLiner:"אינטגרטור ISR+EW הגדול בעולם — Daya ו-GuaRdF נכנסים ישר.",            why:"L3Harris מובילה שילוב מערכות ISR ו-EW ב-DoD — Daya IRIS-20 ו-GuaRdF מושלמים לפלטפורמות שלהם.",    signal:"הכריזה על תוכנית שילוב ISR חדשה $2.3B — פברואר 2025",              status:"לפנות",    priority:"high",   fit:94 },
  { id:"p7",  type:"integrator", flag:"🇺🇸", country:"ארה״ב",   title:"General Dynamics Mission Systems", url:"https://gdmissionsystems.com",             oneLiner:"C2 + Autonomy — שילוב טבעי עם Crebain ו-Mokoushla.",                  why:"GDMS אינטגרטור C2 ו-Autonomous Systems מוביל — Crebain ו-Mokoushla מדברים ישירות לצרכים שלהם.",    signal:"פרסמה BAA autonomous ground systems — ינואר 2025",                 status:"לחקור",    priority:"high",   fit:90 },
  { id:"p8",  type:"integrator", flag:"🇺🇸", country:"ארה״ב",   title:"Leonardo DRS",               url:"https://www.leonardodrs.com",                       oneLiner:"Counter-UAS + Sensors — נוכחות ישראלית קיימת, כניסה מהירה.",          why:"Leonardo DRS מתמחה ב-Counter-UAS ו-Sensors — נוכחות ישראלית קיימת, Aerosentry fit מושלם.",          signal:"השיקה פלטפורמת C-UAS חדשה לצבא האמריקאי — 2024",                   status:"לפנות",    priority:"high",   fit:96 },
  { id:"p9",  type:"integrator", flag:"🇩🇪", country:"גרמניה",  title:"Rheinmetall AG",             url:"https://www.rheinmetall.com/en/markets/defence",    oneLiner:"שער לשוק הגנה האירופי עם תיאבון רכישה פעיל.",                         why:"Rheinmetall אינטגרטור הגנה מוביל באירופה עם תיאבון M&A — Aerosentry ו-Sky Fort לאירופה כולה.",     signal:"הכריזה על תוכנית שיתופי פעולה ישראלים — פברואר 2025",              status:"בתהליך",   priority:"high",   fit:93 },
  { id:"p10", type:"integrator", flag:"🇩🇪", country:"גרמניה",  title:"Hensoldt AG",                url:"https://www.hensoldt.net/markets/defence",           oneLiner:"Sensors ו-Radar לנאטו — השלמה מדויקת ל-Daya ו-GuaRdF.",             why:"Hensoldt מתמחה ב-Sensors ו-Radar לנאטו — Daya IRIS-20 ו-GuaRdF משלימים את הפורטפוליו שלהם.",      signal:"פרסמה RFI Drone Detection Systems — ינואר 2025",                   status:"לפנות",    priority:"medium", fit:87 },
  { id:"p11", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Axon Enterprise (Dedrone)",  url:"https://www.axon.com/products/dedrone",             oneLiner:"רכשה Dedrone ומחפשת עוד — Aerosentry הוא המועמד הבא.",               why:"Axon רכשה Dedrone ב-2024 — מחפשת טכנולוגיה ישראלית נוספת ב-C-UAS. Aerosentry = target מושלם.",     signal:"רכשה Dedrone ב-$250M — הכריזה על הרחבה ישראלית",                  status:"לפנות",    priority:"high",   fit:95 },
  { id:"p12", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Ondas Holdings",             url:"https://www.ondasholdings.com",                     oneLiner:"כבר קנתה חברה ישראלית — מודל רכישה מוכח ורלוונטי.",                  why:"Ondas רכשה Sentrycs הישראלית ב-$200M — פעילה ברכישות defense tech ישראלי. מודל מוכח.",              signal:"רכשה Sentrycs הישראלית ב-$200M — ספטמבר 2024",                     status:"לחקור",    priority:"high",   fit:91 },
  { id:"p13", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Shield AI",                  url:"https://www.shield.ai",                             oneLiner:"Autonomous AI ל-DoD — Crebain ו-iCit על הרדאר שלהם.",               why:"Shield AI מובילה Autonomous AI ל-DoD — Crebain ו-iCit יכולים להיות רכישה או שותפות אסטרטגית.",     signal:"גייסה $200M Series F — מחפשת רכישות AI defense",                  status:"לחקור",    priority:"medium", fit:88 },
  { id:"p14", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Palantir Technologies",      url:"https://www.palantir.com/platforms/aip",             oneLiner:"AI Defense platform מחפשת sensors ישראלי — iCit = fit.",             why:"Palantir מחפשת שותפות עם חברות sensors ו-ISR ישראליות — iCit ו-Visual Layer fit מדויק.",            signal:"השיקה AIP for Defense — מחפשת שותפי data ו-sensors",               status:"לחקור",    priority:"medium", fit:84 },
  { id:"p15", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"RedWire",                    url:"https://redwirespace.com/markets/defense",           oneLiner:"CVC arm פעיל ב-defense tech — DFM Power מתאים לתיק.",               why:"RedWire פעילה ב-M&A defense tech עם CVC arm — DFM Power ו-Autonomous Systems על הרדאר.",            signal:"רכשה Edge Autonomy ב-$925M — ממשיכה לחפש",                          status:"לחקור",    priority:"medium", fit:79 },

  // ── חברות קטנות ומתפתחות — עדיפות גבוהה ────────────────────────────────────
  { id:"p16", type:"integrator", flag:"🇩🇪", country:"גרמניה",  title:"Helsing AI",                 url:"https://helsing.ai",                                oneLiner:"AI לביטחון — הסטארטאפ הכי חם באירופה, מחפש שותפי sensors.",          why:"Helsing גייסה €600M ועובדת עם Saab ו-Eurofighter — מחפשת שותפי sensors ו-ISR. Daya ו-iCit = fit מושלם.",  signal:"גייסה €600M — הכריזה על בניית hardware layer חדש, מחפשת partners",  status:"לפנות",    priority:"high",   fit:91 },
  { id:"p17", type:"integrator", flag:"🇩🇪", country:"גרמניה",  title:"Quantum Systems",            url:"https://www.quantum-systems.com",                   oneLiner:"דרונים ו-AI לשדה קרב — צמיחה מ-€100M ל-€300M, פתוחים לישראל.",     why:"Quantum Systems גדלה 3x ב-2025 ומפתחת AI לניהול שדה קרב — Crebain ו-Daya IRIS-20 משלימים את הפלטפורמה שלהם.", signal:"מתכננת גיוס €3B valuation — מחפשת שותפי טכנולוגיה בישראל",          status:"לפנות",    priority:"high",   fit:88 },
  { id:"p18", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"AeroVironment (AV)",         url:"https://www.avinc.com",                             oneLiner:"IDIQ $874M C-UAS ל-FMS — שותף מפתח לשווקי NATO ובעלי ברית.",       why:"AV זכתה ב-IDIQ $874M ל-Foreign Military Sales של C-UAS — שיתוף פעולה פותח גישה לכל לקוחות FMS של הצבא האמריקאי.", signal:"זכתה IDIQ $874M Army FMS C-UAS — דצמבר 2025",                       status:"לפנות",    priority:"high",   fit:93 },
  { id:"p19", type:"integrator", flag:"🇺🇸", country:"ארה״ב",   title:"Kutta Technologies",         url:"https://www.kuttatech.com",                         oneLiner:"Multi-domain controller לכל UAS — platform פתוח שמחפש יכולות ISR.", why:"Kutta פיתחה KTAC 2.0 — controller טקטי שמפעיל כל UAS ביבשה, ים ואוויר. Daya ו-Aerosentry יכולים להשתלב ישירות.", signal:"השיקה KTAC 2.0 — נבחרה למוצר הבולט ב-DefenseAdvancement 2025",      status:"לחקור",    priority:"medium", fit:84 },
  { id:"p20", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Slingshot Aerospace",        url:"https://www.slingshotaerospace.com",                 oneLiner:"Space domain awareness + AI — מחפשת שותפי sensors ו-ISR.",           why:"Slingshot מפתחת AI לניהול תנועה ומודיעין בחלל ובאוויר — iCit ו-Visual Layer מתאימים לפלטפורמת הנתונים שלהם.", signal:"גייסה Series B 2024 — הרחבה לשוק הביטחוני",                         status:"לחקור",    priority:"medium", fit:78 },
  { id:"p21", type:"integrator", flag:"🇺🇸", country:"ארה״ב",   title:"Joby Defense / Joby Aviation", url:"https://www.jobyaviation.com/defense",             oneLiner:"eVTOL לשדה קרב — מחפשת שותפי autonomy ו-sensors לאינטגרציה.",      why:"Joby Defense פיתחה eVTOL לצבא האמריקאי ומחפשת שותפי autonomy — Crebain ו-DFM Power = שילוב מושלם לkilowatt platform.", signal:"זכתה בחוזה DoD לeVTOL — מחפשת שותפי payload ו-autonomy",            status:"לחקור",    priority:"medium", fit:82 },
  { id:"p22", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Performance Drone Works (PDW)", url:"https://performancedroneworks.com",              oneLiner:"C100 heavy-lift drone + Army contracts — פתוחים לאינטגרציה ישראלית.", why:"PDW זכתה ב-$15.3M מהצבא האמריקאי ל-C100 heavy-lift — DFM Power ו-autonomous payload integration = fit ברור.", signal:"זכתה $15.3M Army contracts — מחפשת שותפי payload ו-power",          status:"לחקור",    priority:"medium", fit:81 },
  { id:"p23", type:"integrator", flag:"🇩🇪", country:"גרמניה",  title:"ESG Elektroniksystem (Hensoldt Group)", url:"https://www.esg.de/en/defense",            oneLiner:"C-UAS integrator בנאטו — חלק מ-Hensoldt, מחפש טכנולוגיה ישראלית.",  why:"ESG התמחתה ב-C-UAS ב-NATO 12 שנים ועברה ל-Hensoldt ב-2024 — ערוץ ישיר לפרויקטי C-UAS גרמניים עם Aerosentry ו-Sky Fort.", signal:"הצטרפה ל-Hensoldt Group 2024 — ממשיכה כיחידה עצמאית עם תקציב C-UAS",  status:"לפנות",    priority:"high",   fit:90 },
  { id:"p24", type:"ma",         flag:"🇺🇸", country:"ארה״ב",   title:"Mistral Inc.",               url:"https://www.mistralsolutions.com",                  oneLiner:"הוציאה לפועל $982M deal ל-DoD עם UVision — מסלול מוכח לחברות ישראליות.", why:"Mistral סיפקה suicide drones ישראלים של UVision לצבא האמריקאי ב-$982M — מודל מוכח לקחת מוצר ישראלי ל-DoD דרך US entity.", signal:"סגרה $982M deal UVision לArmy — ממשיכה לחפש מוצרים ישראלים לשיווק",  status:"לפנות",    priority:"high",   fit:94 },
  { id:"p25", type:"integrator", flag:"🇺🇸", country:"ארה״ב",   title:"Galvion",                    url:"https://www.galvion.com",                           oneLiner:"IDIQ $131M USMC — soldier systems integrator עם פלטפורמת power.",    why:"Galvion זכתה ב-IDIQ $131M ל-USMC ומתמחה ב-soldier power וsystems — DFM Power מתאים לפלטפורמת ה-wearable energy שלהם.", signal:"זכתה IDIQ $131M USMC Helmet System — 2025",                          status:"לחקור",    priority:"medium", fit:83 },
];

const statusColor={"לפנות":"#22c55e","בתהליך":"#3b82f6","לחקור":"#f59e0b","פעיל":"#a855f7"};

function PartnershipCard({p}){
  const [expanded,setExpanded]=useState(false);
  const t=PARTNERSHIP_TYPES[p.type];
  const sc=statusColor[p.status]||"#475569";
  const fc=fitCol(p.fit);
  return (
    <div style={{background:"#0f172a",borderRadius:"10px",padding:"18px",border:`1px solid ${t.color}20`,borderRight:`3px solid ${t.color}`,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:13}}>{p.flag}</span>
            <span style={{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${t.color}50`,background:`${t.color}15`,color:t.color,fontFamily:""Roboto Mono",monospace"}}>{t.icon} {t.label}</span>
            <span style={{fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${sc}50`,background:`${sc}15`,color:sc,fontFamily:""Roboto Mono",monospace"}}>{p.status}</span>
          </div>
          <div style={{fontSize:"14px",fontWeight:800,color:"#f1f5f9",marginBottom:5}}>{p.title}</div>
          <div style={{fontSize:"12px",color:"#94a3b8",fontStyle:"italic",lineHeight:1.5,borderRight:`2px solid ${t.color}`,paddingRight:8}}>{p.oneLiner}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,marginRight:8,flexShrink:0}}>
          <div style={{width:38,height:38,borderRadius:"50%",border:`2px solid ${fc}`,background:`${fc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:fc,fontFamily:""Roboto Mono",monospace"}}>{p.fit}</div>
          <div style={{fontSize:"8px",color:"#334155"}}>fit</div>
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#052e16,#064e3b)",border:"1px solid #16a34a35",borderRadius:"7px",padding:"8px 11px"}}>
        <div style={{fontSize:"9px",color:"#4ade80",fontWeight:700,marginBottom:3}}>🎯 מדוע רלוונטי לגבעון</div>
        <div style={{fontSize:"11px",color:"#86efac",lineHeight:1.6}}>{p.why}</div>
      </div>
      <div style={{background:"#0c1a2e",border:"1px solid #1e40af25",borderRadius:"6px",padding:"7px 11px",display:"flex",gap:6,alignItems:"flex-start"}}>
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
             "לחקור CVC arm שלהם ולשלוח executive summary. להבין timeline ו-criteria לרכישה. לנצל קשרים ישראלים משותפים להיכרות חמה."}
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

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
        {[
          ["🎯 עדיפות גבוהה",PARTNERSHIPS.filter(p=>p.priority==="high").length,"#ef4444"],
          ["📋 IDIQ & Primes",counts.idiq,"#3b82f6"],
          ["⚙️ Integrators",counts.integrator,"#a855f7"],
          ["🤝 M&A",counts.ma,"#f97316"],
          ["📬 לפנות",PARTNERSHIPS.filter(p=>p.status==="לפנות").length,"#22c55e"],
          ["⚡ בתהליך",PARTNERSHIPS.filter(p=>p.status==="בתהליך").length,"#fbbf24"],
        ].map(([label,val,color])=>(
          <div key={label} style={{background:"#0a0f1e",border:`1px solid ${color}20`,borderTop:`2px solid ${color}`,borderRadius:"8px",padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:"22px",fontWeight:800,color,fontFamily:""Roboto Mono",monospace",lineHeight:1}}>{val}</div>
            <div style={{fontSize:"9px",color:"#334155",marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Type explanation */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10,marginBottom:20}}>
        {Object.entries(PARTNERSHIP_TYPES).map(([key,t])=>(
          <div key={key} style={{background:"#0a0f1e",border:`1px solid ${t.color}20`,borderRight:`3px solid ${t.color}`,borderRadius:"8px",padding:"12px 14px"}}>
            <div style={{fontSize:"12px",fontWeight:700,color:t.color,marginBottom:3}}>{t.icon} {t.label}</div>
            <div style={{fontSize:"11px",color:"#64748b"}}>{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
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

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(390px,1fr))",gap:14}}>
        {filtered.map(p=><PartnershipCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("briefing"); // "briefing" | "catalog"
  const [activeCat,setActiveCat]=useState("contracts");
  const [data,setData]=useState(ITEMS);
  const [countryFilter,setCountryFilter]=useState(null);

  const update=(cat,id,ch)=>setData(p=>({...p,[cat]:p[cat].map(o=>o.id===id?{...o,...ch}:o)}));

  const filterByCountry = (items) => {
    if(!countryFilter) return items;
    return items.filter(i=>i.country===countryFilter||i.flag===countryFilter);
  };

  const critical=data.contracts.filter(i=>i.urgency==="critical").length+data.grants.filter(i=>i.urgency==="critical").length;

  return (
    <div style={{minHeight:"100vh",background:"#020617",color:"#e2e8f0",fontFamily:"'Inter','Segoe UI',Tahoma,sans-serif",direction:"rtl"}}>

      {/* ── Header ── */}
      <div style={{background:"rgba(10,15,30,0.75)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 24px",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Logo/>
            <div style={{width:1,height:24,background:"#1e293b"}}/>
            {/* ניווט */}
            {[["briefing","📊 בריפינג יומי"],["catalog","📋 קטלוג"],["trends","📈 מגמות"],["partnerships","🎯 שותפויות"]].map(([v,label])=>(
              <button key={v} onClick={()=>setView(v)} style={{background:view===v?"rgba(0,242,254,0.08)":"transparent",border:"none",borderBottom:view===v?"2px solid #00f2fe":"2px solid transparent",color:view===v?"#e2e8f0":"#475569",padding:"0 16px",height:60,fontSize:"13px",fontWeight:view===v?700:400,cursor:"pointer",transition:"all .2s",textShadow:view===v?"0 0 12px rgba(0,242,254,0.9)":"none",boxShadow:view===v?"inset 0 -3px 12px rgba(0,242,254,0.15), 0 0 20px rgba(0,242,254,0.05)":"none",borderRadius:"4px 4px 0 0",letterSpacing:"0.4px"}}>{label}</button>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"center",gap:20}}>
            {[
              ["🔴 קריטי", critical, "#f87171"],
              ["🎯 Fit 85+", Object.values(data).flat().filter(i=>i.fitScore>=85).length, "#22c55e"],
              ["⭐ אסטרטגי", Object.values(data).flat().filter(i=>i.bookmarked).length, "#fbbf24"],
              ["📊 פעיל", [...data.contracts,...data.grants].filter(i=>i.status!=="בוטל").length, "#38bdf8"],
            ].map(([label,val,color])=>(
              <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                <div style={{fontSize:"18px",fontWeight:800,color,fontFamily:""Roboto Mono",monospace",lineHeight:1}}>{val}</div>
                <div style={{fontSize:"9px",color:"#334155",letterSpacing:"0.05em"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Daily Briefing ── */}
      {view==="briefing" && <DailyBriefing data={data}/>}

      {/* ── Trends ── */}
      {view==="trends" && <TrendsView/>}

      {/* ── Partnerships ── */}
      {view==="partnerships" && <PartnershipOpportunities/>}

      {/* ── Catalog ── */}
      {view==="catalog" && (
        <div style={{maxWidth:1300,margin:"0 auto",padding:"20px 24px"}}>
          {/* Category tabs */}
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            {CATEGORIES.map(cat=>{
              const count=filterByCountry(data[cat.id]).length;
              const on=activeCat===cat.id;
              return (
                <button key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{background:on?"#1e3a5f":"#0a0f1e",border:`1px solid ${on?"#3b82f6":"#1e293b"}`,color:on?"#60a5fa":"#475569",padding:"7px 14px",borderRadius:"8px",fontSize:"12px",fontWeight:on?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all .15s"}}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                  <span style={{background:on?"#1d3a60":"#1e293b",color:on?"#60a5fa":"#475569",fontSize:"10px",padding:"1px 5px",borderRadius:"8px",fontFamily:""Roboto Mono",monospace"}}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* דגלי מדינות */}
          <div style={{display:"flex",gap:5,marginBottom:20,alignItems:"center"}}>
            <div style={{fontSize:"10px",color:"#334155",marginLeft:4}}>סנן לפי מדינה:</div>
            {ALL_COUNTRIES.map(({flag,label})=>(
              <button key={flag} onClick={()=>setCountryFilter(countryFilter===label?null:label)}
                title={label}
                style={{background:countryFilter===label?"#1e3a5f":"transparent",border:`1px solid ${countryFilter===label?"#3b82f6":"#1e293b"}`,borderRadius:"6px",padding:"4px 8px",fontSize:"16px",cursor:"pointer",transition:"all .15s",lineHeight:1,display:"flex",alignItems:"center",gap:4}}>
                {flag}
                {countryFilter===label&&<span style={{fontSize:"9px",color:"#60a5fa",fontFamily:""Roboto Mono",monospace"}}>{label}</span>}
              </button>
            ))}
            {countryFilter&&<button onClick={()=>setCountryFilter(null)} style={{background:"transparent",border:"1px solid #334155",borderRadius:"6px",padding:"3px 9px",fontSize:"10px",color:"#475569",cursor:"pointer"}}>✕ נקה</button>}
          </div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(390px,1fr))",gap:14}}>
            {activeCat==="contracts"&&filterByCountry(data.contracts).map(i=><ContractCard key={i.id} item={i} onUpdate={(id,ch)=>update("contracts",id,ch)}/>)}
            {activeCat==="partners"&&filterByCountry(data.partners).map(i=><PartnerCard key={i.id} item={i}/>)}
            {activeCat==="investors"&&filterByCountry(data.investors).map(i=><InvestorCard key={i.id} item={i}/>)}
            {activeCat==="grants"&&filterByCountry(data.grants).map(i=><GrantCard key={i.id} item={i}/>)}
            {activeCat==="ventures"&&data.ventures.map(i=><VentureCard key={i.id} item={i}/>)}
            {activeCat==="competitors"&&filterByCountry(data.competitors).map(i=><CompetitorCard key={i.id} item={i}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
