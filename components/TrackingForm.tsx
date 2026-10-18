"use client";
import { useState, type FormEvent } from "react";
export function TrackingForm() {
  const [reference,setReference]=useState(""); const [message,setMessage]=useState("");
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const portal=process.env.NEXT_PUBLIC_TRACKING_URL;if(portal){const url=new URL(portal);url.searchParams.set("reference",reference.trim());window.location.href=url.toString();}else{setMessage("Live tracking is not connected on this site yet. Please contact NCSI with your reference number.");}}
  return <form className="tracking-form" onSubmit={submit}><label htmlFor="tracking-ref">Shipment or booking reference</label><div className="tracking-input"><input id="tracking-ref" value={reference} onChange={e=>setReference(e.target.value)} required placeholder="e.g., NCSI123456789"/><button className="button button-primary">Track shipment <span>↗</span></button></div>{message&&<p role="status" className="form-status">{message} <a href="mailto:info@ncsifreightsupplies.com">Email our team</a>.</p>}</form>;
}
