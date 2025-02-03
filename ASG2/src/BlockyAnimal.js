// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4  u_ModelMatrix;
     uniform mat4 u_GlobalRotateMatrix;
    void main() {
      gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
     
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {   
        gl_FragColor = u_FragColor;
    }`

//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGl() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModeMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}





const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segments = 1;

let g_globalAngle = 0;
let g_globalXAngle = 0;
let g_globalYAngle = 0; 

let g_yellowAngle = 0;
let g_magentaAngle = 0;

let g_yellowAnimtion=false;
let g_magentaAnimtion=false;

function addActionsForHtmlUI() {

    document.getElementById('animationYellowOffButton').onclick = function () {g_yellowAnimtion = false;};
    document.getElementById('animationYellowOnButton').onclick = function () {g_yellowAnimtion = true;};

    document.getElementById('animationMagentaOffButton').onclick = function () {g_magentaAnimtion = false;};
    document.getElementById('animationMagentaOnButton').onclick = function () {g_magentaAnimtion = true;};


    document.getElementById('yellowSlide').addEventListener('mousemove', function () { g_yellowAngle = this.value; renderAllShapes(); });
    document.getElementById('magentaSlide').addEventListener('mousemove', function () { g_magentaAngle = this.value; renderAllShapes(); });

    //document.getElementById('angleSlide').addEventListener('mouseup', function () { g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });
}




function main() {

    setupWebGl();
    connectVariablesToGLSL();
    addActionsForHtmlUI();


    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    //canvas.onmousemove = click;
   // canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } }
   canvas.addEventListener('mousemove', function(ev) {
    // Check if the left mouse button is held down:
    if (ev.buttons === 1) { 
        // Get the mouse position relative to the canvas
        let rect = ev.target.getBoundingClientRect();
        let mouseX = ev.clientX - rect.left;
        let mouseY = ev.clientY - rect.top;
        
        // Map the horizontal (x) position to a rotation around the y-axis.
        // For example, if the mouse is at the far right, rotate 360°, at far left -360°.
        g_globalYAngle = (mouseX / canvas.width) * 360;
        
        // Map the vertical (y) position to a rotation around the x-axis.
        // (You might adjust the scaling factor as desired.)
        g_globalXAngle = (mouseY / canvas.height) * 360;
        
        // Re-render the scene with the new global rotation.
        renderAllShapes();
    }
  });

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);

    //renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {

    g_seconds=performance.now()/1000.0-g_startTime;
    console.log(performance.now());

    updateAnimationAngles();

    renderAllShapes();
    requestAnimationFrame(tick);

}


var g_shapesList = [];


function click(ev) {
    canvas.addEventListener('mousemove', function(ev) {
    // Check if the left mouse button is held down:
    if (ev.buttons === 1) { 
        // Get the mouse position relative to the canvas
        let rect = ev.target.getBoundingClientRect();
        let mouseX = ev.clientX - rect.left;
        let mouseY = ev.clientY - rect.top;
        
        // Map the horizontal (x) position to a rotation around the y-axis.
        // For example, if the mouse is at the far right, rotate 360°, at far left -360°.
        g_globalYAngle = (mouseX / canvas.width) * 360;
        
        // Map the vertical (y) position to a rotation around the x-axis.
        // (You might adjust the scaling factor as desired.)
        g_globalXAngle = (mouseY / canvas.height) * 360;
        
        // Re-render the scene with the new global rotation.
        renderAllShapes();
    }
  });
  
    // let [x, y] = convertCoordinatesEventToGl(ev);

    // let shape;
    // if (g_selectedType === POINT) {
    //     shape = new Point();
    // } else if (g_selectedType === TRIANGLE) {
    //     shape = new Triangle();
    // } else {
    //     shape = new Circle();  // Create Circle
    // } 

    // shape.position = [x, y];
    // shape.color = g_selectedColor.slice();
    // shape.size = g_selectedSize;
    // g_shapesList.push(shape);

    // renderAllShapes();
}

function convertCoordinatesEventToGl(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function updateAnimationAngles() {
    if(g_yellowAnimtion) {
        g_yellowAngle = (45*Math.sin(g_seconds));
    }
    if(g_magentaAnimtion) {
        g_magentaAngle = (45*Math.sin(3*g_seconds));
    }
}


function renderAllShapes() {
    // Clear <canvas>
    var startTime = performance.now();

    //var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
    var globalRotMat = new Matrix4();
    globalRotMat.setIdentity();
    globalRotMat.rotate(g_globalXAngle, 1, 0, 0);
    globalRotMat.rotate(g_globalYAngle, 0, 1, 0);

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

   // drawTriangle( [-1.0,0.0,0.0,    -0.5,-1.0,0.0,  0.0,0.0,0.0] );

    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.matrix.translate(-.25,-.75,0.0);
    body.matrix.rotate(-5,1,0,0);
    body.matrix.scale(0.5,.3,.5);
    body.render();
    
    var yellow = new Cube();
    yellow.color = [1,1,0,1];
    yellow.matrix.setTranslate(0,-.5,0.0);
    yellow.matrix.rotate(-5, 1,0,0);
    yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);

    // if(g_yellowAnimtion) {
    //     yellow.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);

    // } else {
    //     yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
    // }
    var yellowCoordMat=new Matrix4(yellow.matrix);
    yellow.matrix.scale(0.25,.7,.5);
    yellow.matrix.translate(-.5,0,0);
    yellow.render();

    var box = new Cube();
    box.color = [1, 0, 1, 1];
    box.matrix  = yellowCoordMat;
    box.matrix.translate(0,0.65,0);
    box.matrix.rotate(g_magentaAngle,0,0,1);
    box.matrix.scale(.3,.3,.3);
    box.matrix.translate(-.5,0, -0.001);
    box.render();

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");

}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

