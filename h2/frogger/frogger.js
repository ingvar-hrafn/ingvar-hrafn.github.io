var gl;

// Global variables (accessed in render)
var locPosition;
var locColor;
var bufferIdA;
var bufferIdB;
var bufferIdC;
var bufferIdD;
var bufferIdCar1;
var bufferIdCar2;
var bufferIdCar3;
var bufferIdCar4;
var bufferIdCar5;
var bufferIdCar6;
var bufferIdCar7;

var car1XPosition = -20 / 16;
var car1Speed = 0.018; 

var car2XPosition = -20 / 16;
var car2Speed = 0.015; 

var car3XPosition = -20 / 16; 
var car3Speed = 0.013;

var car4XPosition = 20 / 16;
var car4Speed = 0.009; 

var car5XPosition = 20 / 16;
var car5Speed = 0.006; 

var car6XPosition = 20 / 16; 
var car6Speed = 0.015;

var car7XPosition = 3 / 16;
var car7Speed = 0.006; 

var colorA = vec4(0.8, 0.8, 0.8, 1.0); // Road 
var colorB = vec4(0.0, 0.7, 0.0, 1.0); // Frog
var colorC = vec4(0.9, 0.9, 0.7, 1.0); // Sidewalk
var colorD = vec4(0.0, 0.0, 0.0, 1.0); // Lines
var colorCar1 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
var colorCar2 = vec4(Math.random(), Math.random(), Math.random(), 1.0); 
var colorCar3 = vec4(Math.random(), Math.random(), Math.random(), 1.0); 
var colorCar4 = vec4(Math.random(), Math.random(), Math.random(), 1.0); 
var colorCar5 = vec4(Math.random(), Math.random(), Math.random(), 1.0); 
var colorCar6 = vec4(Math.random(), Math.random(), Math.random(), 1.0); 
var colorCar7 = vec4(Math.random(), Math.random(), Math.random(), 1.0); 

