#include <stdio.h>
#include <math.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>
#include <stdbool.h>
#include <time.h>
#include <unistd.h>
#include <limits.h>
#include <float.h>
#include <errno.h>
#include <stdint.h>
#include <inttypes.h>
#include <stddef.h>
#include <assert.h>

int main(void);
int n = get_int("Number: ");
{
    for (n>=0 ; n--)
    {
        printf("#");
    }
    printf("\n");
    return 0;
}     
