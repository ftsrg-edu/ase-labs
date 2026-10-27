package math;

import java.util.Objects;

/** v1 */
public class MyInteger {

  private final int value;

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof MyInteger) {
      MyInteger other = (MyInteger)obj;
      return this.value == other.value;
    }
    return false;
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.value);
  }

  @Override
  public String toString() {
    return Integer.toString(value);
  }

  private MyInteger() {
    this.value = 0;
  }

  public MyInteger(int value) {
    this.value = value;
  }

  public MyInteger add(MyInteger other) {
    return new MyInteger(this.value + other.value);
  }

  public MyInteger multiply(MyInteger other) {
    // Always multiply positive numbers, negate later.
    boolean negative = false;
    negative = negative || this.value < 0;
    int absThis = Math.abs(this.value);
    negative = negative || other.value < 0;
    int absOther = Math.abs(other.value);
    int absProduct = absThis * absOther;
    if (negative) {
      return new MyInteger(-1 * absProduct);
    } else {
      return new MyInteger(absProduct);
    }
  }

  public int getIntValue() {
    return value;
  }
}
