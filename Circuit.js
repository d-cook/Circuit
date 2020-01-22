// Paste "Renderer 2.0.0" code HERE ( https://github.com/d-cook/Render/releases/tag/2.0.0 )

let ui = Renderer('top left', { baseline: 'top' });
ui.getCanvas().style.cursor = 'none';
ui.fitToWindow();

ui.onMouseMove((x, y) => {
    mouse = { x, y };
    renderAll();
});

ui.onMouseDown((x, y) => {
    numInputs = 2 + ((numInputs - 1) % 9);
    renderAll();
});

let stubLen = 6;
let spacing = 5;
let numInputs = 2;
let gateSize = 30;
let mouse = { x: 0, y: 0 };

function Value(val) {
    val = Array.isArray(val) ? val[0] : val;
    let state = (typeof val === 'function') ? val : () => !!val;
    return {
        state    : state,
        propagate: () => { },
        update   : () => { },
        getSize: () => ({
            w: gateSize/2 + stubLen + 1,
            h: gateSize/2
        }),
        render: (x, y, not) => {
            let stateColor = (!not === state()) ? 'red' : 'black';
            let quarter    = Math.floor(gateSize/4);
            return [
                [stateColor + ' rect', x, y, gateSize/2, gateSize/2],
                (not ? [stateColor + ' circle', x + gateSize/2 + stubLen/2, y + quarter, stubLen/2]
                     : [stateColor + ' line', x + gateSize/2, y + quarter, x + gateSize/2 + stubLen, y + quarter]
                 )
            ];
        }
    };
}

function Gate(inputs, compute) {
    inputs = Array.isArray(inputs) ? inputs : [];
    inputs = inputs.map(i => Object.assign(Value(i), i));
    let len       = inputs.length;
    let inputGap  = Math.max(spacing, Math.floor(gateSize / (len + 0)));
    let currState = false;
    let nextState = false;
    let isUpdated = false;
    return {
        state      : () => currState,
        inputStates: () => inputs.map(i => i.state()),
        propagate  : () => {
            if (isUpdated) {
                isUpdated = false;
                inputs.forEach(i => i.propagate());
                let states = inputs.map(i => i.state());
                nextState = compute(states);
            }
        },
        update: () => {
            if (!isUpdated) {
                isUpdated = true;
                currState = nextState;
                inputs.forEach(i => i.update());
            }
        },
        getSize: () => ({
            w: gateSize + stubLen + 1,
            h: Math.max(gateSize, inputGap * (len - 1) + 1)
        }),
        render: (x, y, not) => []
    };
}

function And(inputs) {
    let gate = Gate(inputs, states => states.every(s => s));
    let len  = gate.inputStates().length;
    return Object.assign(gate, {
        render: (x, y, not) => {
            let stateColor  = (!not === gate.state()) ? 'red' : 'black';
            let inputGap    = Math.max(spacing, Math.floor(gateSize / (len + 0)));
            let inputHeight = inputGap * (len - 1);
            let topOffset   = Math.floor((gateSize - inputHeight) / 2);
            let inputTop    = y + Math.max(0, topOffset);
            y               = y - Math.min(0, topOffset);
            return [
                [stateColor + ' closed path',
                    x + stubLen, y,
                    [x + gateSize/2, y],
                    [x + gateSize, y, x + gateSize, y + gateSize/2],
                    [x + gateSize, y + gateSize, x + gateSize/2, y + gateSize],
                    [x + stubLen, y + gateSize]
                ],
                [stateColor + ' line', x + stubLen, inputTop, x + stubLen, inputTop + inputHeight],
                (not ? [stateColor + ' circle', x + gateSize + stubLen/2, y + gateSize/2, stubLen/2]
                     : [stateColor + ' line', x + gateSize, y + gateSize/2, x + gateSize + stubLen, y + gateSize/2]
                 )
            ].concat(gate.inputStates().map((v, i) =>
                [(v ? 'red line' : 'line'), x, inputTop + i*inputGap, x + stubLen, inputTop + i*inputGap]
            ));
        }
    });
}

