import sys

f = open(sys.argv[1])

print "The given computations produced errors:"

cum_error = 0
errors = 0

for l in f:
	A, B, C = [int(x) for x in l.split()];
	D = A % B;
	if D != C:
		print A, "/", B
		print "\tgiven:  ", C
		print "\tcorrect:", D
		errors += 1;
		cum_error = cum_error + abs(C-D);
		# print C-D, cum_error

print "errors found:", errors

if errors > 0:
	print "average error per-computation:", cum_error / errors
	print "cummlative error:", cum_error

