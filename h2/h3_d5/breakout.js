var canvas;
var gl;

// Núverandi staðsetning miðju ferningsins
var box = vec2(0.0, 0.0);

// Stefna (og hraði) fernings
var dX;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;

var mouseX;             // Old value of x-coordinate  
var movement = false;   // Do we move the paddle?

var paddleVertices = [
    vec2(-0.1, -0.9),
    vec2(-0.1, -0.86),
    vec2(0.1, -0.86),
    vec2(0.1, -0.9)
];

var ballVertices = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);

var paddleBufferId;     // Define paddleBufferId as a global variable
var ballBufferId;       // Define ballBufferId as a global variable

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // Gefa ferningnum slembistefnu í upphafi
    dX = Math.random() * 0.1 - 0.05;
    dY = Math.random() * 0.1 - 0.05;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU for the ball
    ballBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ballBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, ballVertices, gl.STATIC_DRAW);

    // Load the data into the GPU for the paddle
    paddleBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paddleBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(paddleVertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        mouseX = e.offsetX;
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            var xmove = 2 * (e.offsetX - mouseX) / canvas.width;
            mouseX = e.offsetX;
            for (i = 0; i < 4; i++) {
                paddleVertices[i][0] += xmove;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, paddleBufferId);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(paddleVertices));
        }
    });

    render();
}


function render() {
    // Láta ferninginn skoppa af veggjunum
    if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    if (Math.abs(box[1] + dY) > maxY - boxRad) dY = -dY;

    // Uppfæra staðsetningu
    box[0] += dX;
    box[1] += dY;

    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Draw the ball
    gl.bindBuffer(gl.ARRAY_BUFFER, ballBufferId); 
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(ballVertices));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the paddle
    gl.bindBuffer(gl.ARRAY_BUFFER, paddleBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(paddleVertices));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    window.requestAnimFrame(render);
}
