#!/bin/sh

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml
kubectl apply -f scripts/https/staging-issuer.yaml
# kubectl apply -f scripts/https/ingress.yaml

# kubectl delete secrets api
# kubectl apply -f scripts/https/production-issuer.yaml
# kubectl apply -f scripts/https/ingress.yaml

# https://www.datascienceengineer.com/blog/post-traefik-automatic-ssl-certificates#change-issuer-to-lets-encrypt-production

# kubectl port-forward -n kube-system deployment/traefik 9000:9000
# http://localhost:9000/dashboard/