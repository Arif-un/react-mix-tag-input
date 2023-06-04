"use client";
"use strict";var te=Object.create;var H=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var ae=Object.getPrototypeOf,oe=Object.prototype.hasOwnProperty;var se=(t,i)=>{for(var a in i)H(t,a,{get:i[a],enumerable:!0})},G=(t,i,a,o)=>{if(i&&typeof i=="object"||typeof i=="function")for(let n of re(i))!oe.call(t,n)&&n!==a&&H(t,n,{get:()=>i[n],enumerable:!(o=ne(i,n))||o.enumerable});return t};var ie=(t,i,a)=>(a=t!=null?te(ae(t)):{},G(i||!t||!t.__esModule?H(a,"default",{value:t,enumerable:!0}):a,t)),ce=t=>G(H({},"__esModule",{value:!0}),t);var pe={};se(pe,{default:()=>fe});module.exports=ce(pe);var p=ie(require("react"));var $="mtag",S={TAG:"tag",LINE_BREAK:"line-break"};function C(t,i,a=!1){var d,f;if(!t)return[];let o=Array.from(t),n=[];for(let g=0;g<o.length;g+=1){let c=o[g],y=n.at(-1);if(c instanceof Node&&c.nodeName==="#text"&&c.textContent!==`
`&&c.textContent!==""){let h=ue(c.textContent||"");typeof y=="string"?n[n.length-1]=y+h:n.push(h||"")}if(c instanceof HTMLElement&&c.nodeName==="SPAN"){let h=(d=c==null?void 0:c.classList)==null?void 0:d.value.replace($,"").trim(),I=((f=c==null?void 0:c.dataset)==null?void 0:f.id)||"";n.push({...a?{tagId:I}:{},type:S.TAG,label:c.innerHTML||c.innerText,...h?{classes:h}:{},...i.current[I]?{data:i.current[I]}:{}})}c instanceof HTMLElement&&c.nodeName==="BR"&&n.push({type:S.LINE_BREAK})}return n}function ue(t){return t.replace(/[\u200B]/g,"")}function le({classes:t,text:i,id:a,showTagDeleteBtn:o}){return`<span data-id="${a}" class="${$} ${t}" contenteditable="false">${i.trim()}${o?'<button class="mtag-delete-btn" contenteditable="false" tabindex="-1">\xD7</button>':""}</span>&ZeroWidthSpace;`}function V({valueArr:t,showTagDeleteBtn:i=!1,tagsDataRef:a,componentId:o}){return!Array.isArray(t)||t.length===0?"":t.reduce((n,d)=>{if(typeof d=="string")return n+=d;if(L(d)){let{label:f,classes:g,data:c}=d,y=q(o);return c&&(a.current[y]=c),n+=le({classes:g||"",text:f,id:y,showTagDeleteBtn:i})}return typeof d=="object"&&d.type==="line-break"?n+="<br>":""},"")}function q(t){let i=Date.now().toString(36),a=Math.random().toString(36).substr(2);return t+i+a}function W({componentId:t,tagsDataRef:i,showTagDeleteBtn:a,data:o}){let n=document.createElement("span");n.setAttribute("contentEditable","false");let d=q(t);if(n.setAttribute("data-id",d),n.classList.add($),n.innerHTML=o.label,o.classes&&n.classList.add(o.classes),o.data&&(i.current[d]=o.data,n.setAttribute("data-id",d)),a){let f=document.createElement("button");f.classList.add("mtag-delete-btn"),f.setAttribute("contentEditable","false"),f.setAttribute("tabIndex","-1"),f.innerHTML="&times;",n.appendChild(f)}return n}function O(t,i){var d;if(!t)return{foundNode:void 0,nodeIndex:0};let a=null,o=0,n=Array.from(t.childNodes);for(let f=0;f<n.length;f++){let g=n[f];if(g!=null&&g.textContent){let c=g.textContent.length;if(o+c>=i){a=g;break}o+=c}}return a||(a=n.at(-1),o=((d=a==null?void 0:a.textContent)==null?void 0:d.length)||0),{foundNode:a,nodeIndex:o}}function L(t){return typeof t=="object"&&t.type===S.TAG}function Z(t){return typeof t=="object"&&t.type===S.LINE_BREAK}var de=(0,p.forwardRef)((t,i)=>{let a=(0,p.useId)(),o=(0,p.useRef)({}),{onChange:n,onClick:d,value:f,multiline:g,placeholder:c,showTagDeleteBtn:y=!0,readonly:h=!1,onPaste:I,onKeyDown:k,onSelect:B,onFocus:w,...z}=t,_=(0,p.useRef)(V({componentId:a,tagsDataRef:o,valueArr:f,showTagDeleteBtn:y})),u=(0,p.useRef)(null),b=(0,p.useRef)(0);(0,p.useEffect)(()=>{u.current&&(u.current.innerHTML=V({componentId:a,tagsDataRef:o,valueArr:f,showTagDeleteBtn:y}))},[f]);let F=e=>{var N,P,x,T;let l=window.getSelection();if(!l)return;let r=l.getRangeAt(0);if(r.commonAncestorContainer!==u.current&&r.commonAncestorContainer.parentElement!==u.current)return;r.deleteContents();let s=null;if(typeof e=="string"?(s=document.createTextNode(e),s.textContent=e):L(e)?s=W({componentId:a,tagsDataRef:o,data:e,showTagDeleteBtn:y}):typeof e=="object"&&e.type===S.LINE_BREAK&&(s=document.createElement("br")),!s){console.error("invalid content");return}r.insertNode(s);let m=document.createRange();m.setStartAfter(s),m.setEndAfter(s),l.removeAllRanges(),l.addRange(m),(N=u.current)==null||N.focus(),_.current=((P=u.current)==null?void 0:P.innerHTML)??"";let E=L(e)||Z(e)?1:0;b.current+=(((x=s==null?void 0:s.textContent)==null?void 0:x.length)||0)+E,n==null||n(C((T=u.current)==null?void 0:T.childNodes,o))};(0,p.useImperativeHandle)(i,()=>({inputRef:u.current,insertContent:F,getValue:()=>{var e;return C((e=u.current)==null?void 0:e.childNodes,o)}}));let J=()=>{var e;u.current&&(_.current=u.current.innerHTML),n==null||n(C((e=u.current)==null?void 0:e.childNodes,o))},Q=e=>{var l,r,s,m,E,N,P;if(k==null||k(e),e.key==="Enter"&&!g)e.preventDefault();else if(e.key==="Enter"&&g){e.preventDefault(),F({type:"line-break"});return}else if(e.key==="Backspace"){let{node:x,charCode:T}=K(j()),A=null;if(((l=x==null?void 0:x.previousSibling)==null?void 0:l.nodeName)==="SPAN"){let M=x==null?void 0:x.previousSibling;A=(r=M.getAttribute)==null?void 0:r.call(M,"data-id")}if(A&&T===8203){e.preventDefault();let M=C((s=u.current)==null?void 0:s.childNodes,o,!0),{label:D}=M.find(v=>L(v)&&(v==null?void 0:v.tagId)===A),Y=M.filter(v=>!(L(v)&&v.tagId===A)),ee=V({valueArr:Y,componentId:a,showTagDeleteBtn:y,tagsDataRef:o});u!=null&&u.current&&(u.current.innerHTML=ee),R(b.current-D.length-1)}b.current-=1;return}else if(e.key==="ArrowLeft"){let{node:x,charCode:T}=K(b.current),A=x==null?void 0:x.previousSibling,M=(m=A.getAttribute)==null?void 0:m.call(A,"data-id");if(M&&T===8203){e.preventDefault();let D=(E=u.current)==null?void 0:E.querySelector(`[data-id="${M}"]`);R(b.current-(((N=D==null?void 0:D.textContent)==null?void 0:N.length)||0)-1)}return}else if(e.key==="ArrowRight"){let x=b.current+1,{node:T}=K(x);(T==null?void 0:T.nodeName)==="SPAN"&&(e.preventDefault(),R(b.current+(((P=T==null?void 0:T.textContent)==null?void 0:P.length)||0)+1));return}else e.key!=="Delete"&&e.key!=="Tab"&&(b.current+=1)},X=e=>{var l,r,s;e.target instanceof HTMLButtonElement&&e.target.classList.contains("mtag-delete-btn")&&((r=(l=e.target)==null?void 0:l.parentElement)==null||r.remove(),n==null||n(C((s=u.current)==null?void 0:s.childNodes,o))),d==null||d(e)};function j(){let e=0;if(window.getSelection){let l=window.getSelection();if(u.current&&(l!=null&&l.rangeCount)&&l.rangeCount>0){let r=l.getRangeAt(0),s=r.cloneRange();s.selectNodeContents(u.current),s.setEnd(r.endContainer,r.endOffset),e=s.toString().length}}return e}(0,p.useEffect)(()=>{R(b.current)},[b.current,f]);function R(e){let l=e;if(!u.current)return;let{foundNode:r,nodeIndex:s}=O(u.current,l);if(r!=null&&r.textContent){let m=document.createRange(),E=window.getSelection();if(!E)return;r!=null&&r.textContent&&(r==null?void 0:r.textContent.length)>=l-s?m.setStart(r,l-s):m.setStart(r,r.textContent.length),m.collapse(!0),E.removeAllRanges(),E.addRange(m)}}function K(e){let l=e,{foundNode:r,nodeIndex:s}=O(u.current,l);if(r!=null&&r.textContent){let m=l-s-1,E=r.textContent[m];return{charCode:E==null?void 0:E.charCodeAt(0),node:r,nodeIndex:s,index:m}}return{}}return p.default.createElement("div",{"data-placeholder":c,"aria-label":"input",role:"textbox",tabIndex:0,className:"mix-tag-input",contentEditable:!h,ref:u,onInput:J,onKeyDown:Q,onClick:X,onSelect:e=>{B==null||B(e),b.current=j()},onPaste:e=>{e.preventDefault();let r=e.clipboardData.getData("text/plain");F(r),I==null||I(e)},onFocus:e=>{R(b.current),w==null||w(e)},dangerouslySetInnerHTML:{__html:_.current},...g?{"aria-multiline":!0}:{},...z})}),U=de;var fe=U;
//# sourceMappingURL=index.js.map