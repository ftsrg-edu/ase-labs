void reach_error();

_Bool __VERIFIER_nondet_bool();
int __VERIFIER_nondet_int();

void f(int d) {
  int x = __VERIFIER_nondet_int(), y = __VERIFIER_nondet_int(), k = __VERIFIER_nondet_int(), z = 1;
  L1:
  while (z < k) { z = 2 * z; }
  if(!(z>=2)) reach_error();
  L2:
  while (x > 0 && y > 0) {
    _Bool c = __VERIFIER_nondet_bool();
    if (c) {
      P1:
      x = x - d;
      if (z > 0) {
        z = z - 1;
      }
    } else {
      y = y - d;
    }
  }
  if(x > 0 && y > 0) reach_error();
}

int main() {
  _Bool c = __VERIFIER_nondet_bool();
  if (c) {
    f(1);
  } else {
    f(2);
  }

  return 0;
}
