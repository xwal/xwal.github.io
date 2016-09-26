#!/bin/bash
set -ev
git config --global user.email "chaosky.me@gmail.com"
git config --global user.name "chaosky"
hexo d -g
