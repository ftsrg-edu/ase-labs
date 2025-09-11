@echo off
dist\similarity\bin\similarity.bat muse1.txt muse2.txt 3 > e2e-output.txt
findstr /x /c:"Similarity:0.9000325774286236" e2e-output.txt >nul
