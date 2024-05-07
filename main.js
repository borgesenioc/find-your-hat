const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        this.originalField = JSON.parse(JSON.stringify(field)); // Save original field layout
        this.playerPos = this.findStartPosition();
    }

    findStartPosition() {
        // Locate the starting position of the player marked by '*'
        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field[y].length; x++) {
                if (this.field[y][x] === pathCharacter) {
                    return { x: x, y: y };
                }
            }
        }
        // Default to top-left corner if no '*' found
        this.field[0][0] = pathCharacter;
        return { x: 0, y: 0 };
    }

    printField() {
        console.clear();  // Clears the console each time the field is printed
        this.field.forEach(row => console.log(row.join('')));
    }

    movePlayer(direction) {
        let newX = this.playerPos.x;
        let newY = this.playerPos.y;

        switch (direction) {
            case 'u':  // up
                newY -= 1;
                break;
            case 'd':  // down
                newY += 1;
                break;
            case 'l':  // left
                newX -= 1;
                break;
            case 'r':  // right
                newX += 1;
                break;
            default:
                console.log('Invalid direction');
                return false;
        }

        if (!this.isValidMove(newX, newY)) {
            console.log("You've gone out of bounds! Let's start over.");
            this.resetGame();
            return false;
        }

        // Update player position on the field
        if (this.field[newY][newX] !== hat) {
            this.field[this.playerPos.y][this.playerPos.x] = fieldCharacter;
        }
        this.playerPos.x = newX;
        this.playerPos.y = newY;
        this.field[this.playerPos.y][this.playerPos.x] = pathCharacter;
        return true;
    }

    isValidMove(x, y) {
        return (
            y >= 0 && y < this.field.length &&
            x >= 0 && x < this.field[y].length
        );
    }

    checkWin() {
        return this.field[this.playerPos.y][this.playerPos.x] === hat;
    }

    resetGame() {
        // Reset the field and player position to the start
        this.field = JSON.parse(JSON.stringify(this.originalField));
        this.playerPos = this.findStartPosition();
    }

    runGame() {
        while (true) {
            this.printField();
            const move = prompt('What is your move? (u, d, l, r): ');
            if (!this.movePlayer(move)) continue;

            if (this.checkWin()) {
                console.log("You've found the hat! Congratulations!");
                break;
            }
        }
    }
}


const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
]);

myField.runGame();
