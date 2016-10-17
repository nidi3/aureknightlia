import {inject} from 'aurelia-framework';
import {Highscore} from './highscore';

@inject(Highscore)
export class App {
  boardSize = 8;
  moves: number;
  knight: {x: number,y: number};
  visited: {};
  high: number;
  message: string;

  constructor(private highscore: Highscore) {
    this.init();
  }

  init() {
    this.message = 'Good Luck!';
    this.moves = 0;
    this.visited = {};
    for (let x = 0; x < this.boardSize; x++) {
      this.visited[x] = {};
      for (let y = 0; y < this.boardSize; y++) {
        this.visited[x][y] = false;
      }
    }
    let x = Math.floor(Math.random() * this.boardSize);
    let y = Math.floor(Math.random() * this.boardSize);
    this.set(x, y);
  }

  set(x: number, y: number) {
    this.knight = {x: x, y: y};
    this.visit(x, y, true);
    this.moves++;
    this.high = this.highscore.update(this.moves);
  }

  sizeChanged(){
    this.init();
  }

  private visit(x, y, visited) {
    this.visited[x][y] = visited;
  }

  isVisited(x: number, y: number) {
    return this.visited[x][y];
  }

  moveTo(x: number, y: number) {
    this.message = '';
    if (this.visited[x][y]) {
      return;
    }
    let dx = Math.abs(x - this.knight.x);
    let dy = Math.abs(y - this.knight.y);
    if ((dx == 1 || dx == 2) && dx + dy == 3) {
      this.set(x, y);
    }
    if (this.validMoves() === 0) {
      this.message = (this.moves === this.boardSize * this.boardSize ? 'Congratulations!' : 'Game over!');
    }
  }

  validMoves() {
    return this.validMove(2, 1) + this.validMove(1, 2) + this.validMove(-2, 1) + this.validMove(-1, 2) +
      this.validMove(2, -1) + this.validMove(1, -2) + this.validMove(-2, -1) + this.validMove(-1, -2);
  }


  hint() {
    let instance = this;
    var min = 10;
    var bestDx, bestDy;
    test(2, 1);
    test(1, 2);
    test(-2, 1);
    test(-1, 2);
    test(2, -1);
    test(1, -2);
    test(-2, -1);
    test(-1, -2);

    this.moveTo(this.knight.x + bestDx, this.knight.y + bestDy);

    function test(dx, dy) {
      let pa = instance.validMovesAfter(dx, dy);
      if (pa === 0) {
        pa = 9;
      }
      if (pa > 0 && pa < min) {
        min = pa;
        bestDx = dx;
        bestDy = dy;
      }
    }

  }

  validMovesAfter(dx, dy) {
    if (this.validMove(dx, dy) === 0) {
      return -1;
    }
    this.knight = {x: this.knight.x + dx, y: this.knight.y + dy};
    this.visit(this.knight.x, this.knight.y, true);
    let result = this.validMoves();
    this.visit(this.knight.x, this.knight.y, false);
    this.knight = {x: this.knight.x - dx, y: this.knight.y - dy};
    return result;
  }


  validMove(dx, dy): number {
    let x = this.knight.x + dx;
    let y = this.knight.y + dy;
    return (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && !this.isVisited(x, y)) ? 1 : 0;
  }

}
