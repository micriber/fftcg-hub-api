 #!/bin/bash
set -e

npm install --no-save

if [[ "$NODE_ENV" == 'development' ]] ; then
    npm run migration:run
    npm run card
fi

exec "$@"