var isMovingUp = true;
let collisionDetected = false; // Add this line
var score = 0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Canvas
    var verticesA = [
        vec2(-1, -1),
        vec2(1, -1),
        vec2(-1, 1),
        vec2(1, -1),
        vec2(1, 1),
        vec2(-1, 1)
    ];

    // sidewalk
    var verticesC = [
        vec2(-1, -1),
        vec2(-1, -3/4),
        vec2(1, -3/4),
        vec2(1, -3/4),
        vec2(1, -1),
        vec2(-1, -1),

        vec2(-1, 1),
        vec2(-1, 3/4),
        vec2(1, 1),
        vec2(1, 1),
        vec2(-1, 3/4),
        vec2(1, 3/4),
    ];

    // lines
    var verticesD = [
        vec2(-3/4, 1),
        vec2(-3/4, -1),
        vec2(-1/2, 1),
        vec2(-1/2, -1),
        vec2(-1/4, 1),
        vec2(-1/4, -1),
        vec2(0, 1),
        vec2(0, -1),
        vec2(3/4, 1),
        vec2(3/4, -1),
        vec2(1/2, 1),
        vec2(1/2, -1),
        vec2(1/4, 1),
        vec2(1/4, -1),

        vec2(1, -3/4),
        vec2(-1,-3/4),
        vec2(1, -1/2),
        vec2(-1, -1/2),
        vec2(1, -1/4),
        vec2(-1, -1/4),
        vec2(1, 0),
        vec2(-1, 0),
        vec2(1, 3/4),
        vec2(-1, 3/4),
        vec2(1, 1/2),
        vec2(-1, 1/2),
        vec2(1, 1/4),
        vec2(-1, 1/4),
    ];

    // Frog
    var verticesB = [
        vec2(-1, -1),
        vec2(-7/8, -3/4),
        vec2(-3/4, -1)
    ];

    // Car1 vertices
    var verticesCar1 = [
        vec2(car1XPosition, -9 / 16),
        vec2(car1XPosition, -11 / 16),
        vec2(car1XPosition + 4 / 16, -11 / 16),
        vec2(car1XPosition + 4 / 16, -11 / 16),
        vec2(car1XPosition + 4 / 16, -9 / 16),
        vec2(car1XPosition, -9 / 16)
    ];

    // Car2 vertices
    var verticesCar2 = [
        vec2(car2XPosition, -1 / 16),
        vec2(car2XPosition, -3 / 16),
        vec2(car2XPosition + 4 / 16, -3 / 16),
        vec2(car2XPosition + 4 / 16, -3 / 16),
        vec2(car2XPosition + 4 / 16, -1 / 16),
        vec2(car2XPosition, -1 / 16)
    ];

    // Car3 vertices
    var verticesCar3 = [
        vec2(car3XPosition, 7 / 16),
        vec2(car3XPosition, 5 / 16),
        vec2(car3XPosition + 4 / 16, 5 / 16),
        vec2(car3XPosition + 4 / 16, 5 / 16),
        vec2(car3XPosition + 4 / 16, 7 / 16),
        vec2(car3XPosition, 7 / 16)
    ];

    // Car4 vertices
    var verticesCar4 = [
        vec2(car4XPosition, -7 / 16),
        vec2(car4XPosition, -5 / 16),
        vec2(car4XPosition - 4 / 16, -5 / 16),
        vec2(car4XPosition - 4 / 16, -5 / 16),
        vec2(car4XPosition - 4 / 16, -7 / 16),
        vec2(car4XPosition, -7 / 16)
    ];

    // Car5 vertices
    var verticesCar5 = [
        vec2(car5XPosition, 1 / 16),
        vec2(car5XPosition, 3 / 16),
        vec2(car5XPosition - 4 / 16, 3 / 16),
        vec2(car5XPosition - 4 / 16, 3 / 16),
        vec2(car5XPosition - 4 / 16, 1 / 16),
        vec2(car5XPosition, 1 / 16)
    ];

    // Car6 vertices
    var verticesCar6 = [
        vec2(car6XPosition, 9 / 16),
        vec2(car6XPosition, 11 / 16),
        vec2(car6XPosition - 4 / 16, 11 / 16),
        vec2(car6XPosition - 4 / 16, 11 / 16),
        vec2(car6XPosition - 4 / 16, 9 / 16),
        vec2(car6XPosition, 9 / 16)
    ];

    // Car7 vertices
    var verticesCar7 = [
        vec2(car7XPosition, 1 / 16),
        vec2(car7XPosition, 3 / 16),
        vec2(car7XPosition - 4 / 16, 3 / 16),
        vec2(car7XPosition - 4 / 16, 3 / 16),
        vec2(car7XPosition - 4 / 16, 1 / 16),
        vec2(car7XPosition, 1 / 16)
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Define two VBOs and load the data into the GPU
    bufferIdA = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesA), gl.STATIC_DRAW );

    bufferIdB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW );

    bufferIdC = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesC), gl.STATIC_DRAW );

    bufferIdD = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdD );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesD), gl.STATIC_DRAW );

    bufferIdCar1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar1), gl.STATIC_DRAW );

    bufferIdCar2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar2), gl.STATIC_DRAW );

    bufferIdCar3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar3 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar3), gl.STATIC_DRAW );

    bufferIdCar4 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar4 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar4), gl.STATIC_DRAW );

    bufferIdCar5 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar5 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar5), gl.STATIC_DRAW );

    bufferIdCar6 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar6 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar6), gl.STATIC_DRAW );

    bufferIdCar7 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar7 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesCar7), gl.STATIC_DRAW );

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );
    locColor = gl.getUniformLocation( program, "rcolor" );

   // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        let xmove = 0.0;
        let ymove = 0.0;
        switch (e.key) {
            case "ArrowLeft": // Left arrow
                xmove = -0.25;
                break;
            case "ArrowRight": // Right arrow
                xmove = 0.25;
                break;
            case "ArrowUp": // Up arrow
                ymove = 0.25;
                break;
            case "ArrowDown": // Down arrow
                ymove = -0.25;
                break;
            default:
                xmove = 0.0;
                ymove = 0.0;
        }

        const centerX = (verticesB[0][0] + verticesB[1][0] + verticesB[2][0]) / 3;
        const centerY = (verticesB[0][1] + verticesB[1][1] + verticesB[2][1]) / 3;

        if (verticesB[1][1] >= 0.749 && isMovingUp && ymove > 0) {
            isMovingUp = !isMovingUp;
            score++;
            updateScore();

            // Rotate by 180 degrees (PI radians) around the center
            const PI = Math.PI;
            const cos180 = Math.cos(PI);
            const sin180 = Math.sin(PI);

            for (var i = 0; i < 3; i++) {
                const x = verticesB[i][0] - centerX;
                const y = verticesB[i][1] - centerY;

                // Rotate without adjusting the height
                verticesB[i] = vec2(cos180 * x - sin180 * y + centerX, (sin180 * x + cos180 * y + centerY)+1/12);
            }
        }

        if (verticesB[1][1] <= -0.5 && !isMovingUp && ymove < 0) {
            isMovingUp = !isMovingUp;
            score++;
            updateScore();

            // Rotate by 180 degrees (PI radians) around the center
            const PI = Math.PI;
            const cos180 = Math.cos(PI);
            const sin180 = Math.sin(PI);

            for (var i = 0; i < 3; i++) {
                const x = verticesB[i][0] - centerX;
                const y = verticesB[i][1] - centerY;

                // Rotate without adjusting the height
                verticesB[i] = vec2(cos180 * x - sin180 * y + centerX, (sin180 * x + cos180 * y + centerY)-1/12);
            }
        }

        // Calculate the new position of the entire triangle
        let minX = Math.min(verticesB[0][0] + xmove, verticesB[1][0] + xmove, verticesB[2][0] + xmove);
        let minY = Math.min(verticesB[0][1] + ymove, verticesB[1][1] + ymove, verticesB[2][1] + ymove);
        let maxX = Math.max(verticesB[0][0] + xmove, verticesB[1][0] + xmove, verticesB[2][0] + xmove);
        let maxY = Math.max(verticesB[0][1] + ymove, verticesB[1][1] + ymove, verticesB[2][1] + ymove);

        // Check bounds for the entire triangle
        if (minX >= -1 && maxX <= 1 && minY >= -1 && maxY <= 1) {
            // Update the frog's position
            for (i = 0; i < 3; i++) {
                verticesB[i][0] += xmove;
                verticesB[i][1] += ymove;
            }

            // Update the frog's position in the WebGL buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW);
        }
    });

    render(verticesB, verticesCar1, verticesCar2, verticesCar3, verticesCar4, verticesCar5, verticesCar6, verticesCar7);
};

