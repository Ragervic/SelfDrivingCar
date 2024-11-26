const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 100;
const cars = generateCars(N);

// let is used to initialize variables that change overtime 
let bestCar = cars[0];

// checking for the previous bestbrain and setting it to the bestcar
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
         
    }
}

const traffic = [
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2)
];


animate();

// Function to save the bestcar/brain
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
    localStorage.removeItem("bestBrain");
}

// Function to generate cars 
function generateCars(N) {
    const cars = [];
    for (let i = 0; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50,"AI"));
    }
    return cars;

}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    // update the cars generated at the top
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic); //Detect the borders
    }
    // Finding the best car 
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight; //this adjusts the height of the carCanvas and the car object dynamically
    networkCanvas.height = window.innerHeight; 

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); // this makes a camera like illusion to appear on top of the car

    road.draw(carCtx); //road comes first
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"blue",true)

    carCtx.restore();


    networkCtx.LineDashOffset = -time / 50;
    // visualizing the network
    // Visualizer.drawNetwork(networkCtx,bestCar.brain)
    requestAnimationFrame(animate); // displays motion

}
