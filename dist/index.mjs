"use client";
import I,{forwardRef as E,useEffect as N,useImperativeHandle as C,useRef as O}from"react";function b(r){return typeof r=="object"&&r.type==="tag"}function T(r){return{type:"tag",attrs:{...r.attrs}}}function x(r){let n=[];return r.forEach(t=>{var p;t.type==="paragraph"&&(n.push([]),(p=t==null?void 0:t.content)==null||p.forEach(e=>{var a,s;e.type==="text"&&e.text&&((a=n.at(-1))==null||a.push(e.text)),e.type==="tag"&&((s=n.at(-1))==null||s.push(T(e)))}))}),n}function g(r){let n=[];return r.forEach((t,p)=>{Array.isArray(n[p])||n.push({type:"paragraph",content:[]});let e=n.at(-1);typeof t=="string"&&(e!=null&&e.content)&&e.content.push({type:"text",text:t}),!Array.isArray(t)&&b(t)&&(e!=null&&e.content)&&e.content.push({type:"tag",attrs:{...t.attrs}}),Array.isArray(t)&&t.forEach(a=>{typeof a=="string"&&(e!=null&&e.content)&&e.content.push({type:"text",text:a}),typeof a=="object"&&a.type==="tag"&&(e!=null&&e.content)&&e.content.push({type:"tag",attrs:{...a.attrs}})})}),n}import{EditorContent as R,useEditor as L}from"@tiptap/react";import P from"@tiptap/extension-document";import S from"@tiptap/extension-paragraph";import J from"@tiptap/extension-text";import j from"@tiptap/extension-placeholder";import{mergeAttributes as V,Node as A}from"@tiptap/core";var m=A.create({name:"tag",group:"inline",inline:!0,atom:!0,selectable:!1,parseHTML(){return[{tag:`span[data-type="${this.name}"]`}]},renderHTML({HTMLAttributes:r}){return["span",V(r)]},addNodeView:()=>({node:r,extension:n})=>{let t=document.createElement("span");t.className="mi-tag";let{label:p,id:e,class:a,style:s,...c}=r.attrs;t.innerHTML=p,t.setAttribute("data-type","tag"),e&&t.setAttribute("data-id",e),n.options.tagClassName&&t.classList.add(n.options.tagClassName),a&&(Array.isArray(a)?a.forEach(u=>{t.classList.add(u)}):t.classList.add(a)),s&&Object.assign(t.style,s),Object.keys(c).length&&Object.keys(c).forEach(u=>{t.dataset[u]=c[u]});let d=document.createElement("span");return d.appendChild(t),d.appendChild(document.createTextNode("\u200B")),{dom:d}},addAttributes(){let r={};for(let n in this.options.attrs)r[n]={default:this.options.attrs[n]};return r}});var k={id:void 0,label:void 0,class:void 0,style:void 0},H=E((r,n)=>{let{onChange:t,value:p,placeholder:e,readonly:a=!1,tagClassName:s,editorOptions:c,className:d,tagAttrs:u,ref:v,...h}=r,f=O(null),o=L({editorProps:{attributes:{class:`mix-input ${d}`}},extensions:[P,S.configure({HTMLAttributes:{class:"mi-paragraph"}}),J,j.configure({placeholder:e}),m.configure({tagClassName:s,attrs:{...k,...u}})],onUpdate:({editor:i})=>{var l;t==null||t(x(((l=i==null?void 0:i.getJSON())==null?void 0:l.content)||[]))},...c}),M=i=>{o==null||o.chain().focus().insertContent(i).run()};return N(()=>{let i=g(p);i.length===0&&(i=[{type:"paragraph"}]),JSON.stringify(i)!==JSON.stringify(o==null?void 0:o.getJSON().content)&&(o==null||o.commands.setContent(i))},[p]),C(n,()=>({element:f.current,editor:o,insertContent:M})),I.createElement(R,{editor:o,innerRef:f,...h})}),y=H;var et=y;export{et as default};
//# sourceMappingURL=index.mjs.map