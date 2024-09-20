window.onload = function() {
  // Canvas Variables
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  
  // Background Image
  var background = new Image();
  background.src = 'https://st.depositphotos.com/1288351/3082/i/450/depositphotos_30824807-stock-photo-blue-nebula-space-background.jpg';
  background.onload = function(){
    // Draw the first frame
    requestAnimationFrame(mainLoop);
  };  
  
  
  // Sun, Planet, and Moon Variables
  var sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 50, color: "yellow" };
  var planets = [
    { radius: 20, distance: 100, angle: 0, speed: 0.01, color: "blue", moons: [
      { radius: 5, distance: 30, angle: 0, speed: 0.03 } // Earth's Moons
    ] }, // Earth
    { radius: 15, distance: 150, angle: 0, speed: 0.008, color: "red", moons: [{ radius: 5, distance: 30, angle: 0, speed: 0.03 }, { radius: 5, distance: 30, angle: -1, speed: 0.03 }] } // Mars and 2 moons
  ];
  
  // Keyboard Input
  var keysdown = {}
  
  window.addEventListener("keydown", function (event){
    if (event.defaultPrevented){
      return;
  }
  keysdown[event.key] = true;
  event.preventDefault();
  }, true);
  
  
  window.addEventListener("keyup", function (event){
    if (event.defaultPrevented){
      return;
  }
  keysdown[event.key] = false;
  event.preventDefault();
  }, true);
  
  // Frame Rendering
  var timestep = 1000/60,
      lastFrameTimeMs = 0,
      maxFPS = 60,
      delta = 0
  
  
  // Game/simulation Loop
  function mainLoop(timestamp) {
    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    processInput();

    var numUpdateSteps = 0;
    while (delta >= timestep) {
        update(timestep);
        delta -= timestep;
        if (++numUpdateSteps >= 240) {
            panic();
            break;
        }
    }
    draw();
    requestAnimationFrame(mainLoop);
  }
  
  function processInput() {
    if (keysdown.ArrowLeft) {
      planets.forEach(function(planet) {
        planet.speed = Math.max(0, planet.speed - 0.001);//slower when you click left button
      });
    }
    
    if (keysdown.ArrowRight) {
      planets.forEach(function(planet) {
        planet.speed = Math.min(0.05, planet.speed + 0.001);//faster when you click right button
      });
    }
  }
  
  function update(){
    // Update angles for planets and moons
    planets.forEach(function(planet){
      planet.angle += planet.speed * delta / timestep; // Adjust planet angle
      planet.moons.forEach(function(moon){
        moon.angle += moon.speed * delta / timestep; // Adjust moon angle
      });
    });
    
  }

  function draw() {
    // Clear drawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Background 
    context.drawImage(background, 0,0, canvas.width, canvas.height);

    // Draw Sun
    context.beginPath();
    context.arc(sun.x, sun.y, sun.radius, 0, 2 * Math.PI);
    context.fillStyle = sun.color;
    context.fill();

    // Draw Planets and Moons
    planets.forEach(function(planet) {
      context.save(); 
      context.translate(sun.x, sun.y);
      context.rotate(planet.angle);
      context.translate(planet.distance, 0);
      
      context.beginPath();
      context.arc(0, 0, planet.radius, 0, 2 * Math.PI);
      context.fillStyle = planet.color;
      context.fill();
      
      planet.moons.forEach(function(moon){
        context.save();
        context.rotate(moon.angle);
        context.translate(moon.distance, 0);
        context.beginPath();
        context.arc(0, 0, moon.radius, 0, 2 * Math.PI);
        context.fillStyle = "gray";
        context.fill();

        context.restore();
      });
      
      context.restore(); 
    });
  }
  function panic(){
    delta = 0
  }
}
