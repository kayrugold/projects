#include <gmp.h>
#include <stdlib.h>

// This attribute makes the function visible to Dart's FFI.
__attribute__((visibility("default"))) __attribute__((used))
// Returns the GMP library version string.
const char* get_gmp_version() {
    return gmp_version;
}

// A more complex example: calculate 2^256 - 1.
__attribute__((visibility("default"))) __attribute__((used))
const char* calculate_big_number() {
    mpz_t result;
    mpz_init(result);

    // Calculate 2 to the power of 256
    mpz_ui_pow_ui(result, 2, 256);

    // Subtract 1
    mpz_sub_ui(result, result, 1);

    // Convert the huge number to a string.
    // GMP allocates memory for this string, and our Dart code
    // will be responsible for freeing it later.
    char* result_str = mpz_get_str(NULL, 10, result);

    mpz_clear(result);

    return result_str;
}
