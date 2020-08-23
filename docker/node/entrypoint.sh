 #!/bin/bash
set -e

npm install ci

if [[ "$NODE_ENV" == 'development' ]] ; then
    npm run migration:run
    npm run card
fi

exec "$@"
