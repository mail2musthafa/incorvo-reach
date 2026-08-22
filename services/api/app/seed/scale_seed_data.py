import asyncio
import random
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func
from app.core.database import async_session_factory, engine, Base
from app.core.security import hash_password
from app.models.user import User, UserProfile, PayoutAccount, UserConsent
from app.models.vendor import VendorOrganisation, VendorMembership, VendorDocument, VendorStatus, VendorRole
from app.models.organization import Workspace, Brand
from app.models.campaign import Campaign, CampaignQuestion, CampaignStatus, CampaignType, CampaignStatusHistory
from app.models.mission import MissionAssignment, MissionStatus
from app.models.submission import Submission, SubmissionAnswer, ProofArtifact, VerificationDecision, SubmissionStatus
from app.models.reputation import ParticipantReputation, ParticipantTier
from app.models.crm import LeadRecord, LeadStatus
from app.models.developer import ApiKey, WebhookSubscription
from app.services.ledger_service import LedgerService

CITIES = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Kochi", "Chandigarh", "Indore"]
FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Chiara", "Riya", "Anushka", "Sneha", "Kavita", "Pooja", "Meera", "Tara", "Rohan", "Vikram", "Neha", "Rahul", "Tanvi", "Siddharth", "Gaurav"]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Mehta", "Iyer", "Nair", "Reddy", "Rao", "Gupta", "Singh", "Kumar", "Joshi", "Bose", "Menon", "Deshmukh", "Chopra", "Malhotra", "Kulkarni", "Aggarwal", "Bhat"]

INDUSTRIES = [
    "D2C Health & Wellness", "B2B SaaS & Cloud", "E-commerce & Fashion", "Organic Food & Beverages", 
    "Fintech & Payments", "Edtech & Upskilling", "Clean Beauty & Skincare", "Consumer Electronics",
    "Mobility & EV", "Hospitality & Dining", "Real Estate & Co-living", "Pet Care & Nutrition"
]

COMPANY_PREFIXES = ["Nova", "Zenith", "Aura", "Pure", "Veda", "Nutri", "Cloud", "Pulse", "True", "Urban", "Eco", "Prime", "Next", "Core", "Blue", "Hyper", "Loom", "Peak", "Fresh", "Terra"]
COMPANY_SUFFIXES = ["Health", "Organics", "Technologies", "Labs", "SaaS", "Foods", "Care", "Ventures", "Living", "Mobility", "Brews", "Boutique", "Networks", "Solutions", "Apparel"]

