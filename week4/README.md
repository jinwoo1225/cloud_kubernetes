# Private 5G System 구축을 위한 Cloud

> 홍진우 - 3주차 과제



## 네트워크 구성도

![제목 없는 그림-2](https://tva1.sinaimg.cn/large/008i3skNgy1gv93fmniaqj60fc0ao0td02.jpg)

## Main 과제

### 3주차에 작성한 Metric Monitoring Application을 helm chart로 작성

```bash
├── charts
├── Chart.yaml
├── index.yaml
├── metric-monitor-0.0.1.tgz
├── README.md
├── templates
│   ├── grafana
│   │   ├── grafana_deployment.yaml
│   │   ├── grafana_pvc.yaml
│   │   ├── grafana_pv.yaml
│   │   └── grafana_svc.yaml
│   ├── _helpers.tpl
│   ├── node_exporter
│   │   └── node_exporter_daemonset.yaml
│   ├── NOTES.txt
│   ├── prometheus
│   │   ├── prom_configmap.yaml
│   │   ├── prom_deployment.yaml
│   │   ├── prom_pvc.yaml
│   │   ├── prom_pv.yaml
│   │   ├── prom_role.yaml
│   │   └── prom_svc.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml
```

기존에 작성한 yaml을 바탕으로 재작성하였습니다.

### helm install을 통해 kubernetes에 helm chart에 적용하세요.

![스크린샷 2021-10-17 오후 5.00.13](https://tva1.sinaimg.cn/large/008i3skNgy1gvid7zedecj61f50u0adg02.jpg)

```bash
helm install metric-monitor . -n metric --create-namespace
```

- -n metric 옵션으로 네임스페이스(metric)를 정의하였고
- --create-namespace 옵션으로 네임스페이스를 생성하게 하였습니다. 

#### 결과물 `kubectl get pods -A -o wide`

![스크린샷 2021-10-17 오후 5.03.40](https://tva1.sinaimg.cn/large/008i3skNgy1gvidbkj43qj62040s27c502.jpg)

## Expert

### 3주차에 작성하신 Log Monitoring Application을 helm chart로 작성하세요.

```bash
├── charts
├── Chart.yaml
├── index.yaml
├── log-monitor-0.0.1.tgz
├── README.md
├── templates
│   ├── elasticsearch
│   │   ├── elas_pvc.yaml
│   │   ├── elas_pv.yaml
│   │   ├── elas_statefulset.yaml
│   │   └── elas_svc.yaml
│   ├── fluentd
│   │   ├── fluentd_daemonset.yaml
│   │   └── fluentd_role.yaml
│   ├── _helpers.tpl
│   ├── kibana
│   │   ├── kibana_deployement.yaml
│   │   └── kibana_svc.yaml
│   ├── NOTES.txt
│   └── tests
│       └── test-connection.yaml
└── values.yaml
```

기존에 작성한 expert과제를 재활용했습니다.

## helm install을 통해 kubernetes에 helm chart를 적용하세요.

![스크린샷 2021-10-17 오후 5.07.01](https://tva1.sinaimg.cn/large/008i3skNgy1gvidet8y3rj61ga0u0gp402.jpg)

```bash
helm instsall log-monitor . -n logging --create-namespace
```

main과제와 같은 방법으로 helm chart를 적용했습니다. 

#### 결과물 `kubectl get pods -A -o wide`

![스크린샷 2021-10-17 오후 5.12.10](https://tva1.sinaimg.cn/large/008i3skNgy1gvidk80e00j62040r8aiw02.jpg)

logging 네임스페이스로 잘 배포된 것을 확인할수 있습니다.

### README

https://helm.sh/docs/topics/charts/#chart-license-readme-and-notes

이 링크를 참고해서 각 차트 내에 README.md를 추가했습니다. 

