var canvas;
var gl;

var NumVertices  = 12;
var NumBody = 6;
var NumTail = 3;
var NumFin1 = 3;
var NumFin2 = 3;

var fishes = []; // Array to store information about each fish

// Define constants for herd behavior rules
var SEPARATION_RADIUS = 5.0; 
var ALIGNMENT_RADIUS = 2.0; 
var COHESION_RADIUS = 1.0; 

// Hn�tar fisks � xy-planinu
var vertices = [
    // l�kami (spjald)
    vec4( -0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2,  0.2, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2, -0.15, 0.0, 1.0 ),
	vec4( -0.5,  0.0, 0.0, 1.0 ),
	// spor�ur (�r�hyrningur)
    vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -0.65,  0.15, 0.0, 1.0 ),
    vec4( -0.65, -0.15, 0.0, 1.0 ),
    // Uggi1
    vec4( -0.0,  0.0, 0.0, 1.0 ),
    vec4( -0.20,  0.10, 0.0, 1.0 ),
    vec4( -0.20, -0.10, 0.0, 1.0 ), 
    // Uggi2
    vec4( -0.0,  0.0, 0.0, 1.0 ),
    vec4( -0.20,  0.10, 0.0, 1.0 ),
    vec4( -0.20, -0.10, 0.0, 1.0 ), 
];

var movement = false;     // Er m�sarhnappur ni�ri?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotTail = 0.0;        // Sn�ningshorn spor�s
var incTail = 2.0;        // Breyting � sn�ningshorni

var rotFin1 = 0.0;        // Sn�ningshorn spor�s
var incFin1 = 1.0;        // Breyting � sn�ningshorni

var rotFin2 = 0.0;        // Sn�ningshorn spor�s
var incFin2 = 1.0;        // Breyting � sn�ningshorni

var zView = 5.0;          // Sta�setning �horfanda � z-hniti

var proLoc;
var mvLoc;
var colorLoc;

var lastUpdateTime = Date.now();
var yzDuration = 5000; // Duration in milliseconds (5 seconds)
var yGildi = (Math.random() - 0.01) * 0.02;
var zGildi = (Math.random() - 0.01) * 0.02;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );
 
    gl.enable(gl.DEPTH_TEST);
 
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // Setjum ofanvarpsfylki h�r � upphafi
    var proj = perspective( 90.0, 1.0, 0.1, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    

    // Atbur�af�ll fyrir m�s
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY += (e.offsetX - origX) % 360;
            spinX += (e.offsetY - origY) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Atbur�afall fyrir lyklabor�
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp �r
                zView += 0.2;
                break;
            case 40:	// ni�ur �r
                zView -= 0.2;
                break;
         }
     }  );  

    // Atbur�afall fyri m�sarhj�l
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zView += 0.2;
         } else {
             zView -= 0.2;
         }
     }  );  

    // Create 10 fishes with random colors, positions, and z-coordinates
    for (var i = 0; i < 15; i++) {
        var fish = {
            bodyColor: vec4(Math.random(), Math.random(), Math.random(), 1.0),
            secondColor: vec4(Math.random(), Math.random(), Math.random(), 1.0),            
            x: Math.random() * 10 - 5, // Random x position between -5 and 5
            y: Math.random() * 10 - 5, // Random y position between -5 and 5
            z: Math.random() * 10 - 5, // Random z position between -5 and 5
            tailRotationLimit: 25.0 + Math.random() * 26.0, // Random tail rotation limit between 25 and 50 (inclusive)
            speed: 0.01 + Math.random() * 0.02, // Random speed between 0.01 and 0.02
            direction: normalize(vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)), // Random initial direction
            tailSpeed: 20.0 + Math.random() * 40.0, // Random tail rotation speed between 2.0 and 4.0
            incFin1: 1.0 + Math.random() * 2.0, // Random fin1 rotation speed between 1.0 and 3.0
            incFin2: 1.0 + Math.random() * 2.0 // Random fin2 rotation speed between 1.0 and 3.0
        };
        fishes.push(fish);
    }

    render();
}

