# Metric-Monitor-Application

> https://helm.sh/docs/topics/charts/#chart-license-readme-and-notes

## How to use?

**IMPORTANT**

You must using `--namespace` flag to ensure to deploy serviceAccount!

```bash
helm install metric-monitor . --namespace metric

kubectl port-foward -n metric POD_NAME 3000:3000 
```

```bash
# if you want to use externalIP without using port-foward strategy
helm install metric-monitor . --namespace metric --set-string grafana.externalIP="192.168.1.11" prometheus.externalIP="192.168.1.11"
```



## Chart description

This application will install set of application to monitor metric of cluster.

### What is get collected?

- Metric of every Node in Cluster
- Metric of Cluster
- Metric of Pod
- Metric of Prometheus

### Used Application

- Node Exporter : Daemonset
- Prometheus : Deployment(1), Service, PV, PVC, clusterRole, ClusterRoleBinding, service Account, ConfigMap
- Grafana : Deployment(1), Service, PV, PVC

## Prerequisites or Requirements

- Helm3+
- Kubernetes Cluster

## values.yaml

you can use set option to modify values

```bash	
# example : setting externalIP to grafana service
helm install metric-monitor . --namespace metric --set-string grafana.externalIP="192.168.1.11" prometheus.externalIP="192.168.1.11"
```

**grafana value**

```yaml
grafana:
	# name of service, deployment
  name: grafana
  # external IP service will listen if not set no external IP, you will have to use port-foward option
  externalIP: ""
	# image you application will install
  image:
  	# repository
    repository: grafana/grafana
    # tag, you can't use "latest" tag, use specific image tag
    tag: "8.2.1"
  volume:
  	# name of pv, pvc
    name: grafana-vol
    # persistent volume storage will be created
    storage: 2Gi
    # hostpath
    hostPath:
    	# path to grafana data directory will be automatically set to 777 mod
      path: /opt/grafana
      type: DirectoryOrCreate
    storageClassName: grafana
    # requesting storage
    request: 1Gi
  service:
    type: ClsuterIP
    port: 3000
```

**prometheus value**

```yaml
prometheus:
	# name of deployment, service, role, configMap
  name: prometheus
  externalIP: ""
  image:
    repository: prom/prometheus
    tag: "v2.30.3"
  config:
    name: prometheus-config
  volume:
    name: prometheus-vol
    storage: 2Gi
    hostPath:
    # path to prometheus data directory will be automatically set to 777 mod
      path: /opt/prometheus
      type: DirectoryOrCreate
    storageClassName: prom-volume
    request: 1Gi
  service:
    type: ClusterIP
    port: 9090
```

**node-exporter value**

```yaml
nodeExporter:
	# name of daemonset
  name: node-exporter
  image:
    repository: prom/node-exporter
    tag: "v1.2.2"
```

-----

## There is no dependecies in this chart

