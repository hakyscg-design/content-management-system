# Cross-Service Validation Summary

| Cross-service link | Validation result |
|---|---|
| Source -> Asset | Asset can be registered only from source reference. |
| Asset -> Media | Media processing references asset and writes processing job outputs under media service. |
| Asset/Media -> Content | Content package references asset and derivative references without owning them. |
| Content -> Review | Review assignment targets content package by reference. |
| Review -> Publishing | Publishing package consumes approval status by reference. |
| Publishing -> Performance | Performance import consumes completed publishing package reference. |
| Performance -> Analytics | Analytics consumes performance facts and metric definitions. |
| Workflow -> Owner Services | Workflow dispatches target commands to owner-service boundary only. |
| Administration -> Owner Services | Administration reads owner snapshots and redirects mutations to authoritative owners. |

**Result:** Cross-service flow completes without shared business-record writes.

