import { useState, useEffect } from "react";

// ══════════════════════════════════════════════
//  CONFIG  —  ใส่ URL จาก Google Apps Script
// ══════════════════════════════════════════════
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyq4suRTCJdUQUJjeNhgXYBzMmmmiT8GXkVOsMSMl8teyAj9GNyWT2GCEIIpasIEM28/exec";
const IS_MOCK = false; //SCRIPT_URL === "https://script.google.com/macros/s/AKfycbyq4suRTCJdUQUJjeNhgXYBzMmmmiT8GXkVOsMSMl8teyAj9GNyWT2GCEIIpasIEM28/exec";

const SH = {
  rooms:    "ห้องพัก",
  tenants:  "ผู้เช่า",
  bills:    "บิลค่าเช่า",
  income:   "รายรับ",
  expense:  "รายจ่าย",
  accounts: "บัญชีธนาคาร",
};

// ══════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════
const T = {
  bg:"#F5F4F0", card:"#FFFFFF",
  pri:"#1A3C5E", priL:"#2A5282",
  acc:"#C8922A", accL:"#E8A830",
  ok:"#1E7E4A", err:"#B91C1C",
  txt:"#1A1A1A", muted:"#6B7280",
  border:"#E2DDD6",
  sh:"0 2px 10px rgba(0,0,0,0.07)",
  shH:"0 6px 22px rgba(0,0,0,0.13)",
};

