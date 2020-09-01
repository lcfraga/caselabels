## Kubernetes

Kubernetes secrets, config maps, deployments and services to mimic the main docker composition. This is work in progress and requires cleanup.


```
# https://dzone.com/articles/running-local-docker-images-in-kubernetes-1
eval $(minikube docker-env)
cd backend
script/dockerize
cd ..
cd frontend
script/dockerize # May require adjustments to BACKEND_API_URL
cd ..
```

```
brew install hyperkit
brew install minikube

minikube start --driver=hyperkit --addons ingress

cd k8s

kubectl apply -f prometheus-configmap.yml
kubectl apply -f grafana-configmap.yml

kubectl apply -f jaeger.yml
kubectl apply -f prometheus.yml
kubectl apply -f grafana.yml

minikube service jaeger-ui-service
minikube service prometheus-ui-service
minikube service grafana-ui-service

kubectl apply -f mongo-secret.yml
kubectl apply -f mongo-configmap.yml
kubectl apply -f mongo.yml
kubectl apply -f mongo-express.yml

kubectl apply -f backend-configmap.yml
kubectl apply -f backend-secret.yml
kubectl apply -f backend.yml
kubectl apply -f frontend.yml

kubectl apply -f ingress.yml
# Update /etc/hosts according to ADDRESS reported by kubectl get ingress
# Visit:
# http://caselabels.io for the React frontend
# http://caselabels.io/jquery for the jQuery frontend
# http://caselabels.io/me for Mongo express

kubectl get all
kubectl get pod
```
