# Urja — CBG Plant MRV & Monitoring Platform

Interactive product demo for India’s CBG / digital MRV stack: monitoring, mass balance, CI scoring, carbon credits, audit evidence, and multi-plant portfolio.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo roles

Use **Demo roles** on login:

| Role | Lands on |
|---|---|
| Plant Owner | Dashboard (multi-plant + portfolio) |
| Plant Operator | Digesters / work orders |
| Auditor (ACVA) | Evidence vault (read-only) |
| Super Admin | Full platform |

## Feature map (vs market)

| Module | Why it exists | Competitor reference |
|---|---|---|
| Dashboard | ₹ ROI morning brief | Quintrace monetize framing |
| Digesters | Color-zoned vitals | GPS Renewables ShiftKeeper |
| Feedstock | Intake + farmer ledger | Aegex FACTS / plant ops |
| **Mass balance** | Chain of custody | Rimba, Mangrove, ISCC |
| Gas & dispatch | Yield m³/t | iFactory mass balance |
| **Lab & flares** | Chemistry + destruction | GPS LabDesk, avoided-CH₄ MRV |
| Carbon tracker | Credit bank lifecycle | Goenvi / GreenLoop |
| **CI Score** | Intensity → credit ₹ | Civerify, Mangrove, iFactory |
| Reports / MRV | Replace consultant | Goenvi registry reports |
| Evidence vault | Hash chain | Goenvi blockchain ledger |
| **Data quality** | Gap QA/QC | Rimba substitution rules |
| **Compliance** | Filing calendar | Civerify deadline intel |
| **Work orders** | Alert → close loop | Ops CMMS pattern |
| **Portfolio** | Plant vs plant | Multi-site benchmarking |
| **Devices** | IoT health | SCADA/sensor trust |
| Alerts / Settings | Thresholds + billing | Standard SaaS |

Design principle: every owner login shows money protected, consultant cost avoided, or carbon ₹ in pipeline.
