import N, { forwardRef as h, useRef as x, useEffect as E, useImperativeHandle as H } from "react";
const p = "mtag";
function d(o) {
  var a;
  if (!o)
    return [];
  const i = Array.from(o), e = [];
  for (let c = 0; c < i.length; c += 1) {
    const n = i[c], l = e.at(-1);
    if (n instanceof Node && n.nodeName === "#text" && n.textContent !== `
` && n.textContent !== "" && (typeof l == "string" ? e[e.length - 1] = l + n.textContent : e.push(n.textContent || "")), n instanceof HTMLElement && n.nodeName === "SPAN") {
      const r = (a = n == null ? void 0 : n.classList) == null ? void 0 : a.value.replace(p, "").trim();
      e.push({
        type: "tag",
        label: n.innerHTML || n.innerText,
        ...r ? { classes: r } : {}
      });
    }
  }
  return e;
}
function A(o) {
  return !Array.isArray(o) || o.length === 0 ? "" : o.reduce((i, e) => {
    if (typeof e == "string")
      return i += e;
    if (typeof e == "object") {
      const { label: a, classes: c } = e;
      return i += `<span class="${p} ${c || ""}" contenteditable="false">${a}</span>`;
    }
    return "";
  }, "");
}
h((o, i) => {
  const { onChange: e, value: a, multiline: c, ...n } = o, l = x(A(a)), r = x(null);
  E(() => {
    r.current && (r.current.innerHTML = A(a));
  }, [a]);
  const b = (t) => {
    var m, y, T;
    const u = window.getSelection();
    if (!u)
      return;
    const g = u.getRangeAt(0);
    g.deleteContents();
    let s;
    if (typeof t == "string" ? (s = document.createTextNode(t), s.textContent = t) : typeof t == "object" && t.type === "tag" && (s = document.createElement("span"), s.classList.add(p), t.classes && s.classList.add(t.classes), s.setAttribute("contentEditable", "false"), s.innerHTML = t.label), !s) {
      console.error("invalid content");
      return;
    }
    g.insertNode(s);
    const f = document.createRange();
    f.setStartAfter(s), f.setEndAfter(s), u.removeAllRanges(), u.addRange(f), (m = r.current) == null || m.focus(), l.current = ((y = r.current) == null ? void 0 : y.innerHTML) ?? "", e == null || e(d((T = r.current) == null ? void 0 : T.childNodes));
  };
  H(i, () => ({
    inputRef: r.current,
    insertContent: b,
    getValue: () => {
      var t;
      return d((t = r.current) == null ? void 0 : t.childNodes);
    }
  }));
  const L = () => {
    var t;
    r.current && (l.current = r.current.innerHTML), e == null || e(d((t = r.current) == null ? void 0 : t.childNodes));
  }, R = (t) => {
    t.key === "Enter" && !c && t.preventDefault();
  };
  return N.createElement("div", { "aria-label": "input", role: "textbox", tabIndex: 0, className: "mix-tag-input", contentEditable: !0, ref: r, onInput: L, onKeyDown: R, dangerouslySetInnerHTML: { __html: l.current }, ...c ? { "aria-multiline": !0 } : {}, ...n });
});
