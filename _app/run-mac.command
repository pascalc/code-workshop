#!/bin/bash
cd "`dirname "$0"`"
./node-local -e "require('grunt').tasks(['default']);"
