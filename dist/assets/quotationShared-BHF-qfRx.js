import{bA as re,ay as Q,B as ne,l as E,aw as ie,bK as oe,r as N,j as t,bL as le,bM as de,ap as ce,bD as pe,bN as me,aq as ge,ak as u,bJ as he,bI as ue,n as be}from"./index-Dz4DOVz_.js";const Fe=6,Re=8,xe="crm-admin-quotation-manager-layout",Qe="quotation_layout_preferences",Ue="Admin Quotation Manager Layout",fe=5*1024*1024,ve=["pdf","xls","xlsx"],Me={num:"",owner:"",date:"",company:"",amount:"",status:"",project:""},ke={accountNumber:"",name:"",email:"",phone:"",accountOwner:""},Be=[{value:"",label:"Select"},{value:"open",label:"Open"},{value:"approved",label:"Approved"},{value:"customer_approved",label:"Customer Approved"},{value:"customer_rejected",label:"Customer Rejected"},{value:"rejected",label:"Rejected"},{value:"cancelled",label:"Cancelled"}],Ve=[{value:"INR",label:"INR"},{value:"USD",label:"USD"},{value:"AED",label:"AED"},{value:"NZD",label:"NZ$"},{value:"CAD",label:"CAD"},{value:"SEK",label:"SEK"},{value:"SGD",label:"SGD"},{value:"AUD",label:"AUD"},{value:"JPY",label:"JPY"},{value:"EUR",label:"Euro"},{value:"GBP",label:"GBP"},{value:"QAR",label:"QAR"},{value:"SAR",label:"SAR"},{value:"OMR",label:"OMR"}],k=()=>new Date().toISOString().slice(0,10),ye=(e,a)=>{const n=new Date(e||k());return n.setDate(n.getDate()+a),n.toISOString().slice(0,10)},Ge=()=>{const e=k();return{selectedAccountId:"",selectedAccountLabel:"",clientAccountNumber:"",companyName:"",contactPerson:"",address:"",email:"",phone:"",accountOwner:"",quoteNumber:"",quotationDate:e,totalAmount:"",amountCurrency:"INR",totalProductTax:"",taxCurrency:"INR",quotationStatus:"",validUntilDate:ye(e,30),quoteFile:null,quoteFileName:""}},B=[{key:"num",label:"Quotation Number",exportValue:e=>e.num},{key:"date",label:"Quotation Date",exportValue:e=>e.date},{key:"owner",label:"Quotation Owner",exportValue:e=>e.owner},{key:"company",label:"Company Name",exportValue:e=>e.company},{key:"project",label:"Project Name",exportValue:e=>e.project},{key:"amount",label:"Amount",exportValue:e=>e.amountLabel},{key:"status",label:"Status",exportValue:e=>e.statusLabel}],Ke=[{key:"num",label:"Quotation Number",type:"text",width:18},{key:"date",label:"Quotation Date",type:"date",align:"center",width:18},{key:"owner",label:"Quotation Owner",type:"text",width:22},{key:"company",label:"Company Name",type:"text",width:28},{key:"project",label:"Project Name",type:"text",width:28},{key:"amountLabel",label:"Amount",type:"text",width:18},{key:"statusLabel",label:"Status",type:"text",width:16}],j=["num","owner","date","amount","status","company","project"],V=(e=[],a="deal")=>{const n=e.filter(Boolean),o=(a==="account"?["num","owner","date","company","amount","status","project"]:["num","owner","date","amount","status","company","project"]).filter(i=>n.includes(i));return n.forEach(i=>{o.includes(i)||o.push(i)}),o},De=()=>{try{const e=window.localStorage.getItem(xe),a=e?JSON.parse(e):null,n=Array.isArray(a==null?void 0:a.selectedFields)&&a.selectedFields.length>0?a.selectedFields.filter(s=>B.some(o=>o.key===s)):j;return{selectedFields:V(n)}}catch{return{selectedFields:j}}},We=(e={})=>{const a=Array.isArray(e==null?void 0:e.selectedFields)&&e.selectedFields.length>0?e.selectedFields.filter(n=>B.some(s=>s.key===n)):j;return{selectedFields:V(a.length>0?a:j)}},x={brandKey:"swati",organizationName:"Swati Switchgears India Pvt Ltd",organizationLegalName:"Swati Switchgears (India) Pvt. Ltd.",organizationAddress:"36 Shubhlaxmi Industrial Estate, Sarkhej Bavla Road, Changodar, Ahmedabad - 382210",organizationAddressLines:["36 Shubhlaxmi Industrial Estate,","Sarkhej Bavla Road, Changodar,","Ahmedabad - 382210"],organizationEmail:"mkt@swatiswitchgears.com",organizationPhone:"9913536307",organizationGstin:"24AAACZ0615P1Z7",organizationStateCode:"24",website:"www.swatiswitchgears.com",organizationTagline:"",logoType:"image"},q={brandKey:"lumos",organizationName:"Lumos Building Automation Pvt Ltd",organizationLegalName:"Lumos Building Automation Pvt. Ltd.",organizationAddress:"Vadodara, Gujarat, India",organizationEmail:"sales@lumosbuildingautomation.com",organizationPhone:"+91 265 4000 222",organizationGstin:"24AAECL9020K1ZY",organizationStateCode:"24",website:"www.lumosbuildingautomation.com",organizationTagline:"Building automation, controls and smart infrastructure solutions.",logoType:"image"},U={swati:x,"swati-switch":x,"swati-switch-gear":x,lumos:q,"lumos-building":q},G=[{key:"pdf",label:"View As PDF",icon:re,iconClass:"aqp-action-icon--pdf"},{key:"preview",label:"Preview",icon:Q},{key:"view",label:"View Quote",icon:Q},{key:"approve",label:"Approve Quote",icon:ne},{key:"reject",label:"Reject Quote",icon:E},{key:"clone",label:"Clone Quote",icon:ie},{key:"account",label:"View Account",icon:oe}],v=e=>String(e||"").trim().toLowerCase(),M=e=>String(e||"").split(/\r?\n|,/).map(a=>a.trim()).filter(Boolean),Ze=(e={})=>[e.address,e.location,e.state].filter(Boolean).join(", "),Ne=(e="")=>{const a=String(e||"").split(".");return a.length>1?v(a.pop()):""},Ye=e=>{if(!e)return"Quote File is required.";const a=Ne(e.name);return ve.includes(a)?e.size>fe?"Quote File size must be 5 MB or less.":"":"Only PDF, XLS and XLSX files are allowed."},_=(e={})=>{const a=v(e.profileKey);if(a&&U[a])return U[a];const n=v(e.profileName||e.organizationName);return n.includes("swati")?x:n.includes("lumos")?q:{}},we=(e={})=>_(e).brandKey==="swati",je=(e={})=>_(e).brandKey==="lumos",I=e=>e==="lumos"?he:e==="swati"?ue:null,K=e=>e==="lumos"?"lumos":e==="swati"?"swati":"",_e=(e={})=>{const a=_(e);return a.logoType?a.logoType==="image":v(e.profileName||e.organizationName).includes("swati")},Xe=e=>{if(!e)return"-";const a=new Date(e);if(Number.isNaN(a.getTime()))return String(e);const n=String(a.getDate()).padStart(2,"0"),s=String(a.getMonth()+1).padStart(2,"0"),o=a.getFullYear();return`${n}-${s}-${o}`},z=e=>{if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?String(e):new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(a)},f=e=>{const a=Number.parseFloat(e);return Number.isFinite(a)?a:0},l=e=>String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),P=e=>{const a=v(e).replace(/[\s-]+/g,"_");return a?a==="accepted"?"approved":a==="new"?"draft":a:"draft"},D=e=>{const a=P(e),n={draft:"Draft",sent:"Sent",approved:"Approved",rejected:"Rejected",cancelled:"Cancelled",open:"Open"};return n[a]?n[a]:a.split("_").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" ")},Se=e=>{const a=P(e);return a==="approved"?"aqp-status--approved":a==="rejected"?"aqp-status--rejected":a==="sent"?"aqp-status--sent":"aqp-status--open"},He=e=>{const a=P(e);return a==="approved"||a==="cancelled"?"aqp-num-badge--orange":"aqp-num-badge--teal"},Te=(e={})=>[e==null?void 0:e.name,e==null?void 0:e.username,e==null?void 0:e.email].map(a=>v(a)).filter(Boolean),ze=(e,a)=>{var m,b,p,h,w;const n=v(e==null?void 0:e.role);if(n==="admin"||n==="super_admin")return G.map(y=>y.key);const o=[a==null?void 0:a.owner,(m=a==null?void 0:a.raw)==null?void 0:m.selectedAccountOwner,(b=a==null?void 0:a.raw)==null?void 0:b.ownerName,(p=a==null?void 0:a.raw)==null?void 0:p.createdBy].map(y=>v(y)),i=Te(e),r=o.some(y=>y&&i.includes(y)),d=!!((h=e==null?void 0:e.permissions)!=null&&h.approveQuotes||(w=e==null?void 0:e.permissions)!=null&&w.approveQuotation);if(n==="viewer"||!r&&!d)return["pdf","preview","view"];const g=["pdf","preview","view","clone"];return d&&g.push("approve","reject"),g},Je=(e,a)=>{const n=new Set(ze(e,a));return G.filter(s=>n.has(s.key))},et=(e,a)=>{const s=Math.max(1,e-Math.floor(2.5)),o=Math.min(a,s+5-1),i=Math.max(1,o-5+1);return Array.from({length:o-i+1},(r,d)=>i+d)},tt=e=>e||"-",c=e=>String(e??"").trim().replace(/^-+\s*/,""),qe=(...e)=>e.map(a=>String(a||"").trim()).filter(Boolean).join(", "),Ee=(e={})=>{const n=(Array.isArray(e.lineItems)?e.lineItems:[]).filter(o=>String((o==null?void 0:o.description)||"").trim()).map((o,i)=>{const r=f(o.quantity||o.qty||0),d=f(o.rate||o.price||o.unitPrice||0),g=Number.isFinite(Number(o.amount))?Number(o.amount):r*d;return{id:o.id||`line-${i+1}`,srNo:i+1,description:o.description,quantity:r,unit:o.unit||"Nos",rate:d,amount:g}});if(n.length>0)return n;const s=[e.product,e.otherProduct,e.otherService,e.projectName].filter(Boolean).join(" / ");return!s&&!f(e.amount)?[]:[{id:e.id||"line-1",srNo:1,description:s||e.companyName||"Quotation Item",quantity:1,unit:"Nos",rate:f(e.amount),amount:f(e.amount)}]},W=e=>{const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],n=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],s=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];return e===0?"":e<10?a[e]:e<20?n[e-10]:e<100?`${s[Math.floor(e/10)]}${e%10?` ${a[e%10]}`:""}`:`${a[Math.floor(e/100)]} Hundred${e%100?` ${W(e%100)}`:""}`},Ie=e=>{const a=Math.floor(Math.abs(f(e)));if(!a)return"Zero";const n=[{divisor:1e7,label:"Crore"},{divisor:1e5,label:"Lakh"},{divisor:1e3,label:"Thousand"},{divisor:1,label:""}];let s=a;const o=[];return n.forEach(({divisor:i,label:r})=>{if(s>=i){const d=Math.floor(s/i);s%=i,d>0&&(o.push(W(d)),r&&o.push(r))}}),o.join(" ").trim()},at=(e,a)=>{if(!e)return null;const n=a.find(i=>String(i.id)===String(e.selectedAccountId||""));if(n)return n;const s=v(e.clientAccountNumber);if(s){const i=a.find(r=>v(r.accountNumber)===s);if(i)return i}const o=v(e.companyName);if(o){const i=a.find(r=>v(r.name)===o);if(i)return i}return null},st=(e,a)=>{var O,F,R;const n=_(e),s=n.brandKey?n:x,o=we(e)||!n.brandKey,i=je(e),r=!!n.brandKey,d=s.brandKey||(o?"swati":i?"lumos":"swati"),g=I(d),m=Ee(e),b=m.reduce((ae,se)=>ae+f(se.amount),0),p=f(e.cgstAmount||e.cgst||0),h=f(e.sgstAmount||e.sgst||0),w=f(e.igstAmount||e.igst||0),y=f(e.taxAmount||0),A=f(e.amount),L=b+p+h+w+y,$=A>0?Math.max(A,L):L,Z=e.logoType||n.logoType||(_e(e)?"image":"text"),S=e.clientAddressDetails||qe(a==null?void 0:a.address,a==null?void 0:a.location,a==null?void 0:a.state)||"-",T=r?s.organizationName:e.organizationName||s.organizationName||e.profileName||x.organizationName,Y=r?s.organizationLegalName||T:e.organizationLegalName||s.organizationLegalName||T,C=r?s.organizationAddress||"":e.organizationAddress||s.organizationAddress||x.organizationAddress,X=s.organizationAddressLines||M(C),H=r?s.organizationEmail||"":e.organizationEmail||s.organizationEmail||x.organizationEmail,J=r?s.organizationPhone||"":e.organizationPhone||s.organizationPhone||x.organizationPhone,ee=r?s.organizationGstin||"":e.organizationGstin||s.organizationGstin||x.organizationGstin,te=r?s.organizationStateCode||"":e.organizationStateCode||s.organizationStateCode||x.organizationStateCode;return{id:e.id,quotationNumber:e.quotationNumber||"-",quotationDate:z(e.quotationDate||e.createdAt),validUntil:z(e.validUntil),currency:e.currency||s.currency||"INR",statusLabel:D(e.status),profileName:e.profileName||"-",brandKey:d,brandClassName:K(d),logoSource:g,isSwatiDocument:o,isLumosDocument:i,organizationName:T,organizationLegalName:Y,organizationAddress:C,organizationAddressLines:X,organizationEmail:H,organizationPhone:J,organizationGstin:ee,organizationStateCode:te,website:r?s.website||"":e.website||s.website||x.website,organizationTagline:e.organizationTagline||s.organizationTagline||"",logoType:Z,companyName:e.companyName||(a==null?void 0:a.name)||"-",clientAccountNumber:e.clientAccountNumber||(a==null?void 0:a.accountNumber)||"-",contactPerson:e.contactPerson||(a==null?void 0:a.contactPerson)||"-",telephone:e.telephone||(a==null?void 0:a.phone)||(a==null?void 0:a.contactPhone)||"-",email:e.email||(a==null?void 0:a.email)||(a==null?void 0:a.contactEmail)||"-",gstin:e.gstin||(a==null?void 0:a.gstin)||"-",stateCode:e.stateCode||(a==null?void 0:a.stateCode)||"-",accountOwner:(a==null?void 0:a.accountOwnerDisplay)||e.selectedAccountOwner||(a==null?void 0:a.accountOwner)||"-",customerReferenceNumber:((O=e.customerReference)==null?void 0:O.number)||"-",customerReferenceDate:z((F=e.customerReference)==null?void 0:F.date),customerReferenceSubject:((R=e.customerReference)==null?void 0:R.subject)||"-",quotationSubject:e.quotationSubject||"-",projectName:e.projectName||"-",clientAddressDetails:S,clientAddressLines:M(S==="-"?"":S),product:e.product||"-",otherProduct:e.otherProduct||"-",otherService:e.otherService||"-",deliveryTerms:e.deliveryTerms||"-",paymentTerms:e.paymentTerms||"-",warrantyTerms:e.warrantyTerms||"-",quotationNotes:e.quotationNotes||"-",rejectionReason:e.rejectionReason||"",lineItems:m,subtotal:b,cgst:p,sgst:h,igst:w,otherTax:y,total:$,amountInWords:`${Ie($)} ${e.currency==="USD"?"US Dollars":e.currency==="EUR"?"Euros":"Rupees"} Only`}},Pe=e=>{const a=e.logoSource||I(e.brandKey),n=e.brandClassName||K(e.brandKey),s=e.lineItems.map(i=>`
    <tr>
      <td class="text-center">${i.srNo}</td>
      <td class="description-cell">${l(i.description)}</td>
      <td class="text-center">${l(i.quantity)}</td>
      <td class="text-center">${l(i.unit)}</td>
      <td class="money">${l(u(i.rate,e.currency))}</td>
      <td class="money">${l(u(i.amount,e.currency))}</td>
    </tr>
  `).join(""),o=a?`<div class="logo-wrap logo-wrap--${l(n||"default")}"><img src="${a}" alt="${l(e.organizationName)}" class="logo logo--${l(n||"default")}" /></div>`:`<div class="logo-text">${l(e.organizationName)}</div>`;return`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${l(e.quotationNumber)} - Sales Quotation</title>
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #1f2933; background: #ffffff; }
        .print-shell { padding: 14px; }
        .print-toolbar {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          width: 100%;
          max-width: 980px;
          margin: 0 auto 14px;
        }
        .print-toolbar button {
          padding: 10px 16px;
          border: 1px solid #1f6ea4;
          border-radius: 8px;
          background: linear-gradient(180deg, #3291d1 0%, #1f6ea4 100%);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .print-toolbar button:last-child {
          border-color: #c7d6e2;
          background: #ffffff;
          color: #355163;
        }
        .quotation-print {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #c9d5df;
        }
        .quotation-header {
          padding: 18px 16px 0;
          background: #ffffff;
        }
        .quotation-main {
          padding: 12px 16px 16px;
        }
        .quotation-footer {
          border-top: 1px solid #d5e0ea;
          padding: 12px 18px;
          text-align: center;
          font-size: 10.5px;
          line-height: 1.5;
          color: #52606d;
          background: #ffffff;
        }
        .brand-head {
          text-align: center;
          padding-bottom: 12px;
        }
        .logo-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 0;
          width: fit-content;
          max-width: 100%;
          margin: 0 auto 8px;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
        }
        .logo {
          display: block;
          width: 213px;
          height: 142px;
          max-width: 100%;
          max-height: 152px;
          object-fit: contain;
          object-position: center;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          filter: none;
          opacity: 1;
        }
        .logo--swati {
          width: 196px;
          height: 148px;
          max-height: 159px;
        }
        .logo--lumos {
          width: 311px;
          height: 142px;
          max-height: 152px;
          background: transparent;
          border-radius: 0;
          padding: 0;
        }
        .logo-text {
          font-size: 18px;
          font-weight: 800;
          color: #164f7d;
          margin-bottom: 8px;
        }
        .company-name {
          margin: 0;
          font-size: 20px;
          line-height: 1.25;
          font-weight: 800;
          color: #102a43;
        }
        .company-contact {
          margin-top: 7px;
          font-size: 10px;
          line-height: 1.5;
          color: #52606d;
        }
        .party-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        .party-card {
          border: 1px solid #a9dfe3;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 10.5px;
          line-height: 1.42;
          background: #ffffff;
        }
        .section-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #1f6ea4;
          margin-bottom: 8px;
        }
        .field-row {
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr);
          gap: 8px;
          margin-top: 5px;
        }
        .field-row strong {
          color: #243b53;
          font-weight: 700;
        }
        .field-row span {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        h1 {
          margin: 0;
          padding: 12px 14px;
          text-align: center;
          font-size: 19px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: 1px;
          border-top: 1px solid #d5e0ea;
          border-bottom: 1px solid #d5e0ea;
          background: #dc2626;
          border-color: #b91c1c;
          color: #ffffff;
        }
        h2, h3, p { margin: 0 0 6px; }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid #cbd9e3;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .meta-cell {
          padding: 9px 10px;
          border-right: 1px solid #d5e0ea;
          background: #f4f8fb;
        }
        .meta-cell:last-child { border-right: none; }
        .meta-label {
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          color: #627d98;
          margin-bottom: 6px;
          letter-spacing: 0.04em;
        }
        .meta-value {
          font-size: 10px;
          font-weight: 700;
          color: #102a43;
        }
        table { width: 100%; border-collapse: collapse; }
        .items-table {
          width: 100%;
          max-width: 100%;
          table-layout: fixed;
        }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        .items-table th,
        .items-table td {
          box-sizing: border-box;
          border: 1px solid #c9d5df;
          padding: 6px 6px;
          font-size: 10px;
          vertical-align: top;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .items-table th:nth-child(1),
        .items-table td:nth-child(1) { width: 42px !important; }
        .items-table th:nth-child(2),
        .items-table td:nth-child(2) { width: auto !important; }
        .items-table th:nth-child(3),
        .items-table td:nth-child(3) { width: 50px !important; }
        .items-table th:nth-child(4),
        .items-table td:nth-child(4) { width: 58px !important; }
        .items-table th:nth-child(5),
        .items-table td:nth-child(5) { width: 84px !important; }
        .items-table th:nth-child(6),
        .items-table td:nth-child(6) { width: 92px !important; }
        .items-table th {
          background: #dc2626;
          color: #ffffff;
          font-size: 8.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: center;
        }
        .description-cell {
          overflow-wrap: anywhere;
          line-height: 1.3;
        }
        .text-center { text-align: center; }
        .money {
          text-align: right;
          white-space: nowrap;
        }
        .summary-layout {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          align-items: stretch;
          margin-top: 10px;
        }
        .summary-card,
        .totals-card,
        .terms-card {
          border: 1px solid #a9dfe3;
          border-radius: 10px;
          padding: 10px 12px;
          background: #ffffff;
        }
        .summary-card,
        .totals-card { min-height: 158px; }
        .detail-row,
        .total-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 5px 0;
          border-bottom: 1px solid #edf2f7;
          font-size: 10px;
        }
        .detail-row:last-child,
        .total-row:last-child { border-bottom: none; }
        .detail-row strong,
        .total-row strong { color: #243b53; }
        .detail-row span,
        .total-row span {
          text-align: right;
          overflow-wrap: anywhere;
        }
        .totals-table td {
          padding: 7px 8px;
          border-bottom: 1px solid #d9e2ec;
          font-size: 11px;
        }
        .totals-table td:last-child { text-align: right; }
        .totals-table tr:last-child td { border-bottom: none; }
        .grand-total td {
          border-top: 2px solid #1f6ea4;
          font-weight: 700;
          background: #eff6ff;
        }
        .amount-words {
          margin-top: 12px;
          border: 1px solid #cbd9e3;
          border-radius: 4px;
          padding: 9px 10px;
          font-size: 10px;
          line-height: 1.5;
          background: #f4f8fb;
        }
        .amount-words strong {
          display: block;
          margin-bottom: 4px;
          color: #102a43;
        }
        .terms-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .terms-title {
          margin: 0 0 8px;
          font-size: 9px;
          text-transform: uppercase;
          color: #1f6ea4;
        }
        .terms-value {
          font-size: 10px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          body { background: #ffffff; }
          .print-shell { padding: 0; }
          .print-toolbar { display: none; }
          .quotation-print { max-width: none; border: none; }
          .quotation-header { padding: 0 0 0; }
          .quotation-main { padding: 14px 0 16px; }
          .items-table thead { display: table-header-group; }
          tr, .party-card, .summary-card, .totals-card, .terms-card, .amount-words { page-break-inside: avoid; }
        }
        @media (max-width: 840px) {
          .print-shell { padding: 12px; }
          .party-grid,
          .meta-grid,
          .summary-layout,
          .terms-grid {
            grid-template-columns: 1fr;
          }
          .meta-cell { border-right: none; border-bottom: 1px solid #d5e0ea; }
          .meta-cell:last-child { border-bottom: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-shell">
        <div class="print-toolbar">
          <button type="button" onclick="window.print()">Print / Save PDF</button>
          <button type="button" onclick="window.close()">Close</button>
        </div>
        <div class="quotation-print">
          <div class="quotation-header">
            <div class="brand-head">
              ${o}
              <h2 class="company-name">${l(e.organizationName)}</h2>
              <div class="company-contact">
                ${l(e.organizationAddress)}<br />
                Email: ${l(e.organizationEmail)} | Phone: ${l(e.organizationPhone)} | GSTIN: ${l(e.organizationGstin)}
              </div>
            </div>
            <div class="party-grid">
              <div class="party-card">
                <div class="section-label">Customer Details</div>
                <div class="field-row"><strong>Customer Name</strong><span>${l(c(e.companyName))}</span></div>
                <div class="field-row"><strong>Client Account No.</strong><span>${l(c(e.clientAccountNumber))}</span></div>
                <div class="field-row"><strong>Contact Person</strong><span>${l(c(e.contactPerson))}</span></div>
                <div class="field-row"><strong>Email</strong><span>${l(c(e.email))}</span></div>
                <div class="field-row"><strong>GSTIN</strong><span>${l(c(e.gstin))}</span></div>
                <div class="field-row"><strong>Address</strong><span>${l(c(e.clientAddressDetails))}</span></div>
              </div>
              <div class="party-card">
                <div class="section-label">Sales Details</div>
                <div class="field-row"><strong>Sales Executive</strong><span>${l(e.accountOwner)}</span></div>
                <div class="field-row"><strong>Mobile Number</strong><span>${l(e.organizationPhone)}</span></div>
                <div class="field-row"><strong>Email Address</strong><span>${l(e.organizationEmail)}</span></div>
                <div class="field-row"><strong>Quotation Reference</strong><span>${l(e.quotationNumber)}</span></div>
              </div>
            </div>
          <h1>SALES QUOTATION</h1>
          </div>
          <div class="quotation-main">
            <div class="meta-grid">
              <div class="meta-cell">
                <div class="meta-label">Quotation No.</div>
                <div class="meta-value">${l(e.quotationNumber)}</div>
              </div>
              <div class="meta-cell">
                <div class="meta-label">Quotation Date</div>
                <div class="meta-value">${l(e.quotationDate)}</div>
              </div>
              <div class="meta-cell">
                <div class="meta-label">Valid Until</div>
                <div class="meta-value">${l(e.validUntil)}</div>
              </div>
              <div class="meta-cell">
                <div class="meta-label">Currency</div>
                <div class="meta-value">${l(e.currency)}</div>
              </div>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width:42px;">Sr.</th>
                  <th>Description</th>
                  <th style="width:50px;">Qty</th>
                  <th style="width:58px;">Unit</th>
                  <th style="width:84px;">Rate</th>
                  <th style="width:92px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${s||'<tr><td colspan="6">No quotation items available.</td></tr>'}
              </tbody>
            </table>

            <div class="summary-layout">
              <div class="summary-card">
                <div class="section-label">Quotation Details</div>
                <div class="detail-row"><strong>Profile Name</strong><span>${l(c(e.profileName))}</span></div>
                <div class="detail-row"><strong>Project</strong><span>${l(c(e.projectName))}</span></div>
                <div class="detail-row"><strong>Account Owner</strong><span>${l(c(e.accountOwner))}</span></div>
                <div class="detail-row"><strong>Subject</strong><span>${l(c(e.quotationSubject))}</span></div>
                <div class="detail-row"><strong>Product</strong><span>${l([e.product,e.otherProduct].filter(i=>i&&i!=="-").join(" / "))}</span></div>
                <div class="detail-row"><strong>Service</strong><span>${l(c(e.otherService))}</span></div>
              </div>
              <div class="totals-card">
                <div class="section-label">Amount Summary</div>
                <div class="total-row"><strong>Sub Total</strong><span>${l(u(e.subtotal,e.currency))}</span></div>
                <div class="total-row"><strong>CGST</strong><span>${l(u(e.cgst,e.currency))}</span></div>
                <div class="total-row"><strong>SGST</strong><span>${l(u(e.sgst,e.currency))}</span></div>
                <div class="total-row"><strong>IGST</strong><span>${l(u(e.igst,e.currency))}</span></div>
                <div class="total-row"><strong>Other Tax</strong><span>${l(u(e.otherTax,e.currency))}</span></div>
                <div class="total-row grand-total"><strong>Total Amount</strong><span>${l(u(e.total,e.currency))}</span></div>
              </div>
            </div>

            <div class="amount-words"><strong>Amount in Words</strong>${l(e.amountInWords)}</div>

            <div class="terms-grid">
              <div class="terms-card">
                <h3 class="terms-title">Inquiry Reference</h3>
                <div class="terms-value">Number: ${l(c(e.customerReferenceNumber))}&#10;Date: ${l(c(e.customerReferenceDate))}&#10;Subject: ${l(c(e.customerReferenceSubject))}</div>
              </div>
              <div class="terms-card">
                <h3 class="terms-title">Terms &amp; Conditions</h3>
                <div class="terms-value">Delivery: ${l(c(e.deliveryTerms))}&#10;Payment: ${l(c(e.paymentTerms))}&#10;Warranty: ${l(c(e.warrantyTerms))}</div>
              </div>
              <div class="terms-card">
                <h3 class="terms-title">Quotation Notes</h3>
                <div class="terms-value">${l(c(e.quotationNotes))}</div>
              </div>
              <div class="terms-card">
                <h3 class="terms-title">Status</h3>
                <div class="terms-value">Status: ${l(e.statusLabel)}${e.rejectionReason?`&#10;Reason: ${l(e.rejectionReason)}`:""}</div>
              </div>
            </div>
          </div>
          <div class="quotation-footer">
            <strong>${l(e.organizationName)}</strong><br />
            Website: ${l(e.website||x.website)} | Email: ${l(e.organizationEmail)} | Phone: ${l(e.organizationPhone)}
          </div>
        </div>
      </div>
    </body>
  </html>`},Ae=e=>{if(!e)return;const a=document.title,n=`Quotation-${(e==null?void 0:e.quotationNumber)||"Document"}.pdf`,s=document.createElement("iframe");let o=null;s.title=n,s.setAttribute("aria-hidden","true"),s.style.position="fixed",s.style.left="-10000px",s.style.top="0",s.style.width="1024px",s.style.height="768px",s.style.border="0",s.style.opacity="0";const i=()=>{o&&window.clearTimeout(o),document.title=a,window.removeEventListener("afterprint",i),s.parentNode&&s.parentNode.removeChild(s)},r=()=>{const d=s.contentDocument;if(!d)return Promise.resolve();const g=Array.from(d.images||[]);return Promise.all(g.map(m=>m.complete?Promise.resolve():new Promise(b=>{m.onload=b,m.onerror=b})))};s.onload=()=>{r().then(()=>{const d=s.contentWindow;if(!d){i();return}document.title=n,window.addEventListener("afterprint",i),o=window.setTimeout(i,2500),d.focus(),d.print()})},document.title=n,document.body.appendChild(s),s.srcdoc=Pe(e)};function rt({status:e}){return t.jsx("span",{className:`aqp-status ${Se(e)}`,children:D(e)})}function nt({title:e,onClose:a,onDelete:n,size:s="",children:o,footer:i}){return N.useEffect(()=>{const r=d=>{d.key==="Escape"&&a()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[a]),t.jsx("div",{className:"aqp-overlay",role:"presentation",onClick:a,children:t.jsxs("div",{className:`aqp-modal ${s}`.trim(),role:"dialog","aria-modal":"true",onClick:r=>r.stopPropagation(),children:[t.jsxs("div",{className:"aqp-modal-header",children:[t.jsx("span",{className:"aqp-modal-title",children:e}),t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[n?t.jsx("button",{type:"button",className:"aqp-modal-close",onClick:n,"aria-label":"Delete",title:"Delete",children:t.jsx(ge,{})}):null,t.jsx("button",{type:"button",className:"aqp-modal-close",onClick:a,"aria-label":"Close",children:t.jsx(E,{})})]})]}),t.jsx("div",{className:"aqp-modal-body",children:o}),i?t.jsx("div",{className:"aqp-modal-footer",children:i}):null]})})}const Le=({value:e,fieldKey:a,editable:n=!1,multiline:s=!1,className:o="",onCommit:i})=>{const[r,d]=N.useState(!1),[g,m]=N.useState(e||"");N.useEffect(()=>{r||m(e||"")},[r,e]);const b=()=>{const p=String(g||"").trim();d(!1),p!==String(e||"").trim()&&(i==null||i(a,p))};return!n||!a?t.jsx("span",{className:o,children:e}):r?s?t.jsx("textarea",{className:"aqp-doc-edit-input aqp-doc-edit-input--textarea",value:g,onChange:p=>m(p.target.value),onBlur:b,onKeyDown:p=>{p.key==="Escape"&&d(!1),(p.ctrlKey||p.metaKey)&&p.key==="Enter"&&b()},autoFocus:!0}):t.jsx("input",{className:"aqp-doc-edit-input",value:g,onChange:p=>m(p.target.value),onBlur:b,onKeyDown:p=>{p.key==="Escape"&&d(!1),p.key==="Enter"&&b()},autoFocus:!0}):t.jsxs("span",{className:`aqp-doc-editable ${o}`.trim(),children:[t.jsx("span",{className:"aqp-doc-editable-value",children:e}),t.jsx("button",{type:"button",className:"aqp-doc-edit-btn",onClick:()=>{m(e||""),d(!0)},"aria-label":"Edit quotation field",children:t.jsx(be,{})})]})},$e=(e,a,n)=>(s,o,i={})=>t.jsx(Le,{fieldKey:s,value:o,editable:a,multiline:i.multiline,className:i.className,onCommit:n});function Ce({documentData:e,editable:a=!1,onEditField:n}){const s=e.logoSource||I(e.brandKey),o=e.isLumosDocument?"lumos":e.isSwatiDocument?"swati":"default",i=[e.product,e.otherProduct].filter(d=>d&&d!=="-").join(" / "),r=$e(e,a,n);return t.jsx("div",{className:"aqp-doc aqp-print-scope",children:t.jsxs("div",{className:"aqp-doc__frame",children:[t.jsxs("div",{className:"aqp-doc__brand-head",children:[t.jsx("div",{className:`aqp-doc__logo-wrap aqp-doc__logo-wrap--${o}`,children:s?t.jsx("img",{src:s,alt:e.organizationName,className:`aqp-doc__brand-logo aqp-doc__brand-logo--${o}`}):t.jsx("div",{className:"aqp-doc__text-logo",children:e.organizationName})}),t.jsx("h2",{children:e.organizationName}),t.jsxs("p",{children:[e.organizationAddress,t.jsx("br",{}),"Email: ",e.organizationEmail," | Phone: ",e.organizationPhone," | GSTIN: ",e.organizationGstin]})]}),t.jsxs("div",{className:"aqp-doc__party-grid",children:[t.jsxs("section",{className:"aqp-doc__party-card",children:[t.jsx("div",{className:"aqp-doc__eyebrow",children:"Customer Details"}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Customer Name"}),r("companyName",c(e.companyName))]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Client Account No."}),r("clientAccountNumber",c(e.clientAccountNumber))]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Contact Person"}),r("contactPerson",c(e.contactPerson))]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Email"}),r("email",c(e.email))]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"GSTIN"}),r("gstin",c(e.gstin))]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Address"}),r("clientAddressDetails",c(e.clientAddressDetails),{multiline:!0})]})]}),t.jsxs("section",{className:"aqp-doc__party-card",children:[t.jsx("div",{className:"aqp-doc__eyebrow",children:"Sales Details"}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Sales Executive"}),r("selectedAccountOwner",e.accountOwner)]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Mobile Number"}),r("organizationPhone",e.organizationPhone)]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Email Address"}),r("organizationEmail",e.organizationEmail)]}),t.jsxs("div",{className:"aqp-doc__field-row",children:[t.jsx("strong",{children:"Quotation Reference"}),r("quotationNumber",e.quotationNumber)]})]})]}),t.jsx("div",{className:"aqp-doc__title",children:"SALES QUOTATION"}),t.jsxs("div",{className:"aqp-doc__meta",children:[t.jsxs("div",{className:"aqp-doc__meta-cell",children:[t.jsx("span",{className:"aqp-doc__meta-label",children:"Quotation No."}),t.jsx("strong",{children:r("quotationNumber",e.quotationNumber)})]}),t.jsxs("div",{className:"aqp-doc__meta-cell",children:[t.jsx("span",{className:"aqp-doc__meta-label",children:"Quotation Date"}),t.jsx("strong",{children:r("quotationDate",e.quotationDate)})]}),t.jsxs("div",{className:"aqp-doc__meta-cell",children:[t.jsx("span",{className:"aqp-doc__meta-label",children:"Valid Until"}),t.jsx("strong",{children:r("validUntil",e.validUntil)})]}),t.jsxs("div",{className:"aqp-doc__meta-cell",children:[t.jsx("span",{className:"aqp-doc__meta-label",children:"Currency"}),t.jsx("strong",{children:r("currency",e.currency)})]})]}),t.jsxs("table",{className:"aqp-doc__table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{style:{width:"42px"},children:"Sr."}),t.jsx("th",{children:"Description"}),t.jsx("th",{style:{width:"50px"},children:"Qty"}),t.jsx("th",{style:{width:"58px"},children:"Unit"}),t.jsx("th",{style:{width:"84px"},children:"Rate"}),t.jsx("th",{style:{width:"92px"},children:"Amount"})]})}),t.jsx("tbody",{children:e.lineItems.length===0?t.jsx("tr",{children:t.jsx("td",{colSpan:6,children:"No quotation items available."})}):e.lineItems.map(d=>t.jsxs("tr",{children:[t.jsx("td",{className:"aqp-doc__num",children:d.srNo}),t.jsx("td",{className:"aqp-doc__description",children:r(`lineItems.${d.srNo-1}.description`,d.description,{multiline:!0})}),t.jsx("td",{className:"aqp-doc__num",children:r(`lineItems.${d.srNo-1}.quantity`,d.quantity)}),t.jsx("td",{className:"aqp-doc__num",children:r(`lineItems.${d.srNo-1}.unit`,d.unit)}),t.jsx("td",{className:"aqp-doc__amount",children:r(`lineItems.${d.srNo-1}.rate`,u(d.rate,e.currency))}),t.jsx("td",{className:"aqp-doc__amount",children:u(d.amount,e.currency)})]},d.id))})]}),t.jsxs("div",{className:"aqp-doc__summary",children:[t.jsxs("div",{className:"aqp-doc__summary-card",children:[t.jsx("div",{className:"aqp-doc__eyebrow",children:"Quotation Details"}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Profile Name"}),r("profileName",c(e.profileName))]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Project"}),r("projectName",c(e.projectName))]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Account Owner"}),r("selectedAccountOwner",c(e.accountOwner))]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Subject"}),r("quotationSubject",c(e.quotationSubject))]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Product"}),r("product",i)]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Service"}),r("otherService",c(e.otherService))]})]}),t.jsxs("div",{className:"aqp-doc__totals",children:[t.jsx("div",{className:"aqp-doc__eyebrow",children:"Amount Summary"}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Sub Total"}),t.jsx("span",{children:u(e.subtotal,e.currency)})]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"CGST"}),t.jsx("span",{children:u(e.cgst,e.currency)})]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"SGST"}),t.jsx("span",{children:u(e.sgst,e.currency)})]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"IGST"}),t.jsx("span",{children:u(e.igst,e.currency)})]}),t.jsxs("div",{className:"aqp-doc__kv-row",children:[t.jsx("strong",{children:"Other Tax"}),t.jsx("span",{children:u(e.otherTax,e.currency)})]}),t.jsxs("div",{className:"aqp-doc__kv-row aqp-doc__grand-total",children:[t.jsx("strong",{children:"Total Amount"}),t.jsx("span",{children:u(e.total,e.currency)})]})]})]}),t.jsxs("div",{className:"aqp-doc__amount-words",children:[t.jsx("strong",{children:"Amount in Words"}),t.jsx("span",{children:e.amountInWords})]}),t.jsxs("div",{className:"aqp-doc__terms",children:[t.jsxs("section",{className:"aqp-doc__terms-card",children:[t.jsx("h4",{children:"Inquiry Reference"}),t.jsxs("p",{children:[t.jsx("strong",{children:"Number:"})," ",r("customerReference.number",c(e.customerReferenceNumber))]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Date:"})," ",r("customerReference.date",c(e.customerReferenceDate))]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Subject:"})," ",r("customerReference.subject",c(e.customerReferenceSubject))]})]}),t.jsxs("section",{className:"aqp-doc__terms-card",children:[t.jsx("h4",{children:"Terms & Conditions"}),t.jsxs("p",{children:[t.jsx("strong",{children:"Delivery:"})," ",r("deliveryTerms",c(e.deliveryTerms))]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Payment:"})," ",r("paymentTerms",c(e.paymentTerms))]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Warranty:"})," ",r("warrantyTerms",c(e.warrantyTerms))]})]}),t.jsxs("section",{className:"aqp-doc__terms-card",children:[t.jsx("h4",{children:"Quotation Notes"}),t.jsx("p",{children:r("quotationNotes",c(e.quotationNotes),{multiline:!0})})]}),t.jsxs("section",{className:"aqp-doc__terms-card",children:[t.jsx("h4",{children:"Status"}),t.jsxs("p",{children:[t.jsx("strong",{children:"Status:"})," ",e.statusLabel]}),e.rejectionReason?t.jsxs("p",{children:[t.jsx("strong",{children:"Reason:"})," ",e.rejectionReason]}):null]})]}),t.jsxs("div",{className:"aqp-doc__footer",children:[t.jsx("strong",{children:e.organizationName}),t.jsx("br",{}),"Website: ",e.website||x.website," | Email: ",e.organizationEmail," | Phone: ",e.organizationPhone]})]})})}function it({documentData:e,title:a,subtitle:n,onBack:s,onPrint:o,onDownload:i}){const[r,d]=N.useState(100),[g,m]=N.useState(!1);N.useEffect(()=>{d(100)},[e]),N.useEffect(()=>{if(!g)return;const h=()=>m(!1);return window.addEventListener("click",h),()=>window.removeEventListener("click",h)},[g]);const b=a||`QUOTATION - ${(e==null?void 0:e.quotationNumber)||"-"}`,p=n||(e==null?void 0:e.companyName)||"-";return t.jsxs("div",{className:"aqp-page aqp-page--pdf",children:[t.jsxs("div",{className:"aqp-pdf-toolbar",children:[t.jsxs("div",{className:"aqp-pdf-toolbar-copy",children:[t.jsx("h1",{children:b}),t.jsx("p",{children:p})]}),t.jsxs("div",{className:"aqp-pdf-toolbar-actions",children:[t.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:s,children:"Back"}),t.jsx("button",{type:"button",className:"aqp-pdf-close-btn",onClick:s,"aria-label":"Close quotation PDF",children:t.jsx(E,{})}),t.jsx("div",{className:"aqp-pdf-toolbar-status",children:t.jsx("span",{children:"PDF View"})}),t.jsxs("div",{className:"aqp-pdf-toolbar-zoom",children:[t.jsx("button",{type:"button",className:"aqp-pdf-icon-btn",onClick:()=>d(h=>Math.max(70,h-10)),"aria-label":"Zoom out",children:t.jsx(le,{})}),t.jsxs("span",{className:"aqp-pdf-zoom-value",children:[r,"%"]}),t.jsx("button",{type:"button",className:"aqp-pdf-icon-btn",onClick:()=>d(h=>Math.min(160,h+10)),"aria-label":"Zoom in",children:t.jsx(de,{})})]}),t.jsxs("button",{type:"button",className:"aqp-pdf-action-btn",onClick:o,"aria-label":"Print quotation",children:[t.jsx(ce,{}),"Print"]}),t.jsxs("button",{type:"button",className:"aqp-pdf-action-btn",onClick:()=>{if(typeof i=="function"){i();return}Ae(e)},"aria-label":"Download quotation PDF",children:[t.jsx(pe,{}),"Download PDF"]}),t.jsxs("div",{className:"aqp-pdf-more",children:[t.jsx("button",{type:"button",className:`aqp-pdf-icon-btn${g?" aqp-pdf-icon-btn--active":""}`,"aria-label":"More options",onClick:h=>{h.stopPropagation(),m(w=>!w)},"aria-expanded":g,"aria-haspopup":"menu",children:t.jsx(me,{})}),g?t.jsxs("div",{className:"aqp-action-menu aqp-action-menu--viewer",onClick:h=>h.stopPropagation(),children:[t.jsx("button",{type:"button",className:"aqp-action-item",onClick:()=>{d(100),m(!1)},children:"Reset Zoom"}),t.jsx("button",{type:"button",className:"aqp-action-item",onClick:()=>{d(90),m(!1)},children:"Fit Document"}),t.jsx("button",{type:"button",className:"aqp-action-item",onClick:()=>{o(),m(!1)},children:"Print / Save PDF"})]}):null]})]})]}),t.jsx("div",{className:"aqp-pdf-workspace",children:t.jsx("div",{className:"aqp-pdf-stage",children:t.jsx("div",{className:"aqp-pdf-canvas",children:t.jsx("div",{className:"aqp-pdf-zoom-surface",style:{zoom:r/100},children:t.jsx(Ce,{documentData:e})})})})})]})}export{B as A,G as B,Me as I,nt as M,Fe as P,it as Q,rt as S,Be as U,ke as a,Re as b,Ge as c,et as d,at as e,Ee as f,D as g,Xe as h,st as i,Je as j,He as k,Ve as l,Ce as m,Ae as n,V as o,tt as p,Qe as q,De as r,v as s,f as t,Ue as u,We as v,xe as w,Ye as x,Ze as y,Ke as z};
