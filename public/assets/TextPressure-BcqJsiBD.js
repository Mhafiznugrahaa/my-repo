import{j as y}from"./motion-BwxtdDYr.js";import{a as n}from"./vendor-DFDABoI0.js";const O=(l,a)=>{const s=a.x-l.x,c=a.y-l.y;return Math.sqrt(s*s+c*c)},w=(l,a,s,c)=>{const m=c-Math.abs(c*l/a);return Math.max(s,m+s)},P=(l,a)=>{let s;return(...c)=>{clearTimeout(s),s=setTimeout(()=>{l.apply(void 0,c)},a)}},K=({text:l="Compressa",fontFamily:a="Roboto Flex",fontUrl:s="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap",width:c=!0,weight:m=!0,italic:E=!0,alpha:v=!1,flex:A=!0,stroke:S=!1,scale:b=!1,textColor:p="#FFFFFF",strokeColor:M="#FF0000",className:C="",minFontSize:R=24})=>{const x=n.useRef(null),f=n.useRef(null),$=n.useRef([]),u=n.useRef({x:0,y:0}),d=n.useRef({x:0,y:0}),[T,Y]=n.useState(R),[q,j]=n.useState(1),[H,k]=n.useState(1),F=l.split("");n.useEffect(()=>{const t=e=>{d.current.x=e.clientX,d.current.y=e.clientY},i=e=>{const r=e.touches[0];d.current.x=r.clientX,d.current.y=r.clientY};if(window.addEventListener("mousemove",t),window.addEventListener("touchmove",i,{passive:!0}),x.current){const{left:e,top:r,width:o,height:h}=x.current.getBoundingClientRect();u.current.x=e+o/2,u.current.y=r+h/2,d.current.x=u.current.x,d.current.y=u.current.y}return()=>{window.removeEventListener("mousemove",t),window.removeEventListener("touchmove",i)}},[]);const z=n.useCallback(()=>{if(!x.current||!f.current)return;const{width:t,height:i}=x.current.getBoundingClientRect();let e=t/(F.length/2);e=Math.max(e,R),Y(e),j(1),k(1),requestAnimationFrame(()=>{if(!f.current)return;const r=f.current.getBoundingClientRect();if(b&&r.height>0){const o=i/r.height;j(o),k(o)}})},[F.length,R,b]);n.useEffect(()=>{const t=P(z,100);return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[z]),n.useEffect(()=>{let t;const i=()=>{if(u.current.x+=(d.current.x-u.current.x)/15,u.current.y+=(d.current.y-u.current.y)/15,f.current){const r=f.current.getBoundingClientRect().width/2;$.current.forEach(o=>{if(!o)return;const h=o.getBoundingClientRect(),N={x:h.x+h.width/2,y:h.y+h.height/2},g=O(u.current,N),W=c?Math.floor(w(g,r,5,200)):100,X=m?Math.floor(w(g,r,100,900)):400,D=E?w(g,r,0,1).toFixed(2):0,L=v?w(g,r,0,1).toFixed(2):1,B=`'wght' ${X}, 'wdth' ${W}, 'ital' ${D}`;o.style.fontVariationSettings!==B&&(o.style.fontVariationSettings=B),v&&o.style.opacity!==L&&(o.style.opacity=L)})}t=requestAnimationFrame(i)};return i(),()=>cancelAnimationFrame(t)},[c,m,E,v]);const V=n.useMemo(()=>y.jsx("style",{children:`
        @import url('${s}');

        .flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${p};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${M};
        }

        .text-pressure-title {
          color: ${p};
        }
      `}),[a,s,p,M]),I=[C,A?"flex":"",S?"stroke":""].filter(Boolean).join(" ");return y.jsxs("div",{ref:x,style:{position:"relative",width:"100%",height:"100%",background:"transparent"},children:[V,y.jsx("h1",{ref:f,className:`text-pressure-title ${I}`,style:{fontFamily:a,textTransform:"uppercase",fontSize:T,lineHeight:H,transform:`scale(1, ${q})`,transformOrigin:"center top",margin:0,textAlign:"center",userSelect:"none",whiteSpace:"nowrap",fontWeight:100,width:"100%"},children:F.map((t,i)=>y.jsx("span",{ref:e=>{$.current[i]=e},"data-char":t,style:{display:"inline-block",color:S?void 0:p},children:t},i))})]})};export{K as default};
