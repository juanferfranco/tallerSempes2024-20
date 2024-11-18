const SimAgents = (p) => {

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

let flock;
let separationSlider, alignmentSlider, cohesionSlider;
let separationLabel, alignmentLabel, cohesionLabel;
let separationWeight = 1.5;
let alignmentWeight = 1.0;
let cohesionWeight = 1.0;


class Flock {

    constructor() {
      // An array for all the boids
      this.boids = []; // Initialize the array
    }
  
    run() {
      for (let boid of this.boids) {
        boid.run(this.boids); // Passing the entire list of boids to each boid individually
      }
    }
  
    addBoid(b) {
      this.boids.push(b);
    }
  }




// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

class Boid {
    constructor(x, y) {
      this.acceleration = p.createVector(0, 0);
      this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
      this.position = p.createVector(x, y);
      this.r = 3.0;
      this.maxspeed = 3; // Maximum speed
      this.maxforce = 0.05; // Maximum steering force
    }
  
    run(boids) {
      this.flock(boids);
      this.update();
      this.borders();
      this.show();
    }
  
    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    }
  
    // We accumulate a new acceleration each time based on three rules
    flock(boids) {
      let sep = this.separate(boids); // Separation
      let ali = this.align(boids); // Alignment
      let coh = this.cohere(boids); // Cohesion
      // Arbitrarily weight these forces
      sep.mult(separationWeight);
      ali.mult(alignmentWeight);
      coh.mult(cohesionWeight);
      // Add the force vectors to acceleration
      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
    }
  
    // Method to update location
    update() {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      // Reset accelertion to 0 each cycle
      this.acceleration.mult(0);
    }
  
    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
      let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
      // Normalize desired and scale to maximum speed
      desired.normalize();
      desired.mult(this.maxspeed);
      // Steering = Desired minus Velocity
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce); // Limit to maximum steering force
      return steer;
    }
  
    show() {
      // Draw a triangle rotated in the direction of velocity
      let angle = this.velocity.heading();
      p.fill(255);
      p.stroke(0);
      p.push();
      p.translate(this.position.x, this.position.y);
      p.rotate(angle);
      p.beginShape();
      p.vertex(this.r * 2, 0);
      p.vertex(-this.r * 2, -this.r);
      p.vertex(-this.r * 2, this.r);
      p.endShape(p.CLOSE);
      p.pop();
    }
  
    // Wraparound
    borders() {
      if (this.position.x < -this.r) this.position.x = p.width + this.r;
      if (this.position.y < -this.r) this.position.y = p.height + this.r;
      if (this.position.x > p.width + this.r) this.position.x = -this.r;
      if (this.position.y > p.height + this.r) this.position.y = -this.r;
    }
  
    // Separation
    // Method checks for nearby boids and steers away
    separate(boids) {
      let desiredSeparation = 25;
      let steer = p.createVector(0, 0);
      let count = 0;
      // For every boid in the system, check if it's too close
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if (d > 0 && d < desiredSeparation) {
          // Calculate vector pointing away from neighbor
          let diff = p5.Vector.sub(this.position, boids[i].position);
          diff.normalize();
          diff.div(d); // Weight by distance
          steer.add(diff);
          count++; // Keep track of how many
        }
      }
      // Average -- divide by how many
      if (count > 0) {
        steer.div(count);
      }
  
      // As long as the vector is greater than 0
      if (steer.mag() > 0) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
      }
      return steer;
    }
  
    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
      let neighborDistance = 50;
      let sum = p.createVector(0, 0);
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        if (d > 0 && d < neighborDistance) {
          sum.add(boids[i].velocity);
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        let steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxforce);
        return steer;
      } else {
        return p.createVector(0, 0);
      }
    }
  
    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohere(boids) {
      let neighborDistance = 50;
      let sum = p.createVector(0, 0); // Start with empty vector to accumulate all locations
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        if (d > 0 && d < neighborDistance) {
          sum.add(boids[i].position); // Add location
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
        return this.seek(sum); // Steer towards the location
      } else {
        return p.createVector(0, 0);
      }
    }
  }



    p.setup = () => {
        const container = document.getElementById('sim-agents');
        const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
        canvas.parent('sim-agents');
        flock = new Flock();
        // Add an initial set of boids into the system
        for (let i = 0; i < 60; i++) {
          let boid = new Boid(p.width / 2, p.height / 2);
          flock.addBoid(boid);
        }

        separationSlider = p.createSlider(0, 5, separationWeight, 0.1);
        separationSlider.position(20, 20);
        separationLabel = p.createP("Separación: " + separationWeight.toFixed(1));
        separationLabel.position(160, 20);
    
        alignmentSlider = p.createSlider(0, 5, alignmentWeight, 0.1);
        alignmentSlider.position(20, 60);
        alignmentLabel = p.createP("Alineación: " + alignmentWeight.toFixed(1));
        alignmentLabel.position(160, 60);
    
        cohesionSlider = p.createSlider(0, 5, cohesionWeight, 0.1);
        cohesionSlider.position(20, 100);
        cohesionLabel = p.createP("Cohesión: " + cohesionWeight.toFixed(1));
        cohesionLabel.position(160, 100);

        separationLabel.style('color', '#33C1FF'); 
        alignmentLabel.style('color', '#33C1FF'); 
        cohesionLabel.style('color', '#33C1FF'); 


    };

    p.draw = () => {
        p.background(100, 100, 200);
        separationWeight = separationSlider.value();
        alignmentWeight = alignmentSlider.value();
        cohesionWeight = cohesionSlider.value();
    
        // Actualizar las etiquetas
        separationLabel.html("Separación: " + separationWeight.toFixed(1));
        alignmentLabel.html("Alineación: " + alignmentWeight.toFixed(1));
        cohesionLabel.html("Cohesión: " + cohesionWeight.toFixed(1));
        
        flock.run();
    };

    p.mousePressed = () => {
        const restrictedX = p.mouseX >= 0 && p.mouseX <= 280;
        const restrictedY = p.mouseY >= 0 && p.mouseY <= 150;
    
        if (restrictedX && restrictedY) return;        

        for (let i = 0; i < 10; i++) {
            let boid = new Boid(p.mouseX, p.mouseY);
            flock.addBoid(boid);
          }
    };

    p.windowResized = () => {
        const container = document.getElementById('sim-agents');
        p.resizeCanvas(container.clientWidth, container.clientHeight);
    };


};
