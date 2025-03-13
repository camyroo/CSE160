import*as e from"https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js";import{OrbitControls as Q}from"https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/controls/OrbitControls.js";import{OBJLoader as D}from"https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/OBJLoader.js";import{MTLLoader as W}from"https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/MTLLoader.js";import{GUI as V}from"https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/libs/lil-gui.module.min.js";import{EXRLoader as Y}from"https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/EXRLoader.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const d of s)if(d.type==="childList")for(const x of d.addedNodes)x.tagName==="LINK"&&x.rel==="modulepreload"&&n(x)}).observe(document,{childList:!0,subtree:!0});function a(s){const d={};return s.integrity&&(d.integrity=s.integrity),s.referrerPolicy&&(d.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?d.credentials="include":s.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function n(s){if(s.ep)return;s.ep=!0;const d=a(s);fetch(s.href,d)}})();const N=document.querySelector("#c"),S=new e.WebGLRenderer({antialias:!0,canvas:N});S.setSize(window.innerWidth,window.innerHeight);S.shadowMap.enabled=!0;S.shadowMap.type=e.PCFSoftShadowMap;const r=new e.Scene;r.background=new e.Color(0);r.fog=new e.Fog(0,10,70);const Z=45,_=window.innerWidth/window.innerHeight,B=.1,I=200,f=new e.PerspectiveCamera(Z,_,B,I);f.position.set(0,5,15);const l=new V,A=new Q(f,N);A.target.set(0,2,0);A.update();class ee{constructor(o,a,n,s){this.obj=o,this.minProp=a,this.maxProp=n,this.minDif=s}get min(){return this.obj[this.minProp]}set min(o){this.obj[this.minProp]=o,this.obj[this.maxProp]=Math.max(this.obj[this.maxProp],o+this.minDif)}get max(){return this.obj[this.maxProp]}set max(o){this.obj[this.maxProp]=o,this.min=this.min}}class oe{constructor(o,a){this.fog=o,this.backgroundColor=a}get near(){return this.fog.near}set near(o){this.fog.near=o,this.fog.far=Math.max(this.fog.far,o)}get far(){return this.fog.far}set far(o){this.fog.far=o,this.fog.near=Math.min(this.fog.near,o)}get color(){return`#${this.fog.color.getHexString()}`}set color(o){this.fog.color.set(o),this.backgroundColor.set(o)}}const F=new oe(r.fog,r.background);l.add(F,"near",B,I).listen();l.add(F,"far",B,I).listen();l.addColor(F,"color");function E(){f.updateProjectionMatrix()}l.add(f,"fov",1,180).onChange(E);const $=new ee(f,"near","far",.1);l.add($,"min",.1,50,.1).name("Near Clip").onChange(E);l.add($,"max",.1,50,.1).name("Far Clip").onChange(E);const te=new e.HemisphereLight(11657727,12155424,1.5);r.add(te);const t=new e.DirectionalLight(16777215,2.5);t.position.set(30,10,0);t.castShadow=!0;t.shadow.mapSize.width=4096;t.shadow.mapSize.height=4096;t.shadow.camera.near=.5;t.shadow.camera.far=100;t.shadow.camera.left=-30;t.shadow.camera.right=30;t.shadow.camera.top=30;t.shadow.camera.bottom=-30;r.add(t);const c=new e.SpotLight(16777215,200,50,Math.PI/6,.3,2);c.position.set(0,10,-3);c.castShadow=!0;r.add(c);const T=new e.CanvasTexture(document.createElement("canvas")),H=T.image.getContext("2d");H.font="Bold 40px Arial";H.fillStyle="white";H.fillText("Cammyroo",10,50);T.needsUpdate=!0;const ae=new e.SpriteMaterial({map:T}),O=new e.Sprite(ae);O.scale.set(3,1.5,1);O.position.set(0,7,-3);r.add(O);const y=l.addFolder("Directional Light");y.add(t.position,"x",-50,50,.1);y.add(t.position,"y",-50,50,.1);y.add(t.position,"z",-50,50,.1);y.add(t,"intensity",0,5,.1);const h=l.addFolder("Spotlight");h.add(c.position,"x",-10,10,.1);h.add(c.position,"y",0,20,.1);h.add(c.position,"z",-10,10,.1);h.add(c,"intensity",0,10,.1);h.add(c,"angle",0,Math.PI/2,.01);h.add(c,"penumbra",0,1,.1);h.add(c,"decay",0,5,.1);h.open();const p=l.addFolder("Shadow Camera");p.add(t.shadow.camera,"near",.1,100,.1).onChange(()=>t.shadow.camera.updateProjectionMatrix());p.add(t.shadow.camera,"far",.1,200,.1).onChange(()=>t.shadow.camera.updateProjectionMatrix());p.add(t.shadow.camera,"left",-100,0,1).onChange(()=>t.shadow.camera.updateProjectionMatrix());p.add(t.shadow.camera,"right",0,100,1).onChange(()=>t.shadow.camera.updateProjectionMatrix());p.add(t.shadow.camera,"top",0,100,1).onChange(()=>t.shadow.camera.updateProjectionMatrix());p.add(t.shadow.camera,"bottom",-100,0,1).onChange(()=>t.shadow.camera.updateProjectionMatrix());y.open();p.open();const J=new e.PMREMGenerator(S);J.compileEquirectangularShader();const re=new Y;re.load("./resources/images/sky2.exr",function(i){const o=J.fromEquirectangular(i).texture;r.background=o,r.environment=o,i.dispose()});const R=new e.LoadingManager,se=new e.TextureLoader(R),ne=document.querySelector("#loading"),ie=document.querySelector(".progressbar");R.onProgress=(i,o,a)=>{const n=o/a;ie.style.transform=`scaleX(${n})`};R.onLoad=()=>{ne.style.display="none",ue()};const L=100,j=new e.TextureLoader().load("resources/images/ground.jpg");j.wrapS=e.RepeatWrapping;j.wrapT=e.RepeatWrapping;j.repeat.set(L/2,L/2);const de=new e.PlaneGeometry(L,L),ce=new e.MeshPhongMaterial({map:j,side:e.DoubleSide}),q=new e.Mesh(de,ce);q.rotation.x=-Math.PI/2;q.receiveShadow=!0;r.add(q);function u(i){const o=se.load(i);return o.colorSpace=e.SRGBColorSpace,o}const le=new e.BoxGeometry(1,1,1),he=[new e.MeshBasicMaterial({map:u("resources/images/flower-1.jpg")}),new e.MeshBasicMaterial({map:u("resources/images/flower-2.jpg")}),new e.MeshBasicMaterial({map:u("resources/images/flower-3.jpg")}),new e.MeshBasicMaterial({map:u("resources/images/flower-4.jpg")}),new e.MeshBasicMaterial({map:u("resources/images/flower-5.jpg")}),new e.MeshBasicMaterial({map:u("resources/images/flower-6.jpg")})],me=new e.CylinderGeometry(2,2,.5,32),pe=new e.MeshStandardMaterial({color:9127187}),G=new e.Mesh(me,pe);G.position.set(0,.25,-3);G.castShadow=!0;G.receiveShadow=!0;r.add(G);let w,m,C;function ue(){w=new e.Mesh(le,he),w.position.set(-2,1,0),w.castShadow=!0,r.add(w),m=new e.Mesh(new e.CylinderGeometry(.5,.5,2,32),new e.MeshStandardMaterial({color:16734003})),m.position.set(0,1,0),m.scale.set(.5,.5,.5),m.castShadow=!0,r.add(m),C=new e.Mesh(new e.SphereGeometry(.5,32,32),new e.MeshStandardMaterial({color:3377407})),C.position.set(2,1,0),C.castShadow=!0,r.add(C)}const X=new W;X.setPath("resources/models/statue/");X.load("stat.mtl",i=>{i.preload();const o=new D;o.setMaterials(i),o.setPath("resources/models/statue/"),o.load("stat.obj",a=>{a.position.set(0,.5,-3),a.scale.set(.03,.03,.03),a.rotation.set(-Math.PI/2,0,0),a.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)}),r.add(a)},a=>{console.log(`Model ${a.loaded/a.total*100}% loaded`)},a=>{console.error("Error loading OBJ file:",a)})});const z=12,U=16,k=new W;k.setPath("resources/models/pillar/");k.load("rc.mtl",i=>{i.preload();const o=new D;o.setMaterials(i),o.setPath("resources/models/pillar/"),o.load("rc.obj",a=>{a.scale.set(.2,.2,.2),a.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)});for(let n=0;n<z;n++){const s=n/z*Math.PI*2,d=Math.cos(s)*U,x=Math.sin(s)*U,v=a.clone();v.position.set(d,0,x),v.rotation.set(0,-s,0),r.add(v)}})});const b=new e.Mesh(new e.BoxGeometry(3,2,3),new e.MeshStandardMaterial({color:0}));b.position.set(20,1,-40);b.scale.set(5,5,5);b.castShadow=!0;b.receiveShadow=!0;r.add(b);const g=new e.Mesh(new e.ConeGeometry(2.5,2,4),new e.MeshStandardMaterial({color:0}));g.position.set(20,10,-40);g.scale.set(5,5,5);g.rotation.y=Math.PI/4;g.castShadow=!0;g.receiveShadow=!0;r.add(g);const P=new e.Mesh(new e.BoxGeometry(3,2,3),new e.MeshStandardMaterial({color:0}));P.position.set(-40,1,-40);P.scale.set(5,5,5);P.castShadow=!0;P.receiveShadow=!0;r.add(P);const M=new e.Mesh(new e.ConeGeometry(2.5,2,4),new e.MeshStandardMaterial({color:0}));M.position.set(-40,10,-40);M.scale.set(5,5,5);M.rotation.y=Math.PI/4;M.castShadow=!0;M.receiveShadow=!0;r.add(M);function K(){requestAnimationFrame(K),w.rotation.x+=.01,w.rotation.y+=.01,m.rotation.x+=.01,m.rotation.y+=.01,S.render(r,f)}K();
