#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /deployko/tmp/pids/server.pid


bundle exec rails s -p 3000 -b '0.0.0.0'
