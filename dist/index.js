"use client";
"use strict";var E=Object.create;var f=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var N=Object.getPrototypeOf,V=Object.prototype.hasOwnProperty;var H=(t,n)=>{for(var e in n)f(t,e,{get:n[e],enumerable:!0})},A=(t,n,e,u)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of h(n))!V.call(t,i)&&i!==e&&f(t,i,{get:()=>n[i],enumerable:!(u=b(n,i))||u.enumerable});return t};var S=(t,n,e)=>(e=t!=null?E(N(t)):{},A(n||!t||!t.__esModule?f(e,"default",{value:t,enumerable:!0}):e,t)),v=t=>A(f({},"__esModule",{value:!0}),t);var P={};H(P,{default:()=>D});module.exports=v(P);var l=S(require("react"));var d="mtag";function x(t){var u;if(!t)return[];let n=Array.from(t),e=[];for(let i=0;i<n.length;i+=1){let o=n[i],c=e.at(-1);if(o instanceof Node&&o.nodeName==="#text"&&o.textContent!==`
`&&o.textContent!==""&&(typeof c=="string"?e[e.length-1]=c+o.textContent:e.push(o.textContent||"")),o instanceof HTMLElement&&o.nodeName==="SPAN"){let a=(u=o==null?void 0:o.classList)==null?void 0:u.value.replace(d,"").trim();e.push({type:"tag",label:o.innerHTML||o.innerText,...a?{classes:a}:{}})}}return e}function M(t){return!Array.isArray(t)||t.length===0?"":t.reduce((n,e)=>{if(typeof e=="string")return n+=e;if(typeof e=="object"){let{label:u,classes:i}=e;return n+=`<span class="${d} ${i||""}" contenteditable="false">${u}</span>`}return""},"")}var C=(0,l.forwardRef)((t,n)=>{let{onChange:e,value:u,multiline:i,...o}=t,c=(0,l.useRef)(M(u)),a=(0,l.useRef)(null);(0,l.useEffect)(()=>{a.current&&(a.current.innerHTML=M(u))},[u]);let R=r=>{var y,I,T;let p=window.getSelection();if(!p)return;let m=p.getRangeAt(0);m.deleteContents();let s;if(typeof r=="string"?(s=document.createTextNode(r),s.textContent=r):typeof r=="object"&&r.type==="tag"&&(s=document.createElement("span"),s.classList.add(d),r.classes&&s.classList.add(r.classes),s.setAttribute("contentEditable","false"),s.innerHTML=r.label),!s){console.error("invalid content");return}m.insertNode(s);let g=document.createRange();g.setStartAfter(s),g.setEndAfter(s),p.removeAllRanges(),p.addRange(g),(y=a.current)==null||y.focus(),c.current=((I=a.current)==null?void 0:I.innerHTML)??"",e==null||e(x((T=a.current)==null?void 0:T.childNodes))};return(0,l.useImperativeHandle)(n,()=>({inputRef:a.current,insertContent:R,getValue:()=>{var r;return x((r=a.current)==null?void 0:r.childNodes)}})),l.default.createElement("div",{"aria-label":"input",role:"textbox",tabIndex:0,className:"mix-tag-input",contentEditable:!0,ref:a,onInput:()=>{var r;a.current&&(c.current=a.current.innerHTML),e==null||e(x((r=a.current)==null?void 0:r.childNodes))},onKeyDown:r=>{r.key==="Enter"&&!i&&r.preventDefault()},dangerouslySetInnerHTML:{__html:c.current},...i?{"aria-multiline":!0}:{},...o})}),L=C;var D=L;
//# sourceMappingURL=index.js.map