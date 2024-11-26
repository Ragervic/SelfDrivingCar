// inputs are obtained from the sensors
// weights and biases are used to calculate the outputs

class NeuralNetwork {
    constructor(neuronCount) {
        this.levels = [];
        for (let i = 0; i < neuronCount.length - 1; i++) {
            this.levels.push(new Level(
                neuronCount[i], neuronCount[i + 1]
            ));
        }
    }
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0])
        for (let i = 0; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }
    // Mutation function that changes the network based on a provided amount using the network's weights and biases
    static mutate(network, amount) {
        network.levels.forEach(level => {
            // looping through the biases
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            // looping through the weights in each bias
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i]; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    );
                }
            }
            
        });
    }

}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        // Biases are shifting numerics
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        Level.#randomize(this);

    }
    // Methods don't serialize(change into a transmittable format such JSON)
    static #randomize(level) {
        // Randomization of weights
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                // this generates a random value of -1 and 1
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        // Randomization of biases
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }
    // Algorithm to obtain input data from the sensors
    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            // Sets the output bias to 1 or 0 (active or inactive) based in the inputs and weight
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}