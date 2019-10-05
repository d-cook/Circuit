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

function renderAnd(x, y, not, inputs) {
    let len = inputs.length;
    let inputGap = Math.max(spacing, Math.floor(gateSize / (len + 0)));
    let inputTop = y + Math.floor((gateSize - inputGap * (len - 1)) / 2);
    let inputBottom = y + Math.floor((gateSize + inputGap * (len - 1)) / 2);
    return [
        ['closed path',
            x + stubLen, y,
            [x + gateSize/2, y],
            [x + gateSize, y, x + gateSize, y + gateSize/2],
            [x + gateSize, y + gateSize, x + gateSize/2, y + gateSize],
            [x + stubLen, y + gateSize]
        ],
        ['line', x + stubLen, inputTop, x + stubLen, inputBottom],
        (not ? ['circle', x + gateSize + stubLen/2, y + gateSize/2, stubLen/2]
             : ['line', x + gateSize, y + gateSize/2, x + gateSize + stubLen, y + gateSize/2]
         )
    ].concat(inputs.map((v, i) =>
        ['line', x, inputTop + i*inputGap, x + stubLen, inputTop + i*inputGap]
    ));
}

function renderOr(x, y, not, inputs) {
    let len = inputs.length;
    let inputGap = Math.max(spacing, Math.floor(gateSize / (len + 0)));
    let inputTop = y + Math.floor((gateSize - inputGap * (len - 1)) / 2);
    let inputBottom = y + Math.floor((gateSize + inputGap * (len - 1)) / 2);
    return [
        ['path',
            x + stubLen, y,
            [x + gateSize*3/4, y - gateSize/10, x + gateSize, y + gateSize/2],
            [x + gateSize*3/4, y + gateSize*11/10, x + stubLen, y + gateSize],
            [x + stubLen*2, y + gateSize*2/3, x + stubLen*2, y + gateSize/3, x + stubLen, y]
        ],
        ['line', x + stubLen, inputTop, x + stubLen, inputBottom],
        (not ? ['circle', x + gateSize + stubLen/2, y + gateSize/2, stubLen/2]
             : ['line', x + gateSize, y + gateSize/2, x + gateSize + stubLen, y + gateSize/2]
         )
    ].concat(inputs.map((v, i) =>
        ['line', x, inputTop + i*inputGap, x + stubLen, inputTop + i*inputGap]
    ));
}

function renderXOr(x, y, not, inputs) {
    let len = inputs.length;
    let inputGap = Math.max(spacing, Math.floor(gateSize / (len + 0)));
    let inputTop = y + Math.floor((gateSize - inputGap * (len - 1)) / 2);
    let inputBottom = y + Math.floor((gateSize + inputGap * (len - 1)) / 2);
    return [
        ['path',
            x + stubLen + 3, y,
            [x + gateSize*3/4, y, x + gateSize, y + gateSize/2],
            [x + gateSize*3/4, y + gateSize, x + stubLen + 3, y + gateSize],
            [x + stubLen*2 + 3, y + gateSize*2/3, x + stubLen*2 + 3, y + gateSize/3, x + stubLen + 3, y]
        ],
        ['curve', x + stubLen - 1, y + gateSize, x + stubLen*2 - 1, y + gateSize*2/3, x + stubLen*2 -1, y + gateSize/3, x + stubLen - 1, y],
        ['line', x + stubLen, inputTop, x + stubLen, inputBottom],
        (not ? ['circle', x + gateSize + stubLen/2, y + gateSize/2, stubLen/2]
             : ['line', x + gateSize, y + gateSize/2, x + gateSize + stubLen, y + gateSize/2]
         )
    ].concat(inputs.map((v, i) =>
        ['line', x, inputTop + i*inputGap, x + stubLen, inputTop + i*inputGap]
    ));
}

function renderNot(x, y, input) {
    let quarter = Math.floor(gateSize/4);
    return [
        ['closed line',
            x + stubLen, y,
            x + gateSize/2, y + quarter,
            x + stubLen, y + gateSize/2
        ],
        ['circle', x + gateSize/2 + stubLen/2, y + quarter, stubLen/2],
        ['line', x, y + quarter, x + stubLen, y + quarter]
    ];
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
    ui.render(
        ...renderAnd(mouse.x, mouse.y, false, new Array(numInputs).fill(0)),
        ...renderOr(mouse.x+50, mouse.y, false, new Array(numInputs).fill(0)),
        ...renderXOr(mouse.x+100, mouse.y, false, new Array(numInputs).fill(0)),
        ...renderAnd(mouse.x, mouse.y+50, true, new Array(numInputs).fill(0)),
        ...renderOr(mouse.x+50, mouse.y+50, true, new Array(numInputs).fill(0)),
        ...renderXOr(mouse.x+100, mouse.y+50, true, new Array(numInputs).fill(0)),
        ...renderNot(mouse.x, mouse.y-30, 1),
        ...renderCursor(mouse.x, mouse.y)
    );
}