function updateFishPositions() {
    var currentTime = Date.now();
    var elapsedMilliseconds = currentTime - lastUpdateTime;
    var elapsedSeconds = elapsedMilliseconds / 1000.0;
  
    for (var i = 0; i < fishes.length; i++) {
      var fish = fishes[i];
      var separation = vec3(0.0, 0.0, 0.0);
      var alignment = vec3(0.0, 0.0, 0.0);
      var cohesion = vec3(0.0, 0.0, 0.0);
      var countSeparation = 0;
      var countAlignment = 0;
      var countCohesion = 0;
  
      for (var j = 0; j < fishes.length; j++) {
        if (i !== j) {
          var otherFish = fishes[j];
          var dx = otherFish.x - fish.x;
          var dy = otherFish.y - fish.y;
          var dz = otherFish.z - fish.z;
          var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
          if (distance < COHESION_RADIUS) {
            cohesion[0] += otherFish.x;
            cohesion[1] += otherFish.y;
            cohesion[2] += otherFish.z;
            countCohesion++;
          }
  
          // Separation rule: Avoid other fish that are too close
          if (distance < SEPARATION_RADIUS) {
            var toOtherFish = vec3(dx, dy, dz);
            separation[0] += toOtherFish[0];
            separation[1] += toOtherFish[1];
            separation[2] += toOtherFish[2];
            countSeparation++;
          }
  
          // Alignment rule: Align with nearby fish
          if (distance < ALIGNMENT_RADIUS) {
            alignment[0] += otherFish.direction[0];
            alignment[1] += otherFish.direction[1];
            alignment[2] += otherFish.direction[2];
            countAlignment++;
          }
        }
      }
  
      if (countSeparation > 0) {
        separation[0] /= countSeparation;
        separation[1] /= countSeparation;
        separation[2] /= countSeparation;
        var newPosition = vec3(
          fish.x - separation[0] * 0.01,
          fish.y - separation[1] * 0.01,
          fish.z - separation[2] * 0.01
        );
        fish.y = newPosition[1];
        fish.z = newPosition[2];
      }
  
      if (countAlignment > 0) {
        alignment[1] /= countAlignment;
        alignment[2] /= countAlignment;
      }
  
      if (countCohesion > 0) {
        cohesion[1] /= countCohesion;
        cohesion[2] /= countCohesion;
        var toCenter = vec3(
          cohesion[0] - fish.x,
          cohesion[1] - fish.y,
          cohesion[2] - fish.z
        );
        toCenter[1] *= 0.01;
        toCenter[2] *= 0.01;
        var newPosition = vec3(
          fish.y + toCenter[1] + 0.01,
          fish.z + toCenter[2] + 0.01
        );
        fish.y = newPosition[1];
        fish.z = newPosition[2];
      }
  
      // Update the fish's position in all directions
      fish.x += fish.speed * elapsedSeconds * (Math.random() - 0.5); // Move along the x-axis
      fish.y += fish.speed * elapsedSeconds * (Math.random() - 0.5); // Move along the y-axis
      fish.z += fish.speed * elapsedSeconds * (Math.random() - 0.5); // Move along the z-axis
  
      // Check if the fish goes out of bounds on the right
      if (fish.x > 5.0) {
        fish.x = -5.0; // Wrap around to the left side
      }
      if (fish.y > 5.0) {
        fish.y = -5.0;
      }
      if (fish.y < -5.0) {
        fish.y = 5.0;
      }
      if (fish.z > 5.0) {
        fish.z = -5.0;
      }
      if (fish.z < -5.0) {
        fish.z = 5.0;
      }
    }
  
    lastUpdateTime = currentTime; // Update lastUpdateTime
  }

function updateYzTarget() {
    var currentTime = Date.now();
    var elapsedMilliseconds = currentTime - lastUpdateTime;

    if (elapsedMilliseconds >= yzUpdateInterval) {
        // Generate new random target positions for y and z within a range
        yGildi = (Math.random() - 0.5) * 0.1;
        zGildi = (Math.random() - 0.5) * 0.1;

        // Update the last update time
        lastUpdateTime = currentTime;
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt(vec3(0.0, 0.0, zView), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    mv = mult(mv, rotateX(spinX));
    mv = mult(mv, rotateY(spinY));

    updateFishPositions();
    updateFishPositions();

    for (var i = 0; i < fishes.length; i++) {
        var fish = fishes[i];

        fish.x += fish.speed;

        fish.y += yGildi; // Move forward or backward within the range of -0.05 to 0.05
        fish.z += zGildi; // Move forward or backward within the range of -0.05 to 0.05


        // Check if the fish goes out of bounds on the right
        if (fish.x > 5.0) {
            fish.x = -5.0; // Wrap around to the left side
        }
        if (fish.y > 5.0) {
            fish.y = -5.0;
        }
        if (fish.y < -5.0) {
            fish.y = 5.0;
        }
        if (fish.z > 5.0) {
            fish.z = -5.0;
        }
        if (fish.z < -5.0) {
            fish.z = 5.0;
        }

        // Set fish color
        gl.uniform4fv(colorLoc, fish.bodyColor);

        // Calculate fish's modelview matrix
        var fishMv = mv;
        fishMv = mult(fishMv, translate(fish.x, fish.y, fish.z)); // Apply translation

        // Apply rotation only to the tail and fins
        var fishMvTail = mult(fishMv, translate(-0.5, 0.0, 0.0));
        fishMvTail = mult(fishMvTail, rotateY(rotTail + i * 0.0)); // Rotate the tail
        fishMvTail = mult(fishMvTail, translate(0.5, 0.0, 0.0));

        var fishMvFin1 = mult(fishMv, rotateY(rotFin1 + i * 0.0)); // Rotate fin1

        var fishMvFin2 = mult(fishMv, rotateY(rotFin2 + i * 0.0)); // Rotate fin2

        // Draw fish body
        gl.uniformMatrix4fv(mvLoc, false, flatten(fishMv));
        gl.drawArrays(gl.TRIANGLES, 0, NumBody);

        // Change color
        gl.uniform4fv(colorLoc, fish.secondColor);
    
        // Draw tail
        gl.uniformMatrix4fv(mvLoc, false, flatten(fishMvTail));
        gl.drawArrays(gl.TRIANGLES, NumBody, NumTail);

        // Draw fin1
        gl.uniformMatrix4fv(mvLoc, false, flatten(fishMvFin1));
        gl.drawArrays(gl.TRIANGLES, 9, NumFin1);

        // Draw fin2
        gl.uniformMatrix4fv(mvLoc, false, flatten(fishMvFin2));
        gl.drawArrays(gl.TRIANGLES, 12, NumFin2);

    }

    rotTail += incTail;
    if (rotTail > fish.tailSpeed || rotTail < -fish.tailSpeed)
        incTail *= -1;

    rotFin1 += incFin1;
    if (rotFin1 > 0.0 || rotFin1 < -45.0)
        incFin1 *= -1;

    rotFin2 += incFin2;
    if (rotFin2 > 45.0 || rotFin2 < 0.0)
        incFin2 *= -1;

    gl.uniform4fv(colorLoc, vec4(0.2, 0.6, 0.9, 1.0));

    requestAnimFrame(render);
}
