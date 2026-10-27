package math;

/** buggy version */
public class MyInteger {

  private final int value;

  @Override
  public boolean equals(Object other) {
    if (other instanceof MyInteger) {
      return true;
    }
    return false;
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
