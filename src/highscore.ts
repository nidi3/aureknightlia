export class Highscore {
  private high: number;

  constructor() {
    this.high = +(localStorage.getItem('highscore') || 0);
  }

  update(score: number) {
    if (score > this.high) {
      this.high = score;
      localStorage.setItem('highscore', '' + score);
    }
    return this.high;
  }
}
