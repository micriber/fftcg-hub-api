 #!/bin/bash
set -e

npm install --no-save

if [[ "$NODE_ENV" == 'development' ]] ; then
    npm run typeorm -- migration:run
elif [ "$NODE_ENV" == 'test' ] ; then
    npm run typeorm -- schema:sync
fi
npm run fixture

exec "$@"
