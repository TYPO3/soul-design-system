var V=globalThis,N=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,bt=Symbol(),xt=new WeakMap,I=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==bt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(N&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=xt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&xt.set(e,t))}return t}toString(){return this.cssText}},Ct=i=>new I(typeof i=="string"?i:i+"",void 0,bt);var _t=(i,t)=>{if(N)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),n=V.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},rt=N?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Ct(e)})(i):i;var{is:Kt,defineProperty:Ft,getOwnPropertyDescriptor:Gt,getOwnPropertyNames:Jt,getOwnPropertySymbols:Yt,getPrototypeOf:Zt}=Object,O=globalThis,St=O.trustedTypes,Qt=St?St.emptyScript:"",Xt=O.reactiveElementPolyfillSupport,L=(i,t)=>i,lt={toAttribute(i,t){switch(t){case Boolean:i=i?Qt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Et=(i,t)=>!Kt(i,t),At={attribute:!0,type:String,converter:lt,reflect:!1,useDefault:!1,hasChanged:Et};Symbol.metadata??=Symbol("metadata"),O.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=At){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&Ft(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){let{get:n,set:o}=Gt(this.prototype,t)??{get(){return this[e]},set(l){this[e]=l}};return{get:n,set(l){let u=n?.call(this);o?.call(this,l),this.requestUpdate(t,u,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??At}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Zt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,s=[...Jt(e),...Yt(e)];for(let n of s)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let n of s)e.unshift(rt(n))}else t!==void 0&&e.push(rt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:lt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:lt;this._$Em=n;let u=l.fromAttribute(e,o.type);this[n]=u??this._$Ej?.get(n)??u,this._$Em=null}}requestUpdate(t,e,s,n=!1,o){if(t!==void 0){let l=this.constructor;if(n===!1&&(o=this[t]),s??=l.getPropertyOptions(t),!((s.hasChanged??Et)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(l._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:n,wrapped:o},l){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,l??e??this[t]),o!==!0||l!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,o]of s){let{wrapped:l}=o,u=this[n];l!==!0||this._$AL.has(n)||u===void 0||this.C(n,void 0,o,u)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[L("elementProperties")]=new Map,y[L("finalized")]=new Map,Xt?.({ReactiveElement:y}),(O.reactiveElementVersions??=[]).push("2.1.2");var mt=globalThis,Mt=i=>i,U=mt.trustedTypes,Lt=U?U.createPolicy("lit-html",{createHTML:i=>i}):void 0,Pt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,kt="?"+x,te=`<${kt}>`,A=document,R=()=>A.createComment(""),z=i=>i===null||typeof i!="object"&&typeof i!="function",gt=Array.isArray,ee=i=>gt(i)||typeof i?.[Symbol.iterator]=="function",at=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Tt=/-->/g,Rt=/>/g,_=RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zt=/'/g,Ht=/"/g,Vt=/^(?:script|style|textarea|title)$/i,vt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),r=vt(1),pe=vt(2),he=vt(3),$=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Bt=new WeakMap,S=A.createTreeWalker(A,129);function It(i,t){if(!gt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lt!==void 0?Lt.createHTML(t):t}var se=(i,t)=>{let e=i.length-1,s=[],n,o=t===2?"<svg>":t===3?"<math>":"",l=T;for(let u=0;u<e;u++){let a=i[u],m,g,h=-1,f=0;for(;f<a.length&&(l.lastIndex=f,g=l.exec(a),g!==null);)f=l.lastIndex,l===T?g[1]==="!--"?l=Tt:g[1]!==void 0?l=Rt:g[2]!==void 0?(Vt.test(g[2])&&(n=RegExp("</"+g[2],"g")),l=_):g[3]!==void 0&&(l=_):l===_?g[0]===">"?(l=n??T,h=-1):g[1]===void 0?h=-2:(h=l.lastIndex-g[2].length,m=g[1],l=g[3]===void 0?_:g[3]==='"'?Ht:zt):l===Ht||l===zt?l=_:l===Tt||l===Rt?l=T:(l=_,n=void 0);let w=l===_&&i[u+1].startsWith("/>")?" ":"";o+=l===T?a+te:h>=0?(s.push(m),a.slice(0,h)+Pt+a.slice(h)+x+w):a+x+(h===-2?u:w)}return[It(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},H=class i{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let o=0,l=0,u=t.length-1,a=this.parts,[m,g]=se(t,e);if(this.el=i.createElement(m,s),S.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=S.nextNode())!==null&&a.length<u;){if(n.nodeType===1){if(n.hasAttributes())for(let h of n.getAttributeNames())if(h.endsWith(Pt)){let f=g[l++],w=n.getAttribute(h).split(x),k=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:k[2],strings:w,ctor:k[1]==="."?dt:k[1]==="?"?pt:k[1]==="@"?ht:M}),n.removeAttribute(h)}else h.startsWith(x)&&(a.push({type:6,index:o}),n.removeAttribute(h));if(Vt.test(n.tagName)){let h=n.textContent.split(x),f=h.length-1;if(f>0){n.textContent=U?U.emptyScript:"";for(let w=0;w<f;w++)n.append(h[w],R()),S.nextNode(),a.push({type:2,index:++o});n.append(h[f],R())}}}else if(n.nodeType===8)if(n.data===kt)a.push({type:2,index:o});else{let h=-1;for(;(h=n.data.indexOf(x,h+1))!==-1;)a.push({type:7,index:o}),h+=x.length-1}o++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function E(i,t,e=i,s){if(t===$)return t;let n=s!==void 0?e._$Co?.[s]:e._$Cl,o=z(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=n:e._$Cl=n),n!==void 0&&(t=E(i,n._$AS(i,t.values),n,s)),t}var ct=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,n=(t?.creationScope??A).importNode(e,!0);S.currentNode=n;let o=S.nextNode(),l=0,u=0,a=s[0];for(;a!==void 0;){if(l===a.index){let m;a.type===2?m=new B(o,o.nextSibling,this,t):a.type===1?m=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(m=new ut(o,this,t)),this._$AV.push(m),a=s[++u]}l!==a?.index&&(o=S.nextNode(),l++)}return S.currentNode=A,n}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},B=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),z(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==$&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ee(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=H.createElement(It(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(e);else{let o=new ct(n,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Bt.get(t.strings);return e===void 0&&Bt.set(t.strings,e=new H(t)),e}k(t){gt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,n=0;for(let o of t)n===e.length?e.push(s=new i(this.O(R()),this.O(R()),this,this.options)):s=e[n],s._$AI(o),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=Mt(t).nextSibling;Mt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,n){let o=this.strings,l=!1;if(o===void 0)t=E(this,t,e,0),l=!z(t)||t!==this._$AH&&t!==$,l&&(this._$AH=t);else{let u=t,a,m;for(t=o[0],a=0;a<o.length-1;a++)m=E(this,u[s+a],e,a),m===$&&(m=this._$AH[a]),l||=!z(m)||m!==this._$AH[a],m===p?t=p:t!==p&&(t+=(m??"")+o[a+1]),this._$AH[a]=m}l&&!n&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},dt=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},pt=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},ht=class extends M{constructor(t,e,s,n,o){super(t,e,s,n,o),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??p)===$)return;let s=this._$AH,n=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ut=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var ne=mt.litHtmlPolyfillSupport;ne?.(H,B),(mt.litHtmlVersions??=[]).push("3.3.3");var Nt=(i,t,e)=>{let s=e?.renderBefore??t,n=s._$litPart$;if(n===void 0){let o=e?.renderBefore??null;s._$litPart$=n=new B(t.insertBefore(R(),o),o,void 0,e??{})}return n._$AI(i),n};var ft=globalThis,b=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $}};b._$litElement$=!0,b.finalized=!0,ft.litElementHydrateSupport?.({LitElement:b});var ie=ft.litElementPolyfillSupport;ie?.({LitElement:b});(ft.litElementVersions??=[]).push("4.2.2");var d=class extends b{createRenderRoot(){return this}},yt=new Set;function Ot(i){if(!yt.size)return;let t="sds-host-rule",e=i.getElementById(t)??i.createElement("style");e.id=t,e.textContent=`${[...yt].join(",")}{display:contents}`,e.isConnected||i.head.append(e)}function $t(i=document){Ot(i)}function c(i,t){typeof customElements>"u"||(yt.add(i),typeof document<"u"&&Ot(document),customElements.get(i)||customElements.define(i,t))}var Ut={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Dt=i=>(...t)=>({_$litDirective$:i,values:t}),D=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var P=class extends D{constructor(t){if(super(t),this.it=p,t.type!==Ut.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===p||t==null)return this._t=void 0,this.it=t;if(t===$)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};P.directiveName="unsafeHTML",P.resultType=1;var jt=Dt(P);var wt={"actions-arrow-right":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M2,9h7.3v2c0,0.4,0.5,0.6,0.8,0.4l3.7-3c0.2-0.2,0.2-0.6,0-0.8l-3.7-3C9.8,4.4,9.3,4.6,9.3,5v2H2V9z"/>
</g>
</svg>
`,"actions-book":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M12,1H3v14h9c0.552,0,1-0.448,1-1V2C13,1.448,12.552,1,12,1z M12,13v1H4V2h8v9h-1v2H12z"/>
	<path d="M11,3.25C11,3.112,10.888,3,10.75,3h-5.5C5.112,3,5,3.112,5,3.25v2.5C5,5.888,5.112,6,5.25,6h5.5
		C10.888,6,11,5.888,11,5.75V3.25z"/>
	<rect x="5" y="12" width="2" height="1"/>
</g>
</svg>
`,"actions-check":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M13.3,4.8l-0.7-0.7c-0.2-0.2-0.5-0.2-0.7,0c0,0,0,0-5.4,5.4L4,6.9c-0.2-0.2-0.5-0.2-0.7,0L2.7,7.6c-0.2,0.2-0.2,0.5,0,0.7
		l3.6,3.6c0.2,0.2,0.5,0.2,0.7,0c4.9-4.9,0,0,6.4-6.4C13.5,5.3,13.5,5,13.3,4.8z"/>
</g>
</svg>
`,"actions-check-circle":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M12.1,5.3L11.7,5c-0.1-0.1-0.3-0.1-0.4,0L6.6,9.8l-2-2c-0.1-0.1-0.3-0.1-0.4,0L3.9,8.2c-0.1,0.1-0.1,0.3,0,0.4L6,10.7
		L6.4,11c0.1,0.1,0.3,0.1,0.4,0l0.4-0.4l4.9-4.9C12.2,5.6,12.2,5.4,12.1,5.3z"/>
	<path d="M8,2c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S4.7,2,8,2 M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1L8,1z"/>
</g>
</svg>
`,"actions-chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<polygon points="4.464,6.05 3.757,6.757 8,11 12.243,6.757 11.536,6.05 8,9.586 	"/>
</g>
</svg>
`,"actions-chevron-end":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<polygon points="9.586,8 6.05,11.536 6.757,12.243 11,8 6.757,3.757 6.05,4.464 	"/>
</g>
</svg>
`,"actions-chevron-start":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<polygon points="6.414,8 9.95,4.464 9.243,3.757 5,8 9.243,12.243 9.95,11.536 	"/>
</g>
</svg>
`,"actions-chevron-up":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<polygon points="8,6.664 11.536,10.2 12.243,9.493 8,5.25 3.757,9.493 4.464,10.2 	"/>
</g>
</svg>
`,"actions-clock":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M8,2.6c3.1,0,5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4S2.5,11.1,2.5,8S4.9,2.6,8,2.6 M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7
		S11.9,1,8,1L8,1z"/>
	<path d="M7,4.1V8l4.1,2.5c0.2-0.3,0.4-0.5,0.5-0.9L8,7.4V4C7.7,4,7.3,4.1,7,4.1z"/>
</g>
</svg>
`,"actions-close":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M11.9,5.5L9.4,8l2.5,2.5c0.2,0.2,0.2,0.5,0,0.7l-0.7,0.7c-0.2,0.2-0.5,0.2-0.7,0L8,9.4l-2.5,2.5c-0.2,0.2-0.5,0.2-0.7,0
		l-0.7-0.7c-0.2-0.2-0.2-0.5,0-0.7L6.6,8L4.1,5.5C3.9,5.3,3.9,5,4.1,4.8l0.7-0.7c0.2-0.2,0.5-0.2,0.7,0L8,6.6l2.5-2.5
		c0.2-0.2,0.5-0.2,0.7,0l0.7,0.7C12.1,5,12.1,5.3,11.9,5.5z"/>
</g>
</svg>
`,"actions-code":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
<polygon points="7,14 5.8,14 9,2 10.3,2 "/>
<polygon points="5.3,4 1,7.3 1,8.7 5.3,12 5.2,10.3 2.3,8 5.3,5.7 "/>
<polygon points="10.8,4 10.8,5.7 13.7,8 10.8,10.3 10.8,12 15,8.7 15,7.3 "/>
</g>
</svg>
`,"actions-code-commit":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M8,5c1.378,0,2.5,1.122,2.5,2.5S9.378,10,8,10S5.5,8.878,5.5,7.5S6.622,5,8,5 M8,4C6.071,4,4.5,5.571,4.5,7.5
		S6.071,11,8,11s3.5-1.571,3.5-3.5S9.929,4,8,4L8,4z"/>
	<rect x="1" y="7" width="4" height="1"/>
	<rect x="11" y="7" width="4" height="1"/>
</g>
</svg>
`,"actions-code-compare":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M12.5,11c0.828,0,1.5,0.672,1.5,1.5S13.328,14,12.5,14S11,13.328,11,12.5S11.672,11,12.5,11 M12.5,10
		c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.122,2.5-2.5S13.878,10,12.5,10L12.5,10z"/>
	<path d="M3.5,2C4.328,2,5,2.672,5,3.5S4.328,5,3.5,5S2,4.328,2,3.5S2.672,2,3.5,2 M3.5,1C2.122,1,1,2.122,1,3.5S2.122,6,3.5,6
		S6,4.878,6,3.5S4.878,1,3.5,1L3.5,1z"/>
	<polygon points="8.914,3 10.536,1.379 9.828,0.672 7,3.5 9.828,6.328 10.536,5.621 8.914,4 12,4 12,11 13,11 13,3 	"/>
	<polygon points="6.172,9.672 5.464,10.379 7.086,12 4,12 4,5 3,5 3,13 7.086,13 5.464,14.621 6.172,15.329 9,12.5 	"/>
</g>
</svg>
`,"actions-code-pull-request":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M12.5,11c0.828,0,1.5,0.672,1.5,1.5S13.328,14,12.5,14S11,13.328,11,12.5S11.672,11,12.5,11 M12.5,10
		c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.122,2.5-2.5S13.878,10,12.5,10L12.5,10z"/>
	<path d="M3.5,2C4.328,2,5,2.672,5,3.5S4.328,5,3.5,5S2,4.328,2,3.5S2.672,2,3.5,2 M3.5,1C2.122,1,1,2.122,1,3.5S2.122,6,3.5,6
		S6,4.878,6,3.5S4.878,1,3.5,1L3.5,1z"/>
	<path d="M3.5,11C4.328,11,5,11.672,5,12.5S4.328,14,3.5,14S2,13.328,2,12.5S2.672,11,3.5,11 M3.5,10C2.122,10,1,11.122,1,12.5
		S2.122,15,3.5,15S6,13.878,6,12.5S4.878,10,3.5,10L3.5,10z"/>
	<rect x="3" y="5" width="1" height="6"/>
	<polygon points="8.914,3 10.536,1.379 9.828,0.672 7,3.5 9.828,6.328 10.536,5.621 8.914,4 12,4 12,11 13,11 13,3 	"/>
</g>
</svg>
`,"actions-cog":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M14.413,9.393l-0.865-0.5C13.594,8.602,13.625,8.305,13.625,8s-0.031-0.602-0.078-0.893l0.865-0.5
		c0.478-0.276,0.642-0.888,0.366-1.366l-1-1.732c-0.276-0.478-0.888-0.642-1.366-0.366L11.552,3.64
		C11.09,3.264,10.566,2.963,10,2.748V2c0-0.552-0.448-1-1-1H7C6.448,1,6,1.448,6,2v0.748C5.434,2.964,4.91,3.264,4.448,3.64
		L3.587,3.143c-0.478-0.276-1.09-0.112-1.366,0.366l-1,1.732c-0.276,0.478-0.112,1.09,0.366,1.366l0.865,0.5
		C2.406,7.398,2.375,7.695,2.375,8s0.031,0.602,0.078,0.893l-0.865,0.5c-0.478,0.276-0.642,0.888-0.366,1.366l1,1.732
		c0.276,0.478,0.888,0.642,1.366,0.366l0.861-0.497C4.91,12.736,5.434,13.036,6,13.252V14c0,0.552,0.448,1,1,1h2
		c0.552,0,1-0.448,1-1v-0.748c0.566-0.216,1.09-0.516,1.552-0.892l0.861,0.497c0.478,0.276,1.09,0.112,1.366-0.366l1-1.732
		C15.055,10.281,14.891,9.669,14.413,9.393z M12.913,11.991l-1.515-0.875C10.768,11.803,9.942,12.302,9,12.51V14H7v-1.49
		c-0.942-0.208-1.768-0.707-2.398-1.394l-1.515,0.875l-1-1.732l1.521-0.878C3.47,8.942,3.375,8.484,3.375,8S3.47,7.058,3.608,6.619
		L2.087,5.741l1-1.732l1.515,0.875C5.232,4.197,6.058,3.698,7,3.49V2h2v1.49c0.942,0.208,1.768,0.707,2.398,1.394l1.515-0.875
		l1,1.732l-1.521,0.878C12.53,7.058,12.625,7.516,12.625,8s-0.095,0.942-0.233,1.381l1.521,0.878L12.913,11.991z"/>
	<path d="M8,5.875c1.172,0,2.125,0.953,2.125,2.125S9.172,10.125,8,10.125S5.875,9.172,5.875,8S6.828,5.875,8,5.875 M8,4.875
		C6.274,4.875,4.875,6.274,4.875,8S6.274,11.125,8,11.125S11.125,9.726,11.125,8S9.726,4.875,8,4.875L8,4.875z"/>
</g>
</svg>
`,"actions-database":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
<path d="M2,3.5001831v9c0,1.6416016,3.0185547,2.5,6,2.5s6-0.8583984,6-2.5v-9C14,0.2179565,2,0.2179565,2,3.5001831z M8,2.0001831
	c3.0055542,0,4.9995728,0.90271,4.999939,1.4998169h-0.0002441C12.9979858,4.097168,11.0045776,4.9992065,8,4.9992065
	S3.0020142,4.097168,3.0003052,3.5H3.000061C3.0004272,2.9028931,4.9944458,2.0001831,8,2.0001831z M12.9996948,6.5003052
	C12.9979858,7.0974731,11.0045776,7.9995117,8,7.9995117S3.0020142,7.0974731,3.0003052,6.5003052H3V4.9316406
	c1.1303101,0.7017212,3.0668335,1.0675659,5,1.0675659c1.9331055,0,3.8695679-0.3658447,5-1.0673828v1.5684814H12.9996948z
	 M13,7.9321289v1.5684814h-0.0003052C12.9979858,10.0977783,11.0045776,10.9998169,8,10.9998169
	s-4.9979858-0.9020386-4.9996948-1.4992065H3V7.9319458C4.1303101,8.633667,6.0668335,8.9995117,8,8.9995117
	C9.9331055,8.9995117,11.8695679,8.633667,13,7.9321289z M8,14.0001831c-3.0058594,0-5-0.9023438-5-1.5V10.932251
	c1.1303101,0.7017212,3.0668335,1.0675659,5,1.0675659c1.9331055,0,3.8695679-0.3658447,5-1.0673828v1.567749
	C13,13.0978394,11.0058594,14.0001831,8,14.0001831z"/>
</g>
</svg>
`,"actions-debug":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M15,9V8h-3V6l1.9-1.9C13.9,4.1,14,3.9,14,3.8V1h-1v2.3c0,0.1-0.1,0.3-0.1,0.4L12,4.5V4h-2V3L9.1,2.1C9.1,2.1,8.9,2,8.8,2
		H7.2C7.1,2,6.9,2.1,6.9,2.1L6,3v1H4v1L3.1,4.1C3.1,4.1,3,3.9,3,3.8V1H2v3.3c0,0.1,0.1,0.3,0.1,0.4L4,6.5V8H1v1h3v1.5l-1.9,1.9
		C2.1,12.4,2,12.6,2,12.7V15h1v-1.8c0-0.1,0.1-0.3,0.1-0.4L4,12l1.9,1.9C5.9,13.9,6.1,14,6.2,14h3.6c0.1,0,0.3-0.1,0.4-0.1l1.6-1.6
		l1.1,1.1c0.1,0.1,0.1,0.2,0.1,0.4V15h1v-1.8c0-0.1-0.1-0.3-0.1-0.4L12,11V9H15z M7,3.4L7.4,3h1.2L9,3.4V4H7V3.4z M11,11.6L9.6,13
		H6.4L5,11.6V5h2.5v6h1V5H11V11.6z"/>
</g>
</svg>
`,"actions-duplicate":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
	<g fill="currentColor">
		<path d="M14,4h-2V2V1h-1H2H1v1v9v1h1h2v2v1h1h9h1v-1V5V4H14z M4,4v1v6H2V2h9v2H5H4z M14,14H5V5h9V14z"/>
	</g>
</svg>
`,"actions-exclamation-circle":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8
		s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"/>
	<circle cx="8" cy="11" r="1"/>
	<path d="M8.5,9h-1L7.054975,4.5497518C7.0255408,4.2554088,7.2566829,4,7.5524936,4H8.447506
		c0.2958117,0,0.5269527,0.2554088,0.4975185,0.5497518L8.5,9z"/>
</g>
</svg>
`,"actions-exclamation-triangle":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<circle cx="8" cy="12" r="1"/>
	<path d="M8.5,10h-1L7.054975,5.5497518C7.0255408,5.2554088,7.2566829,5,7.5524936,5H8.447506
		c0.2958117,0,0.5269527,0.2554088,0.4975185,0.5497518L8.5,10z"/>
	<path d="M8,2.0081444c0.1771402,0,0.6169796,0.05021,0.8746996,0.5153399l5.5364609,9.9918499
		c0.2499895,0.4511709,0.0741091,0.8442307-0.0131102,0.99228c-0.0872307,0.1480408-0.3457899,0.4923906-0.8615904,0.4923906
		H2.4635501c-0.5158101,0-0.7743701-0.3443499-0.8615901-0.4923906C1.51473,13.3595648,1.33884,12.9665051,1.58884,12.5153246
		l5.5364599-9.9918404C7.3830199,2.0583649,7.8228598,2.0081444,8,2.0081444 M8,1.0081491
		c-0.6843376,0-1.3686752,0.3435555-1.7494001,1.0306654L0.71414,12.0306549
		c-0.73862,1.3330297,0.22542,2.9693499,1.7494102,2.9693499h11.0729103c1.5239801,0,2.4880209-1.6363201,1.7494001-2.9693403
		L9.7494001,2.0388145C9.3686752,1.3517046,8.6843376,1.0081491,8,1.0081491L8,1.0081491z"/>
</g>
</svg>
`,"actions-extension":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
<path d="M13.408,3.546L7.913,1.087C7.783,1.029,7.644,1,7.504,1C7.365,1,7.226,1.029,7.096,1.087L1.592,3.545
	C1.232,3.706,1,4.064,1,4.459v7.102c0,0.395,0.233,0.754,0.594,0.914l5.496,2.439C7.219,14.971,7.357,15,7.496,15
	c0.138,0,0.277-0.029,0.406-0.086l5.504-2.446C13.767,12.308,14,11.95,14,11.554V4.459C14,4.064,13.768,3.707,13.408,3.546z
	 M7.504,2l4.89,2.187L7.5,6.449L2.607,4.188L7.504,2z M2,5.01l5,2.31v6.46l-5-2.219V5.01z M8,13.776V7.32l5-2.31v6.545L8,13.776z"/>
</g>
</svg>
`,"actions-filter":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M14,2c-1.333,1.667-2.667,3.333-4,5c0,2.28,0,4.56,0,6.84l-4-2.56V7L2,2C6,2,10,2,14,2 M14,1H2
		C1.616,1,1.265,1.22,1.099,1.567c-0.167,0.346-0.12,0.758,0.12,1.058L5,7.351v3.929c0,0.341,0.174,0.658,0.461,0.842l4,2.56
		C9.625,14.787,9.812,14.84,10,14.84c0.165,0,0.33-0.041,0.48-0.123C10.801,14.542,11,14.205,11,13.84V7.351l1.781-2.226l2-2.5
		c0.24-0.3,0.287-0.711,0.12-1.058C14.735,1.22,14.384,1,14,1L14,1z"/>
</g>
</svg>
`,"actions-history":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M9.2,8.9C9.2,9,9,9.2,8.9,9.2H6C5.8,9.2,5.7,9,5.7,8.9V8.3C5.7,8.1,5.8,8,6,8h2V4.8c0-0.2,0.1-0.3,0.3-0.3h0.6
		c0.2,0,0.3,0.1,0.3,0.3L9.2,8.9L9.2,8.9z"/>
	<path d="M5.4,6H1.3C1.1,6,1,5.9,1,5.8V1.6c0-0.2,0.3-0.3,0.4-0.2l4.1,4.1C5.7,5.7,5.6,6,5.4,6z"/>
	<path d="M8,1C5.1,1,2.6,2.8,1.6,5.3h1.7C4.2,3.6,6,2.5,8,2.5c3,0,5.5,2.5,5.5,5.5S11,13.5,8,13.5c-1.8,0-3.3-0.8-4.4-2.2l-1.1,1.1
		C3.9,14,5.8,15,8,15c3.9,0,7-3.1,7-7S11.9,1,8,1z"/>
</g>
</svg>
`,"actions-info-circle":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8
		s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"/>
	<path d="M7,4.999999C7,4.4477148,7.4477148,4,7.999999,4H8.000001C8.5522852,4,9,4.4477148,9,4.999999V5.000001
		C9,5.5522852,8.5522852,6,8.000001,6H7.999999C7.4477148,6,7,5.5522852,7,5.000001V4.999999z"/>
	<path d="M7,7.999999C7,7.4477148,7.4477148,7,7.999999,7H8.000001C8.5522852,7,9,7.4477148,9,7.999999v3.0000019
		C9,11.5522852,8.5522852,12,8.000001,12H7.999999C7.4477148,12,7,11.5522852,7,11.000001V7.999999z"/>
</g>
</svg>
`,"actions-link":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M13.7,3.8l-1.4-1.4c-0.8-0.8-2-0.8-2.8,0L5.9,5.9c-0.8,0.8-0.8,2,0,2.8l1.2,1.2L8,9.1L6.9,8c-0.4-0.4-0.4-1,0-1.4l3.2-3.2
		c0.4-0.4,1-0.4,1.4,0l1.1,1.1c0.4,0.4,0.4,1,0,1.4l-1.3,1.3c0.2,0.4,0.4,0.9,0.4,1.4l2-2C14.4,5.8,14.4,4.5,13.7,3.8z"/>
	<path d="M8.9,6.1L8,6.9L9.1,8c0.4,0.4,0.4,1,0,1.4l-3.2,3.2c-0.4,0.4-1,0.4-1.4,0l-1.1-1.1c-0.4-0.4-0.4-1,0-1.4l1.3-1.3
		C4.5,8.4,4.3,7.9,4.3,7.4l-2,2c-0.8,0.8-0.8,2,0,2.8l1.4,1.4c0.8,0.8,2,0.8,2.8,0l3.5-3.5c0.8-0.8,0.8-2,0-2.8L8.9,6.1z"/>
</g>
</svg>
`,"actions-list":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<rect x="2" y="3" width="2" height="1"/>
	<rect x="5" y="3" width="9" height="1"/>
	<rect x="2" y="6" width="2" height="1"/>
	<rect x="5" y="6" width="9" height="1"/>
	<rect x="2" y="9" width="2" height="1"/>
	<rect x="5" y="9" width="9" height="1"/>
	<rect x="2" y="12" width="2" height="1"/>
	<rect x="5" y="12" width="9" height="1"/>
</g>
</svg>
`,"actions-menu-alternative":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M8.5,9h-1C7.2,9,7,8.8,7,8.5v-1C7,7.2,7.2,7,7.5,7h1C8.8,7,9,7.2,9,7.5v1C9,8.8,8.8,9,8.5,9z"/>
	<path d="M8.5,4h-1C7.2,4,7,3.8,7,3.5v-1C7,2.2,7.2,2,7.5,2h1C8.8,2,9,2.2,9,2.5v1C9,3.8,8.8,4,8.5,4z"/>
	<path d="M8.5,14h-1C7.2,14,7,13.8,7,13.5v-1C7,12.2,7.2,12,7.5,12h1C8.8,12,9,12.2,9,12.5v1C9,13.8,8.8,14,8.5,14z"/>
</g>
</svg>
`,"actions-play":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M5,3.9L11.2,8L5,12.1L5,3.9 M5,2.9c-0.5,0-1,0.4-1,1v8.3c0,0.6,0.5,1,1,1c0.2,0,0.4-0.1,0.6-0.2l6.2-4.1
		c0.6-0.4,0.6-1.3,0-1.7L5.6,3C5.4,2.9,5.2,2.9,5,2.9L5,2.9z"/>
</g>
</svg>
`,"actions-question-circle":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8
		s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"/>
	<path d="M8.7449665,11H7.244966c-0.138,0-0.25,0.1120005-0.25,0.25v1.5c0,0.1379995,0.112,0.25,0.25,0.25h1.5000005
		c0.1379995,0,0.25-0.1120005,0.25-0.25v-1.5C8.9949665,11.1120005,8.882966,11,8.7449665,11z"/>
	<path d="M10.9459667,5.4510002c-0.2130003-1.2010002-1.1970005-2.187-2.3990002-2.401
		c-1.8070006-0.322-3.3900008,0.9749999-3.5410004,2.6830001C4.9939661,5.8759999,5.1169662,6,5.2609658,6H6.771966
		c0.1269999,0,0.2189999-0.098,0.2470002-0.2220001C7.120966,5.3330002,7.5199661,5,7.994966,5
		c0.5510001,0,1.0000005,0.4489999,1.0000005,1c0,0.3569999-0.1990004,0.6570001-0.4820004,0.8330002
		C7.606966,7.3470001,6.994966,8.316,6.994966,9.4329996V9.75c0,0.1379995,0.112,0.25,0.25,0.25h1.5000005
		c0.1379995,0,0.25-0.1120005,0.25-0.25V9.4329996c0-0.3590002,0.2010002-0.6590004,0.4860001-0.835
		C10.5299664,8,11.1839666,6.7919998,10.9459667,5.4510002z"/>
</g>
</svg>
`,"actions-refresh":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M15.549,8H14c0-3.31-2.69-6-6-6C6.88,2,5.84,2.31,4.94,2.84l0.61,0.97C6.27,3.39,7.1,3.13,8,3.13
		c2.68,0,4.87,2.18,4.87,4.87h-1.419c-0.196,0-0.316,0.216-0.212,0.383l2.049,3.278c0.098,0.157,0.326,0.157,0.424,0l2.049-3.278
		C15.865,8.216,15.745,8,15.549,8z"/>
	<path d="M10.37,12.23c-0.7,0.4-1.5,0.64-2.37,0.64c-2.68,0-4.87-2.18-4.87-4.87h1.419c0.196,0,0.316-0.216,0.212-0.383L2.712,4.339
		c-0.098-0.157-0.326-0.157-0.424,0L0.239,7.617C0.135,7.784,0.255,8,0.451,8H2c0,3.31,2.69,6,6,6c1.09,0,2.1-0.29,2.98-0.8
		L10.37,12.23z"/>
</g>
</svg>
`,"actions-search":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M13.92,15c-0.29,0-0.56-0.12-0.76-0.32l-2.89-2.88c-0.98,0.68-2.16,1.04-3.36,1.04C3.65,12.85,1,10.2,1,6.92
		C1,3.65,3.65,1,6.92,1s5.92,2.65,5.92,5.92c0,1.19-0.36,2.37-1.04,3.36l2.89,2.89c0.19,0.19,0.31,0.47,0.31,0.76
		C15,14.51,14.51,15,13.92,15z M6.92,2.42c-2.48,0-4.5,2.02-4.5,4.5s2.02,4.5,4.5,4.5s4.5-2.02,4.5-4.5S9.4,2.42,6.92,2.42z"/>
</g>
</svg>
`,"actions-tag":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<path d="M6.657,1H3.828H1v2.828v2.828l8.485,8.485l5.657-5.657L6.657,1z M1.99,6.232V4.111V1.99h2.121h2.122l7.495,7.494
		l-4.243,4.243L1.99,6.232z"/>
	<path d="M3.475,3.475c-0.683,0.683-0.683,1.792,0,2.475s1.792,0.683,2.475,0s0.683-1.792,0-2.475S4.159,2.791,3.475,3.475z
		 M4.182,4.182c0.293-0.293,0.768-0.293,1.061,0s0.293,0.768,0,1.061s-0.768,0.293-1.061,0C3.889,4.949,3.889,4.475,4.182,4.182z"/>
	<rect x="7.381" y="6.632" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.7826 9.1315)" width="3.5" height="5"/>
</g>
</svg>
`,"actions-window-open":`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">
<g fill="currentColor">
	<rect x="11.672" y="2.328" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 16.6569 18.5563)" width="1" height="7"/>
	<path d="M13,8.536V12H3V5h6.464l1-1H2.5C2.224,4,2,4.224,2,4.5v8C2,12.776,2.224,13,2.5,13h11c0.276,0,0.5-0.224,0.5-0.5V7.535
		L13,8.536z"/>
	<path d="M15.573,6.573l-4.146-4.146C11.269,2.269,11.381,2,11.604,2h4.146C15.888,2,16,2.112,16,2.25v4.146
		C16,6.619,15.731,6.731,15.573,6.573z"/>
</g>
</svg>
`};var j=class extends d{static{this.properties={name:{type:String,reflect:!0},size:{type:Number,reflect:!0},label:{type:String}}}constructor(){super(),this.size=16}inline(t){return t.replace(/[\n\t]/g," ").replace(/\s*version="1\.1"/,"").replace(/<(path|rect|circle|polygon|ellipse|line|polyline)([^>]*?)\s*\/>/g,"<$1$2></$1>").trimEnd()}render(){let t=wt[this.name];if(!t)throw new Error(`unknown icon "${this.name}" \u2014 add it to the ICONS list in scripts/icons.ts and run \`make icons\``);let e=this.label?`role="img" aria-label="${this.label}"`:'aria-hidden="true"',s=this.className||"sds-icon",n=`<svg width="${this.size}" height="${this.size}" class="${s}" ${e} `;return r`${jt(this.inline(t).replace(/^<svg\s*/,n))}`}};c("sds-icon",j);var oe=Object.keys(wt);function Wt({variant:i="primary",size:t="md",label:e="",disabled:s=!1}){let n=["sds-btn",`sds-btn--${i}`];return t==="sm"&&n.push("sds-btn--sm"),e||n.push("sds-btn--icon"),s&&n.push("is-disabled"),n.join(" ")}var W=class extends d{static{this.properties={variant:{type:String,reflect:!0},size:{type:String,reflect:!0},label:{type:String},icon:{type:String},title:{type:String},disabled:{type:Boolean,reflect:!0}}}constructor(){super(),this.variant="primary",this.size="md",this.label="",this.disabled=!1}render(){let t=Wt({variant:this.variant,size:this.size,label:this.label,disabled:this.disabled}),e=r`${this.icon?r`<sds-icon name="${this.icon}"></sds-icon>`:p}${this.label}`;return this.title?r`<button class="${t}" title="${this.title}">${e}</button>`:r`<button class="${t}">${e}</button>`}};c("sds-button",W);var q=class i extends d{static{this.TONE_ICON={ok:"actions-check-circle",warn:"actions-exclamation-triangle",error:"actions-exclamation-circle"}}static{this.properties={label:{type:String},tone:{type:String,reflect:!0},icon:{type:String}}}constructor(){super(),this.label="",this.tone="default"}render(){let t=this.icon??i.TONE_ICON[this.tone],e=this.tone==="default"?"sds-badge":`sds-badge sds-badge--${this.tone}`;return t?r`<span class="${e}"><sds-icon name="${t}"></sds-icon>${this.label}</span>`:r`<span class="${e}">${this.label}</span>`}};c("sds-badge",q);var K=class extends d{static{this.properties={label:{type:String},href:{type:String,reflect:!0},external:{type:Boolean,reflect:!0}}}constructor(){super(),this.label="",this.href="#",this.external=!1}render(){return this.external?r`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${this.label} <sds-icon name="actions-window-open"></sds-icon></a>`:r`<a class="sds-link" href="${this.href}">${this.label}</a>`}};c("sds-link",K);function qt({focused:i,invalid:t,filled:e,select:s}){let n=["sds-field"];return s&&n.push("sds-select"),i&&n.push("is-focused"),t&&n.push("is-invalid"),e&&n.push("is-filled"),n.join(" ")}var F=class extends d{static{this.properties={message:{type:String}}}constructor(){super(),this.message=""}render(){return r`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`}};c("sds-field-error",F);var G=class extends d{static{this.properties={value:{type:String},icon:{type:String},focused:{type:Boolean,reflect:!0},invalid:{type:Boolean,reflect:!0},filled:{type:Boolean,reflect:!0},select:{type:Boolean,reflect:!0},minWidth:{type:Number,attribute:"min-width"}}}constructor(){super(),this.value="",this.focused=!1,this.invalid=!1,this.filled=!1,this.select=!1,this.minWidth=220}render(){let t=qt(this);if(this.select)return r`<span class="${t}" style="min-width:${this.minWidth}px">${this.value} <span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;let e=this.focused?r`<span style="width:2px; height:15px; background:var(--accent);"></span>`:p,s=this.focused?r`<span style="color:var(--text-primary)">${this.value}</span>`:this.icon?r`<span>${this.value}</span>`:r`${this.value}`;return r`<span class="${t}" style="min-width:${this.minWidth}px">${this.icon?r`<sds-icon name="${this.icon}"></sds-icon>`:p}${s}${e}</span>`}};c("sds-field",G);function v(i,t=0){let e=`
${" ".repeat(t)}`,s=[];return i.forEach((n,o)=>{o&&s.push(e),s.push(n)}),s}var C=class extends d{static{this.properties={items:{type:Array},active:{type:Number,reflect:!0}}}constructor(){super(),this.items=[],this.active=0}items_(){return this.items.map((t,e)=>r`<span class="${e===this.active?`${this.item} is-active`:this.item}">${t}</span>`)}};var J=class extends C{constructor(){super(...arguments);this.block="sds-pills";this.item="sds-pill"}render(){return r`<nav class="${this.block}">
  ${v(this.items_(),2)}
</nav>`}};c("sds-pills",J);var Y=class extends C{constructor(){super(...arguments);this.block="sds-tabs";this.item="sds-tab"}render(){return r`<div class="${this.block}">
  ${v(this.items_(),2)}
</div>`}};c("sds-tabs",Y);var Z=class extends C{constructor(){super(...arguments);this.block="sds-rail";this.item="sds-rail__item"}render(){return r`<div class="${this.block}">
  ${v(this.items_(),2)}
</div>`}};c("sds-rail",Z);var Q=class extends d{static{this.properties={plane:{type:String,reflect:!0},heading:{type:String},body:{type:String},boxStyle:{type:String,attribute:"box-style"}}}constructor(){super(),this.plane="card",this.heading="",this.body="",this.boxStyle="flex:1; min-width:200px"}render(){return r`<div class="sds-${this.plane}" style="${this.boxStyle}">
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.body}</div>
</div>`}};c("sds-surface",Q);var X=class extends d{render(){return r`<div class="sds-overlay"></div>`}},tt=class extends d{static{this.properties={heading:{type:String},body:{type:String},actions:{type:Array},width:{type:Number,reflect:!0}}}constructor(){super(),this.heading="",this.body="",this.actions=[],this.width=330}render(){return r`<div class="sds-modal" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${this.width}px">
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <span style="color:var(--text-muted);"><sds-icon name="actions-close"></sds-icon></span>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${v(this.actions,4)}
  </div>
</div>`}},et=class extends d{static{this.properties={body:{type:String},width:{type:Number,reflect:!0}}}constructor(){super(),this.body="",this.width=120}render(){return r`<div class="sds-drawer" style="position:absolute; right:0; top:0; bottom:0; width:${this.width}px">
  ${this.body}
</div>`}};c("sds-overlay",X);c("sds-modal",tt);c("sds-drawer",et);var st=class extends d{static{this.properties={heading:{type:String},body:{type:String},actions:{type:Array},width:{type:Number,reflect:!0},open:{type:Boolean,reflect:!0}}}constructor(){super(),this.heading="",this.body="",this.actions=[],this.width=330,this.open=!1}get dialog(){return this.querySelector("dialog")}show(){this.open=!0,this.updateComplete.then(()=>{let t=this.dialog;t&&!t.open&&t.showModal()})}close(){this.dialog?.close(),this.open=!1}updated(){let t=this.dialog;if(t&&this.isConnected)try{this.open&&!t.open&&t.showModal(),!this.open&&t.open&&t.close()}catch{this.open&&t.setAttribute("open","")}}render(){return r`<dialog
      class="sds-modal"
      style="width:${this.width}px"
      aria-label="${this.heading}"
      @close="${()=>{this.open=!1}}"
    >
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${()=>this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${v(this.actions,4)}
  </div>
</dialog>`}};c("sds-dialog",st);var nt=class extends d{static{this.properties={density:{type:String,reflect:!0},scrollable:{type:Boolean,reflect:!0},columns:{type:Array},rows:{type:Array}}}constructor(){super(),this.density="medium",this.scrollable=!1,this.columns=[],this.rows=[]}cell(t,e){return e?r`<td class="${e}">${t}</td>`:r`<td>${t}</td>`}bodyRow(t){let e=v(t.cells.map((s,n)=>this.cell(s,this.columns[n]?.cls)),6);return t.style?r`<tr style="${t.style}">
      ${e}
    </tr>`:r`<tr>
      ${e}
    </tr>`}render(){let t=`sds-table sds-table--${this.density}${this.scrollable?" sds-table--scroll":""}`;return r`<table class="${t}">
  <thead><tr>
    ${v(this.columns.map(e=>r`<th>${e.head}</th>`),4)}
  </tr></thead>
  <tbody>
    ${v(this.rows.map(e=>this.bodyRow(e)),4)}
  </tbody>
</table>`}};c("sds-table",nt);var it=class extends d{constructor(){super();this.taken=null;this.clipboard=!0;this.lang="",this.body=[],this.copy=!1,this.copied=!1}static{this.properties={lang:{type:String,reflect:!0},body:{type:Array},action:{type:Object},copy:{type:Boolean,reflect:!0},copied:{type:Boolean,state:!0}}}connectedCallback(){if(typeof navigator<"u"&&(this.clipboard=!!navigator.clipboard),this.taken===null&&this.childNodes.length>0){this.taken=[...this.childNodes];for(let e of this.taken)e.remove()}super.connectedCallback()}get text(){return(this.textContent??"").replace(/\n+$/,"")}async toClipboard(){try{await navigator.clipboard.writeText(this.text)}catch{return}this.copied=!0,setTimeout(()=>{this.copied=!1},1600)}get copyButton(){if(!(!this.copy||!this.clipboard))return r`<button type="button" class="sds-code__copy${this.copied?" is-copied":""}" aria-label="Copy this block" @click="${()=>{this.toClipboard()}}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied?"copied":"copy"}</span></button>`}line({kind:e,text:s,code:n}){let o=n?r` <span class="sds-code__cmd">${n}</span>`:void 0;switch(e){case"shell":return r`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${s}</span>${o}`;case"comment":return r`<span class="sds-code__comment">${s}</span>${o}`;case"ok":return r`<span class="sds-code__ok">✓</span> ${s}${o}`;default:return r`${s}${o}`}}get wrapped(){return this.lang?r`<code class="language-${this.lang}">${this.taken}</code>`:r`<code>${this.taken}</code>`}render(){let e=this.action??this.copyButton,s=this.lang||e?r`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${e}
  </div>`:void 0;return r`<div class="sds-code">
  ${s}
  <pre class="sds-code__body">${this.taken?this.wrapped:v(this.body.map(n=>this.line(n)),0)}</pre>
</div>`}},ot=class extends d{static{this.properties={path:{type:String,reflect:!0},icon:{type:String},body:{type:Array}}}constructor(){super(),this.path="",this.body=[]}line({kind:t,text:e}){return t==="context"?r`<span class="sds-diff__line">   ${e}</span>`:r`<span class="sds-diff__line sds-diff__line--${t}"><span class="sds-diff__mark">${t==="add"?"+":"-"}</span>  ${e}</span>`}render(){return r`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon??"actions-code-compare"}"></sds-icon><span class="spec-cap">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map(t=>this.line(t))}</pre>
</div>`}};c("sds-code",it);c("sds-diff",ot);typeof document<"u"&&$t();var an=["sds-icon","sds-button","sds-badge","sds-link","sds-field","sds-field-error","sds-pills","sds-tabs","sds-rail","sds-surface","sds-overlay","sds-modal","sds-drawer","sds-dialog","sds-table","sds-code","sds-diff"];export{q as SdsBadge,W as SdsButton,it as SdsCode,st as SdsDialog,ot as SdsDiff,et as SdsDrawer,d as SdsElement,G as SdsField,F as SdsFieldError,j as SdsIcon,K as SdsLink,tt as SdsModal,X as SdsOverlay,J as SdsPills,Z as SdsRail,Q as SdsSurface,nt as SdsTable,Y as SdsTabs,an as TAGS,Wt as buttonClass,c as define,qt as fieldClass,oe as iconIds,$t as installHostRule};
