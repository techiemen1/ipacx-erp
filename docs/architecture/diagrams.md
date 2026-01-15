# Architecture Diagrams
```mermaid
graph TD;
    A[Client] -->|HTTP| B[Traefik];
    B --> C[Accounting Service];
    B --> D[Inventory Service];
```