function updateScore() {
    var scoreElement = document.getElementById("score");

    if(score >= 10) {
        scoreElement.textContent = "Winner!";
    }
    else {
        scoreElement.textContent = "Score: " + score;
    }
}

function checkCollision(frogVertices, carVertices) {
    // Get the bounding box of the frog
    const frogMinX = Math.min(frogVertices[0][0], frogVertices[1][0], frogVertices[2][0]);
    const frogMaxX = Math.max(frogVertices[0][0], frogVertices[1][0], frogVertices[2][0]);
    const frogMinY = Math.min(frogVertices[0][1], frogVertices[1][1], frogVertices[2][1]);
    const frogMaxY = Math.max(frogVertices[0][1], frogVertices[1][1], frogVertices[2][1]);

    console.log("1", frogMinX)
    console.log("2", frogMaxX)
    console.log("3", frogMinY)
    console.log("4", frogMaxY)


    // Get the bounding box of the car
    const carMinX = Math.min(carVertices[0][0], carVertices[1][0], carVertices[2][0], carVertices[3][0], carVertices[4][0], carVertices[5][0]);
    const carMaxX = Math.max(carVertices[0][0], carVertices[1][0], carVertices[2][0], carVertices[3][0], carVertices[4][0], carVertices[5][0]);
    const carMinY = Math.min(carVertices[0][1], carVertices[1][1], carVertices[2][1], carVertices[3][1], carVertices[4][1], carVertices[5][1]);
    const carMaxY = Math.max(carVertices[0][1], carVertices[1][1], carVertices[2][1], carVertices[3][1], carVertices[4][1], carVertices[5][1]);

    console.log("5", carMinX)
    console.log("6", carMaxX)
    console.log("7", carMinY)
    console.log("8", carMaxY)

    setTimeout(() => {
        console.log("collision");
    }, 300000);

    // Check for collision by comparing bounding boxes
    if (frogMaxX < carMinX || frogMinX > carMaxX || frogMaxY < carMinY || frogMinY > carMaxY) {
        return false; 
    }
    console.log("collision")
    return true;
}



