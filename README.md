# cloud_kubernetes(Comento Bootcamp)

## How to ?

```bash
# copy it to your repository
git clone https://github.com/jinwoo1225/cloud_kubernetes.git
```



## week 1

- install kubernetes on `ubuntu 20.04 LTS`  ([AMD64](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/install_kubernetes_ubuntu_amd64.sh), [ARM64](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/install_kubernetes_ubuntu_arm64.sh))

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

  check : [grafana.yaml](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/grafana.yaml)

- (advanced) access `grafana` dashboard

  ``````bash
  curl localhost:3000
  ``````

  

## week 2

- create simple nodejs application

  check : [simple-webapp](https://github.com/jinwoo1225/cloud_kubernetes/tree/master/simple_webapp)

- build application as container (arch : `linux/amd64`, `linux/arch64`, `linux/arm/v7`) and push to `hub.docker.com`

  to build multi platform container check : [buildx](https://docs.docker.com/buildx/working-with-buildx/)

  Why I'm using it ? check : [meetup.toast](https://meetup.toast.com/posts/255)

  ```bash
  # this command will build simple webapp to support amd64, arm64, armv7 and push to hub.docker.com
  sudo docker buildx build --platform=linux/amd64, linux/amd64, linux/arm/v7 -t jinwoo17962/simple-webapp ./simple_webapp --push
  ```

- deploy application to kubernetes cluster

  check : [nodejs.yaml](https://github.com/jinwoo1225/cloud_kubernetes/blob/master/nodejs.yaml)

- (Advanced)

  - create simple socket transaction program for cluster

    - check : [python-socket-client](https://github.com/jinwoo1225/cloud_kubernetes/tree/master/python_socket_client)

      it will create replica of 4 and send signal to server

    - check : [python-socket-server](https://github.com/jinwoo1225/cloud_kubernetes/tree/master/python_socket_server)

      it will create thread to each client, and send `success` to each valid request

  - build it, push it, deploy it, test it

    ```bash
    sudo docker buildx build --platform=linux/amd64, linux/amd64, linux/arm/v7 -t jinwoo17962/python-socket-client ./python_socket_client --push
    
    sudo docker buildx build --platform=linux/amd64, linux/amd64, linux/arm/v7 -t jinwoo17962/python-socket-server ./python_socket_server --push
    
    kubectl apply -f socket_client.yaml
    
    kubectl apply -f socket_server.yaml
    
    # logs with -f option will stream the log
    kubectl logs deployment/socket-server -f
    ```

    

