// backend/mockData.js
// Simulated billing + metrics data.
// Replace these functions with real AWS SDK calls when you have credentials:
//   npm install @aws-sdk/client-cost-explorer @aws-sdk/client-ec2 @aws-sdk/client-cloudwatch
//   import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer"

export function getBillingData() {
  return [
    { service: "EC2",         region: "us-east-1", costPerHr: 1842, utilPct: 88, status: "spike",   trend: "+340%" },
    { service: "RDS",         region: "us-west-2", costPerHr: 612,  utilPct: 61, status: "normal",  trend: "+2%"   },
    { service: "Lambda",      region: "us-east-1", costPerHr: 389,  utilPct: 45, status: "scaling", trend: "+12%"  },
    { service: "S3",          region: "us-east-1", costPerHr: 240,  utilPct: 30, status: "normal",  trend: "-1%"   },
    { service: "ElastiCache", region: "eu-west-1", costPerHr: 178,  utilPct: 22, status: "idle",    trend: "-5%"   },
    { service: "EKS",         region: "us-east-1", costPerHr: 510,  utilPct: 55, status: "spike",   trend: "+180%" },
  ];
}

export function getMetrics() {
  return {
    anomalies: [
      { service: "EC2", detail: "m5.4xlarge x12 in us-east-1 — batch job data-transform-v4 completed 14:52 UTC but ASG has not scaled down. 8 of 12 instances at 0% CPU for 28 min." },
      { service: "EKS", detail: "prod-cluster-01 — autoscaler manually disabled 2024-02-14. 18 nodes running at 12% avg CPU." },
    ],
    idleEC2: [
      { instanceId: "i-0a1b2c3d4e5f00001", instanceType: "m5.4xlarge", avgCpu: 0.2, region: "us-east-1" },
      { instanceId: "i-0a1b2c3d4e5f00002", instanceType: "m5.4xlarge", avgCpu: 0.1, region: "us-east-1" },
      { instanceId: "i-0a1b2c3d4e5f00003", instanceType: "m5.4xlarge", avgCpu: 0.0, region: "us-east-1" },
    ],
  };
}
