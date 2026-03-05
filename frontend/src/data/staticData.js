// frontend/src/data/staticData.js

export const HOURS = Array.from({ length: 24 }, (_, i) => ({
  hour:  String(i).padStart(2, "0") + ":00",
  cost:  (i === 14 || i === 15) ? 330 + Math.random() * 90 : 78 + Math.sin(i * 0.4) * 20 + Math.random() * 12,
  spike: i === 14 || i === 15,
}));

export const SERVICES = [
  { name: "EC2 - m5.4xlarge x12", region: "us-east-1", cost: 1842, pct: 88, status: "spike",   trend: "+340%" },
  { name: "RDS - db.r6g.2xlarge", region: "us-west-2", cost: 612,  pct: 61, status: "normal",  trend: "+2%"   },
  { name: "Lambda - inference",   region: "us-east-1", cost: 389,  pct: 45, status: "scaling", trend: "+12%"  },
  { name: "S3 - data-lake-prod",  region: "us-east-1", cost: 240,  pct: 30, status: "normal",  trend: "-1%"   },
  { name: "ElastiCache r6g",      region: "eu-west-1", cost: 178,  pct: 22, status: "idle",    trend: "-5%"   },
  { name: "EKS - prod-cluster",   region: "us-east-1", cost: 510,  pct: 55, status: "spike",   trend: "+180%" },
];

export const ALERTS_INIT = [
  { type: "critical", icon: "!", title: "EC2 Cost Spike Detected",  desc: "m5.4xlarge x12 — $1,842/hr (+340%). Run Nova analysis to identify root cause.", time: "now"    },
  { type: "warning",  icon: "~", title: "EKS Over-provisioned",     desc: "prod-cluster: 18 nodes, 12% avg CPU. Autoscaler disabled.",                      time: "8 min"  },
  { type: "info",     icon: "i", title: "Reserved Instance Expiry", desc: "3 RIs expiring in 14 days.",                                                      time: "1 hr"   },
];

export const MCP_LIST = [
  { name: "ec2.stop_instances",       status: "connected", calls: 3  },
  { name: "ec2.describe_instances",   status: "connected", calls: 14 },
  { name: "eks.update_nodegroup",     status: "connected", calls: 7  },
  { name: "rds.modify_instance",      status: "connected", calls: 3  },
  { name: "lambda.update_config",     status: "connected", calls: 22 },
  { name: "cloudwatch.get_metrics",   status: "connected", calls: 89 },
  { name: "cost_explorer.query",      status: "connected", calls: 45 },
  { name: "asg.set_desired_capacity", status: "pending",   calls: 0  },
  { name: "elasticache.modify",       status: "connected", calls: 1  },
];

export const SETUP_STEPS = [
  {
    num: "Step 1",
    title: "Get your Nova API key",
    body: "Go to nova.amazon.com/dev/api. Click the three-dot menu on your key row, then click View Secret Key to copy the full key.",
    code: null,
  },
  {
    num: "Step 2",
    title: "Create .env in the backend folder",
    body: "Copy the env.example file and fill in your key:",
    code: [
      { text: "cp env.example .env", cmd: true },
      { text: "# Then open .env and set:", cmd: false },
      { text: "NOVA_API_KEY=your-full-key-here", cmd: true },
    ],
  },
  {
    num: "Step 3",
    title: "Start the backend",
    body: "From inside the backend folder:",
    code: [
      { text: "npm install", cmd: true },
      { text: "node server.js", cmd: true },
      { text: "# Prints: Nova Cost Agent — nova-2-lite-v1", cmd: false },
      { text: "# http://localhost:3001", cmd: false },
    ],
  },
  {
    num: "Step 4",
    title: "Start the frontend",
    body: "From inside the frontend folder:",
    code: [
      { text: "npm install", cmd: true },
      { text: "npm run dev", cmd: true },
      { text: "# http://localhost:5173", cmd: false },
    ],
  },
];
