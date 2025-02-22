"use strict";


const drawRoundRect=function(ctx,x,y,b,h,r){
	ctx.beginPath();
	ctx.arc(x+r, 	y+r, r, 1 * Math.PI, 1.5 * Math.PI);//links oben		
	ctx.arc(x+b-r, 	y+r, r, 1.5* Math.PI, 2 * Math.PI);//rechts oben
	ctx.arc(x+b-r, 	y+h-r, r, 0, 0.5 * Math.PI);//rechts unten
	ctx.arc(x+r, 	y+h-r, r, 0.5* Math.PI, 1 * Math.PI);//links unten
	
	ctx.closePath();
}
const getAbsolutePosition=function(childElement, parentElement){
    // Position des Eltern-Elements
    const parentRect = parentElement.getBoundingClientRect();
    
    // Position des Kind-Elements (relativ zum Viewport)
    const childRect = childElement.getBoundingClientRect();

    // Berechnung der Position des Kind-Elements relativ zum Eltern-Element
    const absolutePosition = {
        x: childRect.left - parentRect.left,
        y: childRect.top - parentRect.top
    };

    return absolutePosition;
}

const drawcross=function(ctx,x,y,bh,farbe){
	ctx.strokeStyle=farbe;
	ctx.lineWidth =1;
	ctx.beginPath();
	ctx.moveTo(x-bh*0.5,y);
	ctx.lineTo(x+bh*0.5,y);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x,y-bh*0.5);
	ctx.lineTo(x,y+bh*0.5);
	ctx.stroke();
}

