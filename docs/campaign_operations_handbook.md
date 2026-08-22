# Incorvo Reach — Campaign Operations Handbook

**Platform Tagline**: *Verified Actions. Measurable Growth.*  
**Operating Entity**: Quenix Analytics Private Limited  
**Version**: 1.0.0 (Internal Operations Standard)

---

## 1. Purpose & Guiding Principles

This handbook governs the operational lifecycle of every campaign published on Incorvo Reach. It serves as the standard operating procedure for Campaign Operations, Verification Moderators, Trust & Safety Officers, and Finance Managers.

### Foundational Principles
1. **Objective Verification Criteria**: Every campaign brief must state exact, measurable proof requirements. No subjective "we liked the tone" rejections without objective criteria violations.
2. **Zero Review Coercion**: Paid public ratings (Google Maps, App Store, Amazon 5-star reviews) and follower manipulation are legally prohibited under consumer protection laws.
3. **Double-Entry Escrow Invariant**: Campaign funds are debited from the vendor's available balance and held in the `CAMPAIGN_REWARD_RESERVE` ledger account upon launch. Unspent funds are 100% refundable upon cancellation.

---

## 2. Operating Policy by Campaign Pillar

### 2.1 Awareness & Education (Video with Quiz, Walkthroughs)
* **Who Can Create**: Verified D2C Brands, B2B SaaS, Edtech, Financial Services.
* **Eligible Participants**: Minimum Tier: `BRONZE`. Verified phone number required.
* **Mandatory Proof**: 100% video watch event timestamp + minimum 80% passing score on comprehension quiz.
* **Standard Reward Benchmark**: ₹50.00 – ₹100.00 per completed action.
* **Verification SLA**: Automated immediate check ($< 1$ second).
* **Rejection Conditions**: Quiz score $< 80\%$ (participant may retry once after 24h).

### 2.2 Private Research & Usability Studies (Surveys, Screen Recordings)
* **Who Can Create**: Product Managers, UX Researchers, Market Intelligence Agencies.
* **Eligible Participants**: Minimum Tier: `SILVER` for unmoderated recording; `GOLD` for moderated interviews.
* **Mandatory Proof**: Minimum 50-word detailed answers for qualitative questions; HD 1080p screen recording with audio.
* **Standard Reward Benchmark**: ₹150.00 – ₹850.00 per study session.
* **Verification SLA**: 24 business hours.
* **Rejection Conditions**: Gibberish/copy-paste responses, completion velocity anomaly ($< 20\%$ expected time), inaudible microphone audio.

### 2.3 User-Generated Content (UGC Videos & Photography)
* **Who Can Create**: Marketing Directors, Creative Agencies, D2C Founders.
* **Eligible Participants**: Minimum Tier: `GOLD` (Verified Creator Badge).
* **Mandatory Proof**: 9:16 vertical 1080x1920 60fps unedited master file + raw audio + signed commercial rights contract.
* **Standard Reward Benchmark**: ₹850.00 – ₹2,500.00 per video deliverable.
* **Verification SLA**: 48 business hours (allows 1 round of creator revision).
* **Rejection Conditions**: Blurry footage, 16:9 horizontal crop, competitor logo visible, missing required product disclosure.

### 2.4 Retail Field Operations (Store Audits, Mystery Visits, QR Check-in)
* **Who Can Create**: FMCG Brands, Supermarket Chains, Retail Distributors.
* **Eligible Participants**: Participants within 5km geofence radius.
* **Mandatory Proof**: Geotagged camera photo proof + timestamped rotating kiosk QR token scan.
* **Standard Reward Benchmark**: ₹150.00 – ₹350.00 per verified store audit.
* **Verification SLA**: 12 business hours.
* **Rejection Conditions**: GPS coordinates outside store geofence, expired QR token, obstructed shelf photo.

### 2.5 B2B/B2C Qualified Lead Generation
* **Who Can Create**: Enterprise SaaS, Real Estate Developers, Financial Consultancies.
* **Eligible Participants**: Consented targeted demographics (Job Title / City / Age verified).
* **Mandatory Proof**: Valid business email + OTP-verified phone number + affirmative consent timestamp.
* **Standard Reward Benchmark**: ₹250.00 – ₹750.00 per qualified lead.
* **Verification SLA**: 24 business hours (automated phone ping + CRM webhook delivery).
* **Rejection Conditions**: Disposable email domain, invalid phone number, duplicate identity hash.

---

## 3. Moderation, Disqualification & Appeal Rules

1. **Standardized Rejection Codes**:
   * `REQUIREMENT_NOT_MET`: Specific brief checklist step was skipped.
   * `IMAGE_BLURRY`: Camera photo lacks resolution to verify SKU or receipt.
   * `SUSPECTED_DUPLICATE`: Perceptual hash or receipt reference duplicate found.
   * `COMPLETION_TOO_FAST`: Completion time $< 20\%$ of minimum required.
   * `ORIENTATION_WRONG`: Video submitted in 16:9 instead of 9:16 vertical.
2. **Participant Appeal SLA**: Participants have **72 hours** to raise an appeal with supporting evidence. An impartial Incorvo compliance officer arbitrates within **24 hours**.

---

## 4. Financial Settlement & Reconciliation Policies

* **Hold Period**: Rewards become withdrawable immediately upon verification approval.
* **Minimum Payout**: ₹500.00 threshold via direct UPI VPA or NEFT/IMPS mobile number transfer.
* **Daily Reconciliation**: System double-entry equation $\sum \text{Debit} \equiv \sum \text{Credit}$ reconciled daily at 23:59 IST.
* **Campaign Cancellation**: When a vendor cancels a live campaign, $100\%$ of unspent allocated funds are refunded into the vendor's available balance instantly.
