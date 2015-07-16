#! /bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$DIR"
cd ..

nohup npm start >>run.debuglog 2>&1 &
