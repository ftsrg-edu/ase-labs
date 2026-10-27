package math;

import java.util.Objects;

/** v0 */
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
    return new MyInteger(this.value * other.value);
  }

  public int getIntValue() {
    return value;
  }
}
