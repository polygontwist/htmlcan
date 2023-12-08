"use strict";
//kleine Helfer für alle Projekte

//HTML/CSS
var cE=function(ziel,e,id,cn){
	var newNode=document.createElement(e);
	if(id!=undefined && id!="")newNode.id=id;
	if(cn!=undefined && cn!="")newNode.className=cn;
	if(ziel)ziel.appendChild(newNode);
	return newNode;
}
var gE=function(id){if(id=="")return undefined; else return document.getElementById(id);}
var addClass=function(htmlNode,Classe){	
	var newClass;
	if(htmlNode!=undefined){
		newClass=htmlNode.className;
 
		if(newClass==undefined || newClass=="")newClass=Classe;
		else
		if(!istClass(htmlNode,Classe))newClass+=' '+Classe;	
 
		htmlNode.className=newClass;
	}			
}
var subClass=function(htmlNode,Classe){
		var aClass,i;
		if(htmlNode!=undefined && htmlNode.className!=undefined){
			aClass=htmlNode.className.split(" ");	
			var newClass="";
			for(i=0;i<aClass.length;i++){
				if(aClass[i]!=Classe){
					if(newClass!="")newClass+=" ";
					newClass+=aClass[i];
					}
			}
			htmlNode.className=newClass;
		}
}
var istClass=function(htmlNode,Classe){
	if(htmlNode.className){
		var i,aClass=htmlNode.className.split(' ');
		for(i=0;i<aClass.length;i++){
				if(aClass[i]==Classe)return true;
		}	
	}		
	return false;
}

//3D
var setRotation=function(node3d,rotation){//in Grad
	node3d.rotation.set(
		Math.PI/180*rotation.x,
		Math.PI/180*rotation.y,
		Math.PI/180*rotation.z);
}
var GradToRad=function(grad){
	return Math.PI/180*grad;
}
var IntTo6Hex=function(i){
		var re=i.toString(16);
		while(re.length<6)re='0'+re;
		return '#'+re;
	}	

var destroyObj=function(nodelist){
	var i,o;
	for(i=0;i<nodelist.length;i++){
		o=nodelist[i];
		
		if(o["children"]!=undefined){
			if(o["children"].length>0)
				destroyObj(o["children"]);//rekursiev
		}
		
		if(o["userData"]!=undefined)o["userData"]={};
		if(o.type==="Mesh"){
			o.geometry.dispose();
			if(o.material!=undefined){
				destryomatmaps(o.material);
			}
		}			
	}		
}
var destryomatmaps=function(mat){
	if(mat!=undefined){
		if(mat.alphaMap!=null){mat.alphaMap.dispose();}
		if(mat.map!=null){mat.map.dispose();}
		if(mat.bumpMap!=null){mat.bumpMap.dispose();}
		if(mat.emissiveMap!=null){mat.emissiveMap.dispose();}
		if(mat.envMap!=null){mat.envMap.dispose();}
		if(mat.aoMap!=null){mat.aoMap.dispose();}
	}
}	

var setautoMats=function(node,materialliste,WebGLVR){//Materialien mit gleichen Namen in Set ersetzen
		var i,cnode;
		var qmat=materialliste;//VRwelten[weltaktivnr].materialien;
		
		for(i=0;i<node.children.length;i++){
			cnode=node.children[i];
			if(cnode["material"]!=undefined)
			if(cnode["material"].name!=""){
				if(qmat[cnode["material"].name]!=undefined){
					//console.log("set>",cnode["material"].name);
					WebGLVR.setMeshMaterial(cnode,cnode["material"].name,false);
				}
				else
					console.log("n.d.:",cnode["material"].name);
			}
			if(cnode.children.length>0){
				setautoMats(cnode);
			}
		}
	}

//Canvas
var drawDot=function(ctx,x,y, r){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.closePath(); 
}

