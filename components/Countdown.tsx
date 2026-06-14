'use client';
import { useEffect, useState } from 'react';
export function Countdown(){const target=new Date('2026-08-31T17:00:00-07:00').getTime();const [t,setT]=useState(target-Date.now());useEffect(()=>{const id=setInterval(()=>setT(target-Date.now()),60000);return()=>clearInterval(id)},[]);const d=Math.max(0,t);const days=Math.floor(d/86400000),hours=Math.floor(d%86400000/3600000),mins=Math.floor(d%3600000/60000);return <div className="glass inline-flex gap-4 rounded-3xl p-4"><span className="text-white/60">Fall Rush Starts In</span><b>{days}d</b><b>{hours}h</b><b>{mins}m</b></div>}
