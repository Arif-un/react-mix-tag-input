"use client";
"use strict";var S=Object.create;var g=Object.defineProperty;var N=Object.getOwnPropertyDescriptor;var V=Object.getOwnPropertyNames;var C=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var P=(t,r)=>{for(var e in r)g(t,e,{get:r[e],enumerable:!0})},A=(t,r,e,s)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of V(r))!D.call(t,a)&&a!==e&&g(t,a,{get:()=>r[a],enumerable:!(s=N(r,a))||s.enumerable});return t};var _=(t,r,e)=>(e=t!=null?S(C(t)):{},A(r||!t||!t.__esModule?g(e,"default",{value:t,enumerable:!0}):e,t)),w=t=>A(g({},"__esModule",{value:!0}),t);var $={};P($,{default:()=>F});module.exports=w($);var u=_(require("react"));var M="mtag";function m(t){var s;if(!t)return[];let r=Array.from(t),e=[];for(let a=0;a<r.length;a+=1){let o=r[a],x=e.at(-1);if(o instanceof Node&&o.nodeName==="#text"&&o.textContent!==`
`&&o.textContent!==""&&(typeof x=="string"?e[e.length-1]=x+o.textContent:e.push(o.textContent||"")),o instanceof HTMLElement&&o.nodeName==="SPAN"){let p=(s=o==null?void 0:o.classList)==null?void 0:s.value.replace(M,"").trim();e.push({type:"tag",label:o.innerHTML||o.innerText,...p?{classes:p}:{}})}}return e}function b(t,r=!1){return!Array.isArray(t)||t.length===0?"":t.reduce((e,s)=>{if(typeof s=="string")return e+=s;if(typeof s=="object"){let{label:a,classes:o}=s;return e+=`<span class="${M} ${o||""}" contenteditable="false">${a} ${r?'<button class="mtag-delete-btn" contenteditable="false" tabindex="-1">\xD7</button>':""}</span>`}return""},"")}var K=(0,u.forwardRef)((t,r)=>{let{onChange:e,onClick:s,value:a,multiline:o,placeholder:x,showTagDeleteBtn:p=!0,readonly:R=!1,...H}=t,y=(0,u.useRef)(b(a,p)),l=(0,u.useRef)(null);(0,u.useEffect)(()=>{l.current&&(l.current.innerHTML=b(a,p))},[a]);let v=n=>{var E,I,L;let c=window.getSelection();if(!c)return;let d=c.getRangeAt(0);if(d.commonAncestorContainer!==l.current&&d.commonAncestorContainer.parentElement!==l.current)return;d.deleteContents();let i=null;if(typeof n=="string")i=document.createTextNode(n),i.textContent=n;else if(typeof n=="object"&&n.type==="tag"&&(i=document.createElement("span"),i.classList.add(M),n.classes&&i.classList.add(n.classes),i.setAttribute("contentEditable","false"),i.innerHTML=n.label,p)){let f=document.createElement("button");f.classList.add("mtag-delete-btn"),f.setAttribute("contentEditable","false"),f.setAttribute("tabIndex","-1"),f.innerHTML="&times;",i.appendChild(f)}if(!i){console.error("invalid content");return}d.insertNode(i);let T=document.createRange();T.setStartAfter(i),T.setEndAfter(i),c.removeAllRanges(),c.addRange(T),(E=l.current)==null||E.focus(),y.current=((I=l.current)==null?void 0:I.innerHTML)??"",e==null||e(m((L=l.current)==null?void 0:L.childNodes))};return(0,u.useImperativeHandle)(r,()=>({inputRef:l.current,insertContent:v,getValue:()=>{var n;return m((n=l.current)==null?void 0:n.childNodes)}})),u.default.createElement("div",{"data-placeholder":x,"aria-label":"input",role:"textbox",tabIndex:0,className:"mix-tag-input",contentEditable:!R,ref:l,onInput:()=>{var n;l.current&&(y.current=l.current.innerHTML),e==null||e(m((n=l.current)==null?void 0:n.childNodes))},onKeyDown:n=>{n.key==="Enter"&&!o&&n.preventDefault()},onClick:n=>{var c,d,i;n.target instanceof HTMLButtonElement&&n.target.classList.contains("mtag-delete-btn")&&((d=(c=n.target)==null?void 0:c.parentElement)==null||d.remove(),e==null||e(m((i=l.current)==null?void 0:i.childNodes))),s==null||s(n)},dangerouslySetInnerHTML:{__html:y.current},...o?{"aria-multiline":!0}:{},...H})}),h=K;var F=h;
//# sourceMappingURL=index.js.map