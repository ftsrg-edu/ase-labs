#include<stdio.h>
int main() {
  char i;
  printf("Give me i: ");
  scanf("%hhd", &i);
  char j = i + 1;
  if(!(j > i)) printf("Assertion violation!\n");
}
