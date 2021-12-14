const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/5.txt')).toString();

const lines = input
    .split('\n')
    .map((str) => str.trim())
    .filter(Boolean)
    // Convert "123,456 -> 789,654" into [[123,456],[789,654]]
    .map((str) => str.trim().split(' -> ').map((part) => part.split(',').map((nstr) => parseInt(nstr))));


const calculateGrid = (ignoreDiagonal) => {
    const emptyLine = () => new Array(1000).fill(0);
    const grid = new Array(1000).fill(null).map(emptyLine);

    for (const line of lines) {
        const [ fromX, fromY ] = line[0];
        const [ toX, toY ] = line[1];
        if (ignoreDiagonal && fromX !== toX && fromY !== toY) continue;
        let x = fromX;
        let y = fromY;
        for(;;) {
            grid[y][x]++;
            if (x === toX && y === toY) break;
            if (x > toX) x--;
            if (x < toX) x++;
            if (y > toY) y--;
            if (y < toY) y++;
        }
    }
    return grid;
}

{
    // Part 1
    const grid = calculateGrid(true);
    const numHigherThan2 = grid.flat().filter((n) => n > 1).length;
    console.log('Part 1', { numHigherThan2 });
}

{
    // Part 2
    const grid = calculateGrid(false);
    const numHigherThan2 = grid.flat().filter((n) => n > 1).length;
    console.log('Part 2', { numHigherThan2 });
}
