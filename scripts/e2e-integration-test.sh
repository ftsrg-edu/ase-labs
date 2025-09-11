#!/bin/sh

dist/similarity/bin/similarity muse1.txt muse2.txt 3 > e2e-output.txt
grep -xq "Similarity:0.9000325774286236" e2e-output.txt
