"use client";
import R,{forwardRef as E,useEffect as b,useImperativeHandle as h,useRef as y}from"react";var f="mtag";function d(a){var i;if(!a)return[];let l=Array.from(a),e=[];for(let s=0;s<l.length;s+=1){let n=l[s],u=e.at(-1);if(n instanceof Node&&n.nodeName==="#text"&&n.textContent!==`
`&&n.textContent!==""&&(typeof u=="string"?e[e.length-1]=u+n.textContent:e.push(n.textContent||"")),n instanceof HTMLElement&&n.nodeName==="SPAN"){let r=(i=n==null?void 0:n.classList)==null?void 0:i.value.replace(f,"").trim();e.push({type:"tag",label:n.innerHTML||n.innerText,...r?{classes:r}:{}})}}return e}function g(a){return!Array.isArray(a)||a.length===0?"":a.reduce((l,e)=>{if(typeof e=="string")return l+=e;if(typeof e=="object"){let{label:i,classes:s}=e;return l+=`<span class="${f} ${s||""}" contenteditable="false">${i}</span>`}return""},"")}var I=E((a,l)=>{let{onChange:e,value:i,multiline:s,...n}=a,u=y(g(i)),r=y(null);b(()=>{r.current&&(r.current.innerHTML=g(i))},[i]);let L=t=>{var m,T,M;let c=window.getSelection();if(!c)return;let x=c.getRangeAt(0);x.deleteContents();let o;if(typeof t=="string"?(o=document.createTextNode(t),o.textContent=t):typeof t=="object"&&t.type==="tag"&&(o=document.createElement("span"),o.classList.add(f),t.classes&&o.classList.add(t.classes),o.setAttribute("contentEditable","false"),o.innerHTML=t.label),!o){console.error("invalid content");return}x.insertNode(o);let p=document.createRange();p.setStartAfter(o),p.setEndAfter(o),c.removeAllRanges(),c.addRange(p),(m=r.current)==null||m.focus(),u.current=((T=r.current)==null?void 0:T.innerHTML)??"",e==null||e(d((M=r.current)==null?void 0:M.childNodes))};return h(l,()=>({inputRef:r.current,insertContent:L,getValue:()=>{var t;return d((t=r.current)==null?void 0:t.childNodes)}})),R.createElement("div",{"aria-label":"input",role:"textbox",tabIndex:0,className:"mix-tag-input",contentEditable:!0,ref:r,onInput:()=>{var t;r.current&&(u.current=r.current.innerHTML),e==null||e(d((t=r.current)==null?void 0:t.childNodes))},onKeyDown:t=>{t.key==="Enter"&&!s&&t.preventDefault()},dangerouslySetInnerHTML:{__html:u.current},...s?{"aria-multiline":!0}:{},...n})}),A=I;var F=A;export{F as default};
//# sourceMappingURL=index.mjs.map