# Metric-Monitor-Application

> https://helm.sh/docs/topics/charts/#chart-license-readme-and-notes

## How to use?

**IMPORTANT**

You must using `--namespace` flag to ensure to deploy serviceAccount!

```bash
helm install log-monitor . --namespace logging

kubectl port-foward -n metric POD_NAME 3000:3000 
```

```bash
# if you want to use externalIP without using port-foward strategy
helm install log-monitor . --namespace logging --set kibana.externalIP="192.168.1.11"
```



## Chart description

This application will install set of application to monitor Log of cluster.

### What is get collected?

- Log of every Node in Cluster
- Log of Cluster
- Log of Pod

### Used Application

- Fluentd : Daemonset, ClusterRole, ClusterRoleBinding
- ElasticSearch : StatefulSet, Service, PersistentVolume, PersistentVolumeClaim
- Kibana : Deployment, Service

## Prerequisites or Requirements

- Helm3+
- Kubernetes Cluster

## values.yaml

you can use `set` option to modify values

```bash	
# example : setting externalIP to grafana service
helm install log-monitor . --namespace logging --set-string kibana.externalIP="192.168.1.11" 
```

**elasticsearch value**

```yaml
elasticsearch:
	# name of statefulset, service
  name: elasticsearch
  # external IP, service will listen if not set no external IP, you will have to use port-foward option
  externalIP: ""
  # image your application will be installed
  image:
  	# repository
    repository: docker.elastic.co/elasticsearch/elasticsearch
    # tag, you can't use "latest" tag, use specific image tag
    tag: 7.14.1
  volume:
  	# name of pv, pvc
    name: elasticsearch-vol
    # persistent volume storage will be created
    storage: 2Gi
    # hostPath
    hostPath:
    	# path to elasticSearch data, directory will be automatically set to 777 mod
      path: /opt/elasticsearch
      type: DirectoryOrCreate
    storageClassName: elasticsearcch
    # requesting storage
    request: 1Gi
  service:
    type: ClusterIP
    # REST API
    rest:  9200
		# INTER NODE
    inter: 9300
```

**kibana value**

```yaml
kibana:
	# name of deployment, Service
  name: kibana
  externalIP: ""
  image:
    repository: docker.elastic.co/kibana/kibana
    tag: 7.2.0
```

**node-exporter value**

```yaml
fluentd:
	# name of daemonset, clusterRole, clusterRoleBinding
  name: fluentd
  image:
    repository: fluent/fluentd-kubernetes-daemonset
    tag: v1.4.2-debian-elasticsearch-1.1
```

-----

## There is no dependecies in this chart

