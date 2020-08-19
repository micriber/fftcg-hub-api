# fftcg collection api

#### Setup
Create `.env` file with `.env.dist` for database credential 

Run make up

#### Api documentation
Swagger documentation : http://localhost:3000/api/swagger

HTTP client file in `./http/*.http`

#### Oauth
Google token id must have this information
- https://www.googleapis.com/auth/userinfo.email
- https://www.googleapis.com/auth/userinfo.profile 

Use https://developers.google.com/oauthplayground/ for token creation

#### Migration
```
MIGRATION_NAME=migration-name make migration-create => create migration
make migration-run => run migration
```
#### Test
make fixture-test => up test fixture

make test-func-cov => run func test with coverage

#### Fixture
make fixture => up fixture
