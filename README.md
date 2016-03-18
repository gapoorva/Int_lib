ABOUT Int_lib:
-------------

Int_lib is a javascript library for representing arbitrarily large numbers. The
API currently extends basic arithmetic operations on Int objects. Javascript can
represent values up to 2^53-1 accurately in it's Native number object. While this
is more than sufficient for most applications, certain uses like cryptography are
not possible with native types. In industry, RSA an public modulus is 512 bits!

To tackle this issue, Int_lib provides the abstraction of a large number that can
grow aribitrarily large (limited mostly by the amount of memory available on a
machine). It uses an array of native js Number objects to represent large numbers
and focuses on manipulating representation accurately and with high performance.

I created the Int_lib library with the intention of using it for a personal project: a web application that required use of RSA. More information at www.apoorvagupta.com


BASIC BUILD INSTRUCTIONS:
--------------------------

$ cd Int_lib
$ bash build

The above command will build a production-ready version called "Int.min.js". It
will also create a time-stamped verison in the "builds/" directory for reference.
The minified script is build with Google's Closure Compilier. Closure Compiler is 
distributed unter the Apache License like Int_lib. I did not contribute to Closure 
Complier, or modify the source files.

*You will need to have bash and java installed on your machine in order for the build
script to work*

Source files for Int_lib are under the "source" directory. To expand the functionality
of the library, add source files under this directory and rebuild Int_lib. 

To create custom builds of a subset of the source files, you will need to write your
own bash script, or use the Closure Compiler executable directly. You can find detailed
instructions on how to use the compiler in the "compiler/" directory.

METRICS BUILD INSTRUCTIONS:
--------------------------

$ cd Int_lib
$ bash build -m

The above command will build "Int.min.js" with source code for metrics under the 
"metrics/". This will include some debugging and performance tests for Int_lib. 
These are not meant to be used in any particular implementation - they instead
test the functionality, correctness, and performance of Int_lib.

CLEAR BUILD INSTRUCTIONS:
-------------------------

$ cd Int_lib
$ bash build -c

The above command will clear previously compiled minified files, including 
"Int.min.js" and any reference files in the "builds/" directory. 
