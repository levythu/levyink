#! /bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$DIR"

/usr/local/bin/node emailDump.js >> mailer.debuglog  2>&1