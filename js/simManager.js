let simComplex = null;
let simAgents = null;

// Funciones para iniciar simulaciones
const startSimComplex = () => {
    if (!simComplex) {
        simComplex = new p5(SimComplex);
    }
};

const startSimAgents = () => {
    if (!simAgents) {
        simAgents = new p5(SimAgents);
    }
};


// Funciones para destruir simulaciones
const deleteSimComplex = () => {
    if (simComplex) {
        simComplex.remove();
        simComplex = null;
    }
};

const deleteSimAgents = () => {
    if (simAgents) {
        simAgents.remove();
        simAgents = null;
    }
};


const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

const asignarRedimension = () => {
    if (simComplex) {
        simComplex.windowResized = debounce(simComplex.windowResized, 200);
    }
    if (simAgents) {
        simAgents.windowResized = debounce(simAgents.windowResized, 200);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Reveal.on('slidechanged', (event) => {
        const currentSlide = event.currentSlide;
        const previousSlide = event.previousSlide;

        // Destruir simulaciones de la diapositiva anterior
        if (previousSlide) {
            if (previousSlide.id === 'slide-sim-complex') {
                deleteSimComplex();
            } else if (previousSlide.id === 'slide-sim-agents') {
                deleteSimAgents();
            } 
        }

        if (currentSlide) {
            if (currentSlide.id === 'slide-sim-complex') {
                startSimComplex();
            } else if (currentSlide.id === 'slide-sim-agents') {
                startSimAgents();
            }
        }
        setTimeout(asignarRedimension, 100);
    });
});
