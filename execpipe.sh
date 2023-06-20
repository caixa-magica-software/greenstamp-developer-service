#!/bin/bash

# On the main host, chose the folder where you want to put 
# your named pipe file, for instance /data/greenstamp/pipe 
# and a pipe name, for instance mypipe, and then run:
# mkfifo /data/greenstamp/pipe
# The pipe is created. Type: ls -l /data/greenstamp/pipe
# And check the access rights start with "p"

while true; do eval "$(cat /data/greenstamp/pipe)" 2>&1; done
