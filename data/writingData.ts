
export interface Point {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
}

export interface WritingStroke {
    path: string; // SVG path data
    checkpoints: Point[]; // Points user must pass
    startPoint: Point; // Visual indicator
}

export interface WritingCharacter {
    id: string;
    char: string;
    strokes: WritingStroke[];
}

export interface WritingWord {
    id: string;
    label: string;
    image?: string; // Optional image for the word
    charIds: string[]; // List of WritingCharacter IDs that make up this word
}

// --- Geometry Helpers ---
const linePoints = (x1: number, y1: number, x2: number, y2: number, steps: number): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= steps; i++) {
        points.push({ x: x1 + (x2 - x1) * (i / steps), y: y1 + (y2 - y1) * (i / steps) });
    }
    return points;
};

const curvePoints = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, steps: number): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
        points.push({ x, y });
    }
    return points;
};

// --- CHARACTER DATA BANK ---
export const WRITING_DATA: WritingCharacter[] = [
    // --- NUMBERS (0-9) ---
    { id: 'num_0', char: '0', strokes: [{ path: "M 50 10 Q 90 10 90 50 Q 90 90 50 90 Q 10 90 10 50 Q 10 10 50 10", startPoint: { x: 50, y: 10 }, checkpoints: [...curvePoints(50,10,90,10,90,50,6), ...curvePoints(90,50,90,90,50,90,6), ...curvePoints(50,90,10,90,10,50,6), ...curvePoints(10,50,10,10,50,10,6)] }] },
    { id: 'num_1', char: '1', strokes: [{ path: "M 40 30 L 50 10 L 50 90", startPoint: { x: 40, y: 30 }, checkpoints: [...linePoints(40,30,50,10,4), ...linePoints(50,10,50,90,10)] }] },
    { id: 'num_2', char: '2', strokes: [{ path: "M 30 30 Q 50 0 70 30 Q 70 50 30 90 L 70 90", startPoint: { x: 30, y: 30 }, checkpoints: [...curvePoints(30,30,50,0,70,30,5), ...curvePoints(70,30,70,50,30,90,8), ...linePoints(30,90,70,90,5)] }] },
    { id: 'num_3', char: '3', strokes: [{ path: "M 30 20 Q 80 10 50 50 Q 80 90 30 80", startPoint: { x: 30, y: 20 }, checkpoints: [...curvePoints(30,20,80,10,50,50,6), ...curvePoints(50,50,80,90,30,80,6)] }] },
    { id: 'num_4', char: '4', strokes: [{ path: "M 60 10 L 20 60 L 80 60", startPoint: { x: 60, y: 10 }, checkpoints: [...linePoints(60,10,20,60,5), ...linePoints(20,60,80,60,5)] }, { path: "M 60 10 L 60 90", startPoint: { x: 60, y: 10 }, checkpoints: linePoints(60,10,60,90,8) }] },
    { id: 'num_5', char: '5', strokes: [{ path: "M 70 10 L 30 10 L 30 40 Q 80 40 80 70 Q 80 90 30 90", startPoint: { x: 70, y: 10 }, checkpoints: [...linePoints(70,10,30,10,4), ...linePoints(30,10,30,40,4), ...curvePoints(30,40,80,40,80,70,5), ...curvePoints(80,70,80,90,30,90,5)] }] },
    { id: 'num_6', char: '6', strokes: [{ path: "M 70 10 Q 20 10 20 50 Q 20 90 50 90 Q 80 90 80 60 Q 80 40 50 40 Q 25 40 25 60", startPoint: { x: 70, y: 10 }, checkpoints: [...curvePoints(70,10,20,10,20,50,6), ...curvePoints(20,50,20,90,50,90,6), ...curvePoints(50,90,80,90,80,60,5), ...curvePoints(80,60,80,40,50,40,4)] }] },
    { id: 'num_7', char: '7', strokes: [{ path: "M 20 10 L 80 10 L 40 90", startPoint: { x: 20, y: 10 }, checkpoints: [...linePoints(20,10,80,10,6), ...linePoints(80,10,40,90,8)] }] },
    { id: 'num_8', char: '8', strokes: [{ path: "M 50 50 Q 20 50 20 25 Q 20 0 50 0 Q 80 0 80 25 Q 80 50 50 50 Q 20 50 20 75 Q 20 100 50 100 Q 80 100 80 75 Q 80 50 50 50", startPoint: { x: 50, y: 50 }, checkpoints: [...curvePoints(50,50,20,50,20,25,4), ...curvePoints(20,25,20,0,50,0,4), ...curvePoints(50,0,80,0,80,25,4), ...curvePoints(80,25,80,50,50,50,4), ...curvePoints(50,50,20,50,20,75,4), ...curvePoints(20,75,20,100,50,100,4), ...curvePoints(50,100,80,100,80,75,4), ...curvePoints(80,75,80,50,50,50,4)] }] },
    { id: 'num_9', char: '9', strokes: [{ path: "M 50 50 Q 20 50 20 25 Q 20 0 50 0 Q 80 0 80 25 Q 80 50 50 50 Q 80 50 80 90", startPoint: { x: 50, y: 50 }, checkpoints: [...curvePoints(50,50,20,50,20,25,5), ...curvePoints(20,25,20,0,50,0,5), ...curvePoints(50,0,80,0,80,25,5), ...curvePoints(80,25,80,50,50,50,5), ...curvePoints(50,50,80,50,80,90,6)] }] },

    // --- ALPHABET (A-Y) ---
    { id: 'char_A', char: 'A', strokes: [
        { path: "M 50 10 L 20 90", startPoint: { x: 50, y: 10 }, checkpoints: linePoints(50, 10, 20, 90, 8) },
        { path: "M 50 10 L 80 90", startPoint: { x: 50, y: 10 }, checkpoints: linePoints(50, 10, 80, 90, 8) },
        { path: "M 30 60 L 70 60", startPoint: { x: 30, y: 60 }, checkpoints: linePoints(30, 60, 70, 60, 5) }
    ]},
    { id: 'char_B', char: 'B', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 30 10 Q 70 10 70 30 Q 70 50 30 50", startPoint: { x: 30, y: 10 }, checkpoints: [...curvePoints(30,10,70,10,70,30,5), ...curvePoints(70,30,70,50,30,50,5)] },
        { path: "M 30 50 Q 80 50 80 70 Q 80 90 30 90", startPoint: { x: 30, y: 50 }, checkpoints: [...curvePoints(30,50,80,50,80,70,5), ...curvePoints(80,70,80,90,30,90,5)] }
    ]},
    { id: 'char_C', char: 'C', strokes: [
        { path: "M 75 20 Q 20 20 20 50 Q 20 80 75 80", startPoint: { x: 75, y: 20 }, checkpoints: [...curvePoints(75,20,20,20,20,50,8), ...curvePoints(20,50,20,80,75,80,8)] }
    ]},
    { id: 'char_D', char: 'D', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 30 10 Q 90 10 90 50 Q 90 90 30 90", startPoint: { x: 30, y: 10 }, checkpoints: [...curvePoints(30,10,90,10,90,50,8), ...curvePoints(90,50,90,90,30,90,8)] }
    ]},
    { id: 'char_DD', char: 'Đ', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 30 10 Q 90 10 90 50 Q 90 90 30 90", startPoint: { x: 30, y: 10 }, checkpoints: [...curvePoints(30,10,90,10,90,50,8), ...curvePoints(90,50,90,90,30,90,8)] },
        { path: "M 20 50 L 40 50", startPoint: { x: 20, y: 50 }, checkpoints: linePoints(20, 50, 40, 50, 3) }
    ]},
    { id: 'char_E', char: 'E', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 30 10 L 80 10", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 80, 10, 6) },
        { path: "M 30 50 L 70 50", startPoint: { x: 30, y: 50 }, checkpoints: linePoints(30, 50, 70, 50, 5) },
        { path: "M 30 90 L 80 90", startPoint: { x: 30, y: 90 }, checkpoints: linePoints(30, 90, 80, 90, 6) }
    ]},
    { id: 'char_G', char: 'G', strokes: [
        { path: "M 75 20 Q 20 20 20 50 Q 20 80 75 80", startPoint: { x: 75, y: 20 }, checkpoints: [...curvePoints(75,20,20,20,20,50,8), ...curvePoints(20,50,20,80,75,80,8)] },
        { path: "M 50 50 L 80 50", startPoint: { x: 50, y: 50 }, checkpoints: linePoints(50, 50, 80, 50, 4) },
        { path: "M 80 50 L 80 80", startPoint: { x: 80, y: 50 }, checkpoints: linePoints(80, 50, 80, 80, 4) }
    ]},
    { id: 'char_H', char: 'H', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 70 10 L 70 90", startPoint: { x: 70, y: 10 }, checkpoints: linePoints(70, 10, 70, 90, 10) },
        { path: "M 30 50 L 70 50", startPoint: { x: 30, y: 50 }, checkpoints: linePoints(30, 50, 70, 50, 5) }
    ]},
    { id: 'char_I', char: 'I', strokes: [
        { path: "M 50 15 L 50 85", startPoint: { x: 50, y: 15 }, checkpoints: linePoints(50, 15, 50, 85, 8) },
        { path: "M 35 15 L 65 15", startPoint: { x: 35, y: 15 }, checkpoints: linePoints(35, 15, 65, 15, 4) },
        { path: "M 35 85 L 65 85", startPoint: { x: 35, y: 85 }, checkpoints: linePoints(35, 85, 65, 85, 4) }
    ]},
    { id: 'char_K', char: 'K', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 70 10 L 30 50", startPoint: { x: 70, y: 10 }, checkpoints: linePoints(70, 10, 30, 50, 6) },
        { path: "M 30 50 L 70 90", startPoint: { x: 30, y: 50 }, checkpoints: linePoints(30, 50, 70, 90, 6) }
    ]},
    { id: 'char_L', char: 'L', strokes: [
        { path: "M 30 10 L 30 90 L 80 90", startPoint: { x: 30, y: 10 }, checkpoints: [...linePoints(30, 10, 30, 90, 8), ...linePoints(30, 90, 80, 90, 6)] }
    ]},
    { id: 'char_M', char: 'M', strokes: [
        { path: "M 20 90 L 20 10", startPoint: { x: 20, y: 90 }, checkpoints: linePoints(20, 90, 20, 10, 10) },
        { path: "M 20 10 L 50 60", startPoint: { x: 20, y: 10 }, checkpoints: linePoints(20, 10, 50, 60, 6) },
        { path: "M 50 60 L 80 10", startPoint: { x: 50, y: 60 }, checkpoints: linePoints(50, 60, 80, 10, 6) },
        { path: "M 80 10 L 80 90", startPoint: { x: 80, y: 10 }, checkpoints: linePoints(80, 10, 80, 90, 10) }
    ]},
    { id: 'char_N', char: 'N', strokes: [
        { path: "M 30 90 L 30 10", startPoint: { x: 30, y: 90 }, checkpoints: linePoints(30, 90, 30, 10, 10) },
        { path: "M 30 10 L 70 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 70, 90, 10) },
        { path: "M 70 90 L 70 10", startPoint: { x: 70, y: 90 }, checkpoints: linePoints(70, 90, 70, 10, 10) }
    ]},
    { id: 'char_O', char: 'O', strokes: [
        { path: "M 50 10 Q 10 10 10 50 Q 10 90 50 90 Q 90 90 90 50 Q 90 10 50 10", startPoint: { x: 50, y: 10 }, checkpoints: [...curvePoints(50,10,10,10,10,50,6), ...curvePoints(10,50,10,90,50,90,6), ...curvePoints(50,90,90,90,90,50,6), ...curvePoints(90,50,90,10,50,10,6)] }
    ]},
    { id: 'char_P', char: 'P', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 30 10 Q 70 10 70 30 Q 70 50 30 50", startPoint: { x: 30, y: 10 }, checkpoints: [...curvePoints(30,10,70,10,70,30,5), ...curvePoints(70,30,70,50,30,50,5)] }
    ]},
    { id: 'char_Q', char: 'Q', strokes: [
        { path: "M 50 10 Q 10 10 10 50 Q 10 90 50 90 Q 90 90 90 50 Q 90 10 50 10", startPoint: { x: 50, y: 10 }, checkpoints: [...curvePoints(50,10,10,10,10,50,6), ...curvePoints(10,50,10,90,50,90,6), ...curvePoints(50,90,90,90,90,50,6), ...curvePoints(90,50,90,10,50,10,6)] },
        { path: "M 60 60 L 80 80", startPoint: { x: 60, y: 60 }, checkpoints: linePoints(60, 60, 80, 80, 4) }
    ]},
    { id: 'char_R', char: 'R', strokes: [
        { path: "M 30 10 L 30 90", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 90, 10) },
        { path: "M 30 10 Q 70 10 70 30 Q 70 50 30 50 L 30 50", startPoint: { x: 30, y: 10 }, checkpoints: [...curvePoints(30,10,70,10,70,30,5), ...curvePoints(70,30,70,50,30,50,5), ...linePoints(30,50,30,50,2)] },
        { path: "M 50 50 L 80 90", startPoint: { x: 50, y: 50 }, checkpoints: linePoints(50, 50, 80, 90, 6) }
    ]},
    { id: 'char_S', char: 'S', strokes: [
        { path: "M 80 20 Q 20 20 50 50 Q 80 80 20 80", startPoint: { x: 80, y: 20 }, checkpoints: [...curvePoints(80,20,20,20,50,50,6), ...curvePoints(50,50,80,80,20,80,6)] }
    ]},
    { id: 'char_T', char: 'T', strokes: [
        { path: "M 20 10 L 80 10", startPoint: { x: 20, y: 10 }, checkpoints: linePoints(20, 10, 80, 10, 8) },
        { path: "M 50 10 L 50 90", startPoint: { x: 50, y: 10 }, checkpoints: linePoints(50, 10, 50, 90, 8) }
    ]},
    { id: 'char_U', char: 'U', strokes: [
        { path: "M 25 10 L 25 70 Q 25 90 50 90 Q 75 90 75 70 L 75 10", startPoint: { x: 25, y: 10 }, checkpoints: [...linePoints(25,10,25,70,6), ...curvePoints(25,70,25,90,50,90,4), ...curvePoints(50,90,75,90,75,70,4), ...linePoints(75,70,75,10,6)] }
    ]},
    { id: 'char_V', char: 'V', strokes: [
        { path: "M 20 10 L 50 90 L 80 10", startPoint: { x: 20, y: 10 }, checkpoints: [...linePoints(20,10,50,90,6), ...linePoints(50,90,80,10,6)] }
    ]},
    { id: 'char_X', char: 'X', strokes: [
        { path: "M 20 10 L 80 90", startPoint: { x: 20, y: 10 }, checkpoints: linePoints(20, 10, 80, 90, 8) },
        { path: "M 80 10 L 20 90", startPoint: { x: 80, y: 10 }, checkpoints: linePoints(80, 10, 20, 90, 8) }
    ]},
    { id: 'char_Y', char: 'Y', strokes: [
        { path: "M 20 10 L 50 50", startPoint: { x: 20, y: 10 }, checkpoints: linePoints(20, 10, 50, 50, 5) },
        { path: "M 80 10 L 20 90", startPoint: { x: 80, y: 10 }, checkpoints: linePoints(80, 10, 20, 90, 8) }
    ]},

    // --- SPECIAL ACCENTS & COMBOS ---
    { id: 'char_OO', char: 'Ô', strokes: [
        { path: "M 50 10 Q 10 10 10 50 Q 10 90 50 90 Q 90 90 90 50 Q 90 10 50 10", startPoint: { x: 50, y: 10 }, checkpoints: [...curvePoints(50,10,10,10,10,50,6), ...curvePoints(10,50,10,90,50,90,6), ...curvePoints(50,90,90,90,90,50,6), ...curvePoints(90,50,90,10,50,10,6)] },
        { path: "M 35 5 L 50 0 L 65 5", startPoint: { x: 35, y: 5 }, checkpoints: [...linePoints(35,5,50,0,2), ...linePoints(50,0,65,5,2)] } // ^
    ]},
    { id: 'char_OO_SAC', char: 'Ố', strokes: [
        { path: "M 50 25 Q 10 25 10 60 Q 10 95 50 95 Q 90 95 90 60 Q 90 25 50 25", startPoint: { x: 50, y: 25 }, checkpoints: [...curvePoints(50,25,10,25,10,60,6), ...curvePoints(10,60,10,95,50,95,6), ...curvePoints(50,95,90,95,90,60,6), ...curvePoints(90,60,90,25,50,25,6)] },
        { path: "M 35 20 L 50 5", startPoint: { x: 35, y: 20 }, checkpoints: linePoints(35, 20, 50, 5, 3) }, // ^ up
        { path: "M 50 5 L 65 20", startPoint: { x: 50, y: 5 }, checkpoints: linePoints(50, 5, 65, 20, 3) }, // ^ down
        { path: "M 70 5 L 85 15", startPoint: { x: 70, y: 5 }, checkpoints: linePoints(70, 5, 85, 15, 3) }  // ' (sac)
    ]},
    { id: 'char_E_NANG', char: 'Ẹ', strokes: [
        { path: "M 30 10 L 30 80", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 30, 80, 8) },
        { path: "M 30 10 L 80 10", startPoint: { x: 30, y: 10 }, checkpoints: linePoints(30, 10, 80, 10, 6) },
        { path: "M 30 45 L 70 45", startPoint: { x: 30, y: 45 }, checkpoints: linePoints(30, 45, 70, 45, 5) },
        { path: "M 30 80 L 80 80", startPoint: { x: 30, y: 80 }, checkpoints: linePoints(30, 80, 80, 80, 6) },
        { path: "M 50 90 L 50 95", startPoint: { x: 50, y: 90 }, checkpoints: linePoints(50, 90, 50, 95, 2) }
    ]},
    { id: 'char_A_NANG', char: 'Ạ', strokes: [
        { path: "M 50 10 L 20 80", startPoint: { x: 50, y: 10 }, checkpoints: linePoints(50, 10, 20, 80, 8) },
        { path: "M 50 10 L 80 80", startPoint: { x: 50, y: 10 }, checkpoints: linePoints(50, 10, 80, 80, 8) },
        { path: "M 30 55 L 70 55", startPoint: { x: 30, y: 55 }, checkpoints: linePoints(30, 55, 70, 55, 5) },
        { path: "M 50 90 L 50 95", startPoint: { x: 50, y: 90 }, checkpoints: linePoints(50, 90, 50, 95, 2) }
    ]},
    { id: 'char_A_HOI', char: 'Ả', strokes: [
        { path: "M 50 25 L 20 90", startPoint: { x: 50, y: 25 }, checkpoints: linePoints(50, 25, 20, 90, 8) },
        { path: "M 50 25 L 80 90", startPoint: { x: 50, y: 25 }, checkpoints: linePoints(50, 25, 80, 90, 8) },
        { path: "M 30 65 L 70 65", startPoint: { x: 30, y: 65 }, checkpoints: linePoints(30, 65, 70, 65, 5) },
        { path: "M 45 10 Q 55 0 60 10 Q 55 15 50 10", startPoint: { x: 45, y: 10 }, checkpoints: [...curvePoints(45,10,55,0,60,10,4), ...curvePoints(60,10,55,15,50,10,4)] }
    ]},
    { id: 'char_A_HUYEN', char: 'À', strokes: [
        { path: "M 50 25 L 20 90", startPoint: { x: 50, y: 25 }, checkpoints: linePoints(50, 25, 20, 90, 8) },
        { path: "M 50 25 L 80 90", startPoint: { x: 50, y: 25 }, checkpoints: linePoints(50, 25, 80, 90, 8) },
        { path: "M 30 65 L 70 65", startPoint: { x: 30, y: 65 }, checkpoints: linePoints(30, 65, 70, 65, 5) },
        { path: "M 35 5 L 65 15", startPoint: { x: 35, y: 5 }, checkpoints: linePoints(35, 5, 65, 15, 3) } // `
    ]},
    { id: 'char_EE', char: 'Ê', strokes: [
        { path: "M 30 25 L 30 90", startPoint: { x: 30, y: 25 }, checkpoints: linePoints(30, 25, 30, 90, 8) },
        { path: "M 30 25 L 80 25", startPoint: { x: 30, y: 25 }, checkpoints: linePoints(30, 25, 80, 25, 6) },
        { path: "M 30 55 L 70 55", startPoint: { x: 30, y: 55 }, checkpoints: linePoints(30, 55, 70, 55, 5) },
        { path: "M 30 90 L 80 90", startPoint: { x: 30, y: 90 }, checkpoints: linePoints(30, 90, 80, 90, 6) },
        { path: "M 35 15 L 50 5", startPoint: { x: 35, y: 15 }, checkpoints: linePoints(35, 15, 50, 5, 3) }, // ^
        { path: "M 50 5 L 65 15", startPoint: { x: 50, y: 5 }, checkpoints: linePoints(50, 5, 65, 15, 3) }
    ]},
    { id: 'char_UW', char: 'Ư', strokes: [
        { path: "M 25 10 L 25 70 Q 25 90 50 90 Q 75 90 75 70 L 75 10", startPoint: { x: 25, y: 10 }, checkpoints: [...linePoints(25,10,25,70,6), ...curvePoints(25,70,25,90,50,90,4), ...curvePoints(50,90,75,90,75,70,4), ...linePoints(75,70,75,10,6)] },
        { path: "M 75 10 Q 85 10 80 25", startPoint: { x: 75, y: 10 }, checkpoints: curvePoints(75, 10, 85, 10, 80, 25, 4) }
    ]},
    { id: 'char_OW', char: 'Ơ', strokes: [
        { path: "M 50 10 Q 10 10 10 50 Q 10 90 50 90 Q 90 90 90 50 Q 90 10 50 10", startPoint: { x: 50, y: 10 }, checkpoints: [...curvePoints(50,10,10,10,10,50,6), ...curvePoints(10,50,10,90,50,90,6), ...curvePoints(50,90,90,90,90,50,6), ...curvePoints(90,50,90,10,50,10,6)] },
        { path: "M 80 15 Q 95 10 90 30", startPoint: { x: 80, y: 15 }, checkpoints: curvePoints(80, 15, 95, 10, 90, 30, 4) }
    ]}
];

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets/images/chucai';

