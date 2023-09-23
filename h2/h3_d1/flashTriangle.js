var gl;
var locColor;
var locTime;
var iniTime;
var lastColor;

var vertices = [
    vec2(-0.5, -0.5),
    vec2(0.0, 0.5),
    vec2(0.5, -0.5)
];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    locColor = gl.getUniformLocation(program, "rcolor");
    locTime = gl.getUniformLocation(program, "time");

    iniTime = Date.now();
    lastColor = vec4(Math.random(), Math.random(), Math.random(), 1.0); 

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    var msek = Date.now() - iniTime;
    gl.uniform1f(locTime, msek / 1000); 

    // Change color every 0.2 seconds
    var colorChangeInterval = 200; 
    var isBlink = (msek % colorChangeInterval) < (colorChangeInterval / 2);

    if (isBlink) {
        lastColor = vec4(Math.random(), Math.random(), Math.random(), 1.0); 
    }

    gl.uniform4fv(locColor, lastColor);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimFrame(render);
}
