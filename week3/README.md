# Private 5G System 구축을 위한 Cloud

> 홍진우 - 3주차 과제



## 네트워크 구성도
![제목 없는 그림-2](https://tva1.sinaimg.cn/large/008i3skNgy1gv93fmniaqj60fc0ao0td02.jpg)

## **Main 과제**

### **Prometheus, Node-Exporter, Grafana를 설치하세요**

#### **Node-Exporter 설치(node_exporter.yaml)**

각 노드의 데이터를 크롤링해야하고 설치시에 각 노드들의 기저환경을 모르기때문에 **데몬셋**으로 각 노드에 배포를 하여서 설치를 하도록함         

```yaml
spec:
      volumes:
        - name: root
          hostPath:
            path: "/"
      hostNetwork: true
      hostIPC: true
      hostPID: true
      containers:
        - name: node-exporter
          image: prom/node-exporter:latest
          volumeMounts:
            - mountPath: "/host"
              name: root
              readOnly: true
          args:
            - "--path.rootfs=/host"
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
            - containerPort: 9100
```

host의 데이터들을 가져갈수 있게 

- hostNetwork
- hostIPC
- hostPID
- hostPath '/' (readonly)

로 설정하였다.

배포후 사진 (두개의 노드에 설치 된것을 확인)

![스크린샷 2021-10-09 오후 4.27.28](https://tva1.sinaimg.cn/large/008i3skNgy1gv93jx475xj62as0latdr02.jpg)

![스크린샷 2021-10-09 오후 4.35.02](https://tva1.sinaimg.cn/large/008i3skNgy1gv93js3bscj60u00u5q9w02.jpg)

#### **Prometheus설치**

1. **namespace 설정(prom_namespace.yaml)**
   monitoring-prom이라는 네임스페이스에 node-epxorter, prometheus, grafana에 필요한 오브젝트를 포함시켰다.
   
2. **PersistantVolume과 PersistantVolumeClaim 생성(prom_pv.yaml)**
   Prometheus를 업데이트시에 로그들이 사라져서 저장소를 생성하였다. 
   
3. **ConfigMap생성(prom_config.yaml)**
   Prometheus를 생성시에 설정을 담고있는 yaml파일을 담기위해 사용함
   출처 https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config
   
   ```yaml
   scrape_configs:
      - job_name: 'node'
        kubernetes_sd_configs:
        - role: node
   
        relabel_configs:
        - source_labels: [__meta_kubernetes_node_address_InternalIP]
          target_label: __address__
          replacement: $1:9100
   ```
   
   Daemonset으로 배포한 파드는 각 노드의 `internalIP`이므로 Service discovery를 활용해서 클러스터 내의 모든 노드내에 설치 되어있는 node exporter를 찾도록 작성하였다.
   
4. **ClusterRole와 ClusterRoleBinding, ServiceAccount설정(prom_role.yaml)**
   출처 : https://kubernetes.io/docs/reference/access-authn-authz/rbac/

   - ClusterRole : service discovery를 하기 위해서 설정(node, service, endpoints, pods)
   - ClusterRoleBinding : ServiceAccount에 Role을 적용

5. **Prometheus설치(Prometheus.yaml)**
   출처 : https://prometheus.io/docs/prometheus/latest/getting_started/
   Getting Started를 기반으로 작성
   외부에서도 확인할수 있게 서비스(`prometheus-svc`)도 작성
   args를 추가로 작성하여서 config파일과 데이터베이스를 가지게함
   
   ```yaml
   args:
     - "--config.file=/etc/prometheus/prometheus-settings.yaml"
     - "--storage.tsdb.path=/prometheus"
   	- "--storage.tsdb.retention.time=6h"
   ```
   
   ##### **문제점!** 이렇게 tsdb를 설정하게 되면 rolling update시 이전 pod가 tsdb를 lock해버려서  다음 pod가 tsdb가 lock이 걸려있어 교착상태에 처하는것 같습니다! 이럴땐 어떻게 해결해야하나요?
   ![스크린샷 2021-10-09 오후 5.02.34](https://tva1.sinaimg.cn/large/008i3skNgy1gv94c7lmwij61jt0u0qdv02.jpg)
   

#### Grafana설치(grafana.yaml)

1주차 expert과제에 사용한 yaml파일에 namespace만 수정해서 다시 deploy하였습니다.

### 3개의 application을 연동시켜 보세요

Node-exporter와 Prometheus는 config파일에 서로 연동하도록 작성하였다. (prom_config.yaml) Grafana와 Prometheus는 서비스를 통해 찾을수 있도록 서비스이름을 데이터 소스(prometheus-svc)로 작성하였다.
![스크린샷 2021-10-09 오후 5.13.54](https://tva1.sinaimg.cn/large/008i3skNgy1gv94npmqidj60u00u5gni02.jpg)

### Grafana를 통해 DashBoard를 제작해보세요.

목적에 부합하는 완벽한 Dashboard를 찾아서 적용하였습니다.

![스크린샷 2021-10-09 오후 5.15.40](https://tva1.sinaimg.cn/large/008i3skNgy1gv94pfd003j60u00u50we02.jpg)

Dashboard를 Grafana에 적용한 사진

![스크린샷 2021-10-09 오후 5.16.28](https://tva1.sinaimg.cn/large/008i3skNgy1gv94q5gurdj60u00u5jvi02.jpg)

그래프가 실제로 작동되는지 확인하기 위해서 네트워크로 파일을 주고받고 압축을 해제하면서 CPU의 사용량을 늘리니 그래프가 변경되는것을 확인하였다.![스크린샷 2021-10-09 오후 3.00.35](https://tva1.sinaimg.cn/large/008i3skNgy1gv9ekmm7f5j62jx0k7aej02.jpg)



### Expert 심화 : Service Discovery 

클러스터 내의 노드와 파드의 데이터를 가져오게된 스크립트를 가져와서 적용하였습니다. 

```yaml
    scrape_configs:
      - job_name: 'prometheus'
        # metrics_path defaults to '/metrics'
        # scheme defaults to 'http'.
        static_configs:
        - targets: ['localhost:9090']

      - job_name: 'node'
        kubernetes_sd_configs:
        - role: node

        relabel_configs:
        - source_labels: [__meta_kubernetes_node_address_InternalIP]
          target_label: __address__
          replacement: $1:9100


      - job_name: 'kubernetes-nodes'

        scheme: https

        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

        kubernetes_sd_configs:
        - role: node

        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
        - target_label: __address__
          replacement: kubernetes.default.svc:443
        - source_labels: [__meta_kubernetes_node_name]
          regex: (.+)
          target_label: __metrics_path__
          replacement: /api/v1/nodes/${1}/proxy/metrics

      - job_name: 'kubernetes-pods'

        kubernetes_sd_configs:
        - role: pod

        relabel_configs:
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
          action: replace
          target_label: __metrics_path__
          regex: (.+)
        - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          action: replace
          regex: ([^:]+)(?::\d+)?;(\d+)
          replacement: $1:$2
          target_label: __address__
        - action: labelmap
          regex: __meta_kubernetes_pod_label_(.+)
        - source_labels: [__meta_kubernetes_namespace]
          action: replace
          target_label: kubernetes_namespace
        - source_labels: [__meta_kubernetes_pod_name]
          action: replace
          target_label: kubernetes_pod_name

```



## Expert 과제

### ElasticSearch, Kibana, Fluentd를 설치하세요.

출처 : https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes

#### ElasticSearch Stateful set 배포 

앞의 Prometheus와 같은 역할을 하는 ElasticSearch 먼저 설치

- namespace(elas_pv.yaml) : logging-elas
- service object(elas_svc.yaml) : 9200, 9300 port 사용
  clusterIP를 None으로 설정해서 headless로 사용 => elasticsearch-svc를 통해 접근가능 
- persistent Volume과 persistent Volume Claim(elas_pv.yaml)
  **질문점**
  
  ```bash
  위의 튜토리얼에서는 statefulset으로 replica를 3개를 설정했는데 이런경우에 각 레플리카별로 저장소를 따로 지정하려면 어떤 타입을 사용해야할까요? 에러가 계속 발생해서 문제점을 해결하려고 찾아보았을때 딱히 답이 없는것 같아서 질문합니다. 🥲 (여기선 replica를 1로 설정했습니다!)
  ```
- stateful set으로 elasticSearch 배포(elas_statefulset.yaml)
  튜토리얼에서는 고가용성의 멀티노드 클러스터를 위해 statefulset으로 배포한다고 했지만, 2개의 노드의 환경에서 테스팅하고 PV의 문제를 해결하지 못해서 하나의 파드만 배포...

#### Kibana 배포

앞의 Grafana와 같은 역할을 하는 Kibana 설치

- Service와 deployment를 합쳐서 배포(kiba_svc_deploy.yaml)
  container의 ELASTICSEARCH_URL을  elasticsearch서비스를 입력

#### Fluentd Daemonset으로 배포

- ServiceAccount, ClusterRole, ClusterRoleBinding, Daemonset을 한번에 배포(fluentd_svc_svcAccount_Role_daemonset.yaml)

Daemonset으로 배포를 해서 모든 노드에 fluentd가 하나씩 깔리게 설정

### Kibana를 통해 Elastic Search에 수집된 Log를 확인해보세요.

이전에 작성했던 socket서버의 로그를 확인해보았다.

![스크린샷 2021-10-09 오후 11.26.06](https://tva1.sinaimg.cn/large/008i3skNgy1gv9ff0wnhlj60u00vvwil02.jpg)

