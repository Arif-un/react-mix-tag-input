"use client";
import ae,{forwardRef as oe,useEffect as U,useId as se,useImperativeHandle as ie,useRef as H}from"react";var $="mtag",R={TAG:"tag",LINE_BREAK:"line-break"};function v(n,d,o=!1){var l,f;if(!n)return[];let a=Array.from(n),e=[];for(let g=0;g<a.length;g+=1){let s=a[g],b=e.at(-1);if(s instanceof Node&&s.nodeName==="#text"&&s.textContent!==`
`&&s.textContent!==""){let I=ne(s.textContent||"");typeof b=="string"?e[e.length-1]=b+I:e.push(I||"")}if(s instanceof HTMLElement&&s.nodeName==="SPAN"){let I=(l=s==null?void 0:s.classList)==null?void 0:l.value.replace($,"").trim(),C=((f=s==null?void 0:s.dataset)==null?void 0:f.id)||"";e.push({...o?{tagId:C}:{},type:R.TAG,label:s.innerHTML||s.innerText,...I?{classes:I}:{},...d.current[C]?{data:d.current[C]}:{}})}s instanceof HTMLElement&&s.nodeName==="BR"&&e.push({type:R.LINE_BREAK})}return e}function ne(n){return n.replace(/[\u200B]/g,"")}function re({classes:n,text:d,id:o,showTagDeleteBtn:a}){return`<span data-id="${o}" class="${$} ${n}" contenteditable="false">${d.trim()}${a?'<button class="mtag-delete-btn" contenteditable="false" tabindex="-1">\xD7</button>':""}</span>&ZeroWidthSpace;`}function V({valueArr:n,showTagDeleteBtn:d=!1,tagsDataRef:o,componentId:a}){return!Array.isArray(n)||n.length===0?"":n.reduce((e,l)=>{if(typeof l=="string")return e+=l;if(E(l)){let{label:f,classes:g,data:s}=l,b=q(a);return s&&(o.current[b]=s),e+=re({classes:g||"",text:f,id:b,showTagDeleteBtn:d})}return typeof l=="object"&&l.type==="line-break"?e+="<br>":""},"")}function q(n){let d=Date.now().toString(36),o=Math.random().toString(36).substr(2);return n+d+o}function j({componentId:n,tagsDataRef:d,showTagDeleteBtn:o,data:a}){let e=document.createElement("span");e.setAttribute("contentEditable","false");let l=q(n);if(e.setAttribute("data-id",l),e.classList.add($),e.innerHTML=a.label,a.classes&&e.classList.add(a.classes),a.data&&(d.current[l]=a.data,e.setAttribute("data-id",l)),o){let f=document.createElement("button");f.classList.add("mtag-delete-btn"),f.setAttribute("contentEditable","false"),f.setAttribute("tabIndex","-1"),f.innerHTML="&times;",e.appendChild(f)}return e}function O(n,d){var l;if(!n)return{foundNode:void 0,nodeIndex:0};let o=null,a=0,e=Array.from(n.childNodes);for(let f=0;f<e.length;f++){let g=e[f];if(g!=null&&g.textContent){let s=g.textContent.length;if(a+s>=d){o=g;break}a+=s}}return o||(o=e.at(-1),a=((l=o==null?void 0:o.textContent)==null?void 0:l.length)||0),{foundNode:o,nodeIndex:a}}function E(n){return typeof n=="object"&&n.type===R.TAG}function K(n){return typeof n=="object"&&n.type===R.LINE_BREAK}function W({item:n,componentId:d,tagsDataRef:o,showTagDeleteBtn:a}){if(typeof n=="string"){let e=document.createTextNode(n);return e.textContent=n,e}else{if(E(n))return j({componentId:d,tagsDataRef:o,data:n,showTagDeleteBtn:a});if(K(n))return document.createElement("br");if(Array.isArray(n))return n.map(e=>{if(typeof e=="string"){let l=document.createTextNode(e);return l.textContent=e,l}else if(E(e))return j({componentId:d,tagsDataRef:o,data:e,showTagDeleteBtn:a})}).reverse()}}function Z(n){if(Array.isArray(n)){let d=n.at(-1);if(d&&(K(d)||E(d)))return 1}else if(K(n)||E(n))return 1;return 0}var ue=oe((n,d)=>{let o=se(),a=H({}),{onChange:e,onClick:l,value:f,multiline:g,placeholder:s,showTagDeleteBtn:b=!0,readonly:I=!1,onPaste:C,onKeyDown:D,onSelect:w,onFocus:k,...J}=n,B=H(V({componentId:o,tagsDataRef:a,valueArr:f,showTagDeleteBtn:b})),i=H(null),T=H(0);U(()=>{i.current&&(i.current.innerHTML=V({componentId:o,tagsDataRef:a,valueArr:f,showTagDeleteBtn:b}))},[f]);let F=t=>{var S,L,x,y;let c=window.getSelection();if(!c)return;let r=c.getRangeAt(0);if(r.commonAncestorContainer!==i.current&&r.commonAncestorContainer.parentElement!==i.current)return;r.deleteContents();let u=W({item:t,componentId:o,tagsDataRef:a,showTagDeleteBtn:b}),p=0;if(Array.isArray(u)?u.forEach(m=>{var A;m&&(m.nodeName!=="BR"&&(p+=((A=m.textContent)==null?void 0:A.length)||0),m.nodeName==="SPAN"&&(p+=1),r.insertNode(m),r.setEndAfter(m))}):u&&(u.nodeName!=="BR"&&(p+=((S=u.textContent)==null?void 0:S.length)||0),u.nodeName==="SPAN"&&(p+=1),r.insertNode(u),r.setEndAfter(u)),!u){console.error("invalid content");return}B.current=((L=i.current)==null?void 0:L.innerHTML)??"";let M=Z(t);T.current+=p+M,(x=i.current)==null||x.focus(),e==null||e(v((y=i.current)==null?void 0:y.childNodes,a))};ie(d,()=>({inputRef:i.current,insertContent:F,getValue:()=>{var t;return v((t=i.current)==null?void 0:t.childNodes,a)}}));let Q=()=>{var t;i.current&&(B.current=i.current.innerHTML),e==null||e(v((t=i.current)==null?void 0:t.childNodes,a))},X=t=>{var c,r,u,p,M,S,L;if(D==null||D(t),t.key==="Enter"&&!g)t.preventDefault();else if(t.key==="Enter"&&g){t.preventDefault(),F({type:"line-break"});return}else if(t.key==="Backspace"){let{node:x,charCode:y}=_(G()),m=null;if(((c=x==null?void 0:x.previousSibling)==null?void 0:c.nodeName)==="SPAN"){let A=x==null?void 0:x.previousSibling;m=(r=A.getAttribute)==null?void 0:r.call(A,"data-id")}if(m&&y===8203){t.preventDefault();let A=v((u=i.current)==null?void 0:u.childNodes,a,!0),{label:P}=A.find(h=>E(h)&&(h==null?void 0:h.tagId)===m),ee=A.filter(h=>!(E(h)&&h.tagId===m)),te=V({valueArr:ee,componentId:o,showTagDeleteBtn:b,tagsDataRef:a});i!=null&&i.current&&(i.current.innerHTML=te),N(T.current-P.length-1)}T.current-=1;return}else if(t.key==="ArrowLeft"){let{node:x,charCode:y}=_(T.current),m=x==null?void 0:x.previousSibling,A=(p=m.getAttribute)==null?void 0:p.call(m,"data-id");if(A&&y===8203){t.preventDefault();let P=(M=i.current)==null?void 0:M.querySelector(`[data-id="${A}"]`);N(T.current-(((S=P==null?void 0:P.textContent)==null?void 0:S.length)||0)-1)}return}else if(t.key==="ArrowRight"){let x=T.current+1,{node:y}=_(x);(y==null?void 0:y.nodeName)==="SPAN"&&(t.preventDefault(),N(T.current+(((L=y==null?void 0:y.textContent)==null?void 0:L.length)||0)+1));return}else t.key!=="Delete"&&t.key!=="Tab"&&(T.current+=1)},Y=t=>{var c,r,u;t.target instanceof HTMLButtonElement&&t.target.classList.contains("mtag-delete-btn")&&((r=(c=t.target)==null?void 0:c.parentElement)==null||r.remove(),e==null||e(v((u=i.current)==null?void 0:u.childNodes,a))),l==null||l(t)};function G(){let t=0;if(window.getSelection){let c=window.getSelection();if(i.current&&(c!=null&&c.rangeCount)&&c.rangeCount>0){let r=c.getRangeAt(0),u=r.cloneRange();u.selectNodeContents(i.current),u.setEnd(r.endContainer,r.endOffset),t=u.toString().length}}return t}U(()=>{N(T.current)},[T.current,f]);function N(t){let c=t;if(!i.current)return;let{foundNode:r,nodeIndex:u}=O(i.current,c);if(r!=null&&r.textContent){let p=document.createRange(),M=window.getSelection();if(!M)return;r!=null&&r.textContent&&(r==null?void 0:r.textContent.length)>=c-u?p.setStart(r,c-u):p.setStart(r,r.textContent.length),p.collapse(!0),M.removeAllRanges(),M.addRange(p),T.current=t}}function _(t){let c=t,{foundNode:r,nodeIndex:u}=O(i.current,c);if(r!=null&&r.textContent){let p=c-u-1,M=r.textContent[p];return{charCode:M==null?void 0:M.charCodeAt(0),node:r,nodeIndex:u,index:p}}return{}}return ae.createElement("div",{"data-placeholder":s,"aria-label":"input",role:"textbox",tabIndex:0,className:"mix-tag-input",contentEditable:!I,ref:i,onInput:Q,onKeyDown:X,onClick:Y,onSelect:t=>{w==null||w(t),T.current=G()},onPaste:t=>{t.preventDefault();let r=t.clipboardData.getData("text/plain");F(r),C==null||C(t)},onFocus:t=>{N(T.current),k==null||k(t)},dangerouslySetInnerHTML:{__html:B.current},...g?{"aria-multiline":!0}:{},...J})}),z=ue;var Ae=z;export{Ae as default};
//# sourceMappingURL=index.mjs.map