async def seed_scale_data():
    print("🚀 Initializing Scale Seeder (100 Vendors & 1,000 Participants)...")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as db:
        hashed_pwd = hash_password("IncorvoPass2026!")

        # 1. Check existing users count
        existing_users_cnt = (await db.execute(select(func.count(User.id)))).scalar_one()
        if existing_users_cnt >= 1050:
            print(f"✅ Scale database already contains {existing_users_cnt} users. Skipping redundant seed.")
            return

        print("📦 Step 1: Generating 1,000 Realistic Participant Accounts...")
        participants = []
        for i in range(1, 1001):
            fname = random.choice(FIRST_NAMES)
            lname = random.choice(LAST_NAMES)
            city = random.choice(CITIES)
            email = f"user_{i:04d}.{fname.lower()}.{lname.lower()}@reachdemo.in"
            phone = f"+91 {random.randint(90000, 99999)} {random.randint(10000, 99999)}"

            user = User(
                email=email,
                phone=phone,
                hashed_password=hashed_pwd,
                role="PARTICIPANT",
                is_active=True,
                is_verified=True,
                phone_verified=True
            )
            db.add(user)
            await db.flush()

            profile = UserProfile(
                user_id=user.id,
                full_name=f"{fname} {lname}",
                city=city,
                state="Karnataka" if city == "Bengaluru" else "Maharashtra" if city in ["Mumbai", "Pune"] else "Delhi",
                pin_code=f"{random.randint(110001, 700001)}",
                age_range=random.choice(["18-24", "25-34", "35-44"]),
                occupation=random.choice(["Software Engineer", "Product Specialist", "Student", "Marketing Consultant", "UX Designer", "Data Analyst", "Freelancer"]),
                interests=random.sample(["Health & Fitness", "Organic Food", "Technology", "Skincare", "Travel", "Coffee", "Podcasts", "Fintech"], k=3),
                preferred_language="English"
            )
            db.add(profile)

            payout_acc = PayoutAccount(
                user_id=user.id,
                account_type="UPI",
                account_holder_name=f"{fname} {lname}",
                account_identifier=f"{fname.lower()}.{lname.lower()}@okaxis",
                is_verified=True,
                is_primary=True
            )
            db.add(payout_acc)

            # Reputation
            rep = ParticipantReputation(
                user_id=user.id,
                reliability_score=round(random.uniform(90.0, 99.8), 1),
                tier=random.choice([ParticipantTier.BRONZE, ParticipantTier.SILVER, ParticipantTier.GOLD, ParticipantTier.PLATINUM]),
                total_completed_missions=random.randint(2, 25),
                total_approved_missions=random.randint(2, 25),
                high_value_eligible=True,
                category_expertise_json={"Health": random.randint(1, 10), "Tech": random.randint(1, 8)},
                badges_json=["VERIFIED_CREATOR", "THOROUGH_RESEARCHER"]
            )
            db.add(rep)

            participants.append(user)

        await db.commit()
        print(f"✓ 1,000 Participants created with profiles, UPI accounts, and reputations.")

        print("📦 Step 2: Generating 100 Verified Vendor Organizations & Workspaces...")
        vendors = []
        for v_idx in range(1, 101):
            pfx = random.choice(COMPANY_PREFIXES)
            sfx = random.choice(COMPANY_SUFFIXES)
            cname = f"{pfx}{sfx} {v_idx}"
            industry = random.choice(INDUSTRIES)
            city = random.choice(CITIES)

            owner_user = User(
                email=f"founder_{v_idx:03d}@{pfx.lower()}{sfx.lower()}.in",
                phone=f"+91 98{v_idx:02d}0 12345",
                hashed_password=hashed_pwd,
                role="VENDOR_OWNER",
                is_active=True,
                is_verified=True
            )
            db.add(owner_user)
            await db.flush()

            vendor_org = VendorOrganisation(
                legal_name=f"{cname} Private Limited",
                display_name=cname,
                industry=industry,
                business_type="PRIVATE_LIMITED",
                registration_number=f"U72900KA202{random.randint(0,6)}PTC{random.randint(100000, 999999)}",
                gst_number=f"29AAACB{random.randint(1000,9999)}F1Z{random.randint(1,9)}",
                registered_address=f"Tech Hub, {city}",
                status=VendorStatus.VERIFIED,
                estimated_monthly_budget=float(random.randint(50000, 500000)),
                owner_id=owner_user.id
            )
            db.add(vendor_org)
            await db.flush()

            membership = VendorMembership(
                vendor_id=vendor_org.id,
                user_id=owner_user.id,
                role=VendorRole.OWNER,
                is_active=True
            )
            db.add(membership)

            # Workspace & Brand
            ws = Workspace(
                vendor_id=vendor_org.id,
                name=f"{cname} Main Workspace",
                slug=f"{pfx.lower()}-{sfx.lower()}-{v_idx}",
                is_default=True
            )
            db.add(ws)
            await db.flush()

            brand = Brand(
                workspace_id=ws.id,
                name=cname,
                is_active=True
            )
            db.add(brand)

            # Initial Deposit in Double-Entry Ledger
            initial_deposit = float(random.randint(25000, 150000))
            await LedgerService.record_vendor_deposit(
                db, vendor_org.id, initial_deposit, f"INIT_SCALE_DEP_{v_idx:03d}"
            )

            vendors.append(vendor_org)

        await db.commit()
        print(f"✓ 100 Vendors created with workspaces, brands, and double-entry deposit accounts.")

        print("📦 Step 3: Generating Active Campaigns, Submissions, and Leads...")
        # Create campaigns for the first 40 vendors
        for i, vendor in enumerate(vendors[:40]):
            reward = float(random.choice([100.0, 150.0, 200.0, 350.0, 850.0]))
            fee = round(reward * 0.15, 2)
            capacity = random.choice([25, 50, 100])
            total_budget = round((reward + fee) * capacity, 2)
            c_type = random.choice([CampaignType.PRIVATE_SURVEY, CampaignType.UGC, CampaignType.VIDEO_QUIZ, CampaignType.STORE_VISIT, CampaignType.QUALIFIED_LEAD])

            camp = Campaign(
                vendor_id=vendor.id,
                title=f"{vendor.display_name} — Customer Feedback & Action Campaign",
                tagline=f"Participate in authentic {c_type.lower()} research for verified rewards.",
                description=f"We are evaluating market sentiment and creative feedback for {vendor.display_name}. Complete all steps genuinely.",
                template_type=c_type,
                status=CampaignStatus.LIVE,
                reward_per_action=reward,
                platform_fee_per_action=fee,
                total_capacity=capacity,
                remaining_capacity=capacity - 5,
                total_budget=total_budget,
                budget_spent=round((reward + fee) * 5, 2),
                estimated_time_minutes=random.choice([5, 8, 12, 20]),
                proof_instructions="Provide structured, honest answers with attached photo/video verification."
            )
            db.add(camp)
            await db.flush()

            # Ledger hold
            await LedgerService.hold_campaign_budget(db, vendor.id, camp.id, total_budget)

            # Campaign questions
            q1 = CampaignQuestion(
                campaign_id=camp.id,
                question_text="How would you rate the overall product experience and quality?",
                question_type="TEXT",
                order_index=0,
                is_required=True
            )
            q2 = CampaignQuestion(
                campaign_id=camp.id,
                question_text="What would make you recommend this product to peers?",
                question_type="TEXT",
                order_index=1,
                is_required=True
            )
            db.add_all([q1, q2])

            # Sample assignments and submissions
            for p_sub_idx in range(5):
                part_user = participants[i * 5 + p_sub_idx]
                assignment = MissionAssignment(
                    campaign_id=camp.id,
                    participant_id=part_user.id,
                    status=MissionStatus.APPROVED,
                    reserved_at=datetime.now(timezone.utc) - timedelta(days=2),
                    expires_at=datetime.now(timezone.utc) + timedelta(days=1),
                    submitted_at=datetime.now(timezone.utc) - timedelta(days=1),
                    completed_at=datetime.now(timezone.utc)
                )
                db.add(assignment)
                await db.flush()

                submission = Submission(
                    assignment_id=assignment.id,
                    campaign_id=camp.id,
                    participant_id=part_user.id,
                    status=SubmissionStatus.APPROVED,
                    risk_score=0.02,
                    submitted_at=datetime.now(timezone.utc) - timedelta(days=1)
                )
                db.add(submission)
                await db.flush()

                # Settle reward in ledger
                await LedgerService.settle_approved_mission(
                    db, submission.id, part_user.id, reward, fee
                )

                # Lead Record
                lead = LeadRecord(
                    vendor_id=vendor.id,
                    campaign_id=camp.id,
                    participant_id=part_user.id,
                    lead_name=f"Verified Customer {part_user.id[:6]}",
                    lead_email=part_user.email,
                    lead_phone=part_user.phone,
                    city="Bengaluru",
                    status=LeadStatus.QUALIFIED,
                    consent_granted=True,
                    vendor_notes="High intent qualitative participant feedback."
                )
                db.add(lead)

        await db.commit()

        # Final Ledger Integrity Reconcile
        reconcile = await LedgerService.reconcile_entire_ledger(db)
        print(f"✓ All Scale Campaigns & Submissions settled. Double-entry ledger balanced: {reconcile['is_balanced']} (Variance: ₹{reconcile['variance']})")

    print("\n🎉 Scale Seeding Complete: 100 Vendors, 1,000 Participants, 40+ Campaigns & Double-Entry Ledgers Live!")

if __name__ == "__main__":
    asyncio.run(seed_scale_data())
