# cloud_kubernetes(Comento Bootcamp)

## How to ?

```bash
# copy it to your repository
git clone https://github.com/jinwoo1225/cloud_kubernetes.git
```



## week 1

- install kubernetes on `ubuntu 20.04 LTS`  ([AMD64](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/week1/install_kubernetes_ubuntu_amd64.sh), [ARM64](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/week1/install_kubernetes_ubuntu_arm64.sh))

  ```bash
  # amd64 arch machine
  bash ./install_kubernetes_ubuntu_amd64.sh

  # arm64 arch machine
  bash ./install_kubernetes_ubuntu_arm64.sh
  ```
  bcz im using m1 mac 🤣

- creating kubernetes cluster 

  ```bash
  ## create cluster with your custom cidr. 
  ## https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#initializing-your-control-plane-node
  sudo kubeadm init --pod-network-cidr yo.ur.ci.dr/idk
  
  ## copy config to your storage
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

  

- [deploy `calico` CNI](https://docs.projectcalico.org/getting-started/kubernetes/self-managed-onprem/onpremises)

  ```bash
  ## download calico deployment file
  curl https://docs.projectcalico.org/manifests/calico.yaml -O
  ## apply it to your cluster
  kubectl apply -f calico.yaml
  ```

  

- deploy `grafana`

  if you are deploying it to Master Node, you should untaint it

  ```bash
  kubectl taint nodes --all node-role.kubernetes.io/master-
  ```

  

- (advanced) deploy `grafana` with `service`, `persistent volume(PV)`, `persistent volume claim(PVC)` 

  check : [grafana.yaml](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/week1/grafana.yaml)

- (advanced) access `grafana` dashboard

  ``````bash
  curl localhost:3000
  ``````

  

## week 2

- create simple nodejs application

  check : [simple-webapp](https://github.com/jinwoo1225/cloud_kubernetes/tree/master/week2/simple_webapp)

- build application as container (arch : `linux/amd64`, `linux/arch64`, `linux/arm/v7`) and push to `hub.docker.com`

  to build multi platform container check : [buildx](https://docs.docker.com/buildx/working-with-buildx/)

  Why I'm using it ? check : [meetup.toast](https://meetup.toast.com/posts/255)

  ```bash
  # this command will build simple webapp to support amd64, arm64, armv7 and push to hub.docker.com
  sudo docker buildx build --platform=linux/amd64,linux/amd64,linux/arm/v7 -t jinwoo17962/simple-webapp ./simple_webapp --push
  ```

- deploy application to kubernetes cluster

  check : [nodejs.yaml](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/week2/nodejs.yaml)

- (Advanced)

  - create simple socket transaction program for cluster

    - check : [python-socket-client](https://github.com/jinwoo1225/cloud_kubernetes/tree/master/week2/python_socket_client)

      it will create replica of 4 and send signal to server

    - check : [python-socket-server](https://github.com/jinwoo1225/cloud_kubernetes/tree/master/week2/python_socket_server)

      it will create thread to each client, and send `success` to each valid request

  - build it, push it, deploy it, test it

    ```bash
    sudo docker buildx build --platform=linux/amd64,linux/amd64,linux/arm/v7 -t jinwoo17962/python-socket-client ./python_socket_client --push
    
    sudo docker buildx build --platform=linux/amd64,linux/amd64,linux/arm/v7 -t jinwoo17962/python-socket-server ./python_socket_server --push
    
    kubectl apply -f socket_client.yaml
    
    kubectl apply -f socket_server.yaml
    
    # logs with -f option will stream the log
    kubectl logs deployment/socket-server -f
    ```

    

## week3

Install `Prometheus`, `Node Exporter`, `Grafana` in my cluster. (namespace : `monitoring-prom`)

### Create a  namespace

create namespace object to simplify maintaining a applications.

### Deploy Node Exporter

deploy as daemonset to ensure every nodes have a single pod instance. 

set `hostNetwork`, `hostIPC`,`hostPID`, `hostPath(as readonly)` to monitor node's metric.

### Deploy Prometheus

- Persistent Volume and Persistent Volume Claim
  to store logs

- ConfigMap
  Use [Service Discovery](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config) to find every node that contains node-exporter

- ClusterRole, ClusterRoleBinding, ServiceAccount
  To use Service discovery (ClusterRole, ClusterRoleBinding)

- Deployment, Service
  https://prometheus.io/docs/prometheus/latest/getting_started/
  `no-lockfile` option will help pods to rolling update
  if not setted, two prometheus pod will get one storage and get **deadlocked** at that moment.

  ```yaml
  args:
    - "--config.file=/etc/prometheus/prometheus-settings.yaml"
    - "--storage.tsdb.path=/prometheus"
    - "--storage.tsdb.retention.time=6h"
    - "--storage.tsdb.no-lockfile"
  ```

### Deploy Grafana

Using week1's grafana.yaml to install :)

to add database you will have to use URL  `{prometheus-service name}:{portname}` to your Data Sources.

example : `http://prometheus-svc:9090`

### Deploy EFK

#### Deploy Namespace

- namespace : logging-elas

#### Deploy Fluentd

- ServiceAccount, ClusterRole, ClusterRoleBinding, Daemonset

#### Deploy ElasticSearch

- Namespace
- Service
- Persistent Volume, Persistent Volume Claim
  You should not use Persistent Volume in production.
  you should checkout **dynamic provisioing**
- Stateful Set

#### Deploy Kibana

- Service
- Deployment
  should contain enviroment variable called `ELASTICSEARCH_URL` to be serviceURL ex) `elasticsearch-svc:9200`

## week4

### Install helm chart to your System

```bash
bash ./week4/install_helm_amd64.sh
```

### Metric Monitor(Node-Exporter, Prometheus, Grafana)

create chart template

```bash
helm create metric-monitor
```

will create template and change the value in `values.yaml`

create values for applications : [example](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/week4/metric-monitor/values.yaml)

```bash
helm install metric-monitor . -n metric --create-namespace
```

- -n metric : use `metric` namespace
- --create-namespace : create namespace if required namespace is not present.

### Log Monitor(ElasticSearch, Flunetd, Kibana)

```bash
helm create log-monitor
```

```bash
helm install log-monitor . -n logging --create-namespace
```