var drawRoundFilledRect=function(ctx,width,height,rundung, color){
	ctx.fillStyle = color;
	if(width-rundung*2>0)
		ctx.fillRect(rundung, 0, width-rundung*2, height);//grund
	if(height-rundung*2>0)
		ctx.fillRect(0, rundung, width, height-rundung*2);//grund
	
	if(rundung>0){
		ctx.beginPath();
		ctx.arc(rundung, rundung, rundung, 0, 2 * Math.PI);//links oben
		ctx.closePath(); 
		ctx.fill(); 
		
		ctx.beginPath();
		ctx.arc(width-rundung, rundung, rundung, 0, 2 * Math.PI);//rechts oben
		ctx.closePath(); 
		ctx.fill(); 
		
		ctx.beginPath();
		ctx.arc(rundung, height-rundung, rundung, 0, 2 * Math.PI);//links unten
		ctx.closePath(); 
		ctx.fill(); 
		
		ctx.beginPath();
		ctx.arc(width-rundung, height-rundung, rundung, 0, 2 * Math.PI);//rechts unten
		ctx.closePath(); 
		ctx.fill(); 
	}
}

var drawPfad=function(ctx,pfad,relpos){
	var i,p;
	for(i=0;i<pfad.length;i++){
		p=pfad[i];
		if(i==0)
			ctx.moveTo(p[0]+relpos[0],p[1]+relpos[1]);
		else
			ctx.lineTo(p[0]+relpos[0],p[1]+relpos[1]);
	}
}

var tempcanvas=document.createElement("canvas");
var getCanvasTextSize=function(stext,font){
	var ctx = tempcanvas.getContext("2d");
	ctx.font = font;	
	var i,h=0,
		fontliste=font.split(' ');
	for(i=0;i<fontliste.length;i++){
		if(fontliste[i].indexOf('px')>-1){
			h=parseFloat(fontliste[i].split('px')[0]);
		}
	}
	return {"width":ctx.measureText(stext).width,"height":h};
}

var splitText=function(stext,textfont,texturbreite){
	//Text in Zeilen wandeln, die nicht breiter als die Fläche sind
	var zeilenliste=[],i,ibr,tmpstrL,
		listeBR=stext.split('<br>'),
		liste,
		tmplist,
		pos=0,
		tbreite=0,
		stopper=false;
	
	for(ibr=0;ibr<listeBR.length;ibr++){
		liste=listeBR[ibr].split(' ');
		stopper=false;
		pos=0;
		while(pos<liste.length && !stopper){
			tmplist=[];
			tmplist.push(liste[pos]);
			tbreite=getCanvasTextSize(tmplist.join(' '),textfont);
			while( (tbreite.width < texturbreite) && (pos<liste.length) && !stopper){
				pos++;
				if(pos<liste.length){
					tmplist.push(liste[pos]);
					tbreite=getCanvasTextSize(tmplist.join(' '),textfont);
				}
				else{
					stopper=true;
				}
			}
			tmpstrL=[];
			if(stopper)
				for(i=0;i<tmplist.length;i++){			//alle Worte übernehmen
					tmpstrL.push(tmplist[i]);
				}
			else
				for(i=0;i<tmplist.length-1;i++){		//Worte übernehmen, außer das letzte
					tmpstrL.push(tmplist[i]);
				}
			zeilenliste.push(tmpstrL.join(' '));		//Zeile merken
		}
	}

	return zeilenliste;
}

var drawRoundRect=function(ctx,x,y,b,h,r){
		ctx.beginPath();
		ctx.arc(x+r, 	y+r, r, 1 * Math.PI, 1.5 * Math.PI);//links oben		
		ctx.arc(x+b-r, 	y+r, r, 1.5* Math.PI, 2 * Math.PI);//rechts oben
		ctx.arc(x+b-r, 	y+h-r, r, 0, 0.5 * Math.PI);//rechts unten
		ctx.arc(x+r, 	y+h-r, r, 0.5* Math.PI, 1 * Math.PI);//links unten
		
		ctx.closePath();
}

	
export { 
	cE,gE,addClass,subClass,istClass, 
	setRotation,GradToRad,IntTo6Hex,
	destroyObj,destryomatmaps,
	setautoMats,
	drawDot,drawRoundFilledRect,drawPfad,
	getCanvasTextSize,
	splitText,drawRoundRect
	}