function handleCollision() {
    // Reset the frog's position (you can set it to its initial position)
    verticesB = [
        vec2(-1, -1),
        vec2(-7/8, -3/4),
        vec2(-3/4, -1)
    ];

    // Update the WebGL buffer for the frog to reflect the new position
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW);

    score = 0;
    updateScore();
}

function updateCar1Position() {
    car1XPosition += car1Speed;

    // If the car moves off the right edge of the canvas, reset its position and color
    if (car1XPosition > 1.0) {
        car1XPosition = -20 / 16;
        // Generate a new random color for the car
        colorCar1 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Car1
    var verticesCar1 = [
        vec2(car1XPosition, -9 / 16),
        vec2(car1XPosition, -11 / 16),
        vec2(car1XPosition + 4 / 16, -11 / 16),
        vec2(car1XPosition + 4 / 16, -11 / 16),
        vec2(car1XPosition + 4 / 16, -9 / 16),
        vec2(car1XPosition, -9 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar1), gl.STATIC_DRAW);
}

function updateCar2Position() {
    car2XPosition += car2Speed;

    // If the car moves off the right edge of the canvas, reset its position and color
    if (car2XPosition > 1.0) {
        car2XPosition = -20 / 16;
        // Generate a new random color for the car
        colorCar2 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

     // Car2 vertices
     var verticesCar2 = [
        vec2(car2XPosition, -1 / 16),
        vec2(car2XPosition, -3 / 16),
        vec2(car2XPosition + 4 / 16, -3 / 16),
        vec2(car2XPosition + 4 / 16, -3 / 16),
        vec2(car2XPosition + 4 / 16, -1 / 16),
        vec2(car2XPosition, -1 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar2), gl.STATIC_DRAW);
}

function updateCar3Position() {
    car3XPosition += car3Speed;

    // If the car moves off the right edge of the canvas, reset its position and color
    if (car3XPosition > 1.0) {
        car3XPosition = -20 / 16;
        // Generate a new random color for the car
        colorCar3 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Car3 vertices
    var verticesCar3 = [
        vec2(car3XPosition, 7 / 16),
        vec2(car3XPosition, 5 / 16),
        vec2(car3XPosition + 4 / 16, 5 / 16),
        vec2(car3XPosition + 4 / 16, 5 / 16),
        vec2(car3XPosition + 4 / 16, 7 / 16),
        vec2(car3XPosition, 7 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar3), gl.STATIC_DRAW);
}

function updateCar4Position() {
    car4XPosition -= car4Speed;

    // If the car moves off the left edge of the canvas, reset its position and color
    if (car4XPosition < -1.0) {
        car4XPosition = 20 / 16;
        // Generate a new random color for the car
        colorCar4 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Car4 vertices
    var verticesCar4 = [
        vec2(car4XPosition, -7 / 16),
        vec2(car4XPosition, -5 / 16),
        vec2(car4XPosition - 4 / 16, -5 / 16),
        vec2(car4XPosition - 4 / 16, -5 / 16),
        vec2(car4XPosition - 4 / 16, -7 / 16),
        vec2(car4XPosition, -7 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar4);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar4), gl.STATIC_DRAW);
}

function updateCar5Position() {
    car5XPosition -= car5Speed;

    // If the car moves off the left edge of the canvas, reset its position and color
    if (car5XPosition < -1.0) {
        car5XPosition = 20 / 16;
        // Generate a new random color for the car
        colorCar5 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Car5 vertices
    var verticesCar5 = [
        vec2(car5XPosition, 1 / 16),
        vec2(car5XPosition, 3 / 16),
        vec2(car5XPosition - 4 / 16, 3 / 16),
        vec2(car5XPosition - 4 / 16, 3 / 16),
        vec2(car5XPosition - 4 / 16, 1 / 16),
        vec2(car5XPosition, 1 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar5);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar5), gl.STATIC_DRAW);
}

function updateCar6Position() {
    car6XPosition -= car6Speed;

    // If the car moves off the left edge of the canvas, reset its position and color
    if (car6XPosition < -1.0) {
        car6XPosition = 20 / 16;
        // Generate a new random color for the car
        colorCar6 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Car6 vertices
    var verticesCar6 = [
        vec2(car6XPosition, 9 / 16),
        vec2(car6XPosition, 11 / 16),
        vec2(car6XPosition - 4 / 16, 11 / 16),
        vec2(car6XPosition - 4 / 16, 11 / 16),
        vec2(car6XPosition - 4 / 16, 9 / 16),
        vec2(car6XPosition, 9 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar6);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar6), gl.STATIC_DRAW);
}

function updateCar7Position() {
    car7XPosition -= car7Speed;

    // If the car moves off the left edge of the canvas, reset its position and color
    if (car7XPosition < -1.0) {
        car7XPosition = 20 / 16;
        // Generate a new random color for the car
        colorCar7 = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Car5 vertices
    var verticesCar7 = [
        vec2(car7XPosition, 1 / 16),
        vec2(car7XPosition, 3 / 16),
        vec2(car7XPosition - 4 / 16, 3 / 16),
        vec2(car7XPosition - 4 / 16, 3 / 16),
        vec2(car7XPosition - 4 / 16, 1 / 16),
        vec2(car7XPosition, 1 / 16)
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCar7);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar7), gl.STATIC_DRAW);
}

function render(verticesB, verticesCar1, verticesCar2, verticesCar3, verticesCar4, verticesCar5, verticesCar6, verticesCar7) {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw road  
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // Draw sidewalk
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorC) );
    gl.drawArrays( gl.TRIANGLES, 0, 12 );

    //Draw lines
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdD );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorD) );
    gl.drawArrays( gl.LINES, 0, 28 );

    // Draw frog
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorB) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    const carVertices = [verticesCar1, verticesCar2, verticesCar3, verticesCar4, verticesCar5, verticesCar6, verticesCar7];

    // Check for collisions with cars
    for (let i = 0; i < 7; i++) {
        if (checkCollision(verticesB, carVertices[i])) {
            handleCollision();

             verticesB = [
                vec2(-1, -1),
                vec2(-7/8, -3/4),
                vec2(-3/4, -1)
            ];

            collisionDetected = true;

        }
    }

    // Draw Car1
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar1 );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorCar1) );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

    updateCar1Position();

    // Draw Car2
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar2 );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorCar2) );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

    updateCar2Position();
    
    // Draw Car3
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar3 );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorCar3) );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

    updateCar3Position();

    // Draw Car4
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar4 );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorCar4) );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

    updateCar4Position();

   // Draw Car5
   gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar5 );
   gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.uniform4fv( locColor, flatten(colorCar5) );
   gl.drawArrays( gl.TRIANGLES, 0, 6 );

   updateCar5Position();

   // Draw Car6
   gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar6 );
   gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.uniform4fv( locColor, flatten(colorCar6) );
   gl.drawArrays( gl.TRIANGLES, 0, 6 );

   updateCar6Position();

   // Draw Car7
   gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdCar7 );
   gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.uniform4fv( locColor, flatten(colorCar7) );
   gl.drawArrays( gl.TRIANGLES, 0, 6 );

   updateCar7Position();

   window.requestAnimFrame(function() {
    render(verticesB, verticesCar1, verticesCar2, verticesCar3, verticesCar4, verticesCar5, verticesCar6, verticesCar7); // Pass frogVertices to the next frame
   });
}