const htmltocanvas=function(optionen){
	var meinHTML=optionen.quelle,
		canvas=optionen.canvas,
		ctx = canvas.getContext('2d'),
		qscale=1,
		inputcolor="#0075ff",
		i;
	if(optionen["scale"])qscale=optionen["scale"];

	//clonen geht nicht, weilnicht gerendet

	var b=meinHTML.offsetWidth,
		h=meinHTML.offsetHeight
		;


	//canvas auf optimale größe setzen
	var validewerte=[64,128,256,512,1024,2048];
	if(optionen["autosize"]===true){//textur wird bei automatischer größe nicht aktualisiert :/
		canvas.width=validewerte.find(value => value >= b);
		canvas.height=validewerte.find(value => value >= h);
	}
	
	ctx.fillStyle = "#aaaabb";
	ctx.fillRect(0, 0, canvas.width,  canvas.height);
	ctx.save();

	
	const scaleX = canvas.width / b;
	const scaleY = canvas.height / h;
	if(optionen["autoscale"]===true)
		ctx.scale(scaleX, scaleY);
	
	//ctx.scale(2, 2);
	
	//console.log("html:",b,h,"canvas:",canvas.width,  canvas.height,"scale:", scaleX, scaleY);
	
	var manupulatetlist=[];
	
	const drawHTMLElement=function(node,data){
		var pstart,pend,i,iz,t,t2,cnode,worte,preworte,wort,cstyle,
			b,h,size,spacer,zhdiff,
			lineheight,maxb,tmp,out,arr,
			offsetXbreite,reinfo,
			
			ctx=data.ctx,
			styles=window.getComputedStyle(node),
			
			padding={l:0,t:0,r:0,b:0},
			zielsize={w:0,h:0},
			outx,outy,
			xx=0,yy=0
			;
		
		var nodepos=getAbsolutePosition(node,meinHTML);	
			
		offsetXbreite=parseInt(styles.paddingLeft)+parseInt(styles.paddingRight);
		lineheight=parseInt(styles.fontSize);//+size.actualBoundingBoxDescent;
		b=node.offsetWidth;
		h=node.offsetHeight;
		ctx.fillStyle = styles.backgroundColor;

		
		if(styles["borderRadius"]!=undefined){
			tmp=styles.borderRadius;
			if(tmp.indexOf(' ')<0){//nur ein Wert für alle Ecken!
				var bradius=parseInt(tmp);
				if(bradius>0){
					ctx.fillStyle = ctx.fillStyle;
					drawRoundRect(ctx,nodepos.x,nodepos.y,b,h,bradius);
					ctx.fill();
				}
				else{
					ctx.fillRect(nodepos.x,nodepos.y, b,h);
				}
			}
		}		
		
		
		//Element
		padding.l=parseInt(styles.paddingLeft);
		padding.t=parseInt(styles.paddingTop);
		padding.r=parseInt(styles.paddingRight);
		padding.b=parseInt(styles.paddingBottom);
		
		maxb=b-padding.l-padding.r;//offsetXbreite;
		
		zielsize.w=b-padding.l-padding.r;
		zielsize.h=h-padding.t-padding.b;
		
		//start
		xx=nodepos.x;
		yy=nodepos.y;
		var startX=xx;
		var starty=yy;
		outx=xx;
		outy=yy;
		
		var childnodelist=node.childNodes;
		
		var beforeStyle,beforecontent,textinhalt,prop;
		//check auf before-Elemente ->lösche diese und ersetzt duch span-element
		//funktioniert, aber ändert DOM !
		
		beforeStyle = window.getComputedStyle(node, "::before");
		beforecontent=beforeStyle.getPropertyValue("content")
		textinhalt=beforecontent.split('"').join('');
		
		for(i=0;i<node.childNodes.length;i++){
			cnode=node.childNodes[i];
			
			if(cnode.nodeName!=="#text" && cnode.nodeName!="IMG"){
				beforeStyle = window.getComputedStyle(cnode, "::before");
				beforecontent=beforeStyle.getPropertyValue("content")
				textinhalt=beforecontent.split('"').join('');
				
				
				if(textinhalt!="none" && textinhalt!="-moz-alt-content"){
					
					var tempnode=document.createElement("span");
					tempnode.innerHTML=textinhalt;

					tempnode.style.cssText = `
						display: ${beforeStyle.display};
						
						font-family: ${beforeStyle.fontFamily};
						font-style: ${beforeStyle.fontStyle};
						font-weight: ${beforeStyle.fontWeight};
						font-variant: ${beforeStyle.fontVariant};
						text-transform: ${beforeStyle.textTransform};
						line-height: ${beforeStyle.lineHeight};
						
						color: ${beforeStyle.color};
						font-size: ${beforeStyle.fontSize};
						text-align: ${beforeStyle.textAlign};
						
						position: ${beforeStyle.position};
						top: ${beforeStyle.top};
						left: ${beforeStyle.left};
						right: ${beforeStyle.right};
						bottom: ${beforeStyle.bottom};
						background: ${beforeStyle.background};
						margin: ${beforeStyle.margin};
						padding: ${beforeStyle.padding};
					`;
					
					//tempnode.userDataStyElmt=true;
					
					cnode.insertBefore(tempnode,cnode.firstChild);
					
					var deletetClasses="";
					document.querySelectorAll('*').forEach(cnode => {
						const computedStyle = getComputedStyle(cnode, '::before');

						if (computedStyle.content && computedStyle.content !== 'none') {
							cnode.classList.forEach(className => {
								cnode.classList.remove(className);
								deletetClasses+=className+' ';
							});
						}
					});
					
					manupulatetlist.push({"node":cnode,"deletetClasses":deletetClasses,"added":tempnode})
				}
			}
		}
		
		
//console.log(childnodelist);		
		//
		for(i=0;i<childnodelist.length;i++){
			cnode=childnodelist[i];
			
			if(cnode.nodeName==="BR"){//umbruch
				zhdiff=ctx.measureText("test").fontBoundingBoxDescent;
				
				nodepos=getAbsolutePosition(cnode.parentElement,meinHTML);
				xx=nodepos.x;
				yy+=lineheight+zhdiff;
			}
			
//console.log("%c"+cnode.nodeName,"color:#999");
		
			if(cnode.nodeName==="INPUT"){
				cstyle=window.getComputedStyle(cnode);
				
				
				ctx.fillStyle =cstyle.lightingColor;// "#ffffff";

				//ctx.strokeStyle = cstyle.borderColor;
				ctx.strokeStyle = cstyle.outlineColor;
				ctx.lineWidth = 1;//parseInt(cstyle.borderWidth);
				//ctx.lineWidth = parseInt(cstyle.strokeWidth);
				ctx.lineJoin = "round";
				if(cnode.type=="radio"){//console.log(cstyle);	
					if(cnode.checked){
						ctx.strokeStyle = inputcolor;
					}else{
						//ctx.strokeStyle = cstyle.borderColor;console.log(cstyle);//.color
						ctx.strokeStyle = cstyle.color;
					}
					ctx.beginPath();
					ctx.arc(
						cnode.offsetLeft+cnode.offsetWidth*0.5, 
						cnode.offsetTop+cnode.offsetHeight*0.5, 
						cnode.offsetWidth*0.5, 
						0, 2 * Math.PI);
					ctx.closePath(); 
					ctx.fill();
					ctx.stroke();
					
					if(cnode.checked){
						ctx.fillStyle = inputcolor;
						ctx.beginPath();
						ctx.arc(
							cnode.offsetLeft+cnode.offsetWidth*0.5, 
							cnode.offsetTop+cnode.offsetHeight*0.5, 
							cnode.offsetWidth*0.5-2, 
							0, 2 * Math.PI);
						ctx.closePath(); 
						ctx.fill();
					}
				}
				else
				if(cnode.type=="checkbox"){
					var rx=cnode.offsetLeft+0.5, 
						ry=cnode.offsetTop+0.5,
						rb=cnode.offsetWidth,
						rh=cnode.offsetHeight;
						
					if(cnode.checked){
						ctx.lineWidth = 2;
						ctx.strokeStyle = inputcolor;
						ctx.fillStyle = inputcolor;
						drawRoundRect(ctx,rx,ry,rb,rh,2);
						ctx.fill();
						ctx.stroke();
						//Häkchen
						ctx.strokeStyle = cstyle.lightingColor;
						ctx.beginPath();
						ctx.moveTo(rx+rb*0.15,ry+rh*0.5);
						ctx.lineTo(rx+rb*0.40,ry+rh*0.8);
						ctx.lineTo(rx+rb*0.85,ry+rh*0.25);
						ctx.stroke();
					}else{
						
						//ctx.fillStyle = inputcolor;
						drawRoundRect(ctx,rx,ry,rb,rh,2);
						ctx.fill();
						ctx.stroke();
						//console.log(cstyle)
					}
					
				}
				else{
					ctx.fillRect(cnode.offsetLeft+0.5, 
						cnode.offsetTop+0.5,
						cnode.offsetWidth,
						cnode.offsetHeight);
						
					
					ctx.strokeRect(cnode.offsetLeft+0.5, 
						cnode.offsetTop+0.5,
						cnode.offsetWidth,
						cnode.offsetHeight);
				}
				//Text: cnode.value
				var inptextsize=ctx.measureText(cnode.value);
				
				
				//console.log(inptextsize);
				//console.log(">>",cnode.type,cnode.value);
				if(cnode.type=="text"){
					//console.log(cstyle);
					
					
					ctx.fillStyle = cstyle.color;
					ctx.font = cstyle.font;
					ctx.fillText(cnode.value, 
							cnode.offsetLeft+parseInt(cstyle.paddingLeft)+1,
							cnode.offsetTop+4
							+inptextsize.actualBoundingBoxAscent
							+inptextsize.actualBoundingBoxDescent
							+parseInt(cstyle.paddingTop)
						);
				}
				
			}
			else
			if(cnode.nodeName==="IMG"){
				ctx.drawImage(cnode, 
					cnode.offsetLeft, 
					cnode.offsetTop,
					cnode.offsetWidth,
					cnode.offsetHeight);
			}
			else
			if(cnode.nodeName==="#text")
			{
				if(cnode.data!=undefined 
					&& cnode.data!="\n\t"
					&& cnode.data!="\n" 
					&& cnode.data!="\n\n"
					&& cnode.data!="\n\n\t"
					){
					
					ctx.fillStyle = styles.color;
					ctx.font = styles.font;
					
					//einzelne Worte
					preworte=cnode.data;
					preworte=preworte.split('\n').join('');
					preworte=preworte.split('\t').join('');
					preworte=preworte.split(" ");
					
					
					worte=[];
					for(t=0;t<preworte.length;t++){
						tmp=preworte[t];
						if(tmp.indexOf('-')>-1){//Worttrennungen
							arr=tmp.split(/(?=-)|(?<=-)/);
							for(t2=0;t2<arr.length;t2++){
								if(arr[t2]=="-"){
									worte[worte.length-1]=worte[worte.length-1]+'-';
								}
								else{
									if(arr[t2]!="")
										worte.push(arr[t2]);
								}
							}
						}
						else{
							if(tmp!="")
								worte.push(tmp);
						}
					}	
					
					tmp="";
					out="";
					
					zhdiff=ctx.measureText(worte.join(' ')).fontBoundingBoxDescent;
/*				
console.log(
	cnode.nodeName,
	">> pos:",nodepos.x+','+nodepos.y,
	"size:",zielsize.w+'x'+zielsize.h,
	"lineheight:",lineheight,xx,yy);
	
console.log("Text:",'"'+cnode.data+'"');
*/	
	
					for(t=0;t<worte.length;t++){
						wort=worte[t];
						spacer=" ";
						if(wort.charAt(wort.length-1)==="-")
							spacer='';
						
						tmp+=wort+spacer;
						size = ctx.measureText(tmp);
						
						if((size.width+xx)>=maxb || t==worte.length-1){
							if(t==worte.length-1)out+=''+wort;
						
							if(out.length>0){

								size = ctx.measureText(out);
								
								outx =xx+padding.l;
								outy =yy+lineheight+padding.t;								
								
								ctx.textAlign = "left";
								ctx.fillStyle = styles.color;
								
								if(styles.textAlign==="center"){
									outx = xx + b*0.5 -size.width*0.5;
								}
								if(styles.textAlign==="right"){
									outx = xx + b -size.width - padding.r;
								}
								
								//drawcross(ctx,outx,outy,6,styles.color);		

								ctx.fillText(out,outx,outy);
								
								//nächste Zeile
								if(t<worte.length-1){
									yy+=lineheight+zhdiff;
									xx=startX;
								}
							}
							
							out="";
							tmp=wort+spacer;						
						}						
						out+=wort+spacer;
					}
				
				}				
			}
			else{
				//console.log(cnode.nodeName);
			}
			
			if(cnode.childNodes.length>0){
				reinfo=drawHTMLElement(cnode,{"ctx":ctx});
//console.log(reinfo);
				xx=reinfo.x+reinfo.width;
				//yy=reinfo.y;//-reinfo.height-reinfo.zdiff;//bleibt

			}
			
		}//i
		
		return {"width":b,"height":h,"x":outx,"y":outy}
	}

	drawHTMLElement(meinHTML,{"ctx":ctx});
	
	
	//DOM-Manipulationen (before) rückgängig machen
	//manupulatetlist.push({"node":cnode,"deletetClasses":deletetClasses,"added":tempnode})
	var o;
	//console.log(manupulatetlist);
	for(i=0;i<manupulatetlist.length;i++){
		o=manupulatetlist[i];
		o.node.className+=o.deletetClasses;
		o.added.remove();
	}
	
	
	ctx.restore();
}

export{htmltocanvas}