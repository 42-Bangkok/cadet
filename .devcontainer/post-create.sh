#! /bin/bash

PRE='export $(cat '
POST='/app/.env | xargs)'
CMD=$PRE$1$POST
echo $CMD >> ~/.bashrc
