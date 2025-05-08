# Infrastructure & Observability

## Progressive Delivery
- **Argo Rollouts**: See `argo-rollout.yaml` for canary deployment example.
- Apply with:
  ```sh
  kubectl apply -f infra/argo-rollout.yaml
  ```

## Feature Flags
- **Unleash**: Backend and frontend are scaffolded for Unleash integration.
- Set up an Unleash server or use Flagsmith/LaunchDarkly as needed.

## Observability Stack
- **Prometheus**: Metrics scraping (see `prometheus.yml`).
- **Grafana**: Dashboards and alerting (port 3001).
- **Loki**: Log aggregation (see `loki-config.yaml`).
- Start locally with:
  ```sh
  docker-compose -f docker-compose.observability.yml up -d
  ```

## Rollback & Remediation
- **GitHub Actions**: See `.github/workflows/ci-cd.yml` for rollback job.
- Trigger rollback via workflow dispatch or webhook.

## Infrastructure as Code
- Store all configs, manifests, and dashboards in this directory for reproducibility and code review. 