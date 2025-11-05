# Set the minimum required version of CMake
cmake_minimum_required(VERSION 3.10)

# Define the project name
project(gmp_bridge)

# Find the precompiled libgmp.so we placed in the jniLibs folder.
add_library(gmp SHARED IMPORTED)
set_target_properties(gmp PROPERTIES IMPORTED_LOCATION
    ${CMAKE_SOURCE_DIR}/../android/app/src/main/jniLibs/${ANDROID_ABI}/libgmp.so)

# Compile our gmp_bridge.c file into its own shared library, libgmp_bridge.so
add_library(gmp_bridge SHARED gmp_bridge.c)

# vvv THIS IS THE NEW LINE vvv
# Tell the compiler where to find the gmp.h header file.
target_include_directories(gmp_bridge PRIVATE
    /home/kayrugold/development/thirdpartylibs/gmp-6.3.0/build/include)

# Link our new bridge library against the precompiled gmp library.
target_link_libraries(gmp_bridge gmp)
