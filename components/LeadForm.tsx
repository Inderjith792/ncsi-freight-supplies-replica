"use client";
import { useState, type FormEvent } from "react";
export function LeadForm({kind="quote",buttonLabel="Send Request"}:{kind?:"quote"|"contact";buttonLabel?:string}) {
  const [status,setStatus]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("");
    const form=e.currentTarget; const data=Object.fromEntries(new FormData(form).entries());
    const endpoint=process.env.NEXT_PUBLIC_FORM_ENDPOINT;
    if(endpoint) {
      try { const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,kind})}); if(!res.ok) throw new Error("Submission failed"); setStatus("Thanks — your request has been submitted."); form.reset(); }
      catch { setStatus("We couldn't submit online. Please email info@ncsifreightsupplies.com."); }
    } else {
      const subject=encodeURIComponent(kind==="quote"?"NCSI Freight Supplies — Quote Request":"NCSI Freight Supplies — Contact Request");
      const body=encodeURIComponent(Object.entries(data).map(([k,v])=>k+": "+v).join("\n"));
      window.location.href="mailto:info@ncsifreightsupplies.com?subject="+subject+"&body="+body;
      setStatus("Your email app should open with your request prefilled.");
    }
  }
  return <form className="lead-form" onSubmit={submit}>
    <div className="form-row"><label>Full name<input name="name" autoComplete="name" required placeholder="Your full name"/></label><label>Corporate email<input name="email" type="email" autoComplete="email" required placeholder="you@company.com"/></label></div>
    <div className="form-row"><label>Direct phone<input name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000"/></label><label>{kind==="quote"?"Service required":"Company"}<select name="service" defaultValue="" required><option value="" disabled>Select an option</option><option>Container Leasing</option><option>Ocean Freight</option><option>Air Freight</option><option>Customs & Warehousing</option><option>General Inquiry</option></select></label></div>
    <label>{kind==="quote"?"Leasing & freight specifications":"How can we help?"}<textarea name="message" rows={4} required placeholder={kind==="quote"?"Container size, quantity, origin, destination, cargo, or target dates…":"Tell us a little about your request…"}/></label>
    <button className="button button-primary" type="submit">{buttonLabel} <span>↗</span></button>
    {status&&<p className="form-status" role="status">{status}</p>}
  </form>;
}
