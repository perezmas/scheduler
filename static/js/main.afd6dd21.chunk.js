(this["webpackJsonpfinal-project-starter"]=this["webpackJsonpfinal-project-starter"]||[]).push([[0],{24:function(e,t,n){},25:function(e,t,n){},26:function(e,t,n){},32:function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),r=n(7),i=n.n(r),u=(n(24),n(25),n(26),n(27),n(8));function c(e,t){var n=e.map((function(e){return e}));switch(t.type){case"ADD SEMESTER":var a=t,s=function(e,t){for(var n=0;n<e.length;n++)if(e[n].uuid===t)return n;return-1}(n,a.uuid),r=n[s],i=(new Array).concat(r.semesters);return i.push({name:a.name,start:a.start,end:a.end,uuid:a.semesterUuid,courses:new Map}),n[s]={index:n[s].index,uuid:n[s].uuid,semesters:i},n;case"ADD YEAR":var u=t,c={index:u.index,uuid:u.uuid,semesters:new Array};return n.push(c),n;default:throw Error("".concat(t.type," not implemented!"))}}function d(e){return void 0!==e?e:new Array}var o=function(e){var t=Object(a.useReducer)(c,e,d),n=Object(u.a)(t,2),s=n[0],r=n[1];return{value:s,push:function(e,t){r({type:"ADD YEAR",uuid:e,index:t})},putSemester:function(e,t,n,a,s){r({type:"ADD SEMESTER",uuid:e,name:s,start:n,end:a,semesterUuid:t})}}},j=n(43),l=n(14),b=n.n(l),m=n(39),O=n(40),f=n(41),h=n(42),p=n(44),x=n(12),g=n(1),v=s.a.forwardRef((function(e,t){var n=Object(a.useRef)(null),s=Object(a.useState)(!1),r=Object(u.a)(s,2),i=r[0],c=r[1],d=Object(a.useMemo)((function(){return e.semesters.sort((function(e,t){return t.start.getTime()-e.start.getTime()}))}),[e.semesters]);return Object(g.jsx)(m.a,{className:"container-sm",ref:t,children:Object(g.jsx)(O.a,{children:Object(g.jsx)(b.a,{onOpening:function(){c(!0)},onClose:function(){c(!1)},trigger:Object(g.jsx)("button",{"data-testid":"Year ".concat(e.index," label"),className:"trigger",children:"Year ".concat(e.index," >")}),transitionTime:200,children:Object(g.jsxs)(f.a,{hidden:!i,children:[d.map((function(e){return Object(g.jsx)(O.a,{children:e.name},e.uuid)})),Object(g.jsxs)(O.a,{children:[Object(g.jsx)("button",{"data-testid":"trigger",className:"trigger",ref:n,onClick:function(){e.setFormUuid(e.formUuid===e.uuid?null:e.uuid)},children:"+"}),Object(g.jsx)(h.a,{target:n,placement:"right-end",show:e.formUuid===e.uuid,onHide:function(){e.setFormUuid(null)},rootClose:!0,transition:!1,children:Object(g.jsx)(p.a,{id:"popover-basic",children:Object(g.jsx)(x.a,{children:Object(g.jsxs)("form",{"data-testid":"semester-form",onSubmit:e.handleSubmit,children:[Object(g.jsx)("label",{children:"season:"}),Object(g.jsx)("input",{"data-testid":"season-input",type:"text",name:"season",onChange:e.handleInput}),Object(g.jsx)("br",{}),Object(g.jsx)("label",{children:"starts:"}),Object(g.jsx)("input",{"data-testid":"starts-input",type:"date",name:"starts",onChange:e.handleInput}),Object(g.jsx)("br",{}),Object(g.jsx)("label",{children:"ends:"}),Object(g.jsx)("input",{"data-testid":"ends-input",type:"date",name:"ends",onChange:e.handleInput}),Object(g.jsx)("br",{}),Object(g.jsx)("input",{"data-testid":"submit-button",type:"submit",value:"submit"})]})})})})]})]})})})})}));v.displayName="Year";var S=v;function w(e){if(void 0===e.csv&&void 0===e.json){var t=o([{index:1,uuid:Object(j.a)(),semesters:new Array}]),n=Object(a.useState)(null),s=Object(u.a)(n,2),r=s[0],i=s[1],c=Object(a.useState)(null),d=Object(u.a)(c,2),l=d[0],b=d[1],m=Object(a.useState)(null),O=Object(u.a)(m,2),f=O[0],h=O[1],p=Object(a.useState)(null),x=Object(u.a)(p,2),v=x[0],w=x[1],y=function(e){switch(e.target.name){case"season":i(e.target.value);break;case"starts":b(e.target.value);break;case"ends":h(e.target.value)}};return Object(g.jsxs)("div",{children:[t.value.map((function(e,n){return Object(g.jsx)("div",{"data-testid":"Year",children:Object(g.jsx)(S,{handleInput:y,handleSubmit:function(n){!function(e,n){e.preventDefault(),t.putSemester(n,Object(j.a)(),new Date(l),new Date(f),r)}(n,e.uuid)},semesters:e.semesters,uuid:e.uuid,index:n+1,formUuid:v,setFormUuid:w})},e.uuid)})),Object(g.jsx)("button",{"data-testid":"addYearButton",onClick:function(){t.push(Object(j.a)(),t.value.length)},children:"+"})]})}return Object(g.jsx)(g.Fragment,{})}var y=function(){return Object(g.jsx)("div",{className:"App",children:Object(g.jsx)(w,{})})},D=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,45)).then((function(t){var n=t.getCLS,a=t.getFID,s=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),a(e),s(e),r(e),i(e)}))};i.a.render(Object(g.jsx)(s.a.StrictMode,{children:Object(g.jsx)(y,{})}),document.getElementById("root")),D()}},[[32,1,2]]]);
//# sourceMappingURL=main.afd6dd21.chunk.js.map