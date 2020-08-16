 #!/bin/bash
set -e

npm install --no-save

if [[ "$NODE_ENV" == 'development' ]] ; then
    npm run typeorm -- migration:run
fi

exec "$@"