function Or(inputs) {
    let gate = Gate(inputs, states => states.some(s => s));
    let len  = gate.inputStates().length;
    return Object.assign(gate, {
        render: (x, y, not) => {
            let stateColor  = (!not === gate.state()) ? 'red' : 'black';
            let inputGap    = Math.max(spacing, Math.floor(gateSize / (len + 0)));
            let inputHeight = inputGap * (len - 1);
            let topOffset   = Math.floor((gateSize - inputHeight) / 2);
            let inputTop    = y + Math.max(0, topOffset);
            y               = y - Math.min(0, topOffset);
            return [
                [stateColor + ' path',
                    x + stubLen, y,
                    [x + gateSize*3/4, y - gateSize/10, x + gateSize, y + gateSize/2],
                    [x + gateSize*3/4, y + gateSize*11/10, x + stubLen, y + gateSize],
                    [x + stubLen*2, y + gateSize*2/3, x + stubLen*2, y + gateSize/3, x + stubLen, y]
                ],
                [stateColor + ' line', x + stubLen, inputTop, x + stubLen, inputTop + inputHeight],
                (not ? [stateColor + ' circle', x + gateSize + stubLen/2, y + gateSize/2, stubLen/2]
                     : [stateColor + ' line', x + gateSize, y + gateSize/2, x + gateSize + stubLen, y + gateSize/2]
                 )
            ].concat(gate.inputStates().map((v, i) =>
                [(v ? 'red line' : 'line'), x, inputTop + i*inputGap, x + stubLen, inputTop + i*inputGap]
            ));
        }
    });
}

function XOr(inputs) {
    let gate = Gate(inputs, states => states.reduce((r, s) => s ? !r : r, false));
    let len  = gate.inputStates().length;
    return Object.assign(gate, {
        render: (x, y, not) => {
            let stateColor  = (!not === gate.state()) ? 'red' : 'black';
            let inputGap    = Math.max(spacing, Math.floor(gateSize / (len + 0)));
            let inputHeight = inputGap * (len - 1);
            let topOffset   = Math.floor((gateSize - inputHeight) / 2);
            let inputTop    = y + Math.max(0, topOffset);
            y               = y - Math.min(0, topOffset);
            return [
                [stateColor + ' path',
                    x + stubLen + 3, y,
                    [x + gateSize*3/4, y, x + gateSize, y + gateSize/2],
                    [x + gateSize*3/4, y + gateSize, x + stubLen + 3, y + gateSize],
                    [x + stubLen*2 + 3, y + gateSize*2/3, x + stubLen*2 + 3, y + gateSize/3, x + stubLen + 3, y]
                ],
                [stateColor + ' curve', x + stubLen - 1, y + gateSize, x + stubLen*2 - 1, y + gateSize*2/3, x + stubLen*2 -1, y + gateSize/3, x + stubLen - 1, y],
                [stateColor + ' line', x + stubLen, inputTop, x + stubLen, inputTop + inputHeight],
                (not ? [stateColor + ' circle', x + gateSize + stubLen/2, y + gateSize/2, stubLen/2]
                     : [stateColor + ' line', x + gateSize, y + gateSize/2, x + gateSize + stubLen, y + gateSize/2]
                 )
            ].concat(gate.inputStates().map((v, i) =>
                [(v ? 'red line' : 'line'), x, inputTop + i*inputGap, x + stubLen, inputTop + i*inputGap]
            ));
        }
    });
}

function Not(input) {
    let inputs = Array.isArray(input) ? input.slice(0, 1) : [input];
    let gate = Gate(inputs, states => !states[0]);
    return Object.assign(gate, {
        getSize: () => ({
            w: gateSize/2 + stubLen + 1,
            h: gateSize/2
        }),
        render: (x, y, not) => {
            let stateColor = gate.state() ? 'red' : 'black';
            let quarter    = Math.floor(gateSize/4);
            let inputState = gate.inputStates()[0];
            return [
                [stateColor + ' closed line',
                    x + stubLen, y,
                    x + gateSize/2, y + quarter,
                    x + stubLen, y + gateSize/2
                ],
                [stateColor + ' circle', x + gateSize/2 + stubLen/2, y + quarter, stubLen/2],
                [(inputState ? 'red line' : 'line'), x, y + quarter, x + stubLen, y + quarter]
            ];
        }
    });
}

function renderCursor(x, y) {
    return [
        ['red line', x-5, y, x+5, y],
        ['red line', x, y-5, x, y+5],
        ['red circle', x, y, 3]
    ];
}

function renderAll() {
    // Hard-coded entities based on mouse position, for now:
    let gates = [And, Or, XOr, Not, Value].map(g => g(new Array(numInputs).fill(0).map(s => Math.random() < 0.5)));
    gates.forEach(g => { g.update(); g.propagate(); g.update(); });
    let content = [].concat(
        ...gates.map(g => g.getSize()).map((s, i) => [['filled #EEE rect', mouse.x + 55*i, mouse.y, s.w, s.h]]),
        ...gates.map(g => g.getSize()).map((s, i) => [['filled #EEE rect', mouse.x + 55*i, mouse.y+55, s.w, s.h]]),
        ...gates.map((g, i) => g.render(mouse.x + 55*i, mouse.y, false)),
        ...gates.map((g, i) => g.render(mouse.x + 55*i, mouse.y+55, true)),
        renderCursor(mouse.x, mouse.y)
    );
    ui.render(...content);
}