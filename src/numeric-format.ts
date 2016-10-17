export class NumericFormatValueConverter {
  fromView(value) {
    let p = parseInt(value);
    return p >= 4 && p <= 10 ? p : 8;
  }
}