export const WRITING_WORDS: { category: string, words: WritingWord[] }[] = [
    {
        category: "Tên Của Bé",
        words: [
            { id: 'word_khue', label: 'KHUÊ', charIds: ['char_K', 'char_H', 'char_U', 'char_EE'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/gom-sac.png' },
            { id: 'word_khai', label: 'KHẢI', charIds: ['char_K', 'char_H', 'char_A_HOI', 'char_I'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/gao-nang.png' },
        ]
    },
    {
        category: "Số Điện Thoại & Khẩn Cấp",
        words: [
            {
                id: 'phone_ba',
                label: 'SĐT BA',
                // 0977 670 306
                charIds: ['num_0', 'num_9', 'num_7', 'num_7', 'num_6', 'num_7', 'num_0', 'num_3', 'num_0', 'num_6'],
                image: 'https://be-gom-vui-hoc.vercel.app/assets/images/ba-cuong.png'
            },
            {
                id: 'phone_me',
                label: 'SĐT MẸ',
                // 082 221 7493
                charIds: ['num_0', 'num_8', 'num_2', 'num_2', 'num_2', 'num_1', 'num_7', 'num_4', 'num_9', 'num_3'],
                image: 'https://be-gom-vui-hoc.vercel.app/assets/images/me-huong.png'
            },
            {
                id: 'sos_police',
                label: 'CẢNH SÁT (113)',
                charIds: ['num_1', 'num_1', 'num_3'],
                image: 'https://be-gom-vui-hoc.vercel.app/assets/images/customer-police.png'
            },
            {
                id: 'sos_fire',
                label: 'CỨU HỎA (114)',
                charIds: ['num_1', 'num_1', 'num_4'],
                image: 'https://be-gom-vui-hoc.vercel.app/assets/images/english/english_firefighter.png'
            },
            {
                id: 'sos_ambulance',
                label: 'CẤP CỨU (115)',
                charIds: ['num_1', 'num_1', 'num_5'],
                image: 'https://be-gom-vui-hoc.vercel.app/assets/images/english/english_doctor.png'
            }
        ]
    },
    {
        category: "Gia Đình",
        words: [
            { id: 'word_gom', label: 'GỐM', charIds: ['char_G', 'char_OO_SAC', 'char_M'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/gom-sac.png' },
            { id: 'word_gao', label: 'GẠO', charIds: ['char_G', 'char_A_NANG', 'char_O'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/gao-nang.png' },
            { id: 'word_ba', label: 'BA', charIds: ['char_B', 'char_A'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/ba-cuong.png' },
            { id: 'word_me', label: 'MẸ', charIds: ['char_M', 'char_E_NANG'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/me-huong.png' },
            { id: 'word_ong', label: 'ÔNG', charIds: ['char_OO', 'char_N', 'char_G'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/ong-khoa.png' },
            { id: 'word_ba_huyen', label: 'BÀ', charIds: ['char_B', 'char_A_HUYEN'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/ba-thom.png' },
            { id: 'word_em', label: 'EM', charIds: ['char_E', 'char_M'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/customer-gao.png' },
            { id: 'word_cuong', label: 'CƯƠNG', charIds: ['char_C', 'char_UW', 'char_OW', 'char_N', 'char_G'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/ba-cuong.png' },
            { id: 'word_huong', label: 'HƯƠNG', charIds: ['char_H', 'char_UW', 'char_OW', 'char_N', 'char_G'], image: 'https://be-gom-vui-hoc.vercel.app/assets/images/me-huong.png' }
        ]
    },
    {
        category: "Chữ Số",
        words: [
            { id: 'num_0', label: '0', charIds: ['num_0'], image: `${ASSET_BASE_URL}/img_num_0.png` },
            { id: 'num_1', label: '1', charIds: ['num_1'], image: `${ASSET_BASE_URL}/img_num_1.png` },
            { id: 'num_2', label: '2', charIds: ['num_2'], image: `${ASSET_BASE_URL}/img_num_2.png` },
            { id: 'num_3', label: '3', charIds: ['num_3'], image: `${ASSET_BASE_URL}/img_num_3.png` },
            { id: 'num_4', label: '4', charIds: ['num_4'], image: `${ASSET_BASE_URL}/img_num_4.png` },
            { id: 'num_5', label: '5', charIds: ['num_5'], image: `${ASSET_BASE_URL}/img_num_5.png` },
            { id: 'num_6', label: '6', charIds: ['num_6'], image: `${ASSET_BASE_URL}/img_num_6.png` },
            { id: 'num_7', label: '7', charIds: ['num_7'], image: `${ASSET_BASE_URL}/img_num_7.png` },
            { id: 'num_8', label: '8', charIds: ['num_8'], image: `${ASSET_BASE_URL}/img_num_8.png` },
            { id: 'num_9', label: '9', charIds: ['num_9'], image: `${ASSET_BASE_URL}/img_num_9.png` },
        ]
    },
    {
        category: "Bảng Chữ Cái",
        words: [
            { id: 'char_a', label: 'A', charIds: ['char_A'], image: `${ASSET_BASE_URL}/img_char_a.png` },
            { id: 'char_b', label: 'B', charIds: ['char_B'], image: `${ASSET_BASE_URL}/img_char_b.png` },
            { id: 'char_c', label: 'C', charIds: ['char_C'], image: `${ASSET_BASE_URL}/img_char_c.png` },
            { id: 'char_d', label: 'D', charIds: ['char_D'], image: `${ASSET_BASE_URL}/img_char_d.png` },
            { id: 'char_e', label: 'E', charIds: ['char_E'], image: `${ASSET_BASE_URL}/img_char_e.png` },
            { id: 'char_g', label: 'G', charIds: ['char_G'], image: `${ASSET_BASE_URL}/img_char_g.png` },
            { id: 'char_h', label: 'H', charIds: ['char_H'], image: `${ASSET_BASE_URL}/img_char_h.png` },
            { id: 'char_i', label: 'I', charIds: ['char_I'], image: `${ASSET_BASE_URL}/img_char_i.png` },
            { id: 'char_k', label: 'K', charIds: ['char_K'], image: `${ASSET_BASE_URL}/img_char_k.png` },
            { id: 'char_l', label: 'L', charIds: ['char_L'], image: `${ASSET_BASE_URL}/img_char_l.png` },
            { id: 'char_m', label: 'M', charIds: ['char_M'], image: `${ASSET_BASE_URL}/img_char_m.png` },
            { id: 'char_n', label: 'N', charIds: ['char_N'], image: `${ASSET_BASE_URL}/img_char_n.png` },
            { id: 'char_o', label: 'O', charIds: ['char_O'], image: `${ASSET_BASE_URL}/img_char_o.png` },
            { id: 'char_p', label: 'P', charIds: ['char_P'], image: `${ASSET_BASE_URL}/img_char_p.png` },
            { id: 'char_q', label: 'Q', charIds: ['char_Q'], image: `${ASSET_BASE_URL}/img_char_q.png` },
            { id: 'char_r', label: 'R', charIds: ['char_R'], image: `${ASSET_BASE_URL}/img_char_r.png` },
            { id: 'char_s', label: 'S', charIds: ['char_S'], image: `${ASSET_BASE_URL}/img_char_s.png` },
            { id: 'char_t', label: 'T', charIds: ['char_T'], image: `${ASSET_BASE_URL}/img_char_t.png` },
            { id: 'char_u', label: 'U', charIds: ['char_U'], image: `${ASSET_BASE_URL}/img_char_u.png` },
            { id: 'char_v', label: 'V', charIds: ['char_V'], image: `${ASSET_BASE_URL}/img_char_v.png` },
            { id: 'char_x', label: 'X', charIds: ['char_X'], image: `${ASSET_BASE_URL}/img_char_x.png` },
            { id: 'char_y', label: 'Y', charIds: ['char_Y'], image: `${ASSET_BASE_URL}/img_char_y.png` },
        ]
    }
];