// ══════════════════════════════════════════════
//  CSS
// ══════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'Sarabun',sans-serif;background:${T.bg};color:${T.txt};font-size:18px;line-height:1.6}
.wrap{min-height:100vh;max-width:920px;margin:0 auto;padding-bottom:84px}
.hdr{background:${T.pri};color:#fff;padding:18px 20px 14px;position:sticky;top:0;z-index:100;box-shadow:0 2px 14px rgba(0,0,0,.22)}
.hdr-row{display:flex;align-items:center;justify-content:space-between}
.hdr-title{font-size:21px;font-weight:800}
.hdr-sub{font-size:13px;opacity:.72;margin-top:2px}
.hdr-date{font-size:13px;opacity:.78;text-align:right}
.bnav{position:fixed;bottom:0;left:0;right:0;background:${T.pri};display:flex;z-index:100;box-shadow:0 -2px 12px rgba(0,0,0,.18)}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;padding:9px 4px 11px;cursor:pointer;border:none;background:transparent;color:rgba(255,255,255,.5);font-family:'Sarabun',sans-serif;font-size:12px;transition:color .18s;gap:3px}
.bni.on{color:#F4C842}.bni:hover{color:#fff}
.bni-ic{font-size:23px;line-height:1}
.card{background:${T.card};border-radius:16px;box-shadow:${T.sh};padding:20px;margin:14px 14px 0}
.card-t{font-size:19px;font-weight:700;color:${T.pri};margin-bottom:14px}
.sec-hdr{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.muted};padding:18px 14px 6px}
.pg{padding-bottom:20px}
.sbox{background:${T.card};border-radius:14px;padding:16px;box-shadow:${T.sh};text-align:center}
.snum{font-size:32px;font-weight:800;line-height:1.1}
.slbl{font-size:13px;color:${T.muted};margin-top:3px}
.sg{color:${T.ok}}.sr2{color:${T.err}}.sa{color:${T.acc}}.sb{color:#2563EB}
.sgrid2{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:14px 14px 0}
@media(min-width:560px){.sgrid2{grid-template-columns:repeat(4,1fr)}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:13px 18px;border-radius:12px;border:none;font-family:'Sarabun',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:all .18s;min-height:50px;white-space:nowrap}
.btn-pri{background:${T.pri};color:#fff}.btn-pri:hover{background:${T.priL};transform:translateY(-1px)}
.btn-acc{background:${T.acc};color:#fff}.btn-acc:hover{background:${T.accL}}
.btn-ok{background:${T.ok};color:#fff}
.btn-err{background:${T.err};color:#fff}
.btn-out{background:transparent;border:2px solid ${T.pri};color:${T.pri}}
.btn-full{width:100%}
.btn-sm{padding:7px 13px;font-size:14px;min-height:38px;border-radius:9px}
.btn-row{display:flex;gap:10px;margin-top:14px}
.btn-row .btn{flex:1}
.fg{margin-bottom:16px}
.fl{display:block;font-size:15px;font-weight:600;color:${T.txt};margin-bottom:5px}
.fi,.fs,.fta{width:100%;padding:13px 15px;border:2px solid ${T.border};border-radius:12px;font-family:'Sarabun',sans-serif;font-size:16px;color:${T.txt};background:#fff;transition:border-color .18s;-webkit-appearance:none}
.fi:focus,.fs:focus,.fta:focus{outline:none;border-color:${T.pri}}
.fta{min-height:76px;resize:vertical}
.fg2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.li{display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid ${T.border};gap:12px}
.li:last-child{border:none}
.li-l{flex:1;min-width:0}
.lt{font-size:16px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ls{font-size:13px;color:${T.muted};margin-top:1px}
.badge{display:inline-block;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600}
.bg-g{background:#DCFCE7;color:#166534}.bg-r{background:#FEE2E2;color:#991B1B}
.bg-y{background:#FEF9C3;color:#854D0E}.bg-gray{background:#F3F4F6;color:#374151}
.bg-b{background:#DBEAFE;color:#1E40AF}
.mover{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;animation:fi .18s}
.mbox{background:#fff;border-radius:24px 24px 0 0;width:100%;max-height:92vh;overflow-y:auto;padding:22px 18px 44px;animation:su .28s ease-out}
.mt{font-size:21px;font-weight:700;color:${T.pri};margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
.mcl{background:#F3F4F6;border:none;border-radius:50%;width:35px;height:35px;font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sr-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid ${T.border};font-size:16px}
.sr-row:last-child{border:none;font-weight:700;font-size:18px}
.tabs{display:flex;gap:0;margin:14px 14px 0;background:#EEECE8;border-radius:12px;padding:4px}
.tab{flex:1;padding:9px 6px;border:none;border-radius:9px;font-family:'Sarabun',sans-serif;font-size:15px;font-weight:600;cursor:pointer;background:transparent;color:${T.muted};transition:all .18s}
.tab.on{background:#fff;color:${T.pri};box-shadow:0 1px 5px rgba(0,0,0,.1)}
.rgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 14px;margin-top:14px}
@media(min-width:560px){.rgrid{grid-template-columns:repeat(3,1fr)}}
.rc{background:#fff;border-radius:14px;padding:14px;box-shadow:${T.sh};cursor:pointer;transition:all .2s;border:2px solid transparent}
.rc:hover{box-shadow:${T.shH};transform:translateY(-2px)}
.rc.occ{border-color:${T.ok}}.rc.vac{border-color:${T.border}}.rc.maint{border-color:${T.err}}
.rn{font-size:21px;font-weight:800;color:${T.pri}}
.rt{font-size:13px;color:${T.muted};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr{font-size:14px;font-weight:600;color:${T.acc};margin-top:3px}
.acc-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;border:1.5px solid;margin-top:3px}
.alert{padding:13px 16px;border-radius:12px;font-size:15px;margin:10px 14px 0;display:flex;align-items:center;gap:9px}
.al-ok{background:#DCFCE7;color:#166534}
.al-err{background:#FEE2E2;color:#991B1B}
.al-info{background:#DBEAFE;color:#1E40AF}
.spin-wrap{position:fixed;inset:0;background:rgba(255,255,255,.86);z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}
.spin{width:46px;height:46px;border:5px solid ${T.border};border-top-color:${T.pri};border-radius:50%;animation:sp .75s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:38px 20px;color:${T.muted}}
.empty-ic{font-size:46px;margin-bottom:10px}
.hero-card{background:${T.pri};color:#fff;border-radius:16px;padding:20px;margin:14px 14px 0;box-shadow:${T.shH}}
.color-dot{width:14px;height:14px;border-radius:50%;display:inline-block;flex-shrink:0}
`;

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════
const fmt = n => n == null ? "—" : Number(n).toLocaleString("th-TH") + " ฿";
const now = () => new Date().toLocaleDateString("th-TH",{day:"numeric",month:"long",year:"numeric"});
const mth = () => new Date().toLocaleDateString("th-TH",{month:"long",year:"numeric"});
const uid = p => `${p}${Date.now()}`;

// ══════════════════════════════════════════════
//  SHEET API
// ══════════════════════════════════════════════
const shRead   = sh => fetch(`${SCRIPT_URL}?action=read&sheet=${encodeURIComponent(sh)}`).then(r=>r.json()).then(d=>d.rows||[]).catch(()=>[]);
const shAppend = (sh,row) => fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"append",sheet:sh,row})}).then(r=>r.json()).catch(()=>({ok:false}));
const shUpdate = (sh,id,row) => fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"update",sheet:sh,id,row})}).then(r=>r.json()).catch(()=>({ok:false}));
const shDelete = (sh,id) => fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"delete",sheet:sh,id})}).then(r=>r.json()).catch(()=>({ok:false}));

// ══════════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════════
const MOCK = {
  accounts:[
    {id:"A001",name:"กสิกรไทย",number:"123-4-56789-0",type:"ออมทรัพย์",color:"#138A36",note:"บัญชีหลัก"},
    {id:"A002",name:"ไทยพาณิชย์",number:"400-1-23456-7",type:"กระแสรายวัน",color:"#4F2D8C",note:"บัญชีค่าใช้จ่าย"},
    {id:"A003",name:"กรุงเทพ",number:"050-9-87654-3",type:"ออมทรัพย์",color:"#003087",note:"สำรอง"},
  ],
  rooms:[
    {id:"R001",roomNumber:"101",floor:"1",type:"1 ห้องนอน",rent:3500,status:"occupied",tenantId:"T001",waterRate:20,electricRate:7},
    {id:"R002",roomNumber:"102",floor:"1",type:"สตูดิโอ",rent:2800,status:"occupied",tenantId:"T002",waterRate:20,electricRate:7},
    {id:"R003",roomNumber:"103",floor:"1",type:"สตูดิโอ",rent:2800,status:"vacant",tenantId:"",waterRate:20,electricRate:7},
    {id:"R004",roomNumber:"201",floor:"2",type:"1 ห้องนอน",rent:3800,status:"occupied",tenantId:"T003",waterRate:20,electricRate:7},
    {id:"R005",roomNumber:"202",floor:"2",type:"สตูดิโอ",rent:3000,status:"maintenance",tenantId:"",waterRate:20,electricRate:7},
    {id:"R006",roomNumber:"203",floor:"2",type:"1 ห้องนอน",rent:3800,status:"vacant",tenantId:"",waterRate:20,electricRate:7},
  ],
  tenants:[
    {id:"T001",name:"สมชาย ใจดี",phone:"081-234-5678",roomId:"R001",roomNumber:"101",moveIn:"01/01/2568",idCard:"1-2345-67890-12-3"},
    {id:"T002",name:"สุดา มีสุข",phone:"089-876-5432",roomId:"R002",roomNumber:"102",moveIn:"15/02/2568",idCard:"1-3456-78901-23-4"},
    {id:"T003",name:"วิชัย รักดี",phone:"062-111-2222",roomId:"R004",roomNumber:"201",moveIn:"01/03/2568",idCard:"1-4567-89012-34-5"},
  ],
  bills:[
    {id:"B001",roomNumber:"101",tenantName:"สมชาย ใจดี",month:"มีนาคม 2568",rent:3500,water:120,electric:350,extra:0,total:3970,status:"paid",paidDate:"05/04/2568",accountId:"A001"},
    {id:"B002",roomNumber:"102",tenantName:"สุดา มีสุข",month:"เมษายน 2568",rent:2800,water:80,electric:280,extra:0,total:3160,status:"unpaid",paidDate:"",accountId:""},
    {id:"B003",roomNumber:"201",tenantName:"วิชัย รักดี",month:"เมษายน 2568",rent:3800,water:100,electric:420,extra:0,total:4320,status:"paid",paidDate:"03/04/2568",accountId:"A001"},
  ],
  income:[
    {id:"I001",date:"01/04/2568",category:"ค่ามัดจำ",description:"ค่ามัดจำห้อง 203",amount:3800,accountId:"A001",note:""},
    {id:"I002",date:"05/04/2568",category:"ค่าที่จอดรถ",description:"ค่าที่จอดรถ เมษายน",amount:500,accountId:"A001",note:""},
  ],
  expense:[
    {id:"E001",date:"01/04/2568",category:"ซ่อมแซม",description:"ซ่อมท่อน้ำห้อง 202",amount:800,accountId:"A002",note:""},
    {id:"E002",date:"03/04/2568",category:"ค่าไฟส่วนกลาง",description:"ค่าไฟบันได ล็อบบี้",amount:450,accountId:"A002",note:""},
    {id:"E003",date:"05/04/2568",category:"ทำความสะอาด",description:"ค่าจ้างทำความสะอาด",amount:600,accountId:"A002",note:""},
  ],
};

// ══════════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════════
function Modal({title,onClose,children}){
  return(
    <div className="mover" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div className="mt">{title}<button className="mcl" onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

function AccBadge({accountId,accounts}){
  const a=accounts.find(x=>x.id===accountId);
  if(!a) return null;
  return(
    <span className="acc-chip" style={{color:a.color,borderColor:a.color,background:a.color+"20"}}>
      <span className="color-dot" style={{background:a.color}}/>{a.name}
    </span>
  );
}

function AccSelect({value,onChange,accounts,label="บัญชีที่รับ/จ่าย *"}){
  return(
    <div className="fg">
      <label className="fl">{label}</label>
      <select className="fs" value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">— เลือกบัญชี —</option>
        {accounts.map(a=>(
          <option key={a.id} value={a.id}>{a.name} · {a.number} ({a.type})</option>
        ))}
      </select>
    </div>
  );
}

function parseCSV(text){
  const lines=text.trim().split(/\r?\n/).filter(l=>l.trim());
  if(lines.length===0) return [];
  const parseLine=line=>{
    const fields=[];
    let field="";
    let inQuotes=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(inQuotes && line[i+1]==='"'){ field+='"'; i++; }
        else { inQuotes=!inQuotes; }
      } else if(ch===',' && !inQuotes){
        fields.push(field); field="";
      } else {
        field+=ch;
      }
    }
    fields.push(field);
    return fields.map(v=>v.trim());
  };
  const headers=parseLine(lines[0]).map(h=>h.trim());
  return lines.slice(1).map(line=>{
    const values=parseLine(line);
    const item={};
    headers.forEach((h,i)=>item[h]=values[i]||"");
    return item;
  });
}

async function bulkAppend(sheet,rows){
  for(const row of rows){
    await shAppend(sheet,row);
  }
}

// ══════════════════════════════════════════════
//  PAGE: DASHBOARD
// ══════════════════════════════════════════════
function Dashboard({data}){
  const occupied=data.rooms.filter(r=>r.status==="occupied").length;
  const vacant=data.rooms.filter(r=>r.status==="vacant").length;
  const totInc=data.income.reduce((s,i)=>s+Number(i.amount||0),0);
  const totExp=data.expense.reduce((s,e)=>s+Number(e.amount||0),0);
  const profit=totInc-totExp;

  const accSum=data.accounts.map(a=>({
    ...a,
    inc: data.income.filter(i=>i.accountId===a.id).reduce((s,i)=>s+Number(i.amount||0),0),
    exp: data.expense.filter(e=>e.accountId===a.id).reduce((s,e)=>s+Number(e.amount||0),0),
  }));

  return(
    <div className="pg">
      <div className="hero-card">
        <div style={{fontSize:13,opacity:.75}}>{mth()} · รายรับรวมทุกบัญชี</div>
        <div style={{fontSize:36,fontWeight:800,margin:"4px 0"}}>{fmt(totInc)}</div>
        <div style={{display:"flex",gap:20,marginTop:8,flexWrap:"wrap",fontSize:14,opacity:.88}}>
          <span>💸 รายจ่าย {fmt(totExp)}</span>
          <span style={{fontWeight:700,color:profit>=0?"#86EFAC":"#FCA5A5"}}>🏦 กำไร {fmt(profit)}</span>
        </div>
      </div>

      <div className="sgrid2">
        <div className="sbox"><div className="snum sg">{occupied}</div><div className="slbl">ห้องมีผู้เช่า</div></div>
        <div className="sbox"><div className="snum sb">{vacant}</div><div className="slbl">ห้องว่าง</div></div>
        <div className="sbox"><div className="snum sa">{data.income.length}</div><div className="slbl">รายการรายรับ</div></div>
        <div className="sbox"><div className="snum sr2">{data.expense.length}</div><div className="slbl">รายการรายจ่าย</div></div>
      </div>

      <div className="sec-hdr">🏦 ยอดแยกตามบัญชี</div>
      <div className="card">
        {accSum.map(a=>(
          <div className="li" key={a.id}>
            <div style={{width:42,height:42,borderRadius:10,background:a.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,flexShrink:0}}>{a.name[0]}</div>
            <div className="li-l">
              <div className="lt">{a.name}</div>
              <div className="ls">{a.number} · {a.type}</div>
              <div style={{fontSize:12,marginTop:2}}>
                รับ <b style={{color:T.ok}}>{fmt(a.inc)}</b>&nbsp;|&nbsp;จ่าย <b style={{color:T.err}}>{fmt(a.exp)}</b>
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:800,fontSize:17,color:a.inc-a.exp>=0?T.ok:T.err}}>{fmt(a.inc-a.exp)}</div>
              <div style={{fontSize:11,color:T.muted}}>คงเหลือ</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: ACCOUNTS (จัดการบัญชีธนาคาร)
// ══════════════════════════════════════════════
const PALETTE=["#138A36","#4F2D8C","#003087","#C8922A","#B91C1C","#1E40AF","#0F766E","#6D28D9","#B45309","#374151"];
const ACC_TYPES=["ออมทรัพย์","กระแสรายวัน","ฝากประจำ","อื่นๆ"];

function Accounts({data,onRefresh,showAlert}){
  const empty={name:"",number:"",type:"ออมทรัพย์",color:PALETTE[0],note:""};
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState(empty);

  async function save(){
    if(!form.name||!form.number){showAlert("กรุณากรอกชื่อบัญชีและเลขบัญชี","err");return;}
    if(modal==="edit"){
      await shUpdate(SH.accounts,form.id,form);
      showAlert("แก้ไขบัญชีแล้ว ✓");
    } else {
      await shAppend(SH.accounts,[uid("A"),form.name,form.number,form.type,form.color,form.note]);
      showAlert("เพิ่มบัญชีเรียบร้อย ✓");
    }
    setModal(null); setForm(empty); onRefresh();
  }

  async function del(a){
    if(!window.confirm(`ลบบัญชี "${a.name}" ใช่ไหม?\nรายการที่ผูกกับบัญชีนี้จะยังคงอยู่`)) return;
    await shDelete(SH.accounts,a.id);
    showAlert("ลบบัญชีแล้ว"); onRefresh();
  }

  return(
    <div className="pg">
      <div style={{padding:"14px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:19,fontWeight:700,color:T.pri}}>บัญชีธนาคาร ({data.accounts.length} บัญชี)</div>
        <button className="btn btn-pri btn-sm" onClick={()=>{setForm(empty);setModal("add")}}>+ เพิ่มบัญชี</button>
      </div>

      <div className="card">
        {data.accounts.length===0&&<div className="empty"><div className="empty-ic">🏦</div><div>ยังไม่มีบัญชี</div></div>}
        {data.accounts.map(a=>{
          const inc=data.income.filter(i=>i.accountId===a.id).reduce((s,i)=>s+Number(i.amount||0),0);
          const exp=data.expense.filter(e=>e.accountId===a.id).reduce((s,e)=>s+Number(e.amount||0),0);
          return(
            <div className="li" key={a.id}>
              <div style={{width:46,height:46,borderRadius:12,background:a.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,flexShrink:0}}>{a.name[0]}</div>
              <div className="li-l">
                <div className="lt">{a.name}</div>
                <div className="ls">เลขที่ {a.number} · {a.type}</div>
                {a.note&&<div className="ls">📝 {a.note}</div>}
                <div style={{fontSize:12,marginTop:3}}>
                  รับ <b style={{color:T.ok}}>{fmt(inc)}</b>&nbsp;&nbsp;จ่าย <b style={{color:T.err}}>{fmt(exp)}</b>&nbsp;&nbsp;
                  <b style={{color:inc-exp>=0?T.ok:T.err}}>คงเหลือ {fmt(inc-exp)}</b>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                <button className="btn btn-out btn-sm" onClick={()=>{setForm({...a});setModal("edit")}}>แก้ไข</button>
                <button className="btn btn-err btn-sm" onClick={()=>del(a)}>ลบ</button>
              </div>
            </div>
          );
        })}
      </div>

      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"➕ เพิ่มบัญชีใหม่":"✏️ แก้ไขบัญชี"} onClose={()=>setModal(null)}>
          <div className="fg">
            <label className="fl">ชื่อบัญชี *</label>
            <input className="fi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="เช่น บัญชีหลัก, บัญชีค่าใช้จ่าย"/>
          </div>
          <div className="fg">
            <label className="fl">เลขที่บัญชี *</label>
            <input className="fi" value={form.number} onChange={e=>setForm({...form,number:e.target.value})} placeholder="000-0-00000-0"/>
          </div>
          <div className="fg">
            <label className="fl">ประเภทบัญชี</label>
            <select className="fs" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {ACC_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="fl">หมายเหตุ (เช่น บัญชีหลัก, บัญชีค่าใช้จ่าย)</label>
            <input className="fi" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="(ถ้ามี)"/>
          </div>
          <div className="fg">
            <label className="fl">สีของบัญชี</label>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:6}}>
              {PALETTE.map(c=>(
                <div key={c} onClick={()=>setForm({...form,color:c})}
                  style={{width:38,height:38,borderRadius:10,background:c,cursor:"pointer",
                    border:form.color===c?"3px solid #111":"3px solid transparent",
                    boxShadow:form.color===c?"0 0 0 2px white inset":"none",transition:"all .15s"}}/>
              ))}
            </div>
            <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,fontSize:14}}>
              <div style={{width:30,height:30,borderRadius:8,background:form.color}}/>
              <span>ตัวอย่าง: <b style={{color:form.color}}>{form.name||"ชื่อบัญชี"}</b></span>
            </div>
          </div>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>setModal(null)}>ยกเลิก</button>
            <button className="btn btn-pri" onClick={save}>บันทึก</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ImportData({data,onRefresh,showAlert}){
  const [source,setSource]=useState({rooms:"",income:"",expense:"",accounts:""});
  const [loading,setLoading]=useState(false);

  async function importRows(type){
    const text=source[type].trim();
    if(!text){showAlert("กรุณาวางข้อมูลก่อนนำเข้า","err");return;}
    const rows=parseCSV(text);
    if(rows.length===0){showAlert("ไม่พบข้อมูลให้ดูด","err");return;}
    setLoading(true);
    try{
      const items=rows.map(row=>{
        if(type==="rooms") return [uid("R"),row.roomNumber||"",row.floor||"",row.type||"สตูดิโอ",row.rent||"",row.status||"vacant",row.tenantId||"",row.waterRate||20,row.electricRate||7];
        if(type==="income") return [uid("I"),row.date||"",row.category||"",row.description||"",row.amount||"",row.accountId||"",row.note||"",row.roomId||"",row.roomNumber||"",row.parkingType||"",row.plate||""];
        if(type==="expense") return [uid("E"),row.date||"",row.category||"",row.description||"",row.amount||"",row.accountId||"",row.note||""];
        if(type==="accounts") return [uid("A"),row.name||"",row.number||"",row.type||"ออมทรัพย์",row.color||PALETTE[0],row.note||""];
        return [];
      });
      await bulkAppend(SH[type],items);
      showAlert(`นำเข้า ${items.length} รายการสำเร็จ ✓`);
      setSource(prev=>({...prev,[type]:""}));
      onRefresh();
    }catch(e){
      showAlert("นำเข้าล้มเหลว","err");
    }finally{
      setLoading(false);
    }
  }

  return(
    <div className="pg">
      <div style={{padding:"14px 14px 0"}}>
        <div style={{fontSize:19,fontWeight:700,color:T.pri}}>นำเข้าข้อมูลจำนวนมาก</div>
        <div style={{fontSize:13,color:T.muted,marginTop:6}}>วาง CSV แล้วกดนำเข้า สามารถใช้งานกับ ห้องพัก รายรับ รายจ่าย และบัญชีได้</div>
      </div>

      <div className="card">
        <div className="sec-hdr">ห้องพัก</div>
        <div className="fg"><label className="fl">รูปแบบ CSV</label><textarea className="fta" value={source.rooms} onChange={e=>setSource({...source,rooms:e.target.value})} placeholder="roomNumber,floor,type,rent,waterRate,electricRate,status,tenantId\n101,1,สตูดิโอ,3500,20,7,vacant,"/></div>
        <button className="btn btn-pri btn-full" onClick={()=>importRows("rooms")} disabled={loading}>นำเข้าห้องพัก</button>
      </div>

      <div className="card">
        <div className="sec-hdr">รายรับ</div>
        <div className="fg"><label className="fl">รูปแบบ CSV</label><textarea className="fta" value={source.income} onChange={e=>setSource({...source,income:e.target.value})} placeholder="date,category,description,amount,accountId,note,roomId,roomNumber,parkingType,plate\n2026-04-01,ค่าเช่า,ค่าเช่าห้อง 101,3500,A001,,R001,101,,"/></div>
        <button className="btn btn-ok btn-full" onClick={()=>importRows("income")} disabled={loading}>นำเข้ารายรับ</button>
      </div>

      <div className="card">
        <div className="sec-hdr">รายจ่าย</div>
        <div className="fg"><label className="fl">รูปแบบ CSV</label><textarea className="fta" value={source.expense} onChange={e=>setSource({...source,expense:e.target.value})} placeholder="date,category,description,amount,accountId,note\n2026-04-01,ค่าไฟ,ค่าไฟส่วนกลาง,450,A002,"/></div>
        <button className="btn btn-err btn-full" onClick={()=>importRows("expense")} disabled={loading}>นำเข้ารายจ่าย</button>
      </div>

      <div className="card">
        <div className="sec-hdr">บัญชีธนาคาร</div>
        <div className="fg"><label className="fl">รูปแบบ CSV</label><textarea className="fta" value={source.accounts} onChange={e=>setSource({...source,accounts:e.target.value})} placeholder="name,number,type,color,note\nกสิกรไทย,123-4-56789-0,ออมทรัพย์,#138A36,บัญชีหลัก"/></div>
        <button className="btn btn-acc btn-full" onClick={()=>importRows("accounts")} disabled={loading}>นำเข้าบัญชี</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: ACCOUNTING (รายรับ-รายจ่าย)
// ══════════════════════════════════════════════
const INC_CATS=["ค่าเช่า","ค่ามัดจำ","ค่าที่จอดรถ","ค่าส่วนกลาง","ค่าภาษีสังคม","รายรับอื่นๆ"];
const EXP_CATS=["ค่าน้ำ","ค่าไฟ","ประกันสังคม","เงินเดือน (ระบุชื่อ)","ค่า รปภ.","ค่า Internet","ค่าภาษีหัก ณ ที่จ่าย","อื่น ๆ (ระบุเพิ่มเติม)"];

function Accounting({data,onRefresh,showAlert}){
  const [tab,setTab]=useState("summary");
  const [modal,setModal]=useState(null);
  const [filterAcc,setFilterAcc]=useState("all");
  const eI={date:"",category:INC_CATS[0],description:"",amount:"",accountId:"",note:"",roomId:"",roomNumber:"",parkingType:"ชั่วคราว",plate:""};
  const eE={date:"",category:EXP_CATS[0],description:"",amount:"",accountId:"",note:""};
  const [fI,setFI]=useState(eI);
  const [editingIncomeId,setEditingIncomeId]=useState("");
  const [fE,setFE]=useState(eE);
  const [editingExpenseId,setEditingExpenseId]=useState("");

  const fInc  =data.income.filter(i=>filterAcc==="all"||i.accountId===filterAcc);
  const fExp  =data.expense.filter(e=>filterAcc==="all"||e.accountId===filterAcc);
  const tInc  =fInc.reduce((s,i)=>s+Number(i.amount||0),0);
  const tExp  =fExp.reduce((s,e)=>s+Number(e.amount||0),0);
  const profit=tInc-tExp;

  async function saveIncome(){
    if(!fI.description||!fI.amount||!fI.accountId){showAlert("กรุณากรอกข้อมูลให้ครบ","err");return;}
    if(fI.category==="ค่าเช่า"&&!fI.roomId){showAlert("กรุณาเลือกห้องสำหรับค่าเช่า","err");return;}
    if(fI.category==="ค่าที่จอดรถ"&&!fI.plate){showAlert("กรุณากรอกทะเบียนรถ","err");return;}

    const row={
      id: editingIncomeId||uid("I"),
      date: fI.date,
      category: fI.category,
      description: fI.description,
      amount: fI.amount,
      accountId: fI.accountId,
      note: fI.note,
      roomId: fI.roomId,
      roomNumber: fI.roomNumber,
      parkingType: fI.category==="ค่าที่จอดรถ"?fI.parkingType:"",
      plate: fI.category==="ค่าที่จอดรถ"?fI.plate:"",
    };

    if(editingIncomeId){
      await shUpdate(SH.income,editingIncomeId,row);
      showAlert("แก้ไขรายรับเรียบร้อย ✓");
    } else {
      await shAppend(SH.income,[row.id,row.date,row.category,row.description,row.amount,row.accountId,row.note,row.roomId,row.roomNumber,row.parkingType,row.plate]);
      showAlert("บันทึกรายรับเรียบร้อย ✓");
    }
    setModal(null); setFI(eI); setEditingIncomeId(""); onRefresh();
  }
  async function saveExpense(){
    if(!fE.description||!fE.amount||!fE.accountId){showAlert("กรุณากรอกข้อมูลให้ครบ","err");return;}
    if(editingExpenseId){
      await shUpdate(SH.expense,editingExpenseId,{...fE,id:editingExpenseId});
      showAlert("แก้ไขรายจ่ายเรียบร้อย ✓");
    } else {
      await shAppend(SH.expense,[uid("E"),fE.date,fE.category,fE.description,fE.amount,fE.accountId,fE.note]);
      showAlert("บันทึกรายจ่ายเรียบร้อย ✓");
    }
    setModal(null); setFE(eE); setEditingExpenseId(""); onRefresh();
  }

  async function editIncome(item){
    setEditingIncomeId(item.id||"");
    setFI({
      date:item.date||"",
      category:item.category||INC_CATS[0],
      description:item.description||"",
      amount:item.amount||"",
      accountId:item.accountId||"",
      note:item.note||"",
      roomId:item.roomId||"",
      roomNumber:item.roomNumber||"",
      parkingType:item.parkingType||"ชั่วคราว",
      plate:item.plate||"",
    });
    setModal("income");
  }

  async function deleteIncome(item){
    if(!window.confirm(`ลบรายการรายรับ "${item.description}" ใช่ไหม?`)) return;
    await shDelete(SH.income,item.id);
    showAlert("ลบรายรับแล้ว"); onRefresh();
  }

  async function editExpense(item){
    setEditingExpenseId(item.id||"");
    setFE({
      date:item.date||"",
      category:item.category||EXP_CATS[0],
      description:item.description||"",
      amount:item.amount||"",
      accountId:item.accountId||"",
      note:item.note||"",
    });
    setModal("expense");
  }

  async function deleteExpense(item){
    if(!window.confirm(`ลบรายการรายจ่าย "${item.description}" ใช่ไหม?`)) return;
    await shDelete(SH.expense,item.id);
    showAlert("ลบรายจ่ายแล้ว"); onRefresh();
  }

  return(
    <div className="pg">
      <div style={{padding:"14px 14px 0"}}>
        <label className="fl">🔍 กรองตามบัญชี</label>
        <select className="fs" value={filterAcc} onChange={e=>setFilterAcc(e.target.value)}>
          <option value="all">ทุกบัญชี</option>
          {data.accounts.map(a=><option key={a.id} value={a.id}>{a.name} · {a.number}</option>)}
        </select>
      </div>

      <div className="hero-card">
        <div style={{fontSize:13,opacity:.75}}>
          {filterAcc==="all"?"รวมทุกบัญชี":data.accounts.find(a=>a.id===filterAcc)?.name} · {mth()}
        </div>
        <div style={{fontSize:30,fontWeight:800,margin:"4px 0",color:profit>=0?"#86EFAC":"#FCA5A5"}}>{fmt(profit)} <span style={{fontSize:16,opacity:.75,fontWeight:400}}>กำไรสุทธิ</span></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
          <div style={{background:"rgba(255,255,255,.13)",borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:12,opacity:.8}}>💰 รายรับทั้งหมด</div>
            <div style={{fontSize:20,fontWeight:700}}>{fmt(tInc)}</div>
            <div style={{fontSize:11,opacity:.7}}>จากรายการรายรับทั้งหมด</div>
          </div>
          <div style={{background:"rgba(255,255,255,.13)",borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:12,opacity:.8}}>💸 รายจ่ายทั้งหมด</div>
            <div style={{fontSize:20,fontWeight:700}}>{fmt(tExp)}</div>
            <div style={{fontSize:11,opacity:.7}}>{fExp.length} รายการ</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab==="summary"?"on":""}`} onClick={()=>setTab("summary")}>สรุป</button>
        <button className={`tab ${tab==="income"?"on":""}`} onClick={()=>setTab("income")}>รายรับ</button>
        <button className={`tab ${tab==="expense"?"on":""}`} onClick={()=>setTab("expense")}>รายจ่าย</button>
      </div>

      {/* ── SUMMARY ── */}
      {tab==="summary"&&(
        <>
          {data.accounts.map(a=>{
            if(filterAcc!=="all"&&filterAcc!==a.id) return null;
            const aI=data.income.filter(i=>i.accountId===a.id).reduce((s,i)=>s+Number(i.amount||0),0);
            const aE=data.expense.filter(e=>e.accountId===a.id).reduce((s,e)=>s+Number(e.amount||0),0);
            return(
              <div className="card" key={a.id}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:40,height:40,borderRadius:10,background:a.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:17,flexShrink:0}}>{a.name[0]}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:16}}>{a.name}</div>
                    <div style={{fontSize:12,color:T.muted}}>{a.number} · {a.type}</div>
                  </div>
                </div>
                <div className="sr-row"><span>💰 รายรับ</span><span style={{color:T.ok,fontWeight:600}}>{fmt(aI)}</span></div>
                <div className="sr-row"><span>💸 รายจ่าย</span><span style={{color:T.err,fontWeight:600}}>{fmt(aE)}</span></div>
                <div className="sr-row"><span>🏦 กำไรสุทธิ</span><span style={{fontSize:19,fontWeight:800,color:aI-aE>=0?T.ok:T.err}}>{fmt(aI-aE)}</span></div>
              </div>
            );
          })}
        </>
      )}

      {/* ── INCOME ── */}
      {tab==="income"&&(
        <>
          <div style={{padding:"14px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:17,fontWeight:700,color:T.pri}}>รายรับทั้งหมด</div>
            <button className="btn btn-ok btn-sm" onClick={()=>{setEditingIncomeId("");setFI(eI);setModal("income")}}>+ บันทึกรายรับ</button>
          </div>

          <div className="sec-hdr">💰 รายรับทั้งหมด ({fInc.length} รายการ)</div>
          <div className="card">
            {fInc.length===0&&<div className="empty"><div className="empty-ic">💰</div><div>ยังไม่มีรายรับ</div></div>}
            {fInc.map(i=>(
              <div className="li" key={i.id}>
                <div className="li-l">
                  <div className="lt">{i.description}</div>
                  <div className="ls">📅 {i.date} · 🏷️ {i.category}</div>
                  {i.category==="ค่าเช่า" && i.roomNumber && <div className="ls">🏠 ห้อง {i.roomNumber}</div>}
                  {i.category==="ค่าที่จอดรถ" && (
                    <div className="ls">🚗 {i.parkingType} · ทะเบียน {i.plate}</div>
                  )}
                  <AccBadge accountId={i.accountId} accounts={data.accounts}/>
                  {i.note&&<div className="ls">📝 {i.note}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0}}>
                  <div style={{fontWeight:700,color:T.ok,fontSize:17}}>{fmt(i.amount)}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-out btn-sm" onClick={()=>editIncome(i)}>แก้ไข</button>
                    <button className="btn btn-err btn-sm" onClick={()=>deleteIncome(i)}>ลบ</button>
                  </div>
                </div>
              </div>
            ))}
            {fInc.length>0&&<div style={{paddingTop:12,marginTop:4,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:16}}><span>รวม</span><span style={{color:T.ok}}>{fmt(tInc)}</span></div>}
          </div>
        </>
      )}

      {/* ── EXPENSE ── */}
      {tab==="expense"&&(
        <>
          <div style={{padding:"14px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:17,fontWeight:700,color:T.pri}}>รายจ่าย ({fExp.length} รายการ)</div>
            <button className="btn btn-err btn-sm" onClick={()=>{setEditingExpenseId("");setFE(eE);setModal("expense")}}>+ บันทึกรายจ่าย</button>
          </div>
          <div className="card">
            {fExp.length===0&&<div className="empty"><div className="empty-ic">📋</div><div>ยังไม่มีรายจ่าย</div></div>}
            {fExp.map(e=>(
              <div className="li" key={e.id}>
                <div className="li-l">
                  <div className="lt">{e.description}</div>
                  <div className="ls">📅 {e.date} · 🏷️ {e.category}</div>
                  <AccBadge accountId={e.accountId} accounts={data.accounts}/>
                  {e.note&&<div className="ls">📝 {e.note}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0}}>
                  <div style={{fontWeight:700,color:T.err,fontSize:17}}>{fmt(e.amount)}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-out btn-sm" onClick={()=>editExpense(e)}>แก้ไข</button>
                    <button className="btn btn-err btn-sm" onClick={()=>deleteExpense(e)}>ลบ</button>
                  </div>
                </div>
              </div>
            ))}
            {fExp.length>0&&<div style={{paddingTop:12,marginTop:4,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:16}}><span>รวม</span><span style={{color:T.err}}>{fmt(tExp)}</span></div>}
          </div>
        </>
      )}

      {/* Modal รายรับ */}
      {modal==="income"&&(
        <Modal title={editingIncomeId?"✏️ แก้ไขรายรับ":"💰 บันทึกรายรับ"} onClose={()=>setModal(null)}>
          <div className="fg"><label className="fl">วันที่ *</label><input className="fi" type="date" value={fI.date} onChange={e=>setFI({...fI,date:e.target.value})}/></div>
          <div className="fg">
            <label className="fl">ประเภท *</label>
            <select className="fs" value={fI.category} onChange={e=>{
              const category=e.target.value;
              setFI({
                ...fI,
                category,
                roomId: category==="ค่าเช่า" ? fI.roomId : "",
                roomNumber: category==="ค่าเช่า" ? fI.roomNumber : "",
                parkingType: category==="ค่าที่จอดรถ" ? fI.parkingType : "ชั่วคราว",
                plate: category==="ค่าที่จอดรถ" ? fI.plate : "",
              });
            }}>
              {INC_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          {fI.category==="ค่าเช่า"&&(
            <div className="fg">
              <label className="fl">ห้อง *</label>
              <select className="fs" value={fI.roomId} onChange={e=>{
                const roomId=e.target.value;
                const room=data.rooms.find(r=>r.id===roomId);
                setFI({
                  ...fI,
                  roomId,
                  roomNumber: room?.roomNumber||"",
                  description: fI.description||`ค่าเช่าห้อง ${room?.roomNumber||""}`,
                });
              }}>
                <option value="">— เลือกห้อง —</option>
                {data.rooms.map(r=><option key={r.id} value={r.id}>ห้อง {r.roomNumber} {r.status?`(${r.status})`:null}</option>)}
              </select>
            </div>
          )}
          {fI.category==="ค่าที่จอดรถ"&&(
            <>
              <div className="fg">
                <label className="fl">ประเภทการจอดรถ</label>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {['ชั่วคราว','รายเดือน'].map(option=>(
                    <label key={option} style={{display:'inline-flex',alignItems:'center',gap:6,cursor:'pointer'}}>
                      <input type="radio" name="parkingType" value={option} checked={fI.parkingType===option} onChange={e=>setFI({...fI,parkingType:e.target.value})}/>
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="fg"><label className="fl">ทะเบียนรถ *</label><input className="fi" value={fI.plate} onChange={e=>setFI({...fI,plate:e.target.value})} placeholder="กข 1234"/></div>
            </>
          )}
          <div className="fg"><label className="fl">รายละเอียด *</label><textarea className="fta" value={fI.description} onChange={e=>setFI({...fI,description:e.target.value})} placeholder="อธิบายรายรับ..."/></div>
          <div className="fg"><label className="fl">จำนวนเงิน (บาท) *</label><input className="fi" type="number" value={fI.amount} onChange={e=>setFI({...fI,amount:e.target.value})} placeholder="0"/></div>
          <AccSelect value={fI.accountId} onChange={v=>setFI({...fI,accountId:v})} accounts={data.accounts} label="รับเข้าบัญชี *"/>
          <div className="fg"><label className="fl">หมายเหตุ</label><input className="fi" value={fI.note} onChange={e=>setFI({...fI,note:e.target.value})} placeholder="(ถ้ามี)"/></div>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>setModal(null)}>ยกเลิก</button>
            <button className="btn btn-ok" onClick={saveIncome}>บันทึก</button>
          </div>
        </Modal>
      )}

      {/* Modal รายจ่าย */}
      {modal==="expense"&&(
        <Modal title={editingExpenseId?"✏️ แก้ไขรายจ่าย":"💸 บันทึกรายจ่าย"} onClose={()=>setModal(null)}>
          <div className="fg"><label className="fl">วันที่ *</label><input className="fi" type="date" value={fE.date} onChange={e=>setFE({...fE,date:e.target.value})}/></div>
          <div className="fg">
            <label className="fl">ประเภท *</label>
            <select className="fs" value={fE.category} onChange={e=>setFE({...fE,category:e.target.value})}>
              {EXP_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fg"><label className="fl">รายละเอียด *</label><textarea className="fta" value={fE.description} onChange={e=>setFE({...fE,description:e.target.value})} placeholder="อธิบายรายจ่าย..."/></div>
          <div className="fg"><label className="fl">จำนวนเงิน (บาท) *</label><input className="fi" type="number" value={fE.amount} onChange={e=>setFE({...fE,amount:e.target.value})} placeholder="0"/></div>
          <AccSelect value={fE.accountId} onChange={v=>setFE({...fE,accountId:v})} accounts={data.accounts} label="จ่ายจากบัญชี *"/>
          <div className="fg"><label className="fl">หมายเหตุ</label><input className="fi" value={fE.note} onChange={e=>setFE({...fE,note:e.target.value})} placeholder="(ถ้ามี)"/></div>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>setModal(null)}>ยกเลิก</button>
            <button className="btn btn-err" onClick={saveExpense}>บันทึก</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: ROOMS
// ══════════════════════════════════════════════
function Rooms({data,onRefresh,showAlert}){
  const empty={roomNumber:"",floor:"",type:"สตูดิโอ",rent:"",waterRate:20,electricRate:7};
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState(empty);
  const sL={occupied:"มีผู้เช่า",vacant:"ว่าง",maintenance:"ซ่อม"};
  const sB={occupied:"bg-g",vacant:"bg-gray",maintenance:"bg-r"};
  async function add(){
    if(!form.roomNumber||!form.rent){showAlert("กรุณากรอกเลขห้องและค่าเช่า","err");return;}
    await shAppend(SH.rooms,[uid("R"),form.roomNumber,form.floor,form.type,form.rent,"vacant","",form.waterRate,form.electricRate]);
    showAlert("เพิ่มห้องพักเรียบร้อย ✓"); setModal(null); setForm(empty); onRefresh();
  }
  async function edit(){
    if(!form.roomNumber||!form.rent){showAlert("กรุณากรอกเลขห้องและค่าเช่า","err");return;}
    const res = await shUpdate(SH.rooms,form.id,{roomNumber:form.roomNumber,floor:form.floor,type:form.type,rent:form.rent,waterRate:form.waterRate,electricRate:form.electricRate});
    if(!res.ok){showAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล","err");return;}
    showAlert("แก้ไขห้องพักเรียบร้อย ✓"); setModal(null); setForm(empty); onRefresh();
  }
  async function del(){
    if(!confirm(`ต้องการลบห้อง ${modal.roomNumber} ใช่หรือไม่?`)) return;
    await shDelete(SH.rooms,modal.id);
    showAlert("ลบห้องพักเรียบร้อย ✓"); setModal(null); onRefresh();
  }
  return(
    <div className="pg">
      <div style={{padding:"14px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:19,fontWeight:700,color:T.pri}}>ห้องพัก ({data.rooms.length} ห้อง)</div>
        <button className="btn btn-pri btn-sm" onClick={()=>setModal("add")}>+ เพิ่มห้อง</button>
      </div>
      <div className="rgrid">
        {data.rooms.map(r=>{
          const t=data.tenants.find(t=>t.roomId===r.id);
          return(
            <div key={r.id} className={`rc ${r.status}`} onClick={()=>setModal(r)}>
              <div className="rn">🚪 {r.roomNumber}</div>
              <div className="rt">{t?t.name:"—"}</div>
              <div className="rr">{fmt(r.rent)}/เดือน</div>
              <span className={`badge ${sB[r.status]}`} style={{marginTop:6,display:"inline-block"}}>{sL[r.status]}</span>
            </div>
          );
        })}
      </div>
      {modal==="add"&&(
        <Modal title="➕ เพิ่มห้องพัก" onClose={()=>setModal(null)}>
          <div className="fg"><label className="fl">เลขห้อง *</label><input className="fi" value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})} placeholder="101"/></div>
          <div className="fg"><label className="fl">ชั้น</label><input className="fi" value={form.floor} onChange={e=>setForm({...form,floor:e.target.value})} placeholder="1"/></div>
          <div className="fg"><label className="fl">ประเภท</label><select className="fs" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>ห้องปกติ</option><option>ห้องมุม</option></select></div>
          <div className="fg"><label className="fl">ค่าเช่า (฿/เดือน) *</label><input className="fi" type="number" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} placeholder="3500"/></div>
          <div className="fg2">
            <div className="fg"><label className="fl">ค่าน้ำ (฿/หน่วย)</label><input className="fi" type="number" value={form.waterRate} onChange={e=>setForm({...form,waterRate:e.target.value})}/></div>
            <div className="fg"><label className="fl">ค่าไฟ (฿/หน่วย)</label><input className="fi" type="number" value={form.electricRate} onChange={e=>setForm({...form,electricRate:e.target.value})}/></div>
          </div>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>setModal(null)}>ยกเลิก</button>
            <button className="btn btn-pri" onClick={add}>บันทึก</button>
          </div>
        </Modal>
      )}
      {modal==="edit"&&(
        <Modal title="✏️ แก้ไขห้องพัก" onClose={()=>setModal(null)}>
          <div className="fg"><label className="fl">เลขห้อง *</label><input className="fi" value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})} placeholder="101"/></div>
          <div className="fg"><label className="fl">ชั้น</label><input className="fi" value={form.floor} onChange={e=>setForm({...form,floor:e.target.value})} placeholder="1"/></div>
          <div className="fg"><label className="fl">ประเภท</label><select className="fs" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>ห้องปกติ</option><option>ห้องมุม</option></select></div>
          <div className="fg"><label className="fl">ค่าเช่า (฿/เดือน) *</label><input className="fi" type="number" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} placeholder="3500"/></div>
          <div className="fg2">
            <div className="fg"><label className="fl">ค่าน้ำ (฿/หน่วย)</label><input className="fi" type="number" value={form.waterRate} onChange={e=>setForm({...form,waterRate:e.target.value})}/></div>
            <div className="fg"><label className="fl">ค่าไฟ (฿/หน่วย)</label><input className="fi" type="number" value={form.electricRate} onChange={e=>setForm({...form,electricRate:e.target.value})}/></div>
          </div>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>setModal(null)}>ยกเลิก</button>
            <button className="btn btn-pri" onClick={edit}>บันทึก</button>
          </div>
        </Modal>
      )}
      {modal&&modal.id&&(
        <Modal title={`🚪 ห้อง ${modal.roomNumber}`} onClose={()=>setModal(null)}>
          <div style={{fontSize:16,lineHeight:2.2}}>
            <div><b>ประเภท:</b> {modal.type} · ชั้น {modal.floor}</div>
            <div><b>ค่าเช่า:</b> {fmt(modal.rent)}/เดือน</div>
            <div><b>ค่าน้ำ:</b> {modal.waterRate} ฿/หน่วย · <b>ค่าไฟ:</b> {modal.electricRate} ฿/หน่วย</div>
            <div><b>สถานะ:</b> <span className={`badge ${sB[modal.status]}`}>{sL[modal.status]}</span></div>
            {data.tenants.find(t=>t.roomId===modal.id)&&<div><b>ผู้เช่า:</b> {data.tenants.find(t=>t.roomId===modal.id)?.name}</div>}
          </div>
          <div className="btn-row">
            <button className="btn btn-acc" onClick={()=>{setForm(modal);setModal("edit")}}>แก้ไข</button>
            <button className="btn btn-err" onClick={del}>ลบ</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: BILLS
// ══════════════════════════════════════════════
function Bills({data,onRefresh,showAlert}){
  const [tab,setTab]=useState("unpaid");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({roomId:"",waterPrev:"",waterCurr:"",electricPrev:"",electricCurr:"",extraFee:0});
  const [calc,setCalc]=useState(null);
  const [payBill,setPayBill]=useState(null);
  const [payAcc,setPayAcc]=useState("");
  const filtered=data.bills.filter(b=>tab==="all"||b.status===tab);

  function doCalc(){
    const room=data.rooms.find(r=>r.id===form.roomId); if(!room) return;
    const wu=Number(form.waterCurr)-Number(form.waterPrev);
    const eu=Number(form.electricCurr)-Number(form.electricPrev);
    const wc=wu*Number(room.waterRate); const ec=eu*Number(room.electricRate);
    setCalc({room,wu,eu,wc,ec,tot:Number(room.rent)+wc+ec+Number(form.extraFee||0)});
  }
  async function createBill(){
    if(!calc) return;
    const mn=new Date().toLocaleDateString("th-TH",{month:"long",year:"numeric"});
    const ten=data.tenants.find(t=>t.roomId===form.roomId);
    await shAppend(SH.bills,[uid("B"),calc.room.roomNumber,ten?.name||"—",mn,calc.room.rent,calc.wc,calc.ec,form.extraFee||0,calc.tot,"unpaid","",""]);
    showAlert("สร้างบิลเรียบร้อย ✓"); setModal(null); setCalc(null); onRefresh();
  }
  async function confirmPay(){
    if(!payAcc){showAlert("กรุณาเลือกบัญชีที่รับเงิน","err");return;}
    const d=new Date().toLocaleDateString("th-TH");
    await shUpdate(SH.bills,payBill.id,{...payBill,status:"paid",paidDate:d,accountId:payAcc});
    showAlert(`รับชำระห้อง ${payBill.roomNumber} แล้ว ✓`); setPayBill(null); setPayAcc(""); onRefresh();
  }

  return(
    <div className="pg">
      <div className="tabs">
        <button className={`tab ${tab==="unpaid"?"on":""}`} onClick={()=>setTab("unpaid")}>ค้างชำระ</button>
        <button className={`tab ${tab==="paid"?"on":""}`} onClick={()=>setTab("paid")}>ชำระแล้ว</button>
        <button className={`tab ${tab==="all"?"on":""}`} onClick={()=>setTab("all")}>ทั้งหมด</button>
      </div>
      <div style={{padding:"12px 14px 0",display:"flex",justifyContent:"flex-end"}}>
        <button className="btn btn-acc btn-sm" onClick={()=>setModal("create")}>+ สร้างบิล</button>
      </div>
      <div className="card">
        {filtered.length===0&&<div className="empty"><div className="empty-ic">🎉</div><div>ไม่มีบิลในหมวดนี้</div></div>}
        {filtered.map(b=>(
          <div className="li" key={b.id}>
            <div className="li-l">
              <div className="lt">ห้อง {b.roomNumber} — {b.tenantName}</div>
              <div className="ls">{b.month}</div>
              <div className="ls">ค่าเช่า {fmt(b.rent)} น้ำ {fmt(b.water)} ไฟ {fmt(b.electric)}</div>
              {b.status==="paid"&&<AccBadge accountId={b.accountId} accounts={data.accounts}/>}
            </div>
            <div style={{textAlign:"right",flexShrink:0,minWidth:100}}>
              <div style={{fontWeight:800,fontSize:18,color:b.status==="paid"?T.ok:T.err}}>{fmt(b.total)}</div>
              {b.status==="unpaid"
                ?<button className="btn btn-pri btn-sm" style={{marginTop:6}} onClick={()=>{setPayBill(b);setPayAcc("")}}>รับชำระ</button>
                :<span className="badge bg-g" style={{marginTop:6,display:"inline-block"}}>✓ ชำระแล้ว</span>
              }
            </div>
          </div>
        ))}
      </div>

      {modal==="create"&&(
        <Modal title="🧾 สร้างบิลค่าเช่า" onClose={()=>{setModal(null);setCalc(null)}}>
          <div className="fg">
            <label className="fl">เลือกห้อง *</label>
            <select className="fs" value={form.roomId} onChange={e=>setForm({...form,roomId:e.target.value})}>
              <option value="">— เลือกห้อง —</option>
              {data.rooms.filter(r=>r.status==="occupied").map(r=>{
                const t=data.tenants.find(t=>t.roomId===r.id);
                return <option key={r.id} value={r.id}>ห้อง {r.roomNumber} — {t?.name||"—"}</option>;
              })}
            </select>
          </div>
          {form.roomId&&(
            <>
              <div style={{background:"#F0FDF4",borderRadius:10,padding:10,marginBottom:12,fontSize:13}}>
                ค่าเช่า <b>{fmt(data.rooms.find(r=>r.id===form.roomId)?.rent)}</b> · น้ำ <b>{data.rooms.find(r=>r.id===form.roomId)?.waterRate}฿/หน่วย</b> · ไฟ <b>{data.rooms.find(r=>r.id===form.roomId)?.electricRate}฿/หน่วย</b>
              </div>
              <div className="fg2">
                <div className="fg"><label className="fl">มิเตอร์น้ำ เดิม</label><input className="fi" type="number" value={form.waterPrev} onChange={e=>setForm({...form,waterPrev:e.target.value})}/></div>
                <div className="fg"><label className="fl">มิเตอร์น้ำ ใหม่</label><input className="fi" type="number" value={form.waterCurr} onChange={e=>setForm({...form,waterCurr:e.target.value})}/></div>
                <div className="fg"><label className="fl">มิเตอร์ไฟ เดิม</label><input className="fi" type="number" value={form.electricPrev} onChange={e=>setForm({...form,electricPrev:e.target.value})}/></div>
                <div className="fg"><label className="fl">มิเตอร์ไฟ ใหม่</label><input className="fi" type="number" value={form.electricCurr} onChange={e=>setForm({...form,electricCurr:e.target.value})}/></div>
              </div>
              <div className="fg"><label className="fl">ค่าบริการอื่นๆ</label><input className="fi" type="number" value={form.extraFee} onChange={e=>setForm({...form,extraFee:e.target.value})} placeholder="0"/></div>
              <button className="btn btn-out btn-full" onClick={doCalc}>🔢 คำนวณยอดบิล</button>
            </>
          )}
          {calc&&(
            <div style={{background:"#F0FDF4",borderRadius:14,padding:16,marginTop:12}}>
              <div style={{fontWeight:700,fontSize:15,color:T.pri,marginBottom:10}}>สรุปยอดบิล</div>
              <div className="sr-row"><span>ค่าเช่า</span><span>{fmt(calc.room.rent)}</span></div>
              <div className="sr-row"><span>ค่าน้ำ ({calc.wu} หน่วย × {calc.room.waterRate}฿)</span><span>{fmt(calc.wc)}</span></div>
              <div className="sr-row"><span>ค่าไฟ ({calc.eu} หน่วย × {calc.room.electricRate}฿)</span><span>{fmt(calc.ec)}</span></div>
              {Number(form.extraFee)>0&&<div className="sr-row"><span>ค่าบริการอื่นๆ</span><span>{fmt(form.extraFee)}</span></div>}
              <div className="sr-row" style={{color:T.pri}}><span>รวมทั้งสิ้น</span><span style={{fontSize:22,fontWeight:800}}>{fmt(calc.tot)}</span></div>
            </div>
          )}
          <div className="btn-row" style={{marginTop:14}}>
            <button className="btn btn-out" onClick={()=>{setModal(null);setCalc(null)}}>ยกเลิก</button>
            <button className="btn btn-pri" onClick={createBill} disabled={!calc}>บันทึกบิล</button>
          </div>
        </Modal>
      )}

      {payBill&&(
        <Modal title="💳 รับชำระเงิน" onClose={()=>{setPayBill(null);setPayAcc("")}}>
          <div style={{background:"#F0FDF4",borderRadius:14,padding:16,marginBottom:16}}>
            <div style={{fontWeight:600,fontSize:16}}>ห้อง {payBill.roomNumber} — {payBill.tenantName}</div>
            <div style={{fontSize:13,color:T.muted}}>{payBill.month}</div>
            <div style={{fontSize:28,fontWeight:800,color:T.ok,marginTop:8}}>{fmt(payBill.total)}</div>
          </div>
          <AccSelect value={payAcc} onChange={setPayAcc} accounts={data.accounts} label="รับเงินเข้าบัญชี *"/>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>{setPayBill(null);setPayAcc("")}}>ยกเลิก</button>
            <button className="btn btn-ok" onClick={confirmPay}>✓ ยืนยันรับชำระ</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: TENANTS
// ══════════════════════════════════════════════
function Tenants({data,onRefresh,showAlert}){
  const empty={name:"",phone:"",idCard:"",roomId:"",moveIn:""};
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState(empty);
  async function add(){
    if(!form.name||!form.phone||!form.roomId){showAlert("กรุณากรอกข้อมูลให้ครบ","err");return;}
    const room=data.rooms.find(r=>r.id===form.roomId);
    await shAppend(SH.tenants,[uid("T"),form.name,form.phone,form.roomId,room?.roomNumber||"",form.moveIn,form.idCard]);
    showAlert("เพิ่มผู้เช่าเรียบร้อย ✓"); setModal(null); setForm(empty); onRefresh();
  }
  return(
    <div className="pg">
      <div style={{padding:"14px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:19,fontWeight:700,color:T.pri}}>ผู้เช่า ({data.tenants.length} คน)</div>
        <button className="btn btn-pri btn-sm" onClick={()=>setModal("add")}>+ เพิ่มผู้เช่า</button>
      </div>
      <div className="card">
        {data.tenants.length===0&&<div className="empty"><div className="empty-ic">👤</div><div>ยังไม่มีผู้เช่า</div></div>}
        {data.tenants.map(t=>(
          <div className="li" key={t.id} onClick={()=>setModal(t)} style={{cursor:"pointer"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:T.pri,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,flexShrink:0}}>{t.name[0]}</div>
            <div className="li-l">
              <div className="lt">{t.name}</div>
              <div className="ls">📞 {t.phone} · ห้อง {t.roomNumber}</div>
              <div className="ls">📅 เข้าอยู่: {t.moveIn}</div>
            </div>
          </div>
        ))}
      </div>
      {modal==="add"&&(
        <Modal title="👤 เพิ่มผู้เช่าใหม่" onClose={()=>setModal(null)}>
          <div className="fg"><label className="fl">ชื่อ-นามสกุล *</label><input className="fi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="สมชาย ใจดี"/></div>
          <div className="fg"><label className="fl">เบอร์โทร *</label><input className="fi" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="081-234-5678"/></div>
          <div className="fg"><label className="fl">เลขบัตรประชาชน</label><input className="fi" value={form.idCard} onChange={e=>setForm({...form,idCard:e.target.value})} placeholder="1-2345-67890-12-3"/></div>
          <div className="fg">
            <label className="fl">ห้องพัก *</label>
            <select className="fs" value={form.roomId} onChange={e=>setForm({...form,roomId:e.target.value})}>
              <option value="">— เลือกห้อง —</option>
              {data.rooms.filter(r=>r.status==="vacant").map(r=><option key={r.id} value={r.id}>ห้อง {r.roomNumber} ({r.type}) — {fmt(r.rent)}/เดือน</option>)}
            </select>
          </div>
          <div className="fg"><label className="fl">วันที่เข้าอยู่</label><input className="fi" type="date" value={form.moveIn} onChange={e=>setForm({...form,moveIn:e.target.value})}/></div>
          <div className="btn-row">
            <button className="btn btn-out" onClick={()=>setModal(null)}>ยกเลิก</button>
            <button className="btn btn-pri" onClick={add}>บันทึก</button>
          </div>
        </Modal>
      )}
      {modal&&modal.id&&(
        <Modal title={`👤 ${modal.name}`} onClose={()=>setModal(null)}>
          <div style={{fontSize:16,lineHeight:2.2}}>
            <div>📞 {modal.phone}</div><div>🚪 ห้อง {modal.roomNumber}</div>
            <div>📅 เข้าอยู่: {modal.moveIn}</div>
            {modal.idCard&&<div>🪪 บัตร: {modal.idCard}</div>}
          </div>
          <button className="btn btn-out btn-full" style={{marginTop:14}} onClick={()=>setModal(null)}>ปิด</button>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [data,setData]=useState(MOCK);
  const [loading,setLoading]=useState(false);
  const [alertState,setAlertState]=useState(null);

  async function load(){
    if(IS_MOCK) return;
    setLoading(true);
    try{
      const [rooms,tenants,income,expense,accounts]=await Promise.all([
        shRead(SH.rooms),shRead(SH.tenants),
        shRead(SH.income),shRead(SH.expense),shRead(SH.accounts),
      ]);
      setData({rooms,tenants,income,expense,accounts});
    }finally{setLoading(false);}
  }

  useEffect(()=>{load();},[]);

  function showAlert(msg,type="ok"){
    setAlertState({msg,type});
    setTimeout(()=>setAlertState(null),3200);
  }

  const NAV=[
    {id:"dashboard",ic:"🏠",lbl:"หน้าหลัก"},
    {id:"rooms",ic:"🚪",lbl:"ห้องพัก"},
    {id:"import",ic:"⬆️",lbl:"นำเข้า"},
    {id:"tenants",ic:"👥",lbl:"ผู้เช่า"},
    {id:"accounting",ic:"📊",lbl:"บัญชี"},
    {id:"accounts",ic:"🏦",lbl:"ธนาคาร"},
  ];
  const P={data,onRefresh:load,showAlert};

  return(
    <>
      <style>{CSS}</style>
      <div className="wrap">
        <header className="hdr">
          <div className="hdr-row">
            <div>
              <div className="hdr-title">🏢 ระบบจัดการอพาร์ทเม้นท์</div>
              <div className="hdr-sub">ห้องพัก · บัญชี · ผู้เช่า</div>
            </div>
            <div className="hdr-date">{now()}</div>
          </div>
        </header>

        {IS_MOCK&&<div className="alert al-info">⚠️ โหมดทดลอง — กรุณาตั้งค่า Google Script URL เพื่อบันทึกข้อมูลจริง</div>}
        {alertState&&<div className={`alert al-${alertState.type}`}>{alertState.type==="ok"?"✅":"❌"} {alertState.msg}</div>}

        {page==="dashboard"  &&<Dashboard  {...P}/>}
        {page==="rooms"      &&<Rooms      {...P}/>}
        {page==="import"     &&<ImportData {...P}/>}
        {page==="tenants"    &&<Tenants    {...P}/>}
        {page==="accounting" &&<Accounting {...P}/>}
        {page==="accounts"   &&<Accounts   {...P}/>}

        <nav className="bnav">
          {NAV.map(n=>(
            <button key={n.id} className={`bni ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
              <span className="bni-ic">{n.ic}</span>{n.lbl}
            </button>
          ))}
        </nav>

        {loading&&(
          <div className="spin-wrap">
            <div className="spin"/>
            <div style={{fontSize:17,color:T.pri}}>กำลังโหลด...</div>
          </div>
        )}
      </div>
    </>
  );
}
//export default App;
/*function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = CSS;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="wrap">
      App Loaded ✅
    </div>
  );
}*/

