"use strict";

import { drawRoundRect } from './basic.js';

const htmltocanvas=function(optionen){
	const meinHTML=optionen.quelle,
		canvas=optionen.canvas,
		ctx = canvas.getContext('2d'),
		
		inputcolor="#0075ff";
		
	ctx.fillStyle = "#aaaabb";
	ctx.fillRect(0, 0, canvas.width,  canvas.height);

	
	
	const drawHTMLElement=function(node,data){
		var pstart,pend,i,t,t2,cnode,worte,wort,cstyle,
			b,h,size,spacer,
			lineheight,maxb,tmp,out,zeile,
			offsetXbreite,
			
			x=node.offsetLeft,
			y=node.offsetTop,
			
			ctx=data.ctx,
			styles=window.getComputedStyle(node);
			;
			//position: "relative" position:"static"
			
		if(data["tiefe"]==undefined)data["tiefe"]=0;
		if(data["diff"]==undefined)data["diff"]=0;
		x-=data["px"];
		y-=data["py"];
		
		if(node.style.position===""){}
		if(node.style.position==="relative"){
			data["px"]=0;
			data["py"]=0;
		}
		if(node.style.position==="absolute"){
			data["px"]=0;
			data["py"]=0;
		}
		
	
		
		styles = window.getComputedStyle(node);
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
					//ctx.translate(x, y);
					//drawRoundFilledRect(ctx,b,h,bradius,ctx.fillStyle);
					//ctx.resetTransform();
					ctx.fillStyle = ctx.fillStyle;
					drawRoundRect(ctx,x,y,b,h,bradius);
					ctx.fill();
					/*
					ctx.lineWidth = 2;
					ctx.strokeStyle = "#ffffff";
					//drawRoundRect(ctx,x,y,b,h,bradius);
					//drawRoundRect(ctx,0,0,50,50,10);
					ctx.stroke();
					*/
					
				}
				else{
					ctx.fillRect(x,y, b,h);
				}
			}
		}		
		
		maxb=b-parseInt(styles.paddingLeft);//offsetXbreite;
		
		var xx=parseInt(styles.paddingLeft),yy=parseInt(styles.paddingTop);
		for(i=0;i<node.childNodes.length;i++){			//tiefe+1
			cnode=node.childNodes[i];
			
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
//console.log(node.childNodes);					
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
					//size = ctx.measureText("1/n123");
					//console.log(size.actualBoundingBoxDescent);
					worte=cnode.data.split(' ');
					
					//bei "-" wird auch getrennt
					var listeneu=[],tmplist;
					for(t=0;t<worte.length;t++){
						if(worte[t].indexOf('-')>-1){
							tmplist=worte[t].split('-');
							for(t2=0;t2<tmplist.length;t2++){
								if(tmplist[t2]!=""){
									if(t2<tmplist.length-1)
										listeneu.push(tmplist[t2]+'-');
									else
										listeneu.push(tmplist[t2]);
								}
							}
						}
						else
							if(worte[t]!="")
								listeneu.push(worte[t]);
					}
					worte=listeneu;
					
					tmp="";
					out="";
					zeile=0;
					
					var zhdiff=ctx.measureText(worte.join(' ')).actualBoundingBoxDescent
					
					for(t=0;t<worte.length;t++){
						wort=worte[t];
						spacer=" ";
						if(wort.charAt(wort.length-1)==="-")
							spacer='';
						
						tmp+=wort+spacer;
						
						size = ctx.measureText(tmp);
						
						if((size.width+xx)>=maxb || t==worte.length-1){
							if(t==worte.length-1)out+=''+wort;
							
							size = ctx.measureText(out);
							
							ctx.fillStyle = styles.color;
							ctx.fillText(out, 
								xx+x,
								yy+y+lineheight
								);
							
							zeile++;
							yy+=lineheight+zhdiff;
							out="";
							tmp=wort+spacer;						
							
							xx=parseInt(styles.paddingLeft);
						}						
						out+=wort+spacer;						
					}
				}				
			}
			else{
				//console.log(cnode.nodeName);
			}
			
			if(cnode.childNodes.length>0){
				size = ctx.measureText(" ");
				data.tiefe++;
				var reinfo=drawHTMLElement(cnode,
					{"tiefe":data.tiefe
					,"ctx":ctx
					,"px":data["px"]
					,"py":data["py"]//+4
					,"diff":size.width
					});
				
				//xx=data["px"]+reinfo.width+reinfo.x-size.width;
				xx=data["px"]+reinfo.width+reinfo.x-size.width*1+parseInt(styles.paddingLeft)*1;
				yy-=lineheight+zhdiff;
				
				data.tiefe--;
			}
			
		}//i
		
		return {"width":b,"height":h,"x":x,"y":y,"diff":0}
	}

	//console.log(meinHTML.offsetLeft,meinHTML.offsetTop);
	drawHTMLElement(meinHTML,{"tiefe":0,"ctx":ctx, "px":meinHTML.offsetLeft,"py":meinHTML.offsetTop});
	
}

export{htmltocanvas}