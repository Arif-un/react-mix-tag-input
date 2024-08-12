"use client";
"use strict";var L=Object.create;var x=Object.defineProperty;var P=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var J=Object.getPrototypeOf,j=Object.prototype.hasOwnProperty;var k=(r,n)=>{for(var t in n)x(r,t,{get:n[t],enumerable:!0})},M=(r,n,t,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let e of S(n))!j.call(r,e)&&e!==t&&x(r,e,{get:()=>n[e],enumerable:!(o=P(n,e))||o.enumerable});return r};var l=(r,n,t)=>(t=r!=null?L(J(r)):{},M(n||!r||!r.__esModule?x(t,"default",{value:r,enumerable:!0}):t,r)),H=r=>M(x({},"__esModule",{value:!0}),r);var _={};k(_,{default:()=>U});module.exports=H(_);var s=l(require("react"));function v(r){return typeof r=="object"&&r.type==="tag"}function w(r){return{type:"tag",attrs:{...r.attrs}}}function b(r){let n=[];return r.forEach(t=>{var o;t.type==="paragraph"&&(n.push([]),(o=t==null?void 0:t.content)==null||o.forEach(e=>{var a,u;e.type==="text"&&e.text&&((a=n.at(-1))==null||a.push(e.text)),e.type==="tag"&&((u=n.at(-1))==null||u.push(w(e)))}))}),n}function T(r){let n=[];return r.forEach((t,o)=>{Array.isArray(n[o])||n.push({type:"paragraph",content:[]});let e=n.at(-1);typeof t=="string"&&(e!=null&&e.content)&&e.content.push({type:"text",text:t}),!Array.isArray(t)&&v(t)&&(e!=null&&e.content)&&e.content.push({type:"tag",attrs:{...t.attrs}}),Array.isArray(t)&&t.forEach(a=>{typeof a=="string"&&(e!=null&&e.content)&&e.content.push({type:"text",text:a}),typeof a=="object"&&a.type==="tag"&&(e!=null&&e.content)&&e.content.push({type:"tag",attrs:{...a.attrs}})})}),n}var m=require("@tiptap/react"),A=l(require("@tiptap/extension-document")),I=l(require("@tiptap/extension-paragraph")),E=l(require("@tiptap/extension-text")),N=l(require("@tiptap/extension-placeholder"));var g=require("@tiptap/core"),V=g.Node.create({name:"tag",group:"inline",inline:!0,atom:!0,selectable:!1,parseHTML(){return[{tag:`span[data-type="${this.name}"]`}]},renderHTML({HTMLAttributes:r}){return["span",(0,g.mergeAttributes)(r)]},addNodeView:()=>({node:r,extension:n})=>{let t=document.createElement("span");t.className="mi-tag";let{label:o,id:e,class:a,style:u,...d}=r.attrs;t.innerHTML=o,t.setAttribute("data-type","tag"),e&&t.setAttribute("data-id",e),n.options.tagClassName&&t.classList.add(n.options.tagClassName),a&&(Array.isArray(a)?a.forEach(c=>{t.classList.add(c)}):t.classList.add(a)),u&&Object.assign(t.style,u),Object.keys(d).length&&Object.keys(d).forEach(c=>{t.dataset[c]=d[c]});let f=document.createElement("span");return f.appendChild(t),f.appendChild(document.createTextNode("\u200B")),{dom:f}},addAttributes(){let r={};for(let n in this.options.attrs)r[n]={default:this.options.attrs[n]};return r}});var F={id:void 0,label:void 0,class:void 0,style:void 0},D=(0,s.forwardRef)((r,n)=>{let{onChange:t,value:o,placeholder:e,readonly:a=!1,tagClassName:u,editorOptions:d,className:f,tagAttrs:c,...O}=r,y=(0,s.useRef)(null),i=(0,m.useEditor)({editorProps:{attributes:{class:`mix-input ${f}`,...O}},extensions:[A.default,I.default.configure({HTMLAttributes:{class:"mi-paragraph"}}),E.default,N.default.configure({placeholder:e}),V.configure({tagClassName:u,attrs:{...F,...c}})],onUpdate:({editor:p})=>{var h;t==null||t(b(((h=p==null?void 0:p.getJSON())==null?void 0:h.content)||[]))},...d}),R=p=>{i==null||i.chain().focus().insertContent(p).run()};return(0,s.useEffect)(()=>{let p=T(o);p.length===0&&(p=[{type:"paragraph"}]),JSON.stringify(p)!==JSON.stringify(i==null?void 0:i.getJSON().content)&&(i==null||i.commands.setContent(p))},[o]),(0,s.useImperativeHandle)(n,()=>({element:y.current,editor:i,insertContent:R})),s.default.createElement(m.EditorContent,{editor:i,innerRef:y})}),C=D;var U=C;
//# sourceMappingURL=index.js.map