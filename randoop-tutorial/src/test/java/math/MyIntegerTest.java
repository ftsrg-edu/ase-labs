package math;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class MyIntegerTest {
  @Test
  public void testZero() {
    MyInteger zero = new MyInteger(0);
    MyInteger one = new MyInteger(1);
    MyInteger sum = zero.add(one);
    assertEquals("0+1=1", sum, one);
    sum = one.add(zero);
    assertEquals("1+0=1", sum, one);
    MyInteger prod = zero.multiply(one);
    assertEquals("0*1=0", prod, zero);
    prod = one.multiply(zero);
    assertEquals("1*0=0", prod, zero);
  }

  @Test
  public void testAdd() {
    int a_int = 17;
    int b_int = 42117;
    MyInteger a = new MyInteger(a_int);
    MyInteger b = new MyInteger(b_int);
    MyInteger aPlusB = new MyInteger(a_int + b_int);
    assertEquals("sum is a+b", a.add(b), aPlusB);
    assertEquals("sum is a+b", b.add(a), aPlusB);
  }

  @Test
  public void testOne() {
    MyInteger one = new MyInteger(1);
    MyInteger four = new MyInteger(4);
    MyInteger prod = one.multiply(one);
    assertEquals("1*1=1", prod, one);
    prod = one.multiply(four);
    assertEquals("1*4=4", prod, four);
    prod = four.multiply(one);
    assertEquals("4*1=4", prod, four);
  }

  @Test
  public void testMultiply() {
    int a_int = 17;
    int b_int = 42117;
    MyInteger a = new MyInteger(a_int);
    MyInteger b = new MyInteger(b_int);
    MyInteger aTimesB = new MyInteger(a_int * b_int);
    assertEquals("product is a*b", a.multiply(b), aTimesB);
    assertEquals("product is a*b", b.multiply(a), aTimesB);
  }
}
