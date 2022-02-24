#!/bin/bash
cd ..
(timeout 5s npm run work; exit 0)
echo $?
