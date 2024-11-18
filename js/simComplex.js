
const SimComplex = (p) => {
    let puntos = [];
    let numPuntos = 50; // Aumentado para mayor densidad
    let conexiones = [];
    let currentLine = 0;
    let palabra = "COMPLEJIDAD";
    let bufferPalabra;
    let anchoLienzo = 800;
    let altoLienzo = 600;
    let fuenteTamaño = 100;

    p.setup = () => {

        const container = document.getElementById('sim-complex');
        anchoLienzo = container.clientWidth
        altoLienzo = container.clientHeight;
        const canvas = p.createCanvas(anchoLienzo, altoLienzo);
        canvas.parent('sim-complex');

        p.background(200,100,100);
      
        // Crear un buffer para la palabra
        bufferPalabra = p.createGraphics(anchoLienzo, altoLienzo);
        bufferPalabra.pixelDensity(1); // Asegura que la densidad de píxeles sea 1
        bufferPalabra.background(200,100,100);
      
        // Configurar la apariencia de la palabra en el buffer
        bufferPalabra.textAlign(p.CENTER, p.CENTER);
        bufferPalabra.textSize(fuenteTamaño);
        bufferPalabra.fill(200,100,100);
        bufferPalabra.noStroke();
      
        // Dibujar la palabra en el buffer
        bufferPalabra.text(palabra, anchoLienzo / 2, altoLienzo / 2);
      
        // Obtener los píxeles del buffer
        bufferPalabra.loadPixels();
      
        // Generar puntos aleatorios, evitando que estén dentro de la palabra
        for (let i = 0; i < numPuntos; i++) {
          let x, y;
          let attempts = 0;
          let maxAttempts = 100;
          let puntoValido = false;
      
          while (!puntoValido && attempts < maxAttempts) {
            x = p.random(p.width);
            y = p.random(p.height);
            attempts++;
      
            // Verificar si el punto está dentro de la palabra
            let idx = 4 * (p.floor(x) + p.floor(y) * bufferPalabra.width);
            if (idx >= 0 && idx + 3 < bufferPalabra.pixels.length) {
              let r = bufferPalabra.pixels[idx];
              let g = bufferPalabra.pixels[idx + 1];
              let b = bufferPalabra.pixels[idx + 2];
              let a = bufferPalabra.pixels[idx + 3];
              // Considerar que la palabra es blanca, así que R,G,B deben ser 255 y alfa > 0
              if (!(r === 255 && g === 255 && b === 255 && a > 0)) {
                puntoValido = true;
              }
            }
          }
      
          // Solo agregar puntos válidos
          if (puntoValido) {
            puntos.push(p.createVector(x, y));
          }
        }
      
        // Generar todas las conexiones posibles entre puntos
        for (let i = 0; i < puntos.length; i++) {
          for (let j = i + 1; j < puntos.length; j++) {
            conexiones.push([puntos[i], puntos[j]]);
          }
        }
      
        // Mezclar las conexiones para un dibujo aleatorio
        p.shuffle(conexiones, true);
      
        // Configurar estilo de las líneas
        p.stroke(255);
        p.strokeWeight(1);
      
        // Dibujar la palabra inicialmente para que se oculte las líneas que pasan por ella
        p.noStroke();
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(fuenteTamaño);
        p.text(palabra, anchoLienzo / 2, altoLienzo / 2);
      
        // Iniciar el bucle de dibujo
        p.loop();
      
        p.frameRate(30);
        p.print(conexiones.length);
      };

    p.draw = () => {

        
        
        if (currentLine >= conexiones.length) {
            p.noLoop(); // Detener el draw si se han dibujado todas las líneas
          return;
        }
      
        let [p1, p2] = conexiones[currentLine];
      
        p.stroke(255);
        p.circle(p1.x,p1.y,5);
        p.circle(p2.x,p2.y,5);
        p.line(p1.x, p1.y, p2.x, p2.y);
        currentLine++;
      
        // Superponer la palabra en negro para ocultar las líneas que pasan por ella
        p.noStroke();
        p.fill(200,100,100);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(fuenteTamaño);
        p.text(palabra, anchoLienzo / 2, altoLienzo / 2);
      };

      function intersectaPalabra(p1, p2) {
        // Muestra puntos a lo largo de la línea para verificar intersección
        let numMuestras = 100;
        for (let i = 0; i <= numMuestras; i++) {
          let t = i / numMuestras;
          let x = p.lerp(p1.x, p2.x, t);
          let y = p.lerp(p1.y, p2.y, t);
      
          // Asegurarse de que las coordenadas estén dentro del lienzo
          if (x < 0 || x >= anchoLienzo || y < 0 || y >= altoLienzo) continue;
      
          // Obtener el índice del píxel en el buffer
          let idx = 4 * (p.floor(x) + p.floor(y) * bufferPalabra.width);
      
          // Verificar el color en el buffer
          if (idx >= 0 && idx + 3 < bufferPalabra.pixels.length) {
            let r = bufferPalabra.pixels[idx];
            let g = bufferPalabra.pixels[idx + 1];
            let b = bufferPalabra.pixels[idx + 2];
            let a = bufferPalabra.pixels[idx + 3];
            if (r === 255 && g === 255 && b === 255 && a > 0) {
              // Punto dentro de la palabra
              return true;
            }
          }
        }
        return false;
      }
      
      function obtenerPuntoInterseccion(p1, p2) {
        let numMuestras = 100;
        for (let i = 0; i <= numMuestras; i++) {
          let t = i / numMuestras;
          let x = p.lerp(p1.x, p2.x, t);
          let y = p.lerp(p1.y, p2.y, t);
      
          // Asegurarse de que las coordenadas estén dentro del lienzo
          if (x < 0 || x >= anchoLienzo || y < 0 || y >= altoLienzo) continue;
      
          // Obtener el índice del píxel en el buffer
          let idx = 4 * (p.floor(x) + p.floor(y) * bufferPalabra.width);
      
          // Verificar el color en el buffer
          if (idx >= 0 && idx + 3 < bufferPalabra.pixels.length) {
            let r = bufferPalabra.pixels[idx];
            let g = bufferPalabra.pixels[idx + 1];
            let b = bufferPalabra.pixels[idx + 2];
            let a = bufferPalabra.pixels[idx + 3];
            if (r === 255 && g === 255 && b === 255 && a > 0) {
              // Punto dentro de la palabra
              // Devolver el punto justo antes de la intersección
              if (i === 0) return p.createVector(x, y);
              let tPrev = (i - 1) / numMuestras;
              let xPrev = p.lerp(p1.x, p2.x, tPrev);
              let yPrev = p.lerp(p1.y, p2.y, tPrev);
              return p.createVector(xPrev, yPrev);
            }
          }
        }
        return null;
      }
      
      

    p.mousePressed= () =>  {
        p.print(p.frameRate());
        p.print(currentLine);
      }

    p.windowResized = () => {
        const container = document.getElementById('sim-complex');
        p.resizeCanvas(container.clientWidth, container.clientHeight);

        p.background(200, 100, 100);
    };
};

