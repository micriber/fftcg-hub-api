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

### Deployement

To deploy the api to the kubernetes cluster, make sure you have installed:
- docker
- helm 3
- kubectl (with a kubecontext correctly set to the cluster)

##### Build docker image

```bash
docker build -f docker/node/Dockerfile.prod -t registry.micriber.com/fftcg-hub-api:myRelease .
docker push registry.micriber.com/fftcg-hub-api:myRelease
```

Then, you will have your image build and pushed to the registry

##### Kubernetes deployment

N.B. Values between curly braces {} are enums

```bash
# go to the environment you want 
cd infra/k8s/overlays/{preprod|production}
# set the image
kustomize edit set image fftcg-api=registry.micriber.com/fftcg-hub-api:myRelease
# verify that all values are correct
kubectl kustomize .
# When you think all is good, apply, and don't forget to select the correct cluster !
kubectl apply -k . -n fftcg-{preprod|production}
```

#### DEPRECATED: helm deployment

Make a `values-production.yaml` file beside the `values.yaml` (in `infra/helm/fftcg-collection-api`)
And override all the configuration you want

For example:

```yaml
image:
  repository: registry.pawndev.com/fftcg-api
  tag: latest
  pullPolicy: Always

env:
  - name: DB_HOST
    value: "myDB"
  - name: POSTGRES_USER
    value: "myUser"
  - name: POSTGRES_PASSWORD
    value: "myPWD"
  - name: POSTGRES_DB
    value: "fftcg-application"
  - name: GOOGLE_CLIENT_ID
    value: "my other google client id"
  - name: NODE_ENV
    value: "development"

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: fftcg-api.pawndev.com
      paths:
        - /
  tls:
    - secretName: fftcg-api-pawndev-com-tls
      hosts:
        -  fftcg-api.pawndev.com
```

Then, you can do:

```bash
cd infra/helm/fftcg-collection-api
helm upgrade --install fftcg-api . -n fftcg -f .\values-production.yaml --set image.tag=myRelease
```

