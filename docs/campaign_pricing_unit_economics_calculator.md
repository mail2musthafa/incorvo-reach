# Incorvo Reach — Campaign Pricing & Unit-Economics Calculator

**Operating Entity**: Incorvo Reach  
**Model Formula**: $\text{Vendor Payment} - \text{Participant Reward} - \text{Payment Gateway} - \text{Verification SLA} - \text{Fraud Reserve} = \text{Incorvo Net Contribution}$

---

## 1. Unit Economics Matrix by Campaign Type

All calculations are in INR (₹) per single approved outcome:

| Metric / Cost Element | Awareness Video & Quiz | Private UX Survey | UGC Video Deliverable | Retail Store Audit | B2B Demo Qualified Lead |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Gross Price to Vendor** | **₹100.00** | **₹250.00** | **₹1,500.00** | **₹350.00** | **₹600.00** |
| **Participant Reward** | ₹65.00 | ₹160.00 | ₹1,000.00 | ₹220.00 | ₹380.00 |
| **Platform Take-Rate (%)** | 35.0% | 36.0% | 33.3% | 37.1% | 36.7% |
| **Payment Charges (PG ~2%)** | ₹2.00 | ₹5.00 | ₹30.00 | ₹7.00 | ₹12.00 |
| **Verification & Moderation** | ₹1.00 (Auto) | ₹15.00 | ₹65.00 | ₹20.00 | ₹25.00 |
| **Fraud & Dispute Reserve (3%)** | ₹3.00 | ₹7.50 | ₹45.00 | ₹10.50 | ₹18.00 |
| **Net Incorvo Contribution (₹)** | **₹29.00** | **₹62.50** | **₹360.00** | **₹92.50** | **₹165.00** |
| **Net Contribution Margin (%)** | **29.0%** | **25.0%** | **24.0%** | **26.4%** | **27.5%** |

---

## 2. Platform Commercial Tiers

1. **Self-Service Tier**: 20% platform fee on participant reward escrow.
2. **Growth Managed Tier**: 35% margin covering dedicated campaign design, participant screening, and manual proof review.
3. **Enterprise Dedicated Tier**: Annual retainer (₹2.5L – ₹10L/year) with custom SLAs, dedicated Slack channels, and webhook integrations.

---

## 3. Financial Invariant Rules

* **Zero Negative Contribution**: No campaign can be launched if $\text{Vendor Price} < \text{Reward} + \text{Gateway} + \text{Verification SLA}$.
* **Escrow Allocation**: 100% of the gross campaign budget is debited from `VENDOR_AVAILABLE` into `CAMPAIGN_REWARD_RESERVE` before the campaign status is promoted to `LIVE`.
