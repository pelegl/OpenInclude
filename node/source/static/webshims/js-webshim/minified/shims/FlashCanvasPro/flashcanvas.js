window.ActiveXObject&&!window.CanvasRenderingContext2D&&function(j,m){function O(t){this.code=t,this.message=ea[t]}function y(t,e,i){if(!i){i=[];for(var n=0,a=4*t*e;a>n;++n)i[n]=0}this.width=t,this.height=e,this.data=i}function fa(t){this.width=t}function P(t){this.id=t.I++}function z(t){this.O=t,this.id=t.I++}function D(t,e){this.canvas=t,this.w=e,this.f=t.uniqueID,this.J(),this.I=0,this.j=this.H="",this.c=0}function E(){if("complete"===m.readyState){m.detachEvent(Q,E);for(var t=m.getElementsByTagName(u),e=0,i=t.length;i>e;++e)F.initElement(t[e])}}function R(){var t=event.srcElement,e=t.parentNode;t.blur(),e.focus()}function G(){2&event.button&&event.srcElement.parentNode.setCapture()}function H(){2&event.button&&event.srcElement.parentNode.releaseCapture()}function S(){var t=event.propertyName;if("width"===t||"height"===t){var e=event.srcElement,i=e[t],n=parseInt(i,10);(isNaN(n)||0>n)&&(n="width"===t?300:150),i===n?(e.style[t]=n+"px",e.getContext("2d").P(e.width,e.height)):e[t]=n}}function T(){j.detachEvent(U,T);for(var t in n){var e,i=n[t],a=i.firstChild;for(e in a)"function"==typeof a[e]&&(a[e]=k);for(e in i)"function"==typeof i[e]&&(i[e]=k);a.detachEvent(V,R),a.detachEvent(I,G),i.detachEvent(J,H),i.detachEvent(W,S)}j[X]=k,j[Y]=k,j[Z]=k,j[K]=k,j[$]=k}function ga(){var t=m.getElementsByTagName("script");return t=t[t.length-1],m.documentMode>=8?t.src:t.getAttribute("src",4)}function ha(t){return t.toLowerCase()}function g(t){throw new O(t)}function aa(t){var e=parseInt(t.width,10),i=parseInt(t.height,10);(isNaN(e)||0>e)&&(e=300),(isNaN(i)||0>i)&&(i=150),t.width=e,t.height=i}var k=null,u="canvas",X="CanvasRenderingContext2D",Y="CanvasGradient",Z="CanvasPattern",K="FlashCanvas",$="G_vmlCanvasManager",V="onfocus",I="onmousedown",J="onmouseup",W="onpropertychange",Q="onreadystatechange",U="onunload",q;try{q=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").match(/[\d,]+/)[0].replace(/,/g,".")}catch(ia){q=0}var r=j[K+"Options"]||{},ba=r.swfPath||ga().replace(/[^\/]+$/,""),x;x=parseInt(q)>9?ba+"flash10canvas.swf":ba+"flash9canvas.swf";var A={},B={},ca={},L={},v={},da={},n={},C={},l={C:"turbo"in r?r.turbo:1,B:r.delay||0,M:r.disableContextMenu||0,N:r.imageCacheSize||100,D:r.usePolicyFile||0};"10.1.53.64"===q&&(l.C=0,l.B=30),D.prototype={save:function(){this.e(15),this.L.push([this.l,this.m,this.v,this.k,this.p,this.n,this.o,this.q,this.t,this.u,this.r,this.s,this.j,this.z,this.A]),this.a.push("B")},restore:function(){var t=this.L;t.length&&(t=t.pop(),this.globalAlpha=t[0],this.globalCompositeOperation=t[1],this.strokeStyle=t[2],this.fillStyle=t[3],this.lineWidth=t[4],this.lineCap=t[5],this.lineJoin=t[6],this.miterLimit=t[7],this.shadowOffsetX=t[8],this.shadowOffsetY=t[9],this.shadowBlur=t[10],this.shadowColor=t[11],this.font=t[12],this.textAlign=t[13],this.textBaseline=t[14]),this.a.push("C")},scale:function(t,e){this.a.push("D",t,e)},rotate:function(t){this.a.push("E",t)},translate:function(t,e){this.a.push("F",t,e)},transform:function(t,e,i,n,a,s){this.a.push("G",t,e,i,n,a,s)},setTransform:function(t,e,i,n,a,s){this.a.push("H",t,e,i,n,a,s)},createLinearGradient:function(t,e,i,n){return isFinite(t)&&isFinite(e)&&isFinite(i)&&isFinite(n)||g(9),this.a.push("M",t,e,i,n),new z(this)},createRadialGradient:function(t,e,i,n,a,s){return isFinite(t)&&isFinite(e)&&isFinite(i)&&isFinite(n)&&isFinite(a)&&isFinite(s)||g(9),(0>i||0>s)&&g(1),this.a.push("N",t,e,i,n,a,s),new z(this)},createPattern:function(t,e){t||g(17);var i,n,a,s=t.tagName,r=this.f;if(s)if(s=s.toLowerCase(),"img"===s)i=t.getAttribute("src",2);else if(s===u)n=this.G(t),a=t!==this.canvas;else{if("video"===s)return;g(17)}else t.src?i=t.src:g(17);return"repeat"===e||"no-repeat"===e||"repeat-x"===e||"repeat-y"===e||""===e||e===k||g(12),n||(n=B[r][i],(a=void 0===n)&&(n=this.F(i))),this.a.push("O",n,e),a&&A[r]&&(this.g(),++v[r]),new P(this)},clearRect:function(t,e,i,n){this.a.push("X",t,e,i,n),this.b||this.d(),this.c=0},fillRect:function(t,e,i,n){this.e(1),this.a.push("Y",t,e,i,n),this.b||this.d(),this.c=0},strokeRect:function(t,e,i,n){this.e(6),this.a.push("Z",t,e,i,n),this.b||this.d(),this.c=0},beginPath:function(){this.a.push("a")},closePath:function(){this.a.push("b")},moveTo:function(t,e){this.a.push("c",t,e)},lineTo:function(t,e){this.a.push("d",t,e)},quadraticCurveTo:function(t,e,i,n){this.a.push("e",t,e,i,n)},bezierCurveTo:function(t,e,i,n,a,s){this.a.push("f",t,e,i,n,a,s)},arcTo:function(t,e,i,n,a){0>a&&isFinite(a)&&g(1),this.a.push("g",t,e,i,n,a)},rect:function(t,e,i,n){this.a.push("h",t,e,i,n)},arc:function(t,e,i,n,a,s){0>i&&isFinite(i)&&g(1),this.a.push("i",t,e,i,n,a,s?1:0)},fill:function(){this.e(1),this.a.push("j"),this.b||this.d(),this.c=0},stroke:function(){this.e(6),this.a.push("k"),this.b||this.d(),this.c=0},clip:function(){this.a.push("l")},isPointInPath:function(t,e){return this.a.push("m",t,e),"true"===this.g()},fillText:function(t,e,i,n){this.e(9),this.h.push(this.a.length+1),this.a.push("r",t,e,i,void 0===n?1/0:n),this.b||this.d(),this.c=0},strokeText:function(t,e,i,n){this.e(10),this.h.push(this.a.length+1),this.a.push("s",t,e,i,void 0===n?1/0:n),this.b||this.d(),this.c=0},measureText:function(t){var e=C[this.f];try{e.style.font=this.font}catch(i){}return e.innerText=t.replace(/[ \n\f\r]/g,"	"),new fa(e.offsetWidth)},drawImage:function(t,e,i,n,a,s,r,o,h){t||g(17);var l,c,d,f=t.tagName,p=arguments.length,m=this.f;if(f)if(f=f.toLowerCase(),"img"===f)l=t.getAttribute("src",2);else if(f===u)c=this.G(t),d=t!==this.canvas;else{if("video"===f)return;g(17)}else t.src?l=t.src:g(17);if(c||(c=B[m][l],(d=void 0===c)&&(c=this.F(l))),this.e(0),3===p)this.a.push("u",p,c,e,i);else if(5===p)this.a.push("u",p,c,e,i,n,a);else{if(9!==p)return;(0===n||0===a)&&g(1),this.a.push("u",p,c,e,i,n,a,s,r,o,h)}d&&A[m]?(this.g(),++v[m]):this.b||this.d(),this.c=0},createImageData:function(t,e){var i=Math.ceil;return 2===arguments.length?(isFinite(t)&&isFinite(e)||g(9),(0===t||0===e)&&g(1)):(t instanceof y||g(9),e=t.height,t=t.width),t=i(0>t?-t:t),e=i(0>e?-e:e),new y(t,e)},getImageData:function(a,b,c,d){return isFinite(a)&&isFinite(b)&&isFinite(c)&&isFinite(d)||g(9),(0===c||0===d)&&g(1),this.a.push("w",a,b,c,d),a=this.g(),c="object"==typeof JSON?JSON.parse(a):m.documentMode?eval(a):a.slice(1,-1).split(","),a=c.shift(),b=c.shift(),new y(a,b,c)},putImageData:function(t,e,i,n,a,s,r){t instanceof y||g(17),isFinite(e)&&isFinite(i)||g(9);var o=arguments.length,h=t.width,l=t.height,c=t.data;3===o?this.a.push("x",o,h,l,""+c,e,i):7===o&&(isFinite(n)&&isFinite(a)&&isFinite(s)&&isFinite(r)||g(9),this.a.push("x",o,h,l,""+c,e,i,n,a,s,r)),this.b||this.d(),this.c=0},J:function(){this.globalAlpha=this.l=1,this.globalCompositeOperation=this.m="source-over",this.fillStyle=this.k=this.strokeStyle=this.v="#000000",this.lineWidth=this.p=1,this.lineCap=this.n="butt",this.lineJoin=this.o="miter",this.miterLimit=this.q=10,this.shadowBlur=this.r=this.shadowOffsetY=this.u=this.shadowOffsetX=this.t=0,this.shadowColor=this.s="rgba(0, 0, 0, 0.0)",this.font=this.j="10px sans-serif",this.textAlign=this.z="start",this.textBaseline=this.A="alphabetic",this.a=[],this.L=[],this.i=[],this.h=[],this.b=k,this.K=1},e:function(t){var e,i=this.a;this.l!==this.globalAlpha&&i.push("I",this.l=this.globalAlpha),this.m!==this.globalCompositeOperation&&i.push("J",this.m=this.globalCompositeOperation),this.t!==this.shadowOffsetX&&i.push("T",this.t=this.shadowOffsetX),this.u!==this.shadowOffsetY&&i.push("U",this.u=this.shadowOffsetY),this.r!==this.shadowBlur&&i.push("V",this.r=this.shadowBlur),this.s!==this.shadowColor&&(e=this.s=this.shadowColor,(""+e).indexOf("%")>0&&this.i.push(i.length+1),i.push("W",e)),1&t&&this.k!==this.fillStyle&&(e=this.k=this.fillStyle,"object"==typeof e?e=e.id:(""+e).indexOf("%")>0&&this.i.push(i.length+1),i.push("L",e)),2&t&&this.v!==this.strokeStyle&&(e=this.v=this.strokeStyle,"object"==typeof e?e=e.id:(""+e).indexOf("%")>0&&this.i.push(i.length+1),i.push("K",e)),4&t&&(this.p!==this.lineWidth&&i.push("P",this.p=this.lineWidth),this.n!==this.lineCap&&i.push("Q",this.n=this.lineCap),this.o!==this.lineJoin&&i.push("R",this.o=this.lineJoin),this.q!==this.miterLimit&&i.push("S",this.q=this.miterLimit)),8&t&&(this.j!==this.font&&(t=C[this.f].offsetHeight,this.h.push(i.length+2),i.push("o",t,this.j=this.font)),this.z!==this.textAlign&&i.push("p",this.z=this.textAlign),this.A!==this.textBaseline&&i.push("q",this.A=this.textBaseline),this.H!==this.canvas.currentStyle.direction&&i.push("1",this.H=this.canvas.currentStyle.direction))},d:function(){var t=this;t.b=setTimeout(function(){v[t.f]?t.d():(t.b=k,t.g(l.C))},l.B)},Q:function(){clearTimeout(this.b),this.b=k},g:function(t){var e,i,n,a=this.i,s=this.h,r=this.a,o=this.w;if(r.length){if(this.b&&this.Q(),t){for(e=0,i=a.length;i>e;++e)n=a[e],r[n]=encodeURI(r[n]);for(e=0,i=s.length;i>e;++e)n=s[e],r[n]=encodeURIComponent(r[n])}else for(e=0,i=s.length;i>e;++e)n=s[e],r[n]=(""+r[n]).replace(/&/g,"&amp;").replace(/</g,"&lt;");if(e=r.join(""),this.a=[],this.i=[],this.h=[],!t)return o.CallFunction('<invoke name="executeCommand" returntype="javascript"><arguments><string>'+e+"</string></arguments></invoke>");o.flashvars="c="+e,o.width=o.clientWidth+this.K,this.K^=-2}},P:function(t,e){this.g(),this.J(),t>0&&(this.w.width=t),e>0&&(this.w.height=e),this.a.push("2",t,e),this.b||this.d(),this.c=0},G:function(t){var e=t.uniqueID,i=u+":"+e;return(0===t.width||0===t.height)&&g(11),e!==this.f&&(t=n[e].getContext("2d"),t.c||(e=++da[e],i+=":"+e,t.a.push("3",e),t.b||t.d(),t.c=1)),i},F:function(t){var e=this.f,i=B[e],n=ca[e],a=i[t]=L[e]++;return a>=l.N-1&&(L[e]=0),a in n&&delete i[n[a]],this.h.push(this.a.length+2),this.a.push("5",a,t),n[a]=t,a}},z.prototype={addColorStop:function(t,e){(isNaN(t)||0>t||t>1)&&g(1);var i=this.O,n=this.id;(""+e).indexOf("%")>0&&i.i.push(i.a.length+3),i.a.push("y",n,t,e)}},O.prototype=Error();var ea={1:"INDEX_SIZE_ERR",9:"NOT_SUPPORTED_ERR",11:"INVALID_STATE_ERR",12:"SYNTAX_ERR",17:"TYPE_MISMATCH_ERR",18:"SECURITY_ERR"},F={initElement:function(t){if(t.getContext)return t;var e=t.uniqueID,i="external"+e;A[e]=0,B[e]={},ca[e]=[],L[e]=0,v[e]=1,da[e]=0,aa(t),t.innerHTML='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+location.protocol+'//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="100%" height="100%" id="'+i+'"><param name="allowScriptAccess" value="always"><param name="flashvars" value="id='+i+'"><param name="wmode" value="transparent"></object><span style="margin:0;padding:0;border:0;display:inline-block;position:static;height:1em;overflow:visible;white-space:nowrap"></span>',n[e]=t;var a=t.firstChild;C[e]=t.lastChild;var s=m.body.contains;if(s(t))a.movie=x;else var r=setInterval(function(){s(t)&&(clearInterval(r),a.movie=x)},0);"BackCompat"!==m.compatMode&&j.XMLHttpRequest||(C[e].style.overflow="hidden");var o=new D(t,a);return t.getContext=function(t){return"2d"===t?o:k},t.toDataURL=function(e,i){return 0===t.width||0===t.height?"data:,":("image/jpeg"===(""+e).replace(/[A-Z]+/g,ha)?o.a.push("A",e,"number"==typeof i?i:""):o.a.push("A",e),o.g().slice(1,-1))},a.attachEvent(V,R),l.M&&(a.attachEvent(I,G),t.attachEvent(J,H)),l.D&&o.a.push("4","usePolicyFile",l.D),t},saveImage:function(t){t.firstChild.saveImage()},setOptions:function(t){for(var e in t){var i=t[e];switch(e){case"turbo":l.C=i;break;case"delay":l.B=i;break;case"disableContextMenu":var a=l.M=i;i=void 0;for(i in n){var s=n[i],r=a?"attachEvent":"detachEvent";s.firstChild[r](I,G),s[r](J,H)}break;case"imageCacheSize":l.N=i;break;case"usePolicyFile":a=e,i=l.D=i?1:0,s=void 0;for(s in n)r=n[s].getContext("2d"),r.h.push(r.a.length+2),r.a.push("4",a,i)}}},trigger:function(t,e){n[t].fireEvent("on"+e)},unlock:function(t,e){if(v[t]&&--v[t],e){var i,a,s=n[t],r=s.firstChild;aa(s),i=s.width,a=s.height,s.style.width=i+"px",s.style.height=a+"px",i>0&&(r.width=i),a>0&&(r.height=a),r.resize(i,a),s.attachEvent(W,S),A[t]=1}}};m.createElement(u),m.createStyleSheet().cssText=u+"{display:inline-block;overflow:hidden;width:300px;height:150px}","complete"===m.readyState?E():m.attachEvent(Q,E),j.attachEvent(U,T),0===x.indexOf(location.protocol+"//"+location.host+"/")&&(q=new ActiveXObject("Microsoft.XMLHTTP"),q.open("GET",x,!1),q.send(k)),j[X]=D,j[Y]=z,j[Z]=P,j[K]=F,j[$]={init:function(){},init_:function(){},initElement:F.initElement}}(window,document);