import { useState, useRef, useEffect } from "react"

const B = { p:"#4F46E5",ph:"#4338CA",pm:"#C7D2FE",bg:"#F9F8FF",sf:"#FFFFFF",br:"#E5E7EB",bs:"#F3F4F6",t1:"#111827",t2:"#6B7280",t3:"#9CA3AF",mu:"#F5F3FF" }

const QP = [
  "Which business should I launch first as a Dallas entrepreneur?",
  "Give me my exact next 3 moves to make money this week.",
  "Write my LinkedIn launch post for VaultIQ.",
  "How do I land my first AI Content Studio client today?",
  "What is the best niche for my AI Micro-SaaS?",
  "Build me a 7-day revenue sprint plan.",
]

const INIT = { role:"assistant", content:"Hey — I'm VaultIQ, your AI business strategist.\n\nI'm built for entrepreneurs who move fast. You've got three businesses in motion — an Executive Coach platform, an AI Micro-SaaS, and an AI Content Studio — and a 7-day window to first revenue.\n\nLet's not waste time. What's the first thing you want to crack?" }

export default function Home() {
  const [msgs, setMsgs] = useState([INIT])
  const [inp, setInp] = useState("")
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState(null)
  const botRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => { botRef.current?.scrollIntoView({ behavior:"smooth" }) }, [msgs, load])

  async function send(override) {
    const text = (override ?? inp).trim()
    if (!text || load) return
    setInp(""); setErr(null)
    if (taRef.current) taRef.current.style.height = "auto"
    const next = [...msgs, { role:"user", content:text }]
    setMsgs(next); setLoad(true)
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ messages:next }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`)
      setMsgs([...next, { role:"assistant", content:data.reply }])
    } catch(e) {
      setErr(e.message); setMsgs(msgs)
    } finally {
      setLoad(false); taRef.current?.focus()
    }
  }

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:${B.bg};color:${B.t1}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:2px}
        @keyframes blink{0%,80%,100%{opacity:.2;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}
        .vd{display:inline-block;width:5px;height:5px;border-radius:50%;background:${B.t3};animation:blink 1.3s infinite}
        .vd:nth-child(2){animation-delay:.2s}.vd:nth-child(3){animation-delay:.4s}
        .vc{font-size:11px;padding:4px 12px;border-radius:20px;border:1px solid ${B.br};background:${B.sf};cursor:pointer;color:${B.t2};white-space:nowrap;font-weight:500;transition:all .15s}
        .vc:hover:not(:disabled){background:#EEF2FF;border-color:${B.pm};color:${B.p}}
        .vc:disabled{opacity:.45;cursor:not-allowed}
        textarea{font-family:inherit}
        textarea:focus{outline:none;border-color:${B.p}!important;box-shadow:0 0 0 2px ${B.pm}}
        .vs{width:38px;height:38px;border-radius:10px;border:none;background:${B.p};color:#fff;font-size:17px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:background .15s}
        .vs:disabled{background:${B.pm};cursor:not-allowed}
        .vs:not(:disabled):hover{background:${B.ph}}
        .vm{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,${B.p},#7C3AED);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .vl{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse 2s infinite}
      `}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{width:"100%",maxWidth:720,height:"90vh",display:"flex",flexDirection:"column",background:B.sf,borderRadius:20,border:`1px solid ${B.br}`,overflow:"hidden",boxShadow:"0 8px 40px rgba(79,70,229,.10)"}}>

          <header style={{padding:"14px 20px",borderBottom:`1px solid ${B.bs}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div className="vm">VQ</div>
              <div>
                <div style={{fontSize:16,fontWeight:700,letterSpacing:"-.3px"}}>VaultIQ</div>
                <div style={{fontSize:11,color:B.t2,marginTop:1,fontWeight:500}}>Launch fast · Scale smart · Win globally</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:B.t2,padding:"5px 12px",borderRadius:20,border:`1px solid ${B.br}`,background:B.bg,fontWeight:500}}>
              <div className="vl"/>Active
            </div>
          </header>

          <div style={{flex:1,overflowY:"auto",padding:"20px 20px 8px",display:"flex",flexDirection:"column",gap:18}}>
            {msgs.map((m,i) => {
              const u = m.role==="user"
              return (
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",flexDirection:u?"row-reverse":"row"}}>
                  {u
                    ? <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,marginTop:2,background:"#FDF4FF",color:"#7E22CE"}}>You</div>
                    : <div style={{width:30,height:30,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,marginTop:2,background:"linear-gradient(135deg,#4F46E5,#7C3AED)",color:"#fff"}}>VQ</div>
                  }
                  <div style={{maxWidth:"76%",padding:"11px 15px",borderRadius:u?"16px 16px 4px 16px":"16px 16px 16px 4px",fontSize:13.5,lineHeight:1.72,background:u?B.mu:B.sf,border:`1px solid ${u?"#DDD6FE":B.br}`,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                    {m.content}
                  </div>
                </div>
              )
            })}
            {load && (
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:30,height:30,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:"linear-gradient(135deg,#4F46E5,#7C3AED)",color:"#fff"}}>VQ</div>
                <div style={{padding:"13px 16px",borderRadius:"16px 16px 16px 4px",border:`1px solid ${B.br}`,background:B.sf,display:"flex",gap:5,alignItems:"center"}}>
                  <span className="vd"/><span className="vd"/><span className="vd"/>
                </div>
              </div>
            )}
            {err && (
              <div style={{padding:"10px 14px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,fontSize:12,color:"#991B1B",display:"flex",alignItems:"center",gap:10}}>
                <span>⚠ {err}</span>
                <button onClick={()=>{setErr(null);send(msgs[msgs.length-1]?.content)}} style={{marginLeft:"auto",padding:"3px 10px",borderRadius:6,border:"1px solid #FECACA",background:"#fff",color:"#991B1B",fontSize:11,cursor:"pointer",fontWeight:500}}>Retry</button>
              </div>
            )}
            <div ref={botRef}/>
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:"10px 18px",borderTop:`1px solid ${B.bs}`,background:B.bg}}>
            {QP.map((q,i) => <button key={i} className="vc" disabled={load} onClick={()=>send(q)}>{q.length>46?q.slice(0,46)+"…":q}</button>)}
          </div>

          <div style={{padding:"12px 16px",borderTop:`1px solid ${B.br}`,display:"flex",gap:8,alignItems:"flex-end",background:B.sf}}>
            <textarea ref={taRef} value={inp} onChange={e=>{setInp(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"}}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Ask VaultIQ anything…" rows={1} disabled={load}
              style={{flex:1,resize:"none",border:`1px solid ${B.br}`,borderRadius:11,padding:"9px 13px",fontSize:13.5,background:B.bg,color:B.t1,lineHeight:1.55,minHeight:40,maxHeight:120}}/>
            <button className="vs" onClick={()=>send()} disabled={!inp.trim()||load} aria-label="Send">↑</button>
          </div>

        </div>
      </div>
    </>
  )
}
