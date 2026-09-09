import{Z as et,bw as Sa,ao as Ft,B as _a,l as Be,am as Aa,bJ as Ca,r as h,j as e,ap as Dt,bE as P,bK as Ta,bL as Pa,bv as ct,bz as Ia,bM as Fa,u as Ea,s as Oa,W as Qa,bh as za,bt as La,bD as $a,bG as ka,D as Ra,b7 as Ua,aY as Da,H as Ma,I as Va,aj as Ba,bI as Ga,bH as Ka,U as Wa,bN as Et,n as Za}from"./index-TsLRs3lP.js";const tt=(t={})=>({id:t.id,userId:t.userId??t.user_id,companyId:t.companyId??t.company_id,entityType:t.entityType??t.entity_type??"",name:t.name??"",columns:Array.isArray(t.columns)?t.columns:[],filters:t.filters&&typeof t.filters=="object"?t.filters:{},sort:t.sort&&typeof t.sort=="object"?t.sort:{},isDefault:!!(t.isDefault??t.is_default),isShared:!!(t.isShared??t.is_shared)}),at={async listCustomViews(t){const s=await et.get("/custom-views",{params:t?{entityType:t}:{}});return(Array.isArray(s==null?void 0:s.data)?s.data:[]).map(tt)},async createCustomView(t){const s=await et.post("/custom-views",t);return tt((s==null?void 0:s.data)||{})},async updateCustomView(t,s){const l=await et.put(`/custom-views/${encodeURIComponent(t)}`,s);return tt((l==null?void 0:l.data)||{})},async upsertCustomViewByName(t){const s=(t==null?void 0:t.entityType)||"",l=String((t==null?void 0:t.name)||"").trim(),i=(await this.listCustomViews(s)).find(c=>String(c.name||"").trim()===l)||null;return i!=null&&i.id?this.updateCustomView(i.id,t):this.createCustomView(t)}},st=6,nt=8,dt="crm-admin-quotation-manager-layout",Ot="quotation_layout_preferences",Qt="Admin Quotation Manager Layout",Ya=5*1024*1024,Xa=["pdf","xls","xlsx"],zt={num:"",owner:"",date:"",company:"",amount:"",status:"",project:""},ot={accountNumber:"",name:"",email:"",phone:"",accountOwner:""},Ja=[{value:"",label:"Select"},{value:"open",label:"Open"},{value:"approved",label:"Approved"},{value:"customer_approved",label:"Customer Approved"},{value:"customer_rejected",label:"Customer Rejected"},{value:"rejected",label:"Rejected"},{value:"cancelled",label:"Cancelled"}],Lt=[{value:"INR",label:"INR"},{value:"USD",label:"USD"},{value:"AED",label:"AED"},{value:"NZD",label:"NZ$"},{value:"CAD",label:"CAD"},{value:"SEK",label:"SEK"},{value:"SGD",label:"SGD"},{value:"AUD",label:"AUD"},{value:"JPY",label:"JPY"},{value:"EUR",label:"Euro"},{value:"GBP",label:"GBP"},{value:"QAR",label:"QAR"},{value:"SAR",label:"SAR"},{value:"OMR",label:"OMR"}],Mt=()=>new Date().toISOString().slice(0,10),Ha=(t,s)=>{const l=new Date(t||Mt());return l.setDate(l.getDate()+s),l.toISOString().slice(0,10)},lt=()=>{const t=Mt();return{selectedAccountId:"",selectedAccountLabel:"",clientAccountNumber:"",companyName:"",contactPerson:"",address:"",email:"",phone:"",accountOwner:"",quoteNumber:"",quotationDate:t,totalAmount:"",amountCurrency:"INR",totalProductTax:"",taxCurrency:"INR",quotationStatus:"",validUntilDate:Ha(t,30),quoteFile:null,quoteFileName:""}},Ae=[{key:"num",label:"Quotation Number",exportValue:t=>t.num},{key:"date",label:"Quotation Date",exportValue:t=>t.date},{key:"owner",label:"Quotation Owner",exportValue:t=>t.owner},{key:"company",label:"Company Name",exportValue:t=>t.company},{key:"project",label:"Project Name",exportValue:t=>t.project},{key:"amount",label:"Amount",exportValue:t=>t.amountLabel},{key:"status",label:"Status",exportValue:t=>t.statusLabel}],es=[{key:"num",label:"Quotation Number",type:"text",width:18},{key:"date",label:"Quotation Date",type:"date",align:"center",width:18},{key:"owner",label:"Quotation Owner",type:"text",width:22},{key:"company",label:"Company Name",type:"text",width:28},{key:"project",label:"Project Name",type:"text",width:28},{key:"amountLabel",label:"Amount",type:"text",width:18},{key:"statusLabel",label:"Status",type:"text",width:16}],Me=["num","owner","date","amount","status","company","project"],xt=(t=[],s="deal")=>{const l=t.filter(Boolean),i=(s==="account"?["num","owner","date","company","amount","status","project"]:["num","owner","date","amount","status","company","project"]).filter(c=>l.includes(c));return l.forEach(c=>{i.includes(c)||i.push(c)}),i},$t=()=>{try{const t=window.localStorage.getItem(dt),s=t?JSON.parse(t):null,l=Array.isArray(s==null?void 0:s.selectedFields)&&s.selectedFields.length>0?s.selectedFields.filter(o=>Ae.some(i=>i.key===o)):Me;return{selectedFields:xt(l)}}catch{return{selectedFields:Me}}},rt=(t={})=>{const s=Array.isArray(t==null?void 0:t.selectedFields)&&t.selectedFields.length>0?t.selectedFields.filter(l=>Ae.some(o=>o.key===l)):Me;return{selectedFields:xt(s.length>0?s:Me)}},E={brandKey:"swati",organizationName:"Swati Switchgears India Pvt Ltd",organizationLegalName:"Swati Switchgears (India) Pvt. Ltd.",organizationAddress:"36 Shubhlaxmi Industrial Estate, Sarkhej Bavla Road, Changodar, Ahmedabad - 382210",organizationAddressLines:["36 Shubhlaxmi Industrial Estate,","Sarkhej Bavla Road, Changodar,","Ahmedabad - 382210"],organizationEmail:"mkt@swatiswitchgears.com",organizationPhone:"9913536307",organizationGstin:"24AAACZ0615P1Z7",organizationStateCode:"24",website:"www.swatiswitchgears.com",organizationTagline:"",logoType:"image"},ut={brandKey:"lumos",organizationName:"Lumos Building Automation Pvt Ltd",organizationLegalName:"Lumos Building Automation Pvt. Ltd.",organizationAddress:"Vadodara, Gujarat, India",organizationEmail:"sales@lumosbuildingautomation.com",organizationPhone:"+91 265 4000 222",organizationGstin:"24AAECL9020K1ZY",organizationStateCode:"24",website:"www.lumosbuildingautomation.com",organizationTagline:"Building automation, controls and smart infrastructure solutions.",logoType:"image"},kt={swati:E,"swati-switch":E,"swati-switch-gear":E,lumos:ut,"lumos-building":ut},gt=[{key:"pdf",label:"View As PDF",icon:Sa,iconClass:"aqp-action-icon--pdf"},{key:"preview",label:"Preview",icon:Ft},{key:"view",label:"View Quote",icon:Ft},{key:"approve",label:"Approve Quote",icon:_a},{key:"reject",label:"Reject Quote",icon:Be},{key:"clone",label:"Clone Quote",icon:Aa},{key:"account",label:"View Account",icon:Ca}],q=t=>String(t||"").trim().toLowerCase(),Rt=t=>String(t||"").split(/\r?\n|,/).map(s=>s.trim()).filter(Boolean),ts=(t={})=>[t.address,t.location,t.state].filter(Boolean).join(", "),as=(t="")=>{const s=String(t||"").split(".");return s.length>1?q(s.pop()):""},Ut=t=>{if(!t)return"Quote File is required.";const s=as(t.name);return Xa.includes(s)?t.size>Ya?"Quote File size must be 5 MB or less.":"":"Only PDF, XLS and XLSX files are allowed."},Ge=(t={})=>{const s=q(t.profileKey);if(s&&kt[s])return kt[s];const l=q(t.profileName||t.organizationName);return l.includes("swati")?E:l.includes("lumos")?ut:{}},ss=(t={})=>Ge(t).brandKey==="swati",ns=(t={})=>Ge(t).brandKey==="lumos",ft=t=>t==="lumos"?Ga:t==="swati"?Ka:null,Vt=t=>t==="lumos"?"lumos":t==="swati"?"swati":"",os=(t={})=>{const s=Ge(t);return s.logoType?s.logoType==="image":q(t.profileName||t.organizationName).includes("swati")},Bt=t=>{if(!t)return"-";const s=new Date(t);if(Number.isNaN(s.getTime()))return String(t);const l=String(s.getDate()).padStart(2,"0"),o=String(s.getMonth()+1).padStart(2,"0"),i=s.getFullYear();return`${l}-${o}-${i}`},it=t=>{if(!t)return"-";const s=new Date(t);return Number.isNaN(s.getTime())?String(t):new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(s)},_=t=>{const s=Number.parseFloat(t);return Number.isFinite(s)?s:0},m=t=>String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),Nt=t=>{const s=q(t).replace(/[\s-]+/g,"_");return s?s==="accepted"?"approved":s==="new"?"draft":s:"draft"},Ce=t=>{const s=Nt(t),l={draft:"Draft",sent:"Sent",approved:"Approved",rejected:"Rejected",cancelled:"Cancelled",open:"Open"};return l[s]?l[s]:s.split("_").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" ")},Gt=t=>{const s=Nt(t);return s==="approved"?"aqp-status--approved":s==="rejected"?"aqp-status--rejected":s==="sent"?"aqp-status--sent":"aqp-status--open"},pt=t=>{const s=Nt(t);return s==="approved"||s==="cancelled"?"aqp-num-badge--orange":"aqp-num-badge--teal"},ls=(t={})=>[t==null?void 0:t.name,t==null?void 0:t.username,t==null?void 0:t.email].map(s=>q(s)).filter(Boolean),rs=(t,s)=>{var v,A,g,w,Q;const l=q(t==null?void 0:t.role);if(l==="admin"||l==="super_admin")return gt.map(S=>S.key);const i=[s==null?void 0:s.owner,(v=s==null?void 0:s.raw)==null?void 0:v.selectedAccountOwner,(A=s==null?void 0:s.raw)==null?void 0:A.ownerName,(g=s==null?void 0:s.raw)==null?void 0:g.createdBy].map(S=>q(S)),c=ls(t),r=i.some(S=>S&&c.includes(S)),u=!!((w=t==null?void 0:t.permissions)!=null&&w.approveQuotes||(Q=t==null?void 0:t.permissions)!=null&&Q.approveQuotation);if(l==="viewer"||!r&&!u)return["pdf","preview","view"];const j=["pdf","preview","view","clone"];return u&&j.push("approve","reject"),j},mt=(t,s)=>{const l=new Set(rs(t,s));return gt.filter(o=>l.has(o.key))},ht=(t,s)=>{const o=Math.max(1,t-Math.floor(2.5)),i=Math.min(s,o+5-1),c=Math.max(1,i-5+1);return Array.from({length:i-c+1},(r,u)=>c+u)},R=t=>t||"-",f=t=>String(t??"").trim().replace(/^-+\s*/,""),is=(...t)=>t.map(s=>String(s||"").trim()).filter(Boolean).join(", "),bt=(t={})=>{const l=(Array.isArray(t.lineItems)?t.lineItems:[]).filter(i=>String((i==null?void 0:i.description)||"").trim()).map((i,c)=>{const r=_(i.quantity||i.qty||0),u=_(i.rate||i.price||i.unitPrice||0),j=Number.isFinite(Number(i.amount))?Number(i.amount):r*u;return{id:i.id||`line-${c+1}`,srNo:c+1,description:i.description,quantity:r,unit:i.unit||"Nos",rate:u,amount:j}});if(l.length>0)return l;const o=[t.product,t.otherProduct,t.otherService,t.projectName].filter(Boolean).join(" / ");return!o&&!_(t.amount)?[]:[{id:t.id||"line-1",srNo:1,description:o||t.companyName||"Quotation Item",quantity:1,unit:"Nos",rate:_(t.amount),amount:_(t.amount)}]},Kt=t=>{const s=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],l=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],o=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];return t===0?"":t<10?s[t]:t<20?l[t-10]:t<100?`${o[Math.floor(t/10)]}${t%10?` ${s[t%10]}`:""}`:`${s[Math.floor(t/100)]} Hundred${t%100?` ${Kt(t%100)}`:""}`},cs=t=>{const s=Math.floor(Math.abs(_(t)));if(!s)return"Zero";const l=[{divisor:1e7,label:"Crore"},{divisor:1e5,label:"Lakh"},{divisor:1e3,label:"Thousand"},{divisor:1,label:""}];let o=s;const i=[];return l.forEach(({divisor:c,label:r})=>{if(o>=c){const u=Math.floor(o/c);o%=c,u>0&&(i.push(Kt(u)),r&&i.push(r))}}),i.join(" ").trim()},Wt=(t,s)=>{if(!t)return null;const l=s.find(c=>String(c.id)===String(t.selectedAccountId||""));if(l)return l;const o=q(t.clientAccountNumber);if(o){const c=s.find(r=>q(r.accountNumber)===o);if(c)return c}const i=q(t.companyName);if(i){const c=s.find(r=>q(r.name)===i);if(c)return c}return null},De=(t,s)=>{var je,z,L;const l=Ge(t),o=l.brandKey?l:E,i=ss(t)||!l.brandKey,c=ns(t),r=!!l.brandKey,u=o.brandKey||(i?"swati":c?"lumos":"swati"),j=ft(u),v=bt(t),A=v.reduce((Ee,ve)=>Ee+_(ve.amount),0),g=_(t.cgstAmount||t.cgst||0),w=_(t.sgstAmount||t.sgst||0),Q=_(t.igstAmount||t.igst||0),S=_(t.taxAmount||0),ee=_(t.amount),Ke=A+g+w+Q+S,Te=ee>0?Math.max(ee,Ke):Ke,fe=t.logoType||l.logoType||(os(t)?"image":"text"),te=t.clientAddressDetails||is(s==null?void 0:s.address,s==null?void 0:s.location,s==null?void 0:s.state)||"-",ae=r?o.organizationName:t.organizationName||o.organizationName||t.profileName||E.organizationName,B=r?o.organizationLegalName||ae:t.organizationLegalName||o.organizationLegalName||ae,G=r?o.organizationAddress||"":t.organizationAddress||o.organizationAddress||E.organizationAddress,Pe=o.organizationAddressLines||Rt(G),Ie=r?o.organizationEmail||"":t.organizationEmail||o.organizationEmail||E.organizationEmail,se=r?o.organizationPhone||"":t.organizationPhone||o.organizationPhone||E.organizationPhone,Fe=r?o.organizationGstin||"":t.organizationGstin||o.organizationGstin||E.organizationGstin,Ne=r?o.organizationStateCode||"":t.organizationStateCode||o.organizationStateCode||E.organizationStateCode;return{id:t.id,quotationNumber:t.quotationNumber||"-",quotationDate:it(t.quotationDate||t.createdAt),validUntil:it(t.validUntil),currency:t.currency||o.currency||"INR",statusLabel:Ce(t.status),profileName:t.profileName||"-",brandKey:u,brandClassName:Vt(u),logoSource:j,isSwatiDocument:i,isLumosDocument:c,organizationName:ae,organizationLegalName:B,organizationAddress:G,organizationAddressLines:Pe,organizationEmail:Ie,organizationPhone:se,organizationGstin:Fe,organizationStateCode:Ne,website:r?o.website||"":t.website||o.website||E.website,organizationTagline:t.organizationTagline||o.organizationTagline||"",logoType:fe,companyName:t.companyName||(s==null?void 0:s.name)||"-",clientAccountNumber:t.clientAccountNumber||(s==null?void 0:s.accountNumber)||"-",contactPerson:t.contactPerson||(s==null?void 0:s.contactPerson)||"-",telephone:t.telephone||(s==null?void 0:s.phone)||(s==null?void 0:s.contactPhone)||"-",email:t.email||(s==null?void 0:s.email)||(s==null?void 0:s.contactEmail)||"-",gstin:t.gstin||(s==null?void 0:s.gstin)||"-",stateCode:t.stateCode||(s==null?void 0:s.stateCode)||"-",accountOwner:(s==null?void 0:s.accountOwnerDisplay)||t.selectedAccountOwner||(s==null?void 0:s.accountOwner)||"-",customerReferenceNumber:((je=t.customerReference)==null?void 0:je.number)||"-",customerReferenceDate:it((z=t.customerReference)==null?void 0:z.date),customerReferenceSubject:((L=t.customerReference)==null?void 0:L.subject)||"-",quotationSubject:t.quotationSubject||"-",projectName:t.projectName||"-",clientAddressDetails:te,clientAddressLines:Rt(te==="-"?"":te),product:t.product||"-",otherProduct:t.otherProduct||"-",otherService:t.otherService||"-",deliveryTerms:t.deliveryTerms||"-",paymentTerms:t.paymentTerms||"-",warrantyTerms:t.warrantyTerms||"-",quotationNotes:t.quotationNotes||"-",rejectionReason:t.rejectionReason||"",lineItems:v,subtotal:A,cgst:g,sgst:w,igst:Q,otherTax:S,total:Te,amountInWords:`${cs(Te)} ${t.currency==="USD"?"US Dollars":t.currency==="EUR"?"Euros":"Rupees"} Only`}},ds=[{key:"srNo",label:"Sr No",type:"integer",align:"center",width:8},{key:"description",label:"Description",align:"left",width:48,wrap:!0},{key:"quantity",label:"Qty",type:"number",align:"right",width:10},{key:"unit",label:"Unit",align:"center",width:10},{key:"rate",label:"Rate",type:"currency",align:"right",width:16},{key:"amount",label:"Amount",type:"currency",align:"right",width:18}],us=t=>{if(!t)return null;const s=u=>{const j=String(u??"").trim();return j&&j!=="-"?j:""},l=[{label:"Quotation No.",value:s(t.quotationNumber)},{label:"Quotation Date",value:s(t.quotationDate)},{label:"Valid Until",value:s(t.validUntil)},{label:"Status",value:s(t.statusLabel)},{label:"Currency",value:s(t.currency)},{label:"Profile",value:s(t.profileName)},{label:"Customer",value:s(t.companyName)},{label:"Account No.",value:s(t.clientAccountNumber)},{label:"Contact Person",value:s(t.contactPerson)},{label:"Telephone",value:s(t.telephone)},{label:"Email",value:s(t.email)},{label:"GSTIN",value:s(t.gstin)},{label:"State Code",value:s(t.stateCode)},{label:"Account Owner",value:s(t.accountOwner)},{label:"Customer Address",value:s(t.clientAddressDetails)},{label:"Project Name",value:s(t.projectName)},{label:"Quotation Subject",value:s(t.quotationSubject)},{label:"Inquiry Ref No",value:s(t.customerReferenceNumber)},{label:"Inquiry Ref Date",value:s(t.customerReferenceDate)},{label:"Inquiry Subject",value:s(t.customerReferenceSubject)},{label:"Delivery Terms",value:s(t.deliveryTerms)},{label:"Payment Terms",value:s(t.paymentTerms)},{label:"Warranty Terms",value:s(t.warrantyTerms)},{label:"Quotation Notes",value:s(t.quotationNotes)}].filter(u=>u.value);t.rejectionReason&&l.push({label:"Rejection Reason",value:t.rejectionReason});const o=(t.lineItems||[]).map(u=>({srNo:u.srNo,description:u.description,quantity:u.quantity,unit:u.unit,rate:u.rate,amount:u.amount})),i=[],c=(u,j)=>{!Number.isFinite(Number(j))||Number(j)===0||i.push({srNo:"",description:u,quantity:"",unit:"",rate:"",amount:Number(j)})};c("Subtotal",t.subtotal),c("CGST",t.cgst),c("SGST",t.sgst),c("IGST",t.igst),c("Other Tax",t.otherTax),c("Total",t.total),t.amountInWords&&i.push({srNo:"",description:`Amount in Words: ${t.amountInWords}`,quantity:"",unit:"",rate:"",amount:""});const r=[...o,...i];return{title:`Sales Quotation - ${s(t.quotationNumber)||"Draft"}`,subtitle:s(t.companyName)||s(t.organizationName),sheetName:"Quotation",companyName:t.organizationName,metadata:l,columns:ds,rows:r}},Zt=t=>{const s=t.logoSource||ft(t.brandKey),l=t.brandClassName||Vt(t.brandKey),o=t.lineItems.map(c=>`
    <tr>
      <td class="text-center">${c.srNo}</td>
      <td class="description-cell">${m(c.description)}</td>
      <td class="text-center">${m(c.quantity)}</td>
      <td class="text-center">${m(c.unit)}</td>
      <td class="money">${m(P(c.rate,t.currency))}</td>
      <td class="money">${m(P(c.amount,t.currency))}</td>
    </tr>
  `).join(""),i=s?`<div class="logo-wrap logo-wrap--${m(l||"default")}"><img src="${s}" alt="${m(t.organizationName)}" class="logo logo--${m(l||"default")}" /></div>`:`<div class="logo-text">${m(t.organizationName)}</div>`;return`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${m(t.quotationNumber)} - Sales Quotation</title>
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
              ${i}
              <h2 class="company-name">${m(t.organizationName)}</h2>
              <div class="company-contact">
                ${m(t.organizationAddress)}<br />
                Email: ${m(t.organizationEmail)} | Phone: ${m(t.organizationPhone)} | GSTIN: ${m(t.organizationGstin)}
              </div>
            </div>
            <div class="party-grid">
              <div class="party-card">
                <div class="section-label">Customer Details</div>
                <div class="field-row"><strong>Customer Name</strong><span>${m(f(t.companyName))}</span></div>
                <div class="field-row"><strong>Client Account No.</strong><span>${m(f(t.clientAccountNumber))}</span></div>
                <div class="field-row"><strong>Contact Person</strong><span>${m(f(t.contactPerson))}</span></div>
                <div class="field-row"><strong>Email</strong><span>${m(f(t.email))}</span></div>
                <div class="field-row"><strong>GSTIN</strong><span>${m(f(t.gstin))}</span></div>
                <div class="field-row"><strong>Address</strong><span>${m(f(t.clientAddressDetails))}</span></div>
              </div>
              <div class="party-card">
                <div class="section-label">Sales Details</div>
                <div class="field-row"><strong>Sales Executive</strong><span>${m(t.accountOwner)}</span></div>
                <div class="field-row"><strong>Mobile Number</strong><span>${m(t.organizationPhone)}</span></div>
                <div class="field-row"><strong>Email Address</strong><span>${m(t.organizationEmail)}</span></div>
                <div class="field-row"><strong>Quotation Reference</strong><span>${m(t.quotationNumber)}</span></div>
              </div>
            </div>
          <h1>SALES QUOTATION</h1>
          </div>
          <div class="quotation-main">
            <div class="meta-grid">
              <div class="meta-cell">
                <div class="meta-label">Quotation No.</div>
                <div class="meta-value">${m(t.quotationNumber)}</div>
              </div>
              <div class="meta-cell">
                <div class="meta-label">Quotation Date</div>
                <div class="meta-value">${m(t.quotationDate)}</div>
              </div>
              <div class="meta-cell">
                <div class="meta-label">Valid Until</div>
                <div class="meta-value">${m(t.validUntil)}</div>
              </div>
              <div class="meta-cell">
                <div class="meta-label">Currency</div>
                <div class="meta-value">${m(t.currency)}</div>
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
                ${o||'<tr><td colspan="6">No quotation items available.</td></tr>'}
              </tbody>
            </table>

            <div class="summary-layout">
              <div class="summary-card">
                <div class="section-label">Quotation Details</div>
                <div class="detail-row"><strong>Profile Name</strong><span>${m(f(t.profileName))}</span></div>
                <div class="detail-row"><strong>Project</strong><span>${m(f(t.projectName))}</span></div>
                <div class="detail-row"><strong>Account Owner</strong><span>${m(f(t.accountOwner))}</span></div>
                <div class="detail-row"><strong>Subject</strong><span>${m(f(t.quotationSubject))}</span></div>
                <div class="detail-row"><strong>Product</strong><span>${m([t.product,t.otherProduct].filter(c=>c&&c!=="-").join(" / "))}</span></div>
                <div class="detail-row"><strong>Service</strong><span>${m(f(t.otherService))}</span></div>
              </div>
              <div class="totals-card">
                <div class="section-label">Amount Summary</div>
                <div class="total-row"><strong>Sub Total</strong><span>${m(P(t.subtotal,t.currency))}</span></div>
                <div class="total-row"><strong>CGST</strong><span>${m(P(t.cgst,t.currency))}</span></div>
                <div class="total-row"><strong>SGST</strong><span>${m(P(t.sgst,t.currency))}</span></div>
                <div class="total-row"><strong>IGST</strong><span>${m(P(t.igst,t.currency))}</span></div>
                <div class="total-row"><strong>Other Tax</strong><span>${m(P(t.otherTax,t.currency))}</span></div>
                <div class="total-row grand-total"><strong>Total Amount</strong><span>${m(P(t.total,t.currency))}</span></div>
              </div>
            </div>

            <div class="amount-words"><strong>Amount in Words</strong>${m(t.amountInWords)}</div>

            <div class="terms-grid">
              <div class="terms-card">
                <h3 class="terms-title">Inquiry Reference</h3>
                <div class="terms-value">Number: ${m(f(t.customerReferenceNumber))}&#10;Date: ${m(f(t.customerReferenceDate))}&#10;Subject: ${m(f(t.customerReferenceSubject))}</div>
              </div>
              <div class="terms-card">
                <h3 class="terms-title">Terms &amp; Conditions</h3>
                <div class="terms-value">Delivery: ${m(f(t.deliveryTerms))}&#10;Payment: ${m(f(t.paymentTerms))}&#10;Warranty: ${m(f(t.warrantyTerms))}</div>
              </div>
              <div class="terms-card">
                <h3 class="terms-title">Quotation Notes</h3>
                <div class="terms-value">${m(f(t.quotationNotes))}</div>
              </div>
              <div class="terms-card">
                <h3 class="terms-title">Status</h3>
                <div class="terms-value">Status: ${m(t.statusLabel)}${t.rejectionReason?`&#10;Reason: ${m(t.rejectionReason)}`:""}</div>
              </div>
            </div>
          </div>
          <div class="quotation-footer">
            <strong>${m(t.organizationName)}</strong><br />
            Website: ${m(t.website||E.website)} | Email: ${m(t.organizationEmail)} | Phone: ${m(t.organizationPhone)}
          </div>
        </div>
      </div>
    </body>
  </html>`},ge=t=>{if(!t)return;const s=document.title,l=`Quotation-${(t==null?void 0:t.quotationNumber)||"Document"}.pdf`,o=document.createElement("iframe");let i=null;o.title=l,o.setAttribute("aria-hidden","true"),o.style.position="fixed",o.style.left="-10000px",o.style.top="0",o.style.width="1024px",o.style.height="768px",o.style.border="0",o.style.opacity="0";const c=()=>{i&&window.clearTimeout(i),document.title=s,window.removeEventListener("afterprint",c),o.parentNode&&o.parentNode.removeChild(o)},r=()=>{const u=o.contentDocument;if(!u)return Promise.resolve();const j=Array.from(u.images||[]);return Promise.all(j.map(v=>v.complete?Promise.resolve():new Promise(A=>{v.onload=A,v.onerror=A})))};o.onload=()=>{r().then(()=>{const u=o.contentWindow;if(!u){c();return}document.title=l,window.addEventListener("afterprint",c),i=window.setTimeout(c,2500),u.focus(),u.print()})},document.title=l,document.body.appendChild(o),o.srcdoc=Zt(t)};function Yt({status:t}){return e.jsx("span",{className:`aqp-status ${Gt(t)}`,children:Ce(t)})}function V({title:t,onClose:s,onDelete:l,size:o="",children:i,footer:c}){return h.useEffect(()=>{const r=u=>{u.key==="Escape"&&s()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[s]),e.jsx("div",{className:"aqp-overlay",role:"presentation",onClick:s,children:e.jsxs("div",{className:`aqp-modal ${o}`.trim(),role:"dialog","aria-modal":"true",onClick:r=>r.stopPropagation(),children:[e.jsxs("div",{className:"aqp-modal-header",children:[e.jsx("span",{className:"aqp-modal-title",children:t}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[l?e.jsx("button",{type:"button",className:"aqp-modal-close",onClick:l,"aria-label":"Delete",title:"Delete",children:e.jsx(Dt,{})}):null,e.jsx("button",{type:"button",className:"aqp-modal-close",onClick:s,"aria-label":"Close",children:e.jsx(Be,{})})]})]}),e.jsx("div",{className:"aqp-modal-body",children:i}),c?e.jsx("div",{className:"aqp-modal-footer",children:c}):null]})})}const ps=({value:t,fieldKey:s,editable:l=!1,multiline:o=!1,className:i="",onCommit:c})=>{const[r,u]=h.useState(!1),[j,v]=h.useState(t||"");h.useEffect(()=>{r||v(t||"")},[r,t]);const A=()=>{const g=String(j||"").trim();u(!1),g!==String(t||"").trim()&&(c==null||c(s,g))};return!l||!s?e.jsx("span",{className:i,children:t}):r?o?e.jsx("textarea",{className:"aqp-doc-edit-input aqp-doc-edit-input--textarea",value:j,onChange:g=>v(g.target.value),onBlur:A,onKeyDown:g=>{g.key==="Escape"&&u(!1),(g.ctrlKey||g.metaKey)&&g.key==="Enter"&&A()},autoFocus:!0}):e.jsx("input",{className:"aqp-doc-edit-input",value:j,onChange:g=>v(g.target.value),onBlur:A,onKeyDown:g=>{g.key==="Escape"&&u(!1),g.key==="Enter"&&A()},autoFocus:!0}):e.jsxs("span",{className:`aqp-doc-editable ${i}`.trim(),children:[e.jsx("span",{className:"aqp-doc-editable-value",children:t}),e.jsx("button",{type:"button",className:"aqp-doc-edit-btn",onClick:()=>{v(t||""),u(!0)},"aria-label":"Edit quotation field",children:e.jsx(Za,{})})]})},ms=(t,s,l)=>(o,i,c={})=>e.jsx(ps,{fieldKey:o,value:i,editable:s,multiline:c.multiline,className:c.className,onCommit:l});function Ve({documentData:t,editable:s=!1,onEditField:l}){const o=t.logoSource||ft(t.brandKey),i=t.isLumosDocument?"lumos":t.isSwatiDocument?"swati":"default",c=[t.product,t.otherProduct].filter(u=>u&&u!=="-").join(" / "),r=ms(t,s,l);return e.jsx("div",{className:"aqp-doc aqp-print-scope",children:e.jsxs("div",{className:"aqp-doc__frame",children:[e.jsxs("div",{className:"aqp-doc__brand-head",children:[e.jsx("div",{className:`aqp-doc__logo-wrap aqp-doc__logo-wrap--${i}`,children:o?e.jsx("img",{src:o,alt:t.organizationName,className:`aqp-doc__brand-logo aqp-doc__brand-logo--${i}`}):e.jsx("div",{className:"aqp-doc__text-logo",children:t.organizationName})}),e.jsx("h2",{children:t.organizationName}),e.jsxs("p",{children:[t.organizationAddress,e.jsx("br",{}),"Email: ",t.organizationEmail," | Phone: ",t.organizationPhone," | GSTIN: ",t.organizationGstin]})]}),e.jsxs("div",{className:"aqp-doc__party-grid",children:[e.jsxs("section",{className:"aqp-doc__party-card",children:[e.jsx("div",{className:"aqp-doc__eyebrow",children:"Customer Details"}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Customer Name"}),r("companyName",f(t.companyName))]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Client Account No."}),r("clientAccountNumber",f(t.clientAccountNumber))]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Contact Person"}),r("contactPerson",f(t.contactPerson))]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Email"}),r("email",f(t.email))]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"GSTIN"}),r("gstin",f(t.gstin))]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Address"}),r("clientAddressDetails",f(t.clientAddressDetails),{multiline:!0})]})]}),e.jsxs("section",{className:"aqp-doc__party-card",children:[e.jsx("div",{className:"aqp-doc__eyebrow",children:"Sales Details"}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Sales Executive"}),r("selectedAccountOwner",t.accountOwner)]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Mobile Number"}),r("organizationPhone",t.organizationPhone)]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Email Address"}),r("organizationEmail",t.organizationEmail)]}),e.jsxs("div",{className:"aqp-doc__field-row",children:[e.jsx("strong",{children:"Quotation Reference"}),r("quotationNumber",t.quotationNumber)]})]})]}),e.jsx("div",{className:"aqp-doc__title",children:"SALES QUOTATION"}),e.jsxs("div",{className:"aqp-doc__meta",children:[e.jsxs("div",{className:"aqp-doc__meta-cell",children:[e.jsx("span",{className:"aqp-doc__meta-label",children:"Quotation No."}),e.jsx("strong",{children:r("quotationNumber",t.quotationNumber)})]}),e.jsxs("div",{className:"aqp-doc__meta-cell",children:[e.jsx("span",{className:"aqp-doc__meta-label",children:"Quotation Date"}),e.jsx("strong",{children:r("quotationDate",t.quotationDate)})]}),e.jsxs("div",{className:"aqp-doc__meta-cell",children:[e.jsx("span",{className:"aqp-doc__meta-label",children:"Valid Until"}),e.jsx("strong",{children:r("validUntil",t.validUntil)})]}),e.jsxs("div",{className:"aqp-doc__meta-cell",children:[e.jsx("span",{className:"aqp-doc__meta-label",children:"Currency"}),e.jsx("strong",{children:r("currency",t.currency)})]})]}),e.jsxs("table",{className:"aqp-doc__table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"42px"},children:"Sr."}),e.jsx("th",{children:"Description"}),e.jsx("th",{style:{width:"50px"},children:"Qty"}),e.jsx("th",{style:{width:"58px"},children:"Unit"}),e.jsx("th",{style:{width:"84px"},children:"Rate"}),e.jsx("th",{style:{width:"92px"},children:"Amount"})]})}),e.jsx("tbody",{children:t.lineItems.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:"No quotation items available."})}):t.lineItems.map(u=>e.jsxs("tr",{children:[e.jsx("td",{className:"aqp-doc__num",children:u.srNo}),e.jsx("td",{className:"aqp-doc__description",children:r(`lineItems.${u.srNo-1}.description`,u.description,{multiline:!0})}),e.jsx("td",{className:"aqp-doc__num",children:r(`lineItems.${u.srNo-1}.quantity`,u.quantity)}),e.jsx("td",{className:"aqp-doc__num",children:r(`lineItems.${u.srNo-1}.unit`,u.unit)}),e.jsx("td",{className:"aqp-doc__amount",children:r(`lineItems.${u.srNo-1}.rate`,P(u.rate,t.currency))}),e.jsx("td",{className:"aqp-doc__amount",children:P(u.amount,t.currency)})]},u.id))})]}),e.jsxs("div",{className:"aqp-doc__summary",children:[e.jsxs("div",{className:"aqp-doc__summary-card",children:[e.jsx("div",{className:"aqp-doc__eyebrow",children:"Quotation Details"}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Profile Name"}),r("profileName",f(t.profileName))]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Project"}),r("projectName",f(t.projectName))]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Account Owner"}),r("selectedAccountOwner",f(t.accountOwner))]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Subject"}),r("quotationSubject",f(t.quotationSubject))]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Product"}),r("product",c)]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Service"}),r("otherService",f(t.otherService))]})]}),e.jsxs("div",{className:"aqp-doc__totals",children:[e.jsx("div",{className:"aqp-doc__eyebrow",children:"Amount Summary"}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Sub Total"}),e.jsx("span",{children:P(t.subtotal,t.currency)})]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"CGST"}),e.jsx("span",{children:P(t.cgst,t.currency)})]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"SGST"}),e.jsx("span",{children:P(t.sgst,t.currency)})]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"IGST"}),e.jsx("span",{children:P(t.igst,t.currency)})]}),e.jsxs("div",{className:"aqp-doc__kv-row",children:[e.jsx("strong",{children:"Other Tax"}),e.jsx("span",{children:P(t.otherTax,t.currency)})]}),e.jsxs("div",{className:"aqp-doc__kv-row aqp-doc__grand-total",children:[e.jsx("strong",{children:"Total Amount"}),e.jsx("span",{children:P(t.total,t.currency)})]})]})]}),e.jsxs("div",{className:"aqp-doc__amount-words",children:[e.jsx("strong",{children:"Amount in Words"}),e.jsx("span",{children:t.amountInWords})]}),e.jsxs("div",{className:"aqp-doc__terms",children:[e.jsxs("section",{className:"aqp-doc__terms-card",children:[e.jsx("h4",{children:"Inquiry Reference"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Number:"})," ",r("customerReference.number",f(t.customerReferenceNumber))]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Date:"})," ",r("customerReference.date",f(t.customerReferenceDate))]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Subject:"})," ",r("customerReference.subject",f(t.customerReferenceSubject))]})]}),e.jsxs("section",{className:"aqp-doc__terms-card",children:[e.jsx("h4",{children:"Terms & Conditions"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Delivery:"})," ",r("deliveryTerms",f(t.deliveryTerms))]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Payment:"})," ",r("paymentTerms",f(t.paymentTerms))]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Warranty:"})," ",r("warrantyTerms",f(t.warrantyTerms))]})]}),e.jsxs("section",{className:"aqp-doc__terms-card",children:[e.jsx("h4",{children:"Quotation Notes"}),e.jsx("p",{children:r("quotationNotes",f(t.quotationNotes),{multiline:!0})})]}),e.jsxs("section",{className:"aqp-doc__terms-card",children:[e.jsx("h4",{children:"Status"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Status:"})," ",t.statusLabel]}),t.rejectionReason?e.jsxs("p",{children:[e.jsx("strong",{children:"Reason:"})," ",t.rejectionReason]}):null]})]}),e.jsxs("div",{className:"aqp-doc__footer",children:[e.jsx("strong",{children:t.organizationName}),e.jsx("br",{}),"Website: ",t.website||E.website," | Email: ",t.organizationEmail," | Phone: ",t.organizationPhone]})]})})}function Xt({documentData:t,title:s,subtitle:l,onBack:o,onPrint:i,onDownload:c}){const[r,u]=h.useState(100),[j,v]=h.useState(!1);h.useEffect(()=>{u(100)},[t]),h.useEffect(()=>{if(!j)return;const w=()=>v(!1);return window.addEventListener("click",w),()=>window.removeEventListener("click",w)},[j]);const A=s||`QUOTATION - ${(t==null?void 0:t.quotationNumber)||"-"}`,g=l||(t==null?void 0:t.companyName)||"-";return e.jsxs("div",{className:"aqp-page aqp-page--pdf",children:[e.jsxs("div",{className:"aqp-pdf-toolbar",children:[e.jsxs("div",{className:"aqp-pdf-toolbar-copy",children:[e.jsx("h1",{children:A}),e.jsx("p",{children:g})]}),e.jsxs("div",{className:"aqp-pdf-toolbar-actions",children:[e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:o,children:"Back"}),e.jsx("button",{type:"button",className:"aqp-pdf-close-btn",onClick:o,"aria-label":"Close quotation PDF",children:e.jsx(Be,{})}),e.jsx("div",{className:"aqp-pdf-toolbar-status",children:e.jsx("span",{children:"PDF View"})}),e.jsxs("div",{className:"aqp-pdf-toolbar-zoom",children:[e.jsx("button",{type:"button",className:"aqp-pdf-icon-btn",onClick:()=>u(w=>Math.max(70,w-10)),"aria-label":"Zoom out",children:e.jsx(Ta,{})}),e.jsxs("span",{className:"aqp-pdf-zoom-value",children:[r,"%"]}),e.jsx("button",{type:"button",className:"aqp-pdf-icon-btn",onClick:()=>u(w=>Math.min(160,w+10)),"aria-label":"Zoom in",children:e.jsx(Pa,{})})]}),e.jsxs("button",{type:"button",className:"aqp-pdf-action-btn",onClick:i,"aria-label":"Print quotation",children:[e.jsx(ct,{}),"Print"]}),e.jsxs("button",{type:"button",className:"aqp-pdf-action-btn",onClick:()=>{if(typeof c=="function"){c();return}ge(t)},"aria-label":"Download quotation PDF",children:[e.jsx(Ia,{}),"Download PDF"]}),e.jsxs("div",{className:"aqp-pdf-more",children:[e.jsx("button",{type:"button",className:`aqp-pdf-icon-btn${j?" aqp-pdf-icon-btn--active":""}`,"aria-label":"More options",onClick:w=>{w.stopPropagation(),v(Q=>!Q)},"aria-expanded":j,"aria-haspopup":"menu",children:e.jsx(Fa,{})}),j?e.jsxs("div",{className:"aqp-action-menu aqp-action-menu--viewer",onClick:w=>w.stopPropagation(),children:[e.jsx("button",{type:"button",className:"aqp-action-item",onClick:()=>{u(100),v(!1)},children:"Reset Zoom"}),e.jsx("button",{type:"button",className:"aqp-action-item",onClick:()=>{u(90),v(!1)},children:"Fit Document"}),e.jsx("button",{type:"button",className:"aqp-action-item",onClick:()=>{i(),v(!1)},children:"Print / Save PDF"})]}):null]})]})]}),e.jsx("div",{className:"aqp-pdf-workspace",children:e.jsx("div",{className:"aqp-pdf-stage",children:e.jsx("div",{className:"aqp-pdf-canvas",children:e.jsx("div",{className:"aqp-pdf-zoom-surface",style:{zoom:r/100},children:e.jsx(Ve,{documentData:t})})})})})]})}const hs=({allowUsers:t=!1,generatorPath:s="/admin/quotations"})=>{const l=Ea(),{user:o}=Oa(),{quotations:i,quotationsLoading:c,quotationsError:r,accounts:u,createQuotation:j,updateQuotation:v,deleteQuotation:A,addNotification:g,loadQuotations:w}=Qa(),Q=t||o&&(o.role==="admin"||o.role==="super_admin");h.useEffect(()=>{Q||l("/unauthorized",{replace:!0})},[Q,l]);const[S,ee]=h.useState("account"),[Ke]=h.useState(!1),[Te,fe]=h.useState(!1),[te,ae]=h.useState($t),[B,G]=h.useState($t),[Pe,Ie]=h.useState(""),[se,Fe]=h.useState(""),[Ne,je]=h.useState(zt),[z,L]=h.useState(1),[Ee,ve]=h.useState(!1),[Jt,ne]=h.useState(!1),[p,oe]=h.useState(lt),[C,U]=h.useState({}),[jt,$]=h.useState(""),[ye,vt]=h.useState(!1),[K,We]=h.useState(ot),[W,Z]=h.useState(1),[le,Ze]=h.useState(null),[Ye,yt]=h.useState(null),[I,re]=h.useState(null),[Xe,Oe]=h.useState(!1),[F,qt]=h.useState(null),[Y,Je]=h.useState(null),[X,He]=h.useState(null),[wt,Qe]=h.useState(""),[ze,qe]=h.useState(""),[ie,Le]=h.useState(""),[St,Ht]=za(),we=St.get("view")||"",ce=h.useMemo(()=>xt(te.selectedFields,S).map(a=>Ae.find(n=>n.key===a)).filter(Boolean),[te.selectedFields,S]),ea=h.useMemo(()=>Ae.filter(a=>!B.selectedFields.includes(a.key)),[B.selectedFields]),de=h.useMemo(()=>u.map((a,n)=>La(a,n,{recordSource:"admin-quotation-view"})).sort($a),[u]),ue=h.useMemo(()=>de.find(a=>String(a.id)===String(p.selectedAccountId||""))||null,[de,p.selectedAccountId]),Se=h.useMemo(()=>de.filter(a=>Object.entries(K).every(([n,d])=>{const x=q(d);if(!x)return!0;const b=n==="accountOwner"?a.accountOwnerDisplay||a.accountOwner||"":a[n];return q(b).includes(x)})),[K,de]),pe=h.useMemo(()=>Math.max(1,Math.ceil(Se.length/nt)),[Se.length]),ta=h.useMemo(()=>ht(W,pe),[W,pe]),_t=h.useMemo(()=>{const a=(W-1)*nt;return Se.slice(a,a+nt)},[W,Se]),me=h.useMemo(()=>i.map((a,n)=>{const d=Wt(a,de),x=_(a.amount)||bt(a).reduce((b,y)=>b+_(y.amount),0);return{id:a.id||`quotation-${n}`,num:a.quotationNumber||`Quotation ${n+1}`,owner:(d==null?void 0:d.accountOwnerDisplay)||a.selectedAccountOwner||(d==null?void 0:d.accountOwner)||"-",date:Bt(a.quotationDate||a.createdAt),dateSort:a.quotationDate||a.createdAt||"",company:a.companyName||(d==null?void 0:d.name)||a.clientName||"-",amount:x,amountLabel:P(x,a.currency||"INR"),status:a.status||"draft",statusLabel:Ce(a.status),project:a.projectName||a.product||a.otherProduct||a.otherService||"-",profileName:a.profileName||"-",linkedAccount:d,raw:a}}).sort((a,n)=>new Date(n.dateSort||0).getTime()-new Date(a.dateSort||0).getTime()),[de,i]),D=h.useMemo(()=>me.filter(a=>S!=="account"&&S!=="deal"?!1:Object.entries(Ne).every(([n,d])=>{const x=q(d);if(!x)return!0;const b=n==="amount"?`${a.amount} ${a.amountLabel}`:n==="status"?a.statusLabel:a[n];return q(b).includes(x)})),[S,Ne,me]),he=h.useMemo(()=>Math.max(1,Math.ceil(D.length/st)),[D.length]),aa=h.useMemo(()=>ht(z,he),[z,he]),$e=h.useMemo(()=>{const a=(z-1)*st;return D.slice(a,a+st)},[D,z]);h.useEffect(()=>{L(a=>Math.min(a,he))},[he]),h.useEffect(()=>{Z(a=>Math.min(a,pe))},[pe]),h.useEffect(()=>{let a=!0;return(async()=>{try{const d=await at.listCustomViews(Ot);if(!a)return;const x=d.find(y=>y.name===Qt)||null;if(!x)return;const b=rt({selectedFields:x.columns});Ie(String(x.id||"")),ae(b),G(b),window.localStorage.setItem(dt,JSON.stringify(b))}catch{}})(),()=>{a=!1}},[]);const At=a=>{const n=new URLSearchParams(St);a?n.set("view",a):n.delete("view"),Ht(n,{replace:!0})},sa=()=>{oe(lt()),U({}),$(""),We(ot),Z(1),ne(!1),ve(!0)},Ct=()=>{ye||(ve(!1),ne(!1),U({}),$(""))},O=(a,n)=>{oe(d=>({...d,[a]:n})),$(""),U(d=>d[a]?{...d,[a]:""}:d)},na=()=>{$(""),We(ot),Z(1),ne(!0)},_e=(a,n)=>{We(d=>({...d,[a]:n})),Z(1)},oa=a=>{oe(n=>({...n,selectedAccountId:a.id||"",selectedAccountLabel:[a.accountNumber,a.name].filter(Boolean).join(" - "),clientAccountNumber:a.accountNumber||"",companyName:a.name||"",contactPerson:a.contactPerson||"",address:ts(a),email:a.contactEmail||a.email||"",phone:a.contactMobile||a.contactPhone||a.phone||"",accountOwner:a.accountOwnerName||a.accountOwner||""})),U(n=>({...n,selectedAccountId:""})),$(""),ne(!1)},la=a=>{var x;const n=((x=a.target.files)==null?void 0:x[0])||null,d=Ut(n);if(d){oe(b=>({...b,quoteFile:null,quoteFileName:""})),U(b=>({...b,quoteFile:d})),a.target.value="";return}oe(b=>({...b,quoteFile:n,quoteFileName:(n==null?void 0:n.name)||""})),U(b=>({...b,quoteFile:""})),$("")},ra=async a=>{var y,T,xe;if(a.preventDefault(),ye)return;const n={};p.selectedAccountId||(n.selectedAccountId="Please select an account from Account List."),p.quoteNumber.trim()||(n.quoteNumber="Quote Number is required."),p.quotationDate||(n.quotationDate="Quotation Date is required."),String(p.totalAmount).trim()||(n.totalAmount="Total Amount is required."),p.quotationStatus||(n.quotationStatus="Quotation Status is required.");const d=Ut(p.quoteFile);if(d&&(n.quoteFile=d),U(n),$(""),Object.keys(n).length>0)return;const x={quotationNumber:p.quoteNumber.trim(),quotationDate:p.quotationDate,validUntil:p.validUntilDate||p.quotationDate,amount:Number.parseFloat(p.totalAmount)||0,totalAmount:Number.parseFloat(p.totalAmount)||0,taxAmount:Number.parseFloat(p.totalProductTax)||0,productTax:Number.parseFloat(p.totalProductTax)||0,currency:p.amountCurrency||"INR",taxCurrency:p.taxCurrency||p.amountCurrency||"INR",status:p.quotationStatus,clientName:p.contactPerson||p.companyName||p.clientAccountNumber,companyName:p.companyName,clientAccountNumber:p.clientAccountNumber,contactPerson:p.contactPerson,telephone:p.phone,email:p.email,clientAddressDetails:p.address,selectedAccountId:p.selectedAccountId,selectedAccountOwner:p.accountOwner,quotationFileName:((y=p.quoteFile)==null?void 0:y.name)||"",quotationFileSize:((T=p.quoteFile)==null?void 0:T.size)||0,quotationFileType:((xe=p.quoteFile)==null?void 0:xe.type)||"",projectName:(ue==null?void 0:ue.projectName)||p.companyName||p.clientAccountNumber};vt(!0);const b=await j(x);if(vt(!1),!b.success){const M=b.code==="DUPLICATE_QUOTATION"||b.status===409,k=b.message||"Unable to upload quotation.";$(k),M?g("warning","Duplicate quotation",k):g("error","Error",k);return}g("success","Success","Quotation uploaded successfully."),ee("account"),L(1),je(zt),ve(!1),ne(!1),oe(lt()),U({}),$("")},ke=(a,n=!0)=>{re(a),Oe(n),n&&At(a.id)},Re=()=>{re(null),(Xe||we)&&(Oe(!1),At(""))},ia=async a=>{var x,b;const n=a||be;if(!(!(n!=null&&n.id)||!window.confirm(`Delete Quotation

Are you sure you want to delete quotation "${n.quotationNumber||n.quoteNumber||n.id}"?`)))try{A?await A(n.id):await Et.deleteQuotation(n.id),g==null||g("success","Quotation deleted","Quotation deleted successfully."),Re(),w==null||w()}catch(y){g==null||g("error","Delete failed",((b=(x=y==null?void 0:y.response)==null?void 0:x.data)==null?void 0:b.message)||(y==null?void 0:y.message)||"Failed to delete quotation.")}};h.useEffect(()=>{if(!we){Xe&&(re(null),Oe(!1));return}const a=me.find(n=>{var d;return String(n.id)===String(we)||String(((d=n.raw)==null?void 0:d.id)||"")===String(we)});a&&(Oe(!0),re(n=>(n==null?void 0:n.id)===a.id?n:a))},[me,we,Xe]);const ca=a=>a?me.filter(n=>String(n.raw.selectedAccountId||"")===String(a.id||"")||q(n.raw.clientAccountNumber)===q(a.accountNumber)||q(n.company)===q(a.name)):[],da=a=>{yt(a)},ua=()=>{yt(null)},pa=()=>{ge(J)},ma=()=>{J&&ge(J)},ha=async a=>{const n=rt(a),d={entityType:Ot,name:Qt,columns:n.selectedFields,filters:{},sort:{},isDefault:!1,isShared:!1},x=Pe?await at.updateCustomView(Pe,d):await at.upsertCustomViewByName(d);x!=null&&x.id&&Ie(String(x.id))},Tt=async a=>{if(B.selectedFields.length===0){g("error","Field selection required","Select at least one quotation field.");return}const n=rt(B);if(ae(n),a){window.localStorage.setItem(dt,JSON.stringify(n));try{await ha(n)}catch{g("warning","Saved locally","The quotation layout was saved in this browser, but database sync is unavailable right now.")}}fe(!1)},ba=a=>{G(n=>n.selectedFields.includes(a)?n:{...n,selectedFields:[...n.selectedFields,a]})},xa=a=>{G(n=>n.selectedFields.length<=1?n:{...n,selectedFields:n.selectedFields.filter(d=>d!==a)})},ga=a=>{!se||se===a||(G(n=>{const d=n.selectedFields.indexOf(se),x=n.selectedFields.indexOf(a);if(d<0||x<0)return n;const b=[...n.selectedFields];return b.splice(d,1),b.splice(x,0,se),{...n,selectedFields:b}}),Fe(""))},fa=a=>{const n=`Quotation_Manager_${S}_${new Date().toISOString().slice(0,10)}`,d=[{label:"View",value:S.toUpperCase()},{label:"Total Records",value:String(D.length)},{label:"Generated On",value:new Date().toLocaleString("en-IN")}],x=D.map(b=>{var y,T;return{date:b.dateSort||((y=b.raw)==null?void 0:y.quotationDate)||((T=b.raw)==null?void 0:T.createdAt)||"",owner:b.owner||"",company:b.company||"",project:b.project||"",num:b.num||"",amountLabel:b.amountLabel||"",statusLabel:b.statusLabel||Ce(b.status),oldStatus:b.oldStatus||"",newStatus:b.newStatus||"",convertToPo:b.convertToPo||"",poValueJobNo:b.poValueJobNo||"",reasonForLostOrder:b.reasonForLostOrder||""}});Wa({filename:`${n}.xlsx`,title:"Quotation Manager",subtitle:`${S.toUpperCase()} quotations`,sheetName:"Quotation Manager",metadata:d,columns:es,rows:x}),g("success","Excel exported","Quotation manager data exported to Excel.")},Na=async()=>{if(!Y)return;Le(Y.id);const a=await v(Y.id,{status:"approved",rejectionReason:"",approvedAt:new Date().toISOString()});if(Le(""),!a.success){g("error","Approval failed",a.message||"Unable to approve this quotation.");return}Je(null),g("success","Quotation approved","The quotation status has been updated to Approved.")},ja=async()=>{const a=wt.trim();if(!a){qe("Rejection reason is required.");return}if(!X)return;qe(""),Le(X.id);const n=await v(X.id,{status:"rejected",rejectionReason:a,rejectedAt:new Date().toISOString()});if(Le(""),!n.success){g("error","Reject failed",n.message||"Unable to reject this quotation.");return}He(null),Qe(""),g("success","Quotation rejected","The quotation has been rejected and the reason was saved.")},Pt=a=>{const n=Number.parseFloat(String(a||"").replace(/[^\d.-]/g,""));return Number.isFinite(n)?n:0},va=(a={},n="",d="")=>{if(n.startsWith("customerReference.")){const[,x]=n.split(".");return{customerReference:{...a.customerReference||{},[x]:d}}}if(n.startsWith("lineItems.")){const[,x,b]=n.split("."),y=Number.parseInt(x,10),xe=(Array.isArray(a.lineItems)&&a.lineItems.length>0?a.lineItems:bt(a)).map((M,k)=>{if(k!==y)return M;const H={...M};return b==="quantity"?H.quantity=Pt(d):b==="rate"?H.rate=Pt(d):H[b]=d,H.amount=_(H.quantity)*_(H.rate),H});return{lineItems:xe,amount:xe.reduce((M,k)=>M+_(k.amount),0),totalAmount:xe.reduce((M,k)=>M+_(k.amount),0)}}return{[n]:d}},ya=async(a,n)=>{if(!(I!=null&&I.id)||!a)return;const d=I.raw||{},x=va(d,a,n),b={...d,...x};re(T=>(T==null?void 0:T.id)===I.id?{...T,raw:b}:T);const y=await v(I.id,x);if(!y.success){g("error","Quotation update failed",y.message||"Unable to save quotation field."),re(T=>(T==null?void 0:T.id)===I.id?{...T,raw:d}:T);return}g("success","Quotation updated","Quotation field saved.")},qa=async()=>{var n,d;if(!(!(I!=null&&I.id)||!window.confirm("Are you sure you want to delete this Quotation?")))try{await Et.frontendDeleteQuotation(I.id),Re(),g("success","Quotation deleted","Quotation was removed from the list."),await refreshData()}catch(x){g("error","Delete failed",((d=(n=x==null?void 0:x.response)==null?void 0:n.data)==null?void 0:d.message)||(x==null?void 0:x.message)||"Unable to delete quotation.")}},Ue=le?De(le.raw,le.linkedAccount):null,J=Ye?De(Ye.raw,Ye.linkedAccount):null,be=I?De(I.raw,I.linkedAccount):null,wa=le?mt(o,le):[];I&&mt(o,I);const N=(F==null?void 0:F.linkedAccount)||null,It=h.useMemo(()=>ca(N),[N,me]);return Q?J?e.jsx(Xt,{documentData:J,title:`QUOTATION - ${J.quotationNumber}`,subtitle:J.companyName,onBack:ua,onPrint:pa,onDownload:ma}):e.jsxs("div",{className:"aqp-page",children:[e.jsx("div",{className:"aqp-titlebar",children:e.jsx("h1",{className:"aqp-title",children:"Quotation Manager"})}),e.jsxs("div",{className:"aqp-tab-bar",children:[e.jsxs("div",{className:"aqp-tabs",children:[e.jsx("button",{type:"button",className:`aqp-tab${S==="account"?" aqp-tab--active":""}`,onClick:()=>ee("account"),children:"ACCOUNT"}),e.jsx("button",{type:"button",className:`aqp-tab${S==="deal"?" aqp-tab--active":""}`,onClick:()=>ee("deal"),children:"DEAL"})]}),e.jsxs("div",{className:"aqp-tab-actions",children:[e.jsxs("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:sa,children:[e.jsx(ka,{className:"aqp-btn-icon"}),"Upload Quotation"]}),e.jsxs("button",{type:"button",className:"aqp-btn aqp-btn--red aqp-btn--generate",onClick:()=>l(s,{state:{openGenerator:!0}}),children:[e.jsx(Ra,{className:"aqp-btn-icon"}),"Generate Quotation"]})]})]}),e.jsx("div",{className:"aqp-content-wrapper",children:e.jsxs("div",{className:"aqp-main-content",children:[e.jsx("div",{className:"aqp-report-controls",children:e.jsx("div",{className:"aqp-report-controls-left",children:e.jsx("div",{className:"aqp-report-export",children:e.jsx(Ua,{label:"Export",title:"Export quotation manager",className:"aqp-report-export",items:[{key:"quotation-manager-excel",label:"Export to Excel",badge:"XLSX",onClick:()=>fa()}]})})})}),e.jsx("div",{className:"aqp-table-wrap",children:e.jsxs("table",{className:"aqp-table",children:[e.jsxs("thead",{children:[e.jsx("tr",{className:"aqp-thead-row",children:ce.map(a=>e.jsxs("th",{className:`aqp-th aqp-field--${a.key}`,children:[a.label," ",e.jsx(Da,{className:"aqp-sort-icon"})]},a.key))}),e.jsx("tr",{className:"aqp-search-row",children:ce.map(a=>e.jsx("th",{className:`aqp-search-th aqp-field--${a.key}`,children:e.jsx("input",{className:"aqp-search-input",value:Ne[a.key]||"",onChange:n=>{je(d=>({...d,[a.key]:n.target.value})),L(1)},placeholder:"Search "+a.label})},a.key))})]}),e.jsx("tbody",{children:c&&$e.length===0?e.jsx("tr",{className:"aqp-row",children:e.jsx("td",{className:"aqp-td",colSpan:Math.max(1,ce.length),children:"Loading quotations..."})}):r&&$e.length===0?e.jsx("tr",{className:"aqp-row",children:e.jsx("td",{className:"aqp-td",colSpan:Math.max(1,ce.length),children:r})}):$e.length===0?e.jsx("tr",{className:"aqp-row",children:e.jsx("td",{className:"aqp-td",colSpan:Math.max(1,ce.length),children:"No quotations found."})}):$e.map(a=>e.jsx("tr",{className:"aqp-row",onClick:()=>ke(a),title:`Click to view ${a.num}`,children:ce.map(n=>{if(n.key==="num")return e.jsx("td",{className:`aqp-td aqp-td--num aqp-field--${n.key}`,children:e.jsx("button",{type:"button",className:`aqp-num-badge aqp-num-badge--button ${pt(a.status)}`,onClick:b=>{b.stopPropagation(),ke(a)},children:a.num})},n.key);if(n.key==="status")return e.jsx("td",{className:`aqp-td aqp-field--${n.key}`,children:e.jsx(Yt,{status:a.status})},n.key);const d=n.exportValue(a),x=n.key==="company"?`aqp-td aqp-td--link aqp-field--${n.key}`:n.key==="amount"?`aqp-td aqp-td--amount aqp-field--${n.key}`:`aqp-td aqp-field--${n.key}`;return e.jsx("td",{className:x,children:d},n.key)})},a.id))})]})}),e.jsxs("div",{className:"aqp-pagination",children:[e.jsx("span",{className:"aqp-page-icon",children:D.length}),e.jsxs("span",{className:"aqp-total-label",children:["Total records: ",D.length]}),e.jsxs("div",{className:"aqp-page-btns",children:[e.jsx("button",{type:"button",className:"aqp-page-btn",onClick:()=>L(a=>Math.max(1,a-1)),disabled:z===1,children:e.jsx(Ma,{})}),aa.map(a=>e.jsx("button",{type:"button",className:`aqp-page-btn${z===a?" aqp-page-btn--active":""}`,onClick:()=>L(a),children:a},a)),e.jsx("button",{type:"button",className:"aqp-page-btn",onClick:()=>L(a=>Math.min(he,a+1)),disabled:z===he,children:e.jsx(Va,{})})]})]})]})}),Te?e.jsx("div",{className:"aqp-field-panel-overlay",onClick:()=>fe(!1),children:e.jsxs("div",{className:"aqp-field-panel",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"aqp-field-panel-header",children:[e.jsx("h2",{children:"Select Quotation Report Fields"}),e.jsxs("div",{className:"aqp-field-panel-actions",children:[e.jsx("button",{type:"button",className:"aqp-field-panel-btn aqp-field-panel-btn--ghost",onClick:()=>fe(!1),children:"Close"}),e.jsx("button",{type:"button",className:"aqp-field-panel-btn aqp-field-panel-btn--blue",onClick:()=>Tt(!1),children:"Apply"}),e.jsx("button",{type:"button",className:"aqp-field-panel-btn aqp-field-panel-btn--green",onClick:()=>Tt(!0),children:"Save & Apply"})]})]}),e.jsxs("div",{className:"aqp-field-panel-grid",children:[e.jsxs("section",{className:"aqp-field-box",children:[e.jsx("div",{className:"aqp-field-box-header",children:"Quotation Fields"}),e.jsx("div",{className:"aqp-field-box-list",children:ea.map(a=>e.jsxs("button",{type:"button",className:"aqp-field-option",onClick:()=>ba(a.key),children:[e.jsx("span",{children:a.label}),e.jsx("strong",{children:"+"})]},a.key))})]}),e.jsxs("section",{className:"aqp-field-box",children:[e.jsx("div",{className:"aqp-field-box-header",children:"Selected Fields"}),e.jsx("div",{className:"aqp-field-box-list",children:B.selectedFields.map(a=>{const n=Ae.find(d=>d.key===a);return n?e.jsxs("div",{className:"aqp-field-selected",draggable:!0,onDragStart:()=>Fe(n.key),onDragOver:d=>d.preventDefault(),onDrop:()=>ga(n.key),children:[e.jsx("span",{children:n.label}),e.jsx("button",{type:"button",className:"aqp-field-remove",onClick:()=>xa(n.key),children:e.jsx(Be,{})})]},n.key):null})})]})]})]})}):null,Ee?e.jsx(V,{title:"Upload Account Quotation",onClose:Ct,size:"aqp-modal--upload",footer:e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:Ct,disabled:ye,children:"Close"}),e.jsx("button",{type:"submit",form:"aqp-upload-quotation-form",className:"aqp-btn aqp-btn--blue",disabled:ye,children:ye?"Saving...":"Save"})]}),children:e.jsxs("form",{id:"aqp-upload-quotation-form",className:"aqp-upload-form",onSubmit:ra,children:[e.jsx("div",{className:"aqp-upload-note",children:"Please select the account from the Account List popup before saving the uploaded quotation."}),e.jsxs("div",{className:"aqp-upload-grid",children:[e.jsxs("label",{className:"aqp-form-field aqp-upload-grid__full",children:[e.jsx("span",{className:"aqp-form-label aqp-form-label--required",children:"Select Account"}),e.jsxs("div",{className:"aqp-upload-account-picker",children:[e.jsx("input",{className:`aqp-upload-input${C.selectedAccountId?" aqp-upload-input--error":""}`,value:p.selectedAccountLabel,placeholder:"Click the search icon to select an account",readOnly:!0}),e.jsx("button",{type:"button",className:"aqp-upload-account-button",onClick:na,"aria-label":"Search accounts",children:e.jsx(Ba,{})})]}),C.selectedAccountId?e.jsx("div",{className:"aqp-form-error",children:C.selectedAccountId}):null]}),ue?e.jsxs("div",{className:"aqp-upload-account-card aqp-upload-grid__full",children:[e.jsx("div",{className:"aqp-upload-account-note",children:"Please double click on another account in the list if you want to change this selection."}),e.jsxs("div",{className:"aqp-upload-account-grid",children:[e.jsxs("div",{className:"aqp-upload-account-item",children:[e.jsx("span",{className:"aqp-upload-account-item-label",children:"Account No."}),e.jsx("span",{className:"aqp-upload-account-item-value",children:ue.accountNumber||"-"})]}),e.jsxs("div",{className:"aqp-upload-account-item",children:[e.jsx("span",{className:"aqp-upload-account-item-label",children:"Account Name"}),e.jsx("span",{className:"aqp-upload-account-item-value",children:ue.name||"-"})]}),e.jsxs("div",{className:"aqp-upload-account-item",children:[e.jsx("span",{className:"aqp-upload-account-item-label",children:"Email"}),e.jsx("span",{className:"aqp-upload-account-item-value",children:p.email||"-"})]}),e.jsxs("div",{className:"aqp-upload-account-item",children:[e.jsx("span",{className:"aqp-upload-account-item-label",children:"Phone"}),e.jsx("span",{className:"aqp-upload-account-item-value",children:p.phone||"-"})]}),e.jsxs("div",{className:"aqp-upload-account-item",children:[e.jsx("span",{className:"aqp-upload-account-item-label",children:"Account Owner"}),e.jsx("span",{className:"aqp-upload-account-item-value",children:p.accountOwner||"-"})]}),e.jsxs("div",{className:"aqp-upload-account-item aqp-upload-account-item--wide",children:[e.jsx("span",{className:"aqp-upload-account-item-label",children:"Address"}),e.jsx("span",{className:"aqp-upload-account-item-value",children:p.address||"-"})]})]})]}):null,e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label aqp-form-label--required",children:"Quote Number"}),e.jsx("input",{className:`aqp-upload-input${C.quoteNumber?" aqp-upload-input--error":""}`,value:p.quoteNumber,onChange:a=>O("quoteNumber",a.target.value)}),C.quoteNumber?e.jsx("div",{className:"aqp-form-error",children:C.quoteNumber}):null]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label aqp-form-label--required",children:"Quotation Date"}),e.jsx("input",{type:"date",className:`aqp-upload-input${C.quotationDate?" aqp-upload-input--error":""}`,value:p.quotationDate,onChange:a=>O("quotationDate",a.target.value)}),C.quotationDate?e.jsx("div",{className:"aqp-form-error",children:C.quotationDate}):null]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label aqp-form-label--required",children:"Total Amount"}),e.jsxs("div",{className:"aqp-upload-field-inline",children:[e.jsx("input",{type:"number",min:"0",step:"0.01",className:`aqp-upload-input${C.totalAmount?" aqp-upload-input--error":""}`,value:p.totalAmount,onChange:a=>O("totalAmount",a.target.value)}),e.jsx("select",{className:"aqp-upload-select aqp-upload-select--currency",value:p.amountCurrency,onChange:a=>O("amountCurrency",a.target.value),children:Lt.map(a=>e.jsx("option",{value:a.value,children:a.label},a.value))})]}),C.totalAmount?e.jsx("div",{className:"aqp-form-error",children:C.totalAmount}):null]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label",children:"Total Product Tax"}),e.jsxs("div",{className:"aqp-upload-field-inline",children:[e.jsx("input",{type:"number",min:"0",step:"0.01",className:"aqp-upload-input",value:p.totalProductTax,onChange:a=>O("totalProductTax",a.target.value)}),e.jsx("select",{className:"aqp-upload-select aqp-upload-select--currency",value:p.taxCurrency,onChange:a=>O("taxCurrency",a.target.value),children:Lt.map(a=>e.jsx("option",{value:a.value,children:a.label},a.value))})]})]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label aqp-form-label--required",children:"Quotation Status"}),e.jsx("select",{className:`aqp-upload-select${C.quotationStatus?" aqp-upload-select--error":""}`,value:p.quotationStatus,onChange:a=>O("quotationStatus",a.target.value),children:Ja.map(a=>e.jsx("option",{value:a.value,children:a.label},a.value||"select"))}),C.quotationStatus?e.jsx("div",{className:"aqp-form-error",children:C.quotationStatus}):null]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label",children:"Valid Until Date"}),e.jsx("input",{type:"date",className:"aqp-upload-input",value:p.validUntilDate,onChange:a=>O("validUntilDate",a.target.value)})]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label",children:"Contact Person"}),e.jsx("input",{className:"aqp-upload-input",value:p.contactPerson,onChange:a=>O("contactPerson",a.target.value)})]}),e.jsxs("label",{className:"aqp-form-field aqp-upload-grid__full",children:[e.jsx("span",{className:"aqp-form-label",children:"Address"}),e.jsx("textarea",{className:"aqp-textarea",rows:3,value:p.address,onChange:a=>O("address",a.target.value)})]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label",children:"Email"}),e.jsx("input",{className:"aqp-upload-input",value:p.email,onChange:a=>O("email",a.target.value)})]}),e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label",children:"Phone"}),e.jsx("input",{className:"aqp-upload-input",value:p.phone,onChange:a=>O("phone",a.target.value)})]}),e.jsxs("label",{className:"aqp-form-field aqp-upload-grid__full",children:[e.jsx("span",{className:"aqp-form-label aqp-form-label--required",children:"Quote File"}),e.jsx("input",{type:"file",accept:".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",className:`aqp-upload-file-input${C.quoteFile?" aqp-upload-file-input--error":""}`,onChange:la}),e.jsx("div",{className:"aqp-upload-file-note",children:"Allowed file types: PDF, XLS, XLSX. Maximum size: 5 MB."}),p.quoteFileName?e.jsx("div",{className:"aqp-upload-file-name",children:p.quoteFileName}):null,C.quoteFile?e.jsx("div",{className:"aqp-form-error",children:C.quoteFile}):null]})]}),jt?e.jsx("div",{className:"aqp-upload-message",children:jt}):null]})}):null,Ee&&Jt?e.jsx(V,{title:"Account List",onClose:()=>ne(!1),size:"aqp-modal--xl",children:e.jsxs("div",{className:"aqp-account-list",children:[e.jsx("div",{className:"aqp-account-list-note",children:"Please double click on the account to select a account."}),e.jsx("div",{className:"aqp-account-list-table-wrap",children:e.jsxs("table",{className:"aqp-account-list-table",children:[e.jsxs("thead",{children:[e.jsxs("tr",{className:"aqp-account-list-header-row",children:[e.jsx("th",{children:"Account No."}),e.jsx("th",{children:"Account Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Phone"}),e.jsx("th",{children:"Account Owner"})]}),e.jsxs("tr",{className:"aqp-account-list-search-row",children:[e.jsx("th",{children:e.jsx("input",{className:"aqp-account-list-search-input",value:K.accountNumber,onChange:a=>_e("accountNumber",a.target.value),placeholder:"Search here ..."})}),e.jsx("th",{children:e.jsx("input",{className:"aqp-account-list-search-input",value:K.name,onChange:a=>_e("name",a.target.value),placeholder:"Search here ..."})}),e.jsx("th",{children:e.jsx("input",{className:"aqp-account-list-search-input",value:K.email,onChange:a=>_e("email",a.target.value),placeholder:"Search here ..."})}),e.jsx("th",{children:e.jsx("input",{className:"aqp-account-list-search-input",value:K.phone,onChange:a=>_e("phone",a.target.value),placeholder:"Search here ..."})}),e.jsx("th",{children:e.jsx("input",{className:"aqp-account-list-search-input",value:K.accountOwner,onChange:a=>_e("accountOwner",a.target.value),placeholder:"Search here ..."})})]})]}),e.jsx("tbody",{children:_t.length>0?_t.map(a=>e.jsxs("tr",{className:`aqp-account-list-row${p.selectedAccountId===a.id?" aqp-account-list-row--selected":""}`,onDoubleClick:()=>oa(a),children:[e.jsx("td",{children:a.accountNumber||"-"}),e.jsx("td",{children:a.name||"-"}),e.jsx("td",{children:a.email||"-"}),e.jsx("td",{children:a.phone||"-"}),e.jsx("td",{children:a.accountOwnerDisplay||a.accountOwner||"-"})]},a.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"aqp-account-list-empty",children:"No accounts found."})})})]})}),e.jsxs("div",{className:"aqp-account-list-pagination",children:[e.jsxs("span",{className:"aqp-account-list-total",children:["Total records: ",Se.length]}),e.jsxs("div",{className:"aqp-account-list-pagination-actions",children:[e.jsx("button",{type:"button",className:"aqp-account-list-page-button",onClick:()=>Z(a=>Math.max(1,a-1)),disabled:W===1,children:"prev"}),ta.map(a=>e.jsx("button",{type:"button",className:`aqp-account-list-page-button${a===W?" aqp-account-list-page-button--active":""}`,onClick:()=>Z(a),children:a},a)),e.jsx("button",{type:"button",className:"aqp-account-list-page-button",onClick:()=>Z(a=>Math.min(pe,a+1)),disabled:W===pe,children:"next"})]})]})]})}):null,Ue?e.jsx(V,{title:`Quotation Preview - ${Ue.quotationNumber}`,onClose:()=>Ze(null),size:"aqp-modal--xl",footer:e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:()=>Ze(null),children:"Close"}),e.jsxs("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:()=>ge(Ue),children:[e.jsx(ct,{className:"aqp-btn-icon"}),"Print"]}),wa.some(a=>a.key==="pdf")?e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--blue",onClick:()=>{const a=le;Ze(null),da(a)},children:"View As PDF"}):null]}),children:e.jsx(Ve,{documentData:Ue})}):null,be?e.jsxs(V,{title:`View Quotation - ${be.quotationNumber}`,onClose:Re,onDelete:()=>ia(be),size:"aqp-modal--xl",children:[e.jsx("div",{className:"aqp-view-top-actions",children:e.jsxs("div",{className:"aqp-modal-footer-group",children:[e.jsxs("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:qa,"aria-label":"Delete quotation",children:[e.jsx(Dt,{className:"aqp-btn-icon"}),"Delete"]}),e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:Re,children:"Close"}),e.jsxs("button",{type:"button",className:"aqp-btn aqp-btn--blue",onClick:()=>ge(be),children:[e.jsx(ct,{className:"aqp-btn-icon"}),"Print"]})]})}),e.jsx("div",{className:"aqp-view-quotation-document",children:e.jsx(Ve,{documentData:be,editable:!0,onEditField:ya})})]}):null,F?e.jsx(V,{title:`View Account - ${F.company}`,onClose:()=>qt(null),size:"aqp-modal--lg",footer:e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:()=>qt(null),children:"Close"}),children:e.jsxs("div",{className:"aqp-account",children:[e.jsxs("div",{className:"aqp-account__grid",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Account No.:"})," ",R((N==null?void 0:N.accountNumber)||F.raw.clientAccountNumber)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Account Name:"})," ",R((N==null?void 0:N.name)||F.company)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Email:"})," ",R((N==null?void 0:N.email)||F.raw.email)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Phone:"})," ",R((N==null?void 0:N.phone)||F.raw.telephone)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Account Owner:"})," ",R((N==null?void 0:N.accountOwnerDisplay)||(N==null?void 0:N.accountOwner)||F.raw.selectedAccountOwner)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"GSTIN:"})," ",R((N==null?void 0:N.gstin)||F.raw.gstin)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"State Code:"})," ",R((N==null?void 0:N.stateCode)||F.raw.stateCode)]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Contact Person:"})," ",R((N==null?void 0:N.contactPerson)||F.raw.contactPerson)]})]}),e.jsxs("div",{className:"aqp-account__section",children:[e.jsx("h3",{children:"Address"}),e.jsx("p",{children:R((N==null?void 0:N.address)||F.raw.clientAddressDetails)})]}),e.jsxs("div",{className:"aqp-account__section",children:[e.jsx("h3",{children:"Related Quotations"}),It.length===0?e.jsx("p",{children:"No related quotations found."}):e.jsxs("table",{className:"aqp-account__table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Quotation No."}),e.jsx("th",{children:"Date"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Amount"})]})}),e.jsx("tbody",{children:It.map(a=>e.jsxs("tr",{onClick:()=>ke(a),title:`Click to view ${a.num}`,children:[e.jsx("td",{className:"aqp-account__table-cell--num",children:e.jsx("button",{type:"button",className:`aqp-num-badge aqp-num-badge--button ${pt(a.status)}`,onClick:n=>{n.stopPropagation(),ke(a)},children:a.num})}),e.jsx("td",{children:a.date}),e.jsx("td",{children:a.statusLabel}),e.jsx("td",{children:a.amountLabel})]},a.id))})]})]})]})}):null,Y?e.jsx(V,{title:"Approve Quote",onClose:()=>Je(null),footer:e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:()=>Je(null),disabled:ie===Y.id,children:"Cancel"}),e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--blue",onClick:Na,disabled:ie===Y.id,children:ie===Y.id?"Approving...":"Approve"})]}),children:e.jsx("p",{children:"Are you sure you want to approve this quote?"})}):null,X?e.jsxs(V,{title:"Reject Quote",onClose:()=>{He(null),qe(""),Qe("")},footer:e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--gray",onClick:()=>{He(null),qe(""),Qe("")},disabled:ie===X.id,children:"Cancel"}),e.jsx("button",{type:"button",className:"aqp-btn aqp-btn--blue",onClick:ja,disabled:ie===X.id,children:ie===X.id?"Rejecting...":"Reject Quote"})]}),children:[e.jsxs("label",{className:"aqp-form-field",children:[e.jsx("span",{className:"aqp-form-label",children:"Rejection Reason"}),e.jsx("textarea",{className:`aqp-textarea${ze?" aqp-textarea--error":""}`,rows:5,value:wt,onChange:a=>{Qe(a.target.value),ze&&qe("")},placeholder:"Enter rejection reason"})]}),ze?e.jsx("div",{className:"aqp-form-error",children:ze}):null]}):null]}):null},xs=Object.freeze(Object.defineProperty({__proto__:null,ACTIONS:gt,ModalShell:V,QuotationDocument:Ve,QuotationPdfViewer:Xt,StatusBadge:Yt,buildPrintableHtml:Zt,buildQuotationDocumentData:De,buildQuotationViewExportOptions:us,buildVisiblePages:ht,default:hs,formatListDate:Bt,formatStatusLabel:Ce,getActionBadgeClassName:pt,getAllowedQuotationActions:mt,getStatusClassName:Gt,resolveLinkedAccount:Wt,safeLower:q,toNumber:_,triggerBrowserPdfSave:ge},Symbol.toStringTag,{value:"Module"}));export{gt as A,V as M,Xt as Q,Yt as S,Bt as a,De as b,Ve as c,at as d,ht as e,Ce as f,pt as g,xs as h,Wt as r,q as s,ge as t};
