import asyncio
import uuid
from datetime import datetime, timezone, timedelta
from app.core.database import async_session_factory, engine, Base
from app.core.security import hash_password, UserRole
from app.models.user import User, UserProfile, PayoutAccount, UserConsent
from app.models.vendor import VendorOrganisation, VendorMembership, VendorRole, VendorStatus, VendorDocument
from app.models.campaign import Campaign, CampaignQuestion, CampaignType, CampaignStatus
from app.models.mission import MissionAssignment, MissionStatus
from app.models.submission import Submission, SubmissionAnswer, ProofArtifact, VerificationDecision, SubmissionStatus
from app.models.ledger import (
    LedgerAccount,
    LedgerJournal,
    LedgerPosting,
    LedgerAccountType,
    JournalEntryType,
    PostingDirection,
    PayoutRequest,
    VendorDeposit
)
from app.models.dispute import Dispute, DisputeMessage, DisputeStatus
from app.models.notification import Notification
from app.models.fraud import FraudEvent
from app.services.ledger_service import LedgerService

async def seed_all():
    print("🌱 Starting Incorvo Reach Seed Data Generator...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as db:
        now = datetime.now(timezone.utc)
        default_pwd = hash_password("IncorvoPass2026!")

        # 1. Super Admin & Moderator
        admin_user = User(
            email="admin@reach.incorvo.in",
            phone="+919876543210",
            hashed_password=default_pwd,
            role=UserRole.SUPER_ADMIN,
            is_active=True,
            is_verified=True,
            phone_verified=True
        )
        mod_user = User(
            email="moderator@reach.incorvo.in",
            phone="+919876543211",
            hashed_password=default_pwd,
            role=UserRole.VERIFIER_MODERATOR,
            is_active=True,
            is_verified=True,
            phone_verified=True
        )
        db.add_all([admin_user, mod_user])
        await db.flush()

        admin_profile = UserProfile(user_id=admin_user.id, full_name="Aarav Sharma", city="Bengaluru", state="Karnataka")
        mod_profile = UserProfile(user_id=mod_user.id, full_name="Priya Nair", city="Mumbai", state="Maharashtra")
        db.add_all([admin_profile, mod_profile])

        # 2. Vendors
        vendor_owner_user = User(
            email="founder@novahealth.in",
            phone="+919811223344",
            hashed_password=default_pwd,
            role=UserRole.VENDOR_OWNER,
            is_active=True,
            is_verified=True,
            phone_verified=True
        )
        vendor_owner_2 = User(
            email="growth@zenithsaas.io",
            phone="+919822334455",
            hashed_password=default_pwd,
            role=UserRole.VENDOR_OWNER,
            is_active=True,
            is_verified=True,
            phone_verified=True
        )
        db.add_all([vendor_owner_user, vendor_owner_2])
        await db.flush()

        # Vendor Organisations: 1 Verified, 1 Pending
        vendor_verified = VendorOrganisation(
            legal_name="NovaHealth Organics Private Limited",
            display_name="NovaHealth Organics",
            industry="Health & Wellness / D2C",
            business_type="PRIVATE_LIMITED",
            registration_number="U74999KA2021PTC145892",
            gst_number="29AABCN1234F1Z5",
            registered_address="Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
            website="https://novahealth.example.com",
            status=VendorStatus.VERIFIED,
            estimated_monthly_budget=150000.0,
            owner_id=vendor_owner_user.id
        )
        vendor_pending = VendorOrganisation(
            legal_name="Zenith Cloud Technologies LLP",
            display_name="Zenith SaaS",
            industry="B2B Software / Enterprise",
            business_type="LLP",
            registration_number="AAB-9921",
            gst_number="27AABFZ9876C1ZV",
            registered_address="Bandra Kurla Complex, Mumbai, Maharashtra 400051",
            website="https://zenithsaas.example.com",
            status=VendorStatus.UNDER_REVIEW,
            estimated_monthly_budget=75000.0,
            owner_id=vendor_owner_2.id
        )
        db.add_all([vendor_verified, vendor_pending])
        await db.flush()

        db.add(VendorMembership(vendor_id=vendor_verified.id, user_id=vendor_owner_user.id, role=VendorRole.OWNER))
        db.add(VendorMembership(vendor_id=vendor_pending.id, user_id=vendor_owner_2.id, role=VendorRole.OWNER))

        # 3. 5 Realistic Participant Users
        participants_data = [
            ("ananya.iyer@gmail.com", "Ananya Iyer", "Chennai", "Tamil Nadu", "600028", "25-34", "Software Engineer", ["Tech", "Fitness", "Sustainability"], "ananya.iyer@okhdfcbank"),
            ("rohit.verma@outlook.com", "Rohit Verma", "Delhi", "Delhi", "110001", "18-24", "Graduate Student", ["Gaming", "D2C Brands", "Coffee"], "rohit.verma@oksbi"),
            ("kavita.patel@yahoo.com", "Kavita Patel", "Ahmedabad", "Gujarat", "380015", "35-44", "Marketing Consultant", ["Organic Food", "Travel", "Fintech"], "kavita.patel@icici"),
            ("vikram.deshmukh@gmail.com", "Vikram Deshmukh", "Pune", "Maharashtra", "411004", "25-34", "UX Designer", ["Design", "Gadgets", "EVs"], "vikram.d@okaxis"),
            ("sneha.menon@gmail.com", "Sneha Menon", "Kochi", "Kerala", "682001", "25-34", "Nutritionist", ["Nutrition", "Yoga", "Skincare"], "sneha.menon@paytm")
        ]

        participant_users = []
        payout_accounts_list = []
        for idx, (p_email, p_name, city, state, pin, age, occ, ints, upi_id) in enumerate(participants_data):
            p_user = User(
                email=p_email,
                phone=f"+91980000000{idx+1}",
                hashed_password=default_pwd,
                role=UserRole.PARTICIPANT,
                is_active=True,
                is_verified=True,
                phone_verified=True
            )
            db.add(p_user)
            await db.flush()

            profile = UserProfile(
                user_id=p_user.id,
                full_name=p_name,
                city=city,
                state=state,
                pin_code=pin,
                age_range=age,
                occupation=occ,
                interests=ints,
                preferred_language="English"
            )
            payout = PayoutAccount(
                user_id=p_user.id,
                account_type="UPI",
                account_holder_name=p_name,
                account_identifier=upi_id,
                is_verified=True,
                is_primary=True
            )
            consent = UserConsent(
                user_id=p_user.id,
                consent_type="TERMS_AND_PRIVACY_V1",
                version="1.0"
            )
            db.add_all([profile, payout, consent])
            participant_users.append(p_user)
            payout_accounts_list.append(payout)

        await db.flush()

        # 4. Record Vendor Deposits in Ledger
        await LedgerService.record_vendor_deposit(db, vendor_verified.id, 100000.0, "DEP_ICICI_20260822_001")

        # 5. Create Realistic Campaigns
        c1 = Campaign(
            vendor_id=vendor_verified.id,
            title="Plant-Based Protein Bar Flavor & Texture Feedback",
            tagline="Taste test NovaHealth's new almond fudge protein bar and provide honest private research.",
            description="We are formulating a clean-label protein bar with zero artificial sweeteners. Complete a structured 12-question private feedback survey evaluating texture, sweetness and satiety.",
            template_type=CampaignType.PRIVATE_SURVEY,
            status=CampaignStatus.LIVE,
            reward_per_action=150.0,
            platform_fee_per_action=22.5,
            total_capacity=100,
            remaining_capacity=97,
            total_budget=17250.0,
            budget_spent=450.0,
            estimated_time_minutes=8,
            proof_instructions="Answer all 6 private survey questions with genuine, detailed feedback.",
            verification_method="MANUAL_REVIEW",
            target_audience_json={"age_range": ["18-24", "25-34", "35-44"], "interests": ["Fitness", "Organic Food", "Nutrition"]}
        )
        c2 = Campaign(
            vendor_id=vendor_verified.id,
            title="Original Morning Routine UGC Video with Nova Matcha",
            tagline="Create an unscripted, genuine 30-45s vertical video incorporating organic ceremonial matcha.",
            description="Demonstrate your authentic morning preparation of Nova Matcha. Focus on clarity, good lighting, and natural aesthetic. No exaggerated claims required or allowed.",
            template_type=CampaignType.UGC,
            status=CampaignStatus.LIVE,
            reward_per_action=850.0,
            platform_fee_per_action=127.5,
            total_capacity=20,
            remaining_capacity=19,
            total_budget=19550.0,
            budget_spent=977.5,
            estimated_time_minutes=25,
            proof_instructions="Upload your high-definition MP4 vertical video (1080x1920) showcasing authentic preparation.",
            verification_method="MANUAL_REVIEW",
            target_audience_json={"age_range": ["25-34", "35-44"]}
        )
        c3 = Campaign(
            vendor_id=vendor_verified.id,
            title="Clean Beauty & Cold-Pressed Oil Consumer Study",
            tagline="Watch a 3-minute ingredient breakdown and test your knowledge with a 4-question quiz.",
            description="Learn how chemical solvent extraction differs from wood-pressed virgin extraction. Watch the short educational clip and answer the verification quiz with 100% accuracy.",
            template_type=CampaignType.VIDEO_QUIZ,
            status=CampaignStatus.LIVE,
            reward_per_action=75.0,
            platform_fee_per_action=11.25,
            total_capacity=200,
            remaining_capacity=198,
            total_budget=17250.0,
            budget_spent=172.5,
            estimated_time_minutes=5,
            proof_instructions="Complete the full video playback without skipping and pass the quiz.",
            verification_method="AUTOMATED_CHECK",
            target_audience_json={"interests": ["Skincare", "Sustainability", "Organic Food"]}
        )
        c4 = Campaign(
            vendor_id=vendor_verified.id,
            title="Flagship Experience Store QR Check-in & Visit",
            tagline="Visit our flagship wellness lounge in Indiranagar, scan the rotating in-store QR and explore.",
            description="Experience our sensory herbal dispensary in Bengaluru. Scan the in-store rotating kiosk code and tell us about your store discovery experience.",
            template_type=CampaignType.STORE_VISIT,
            status=CampaignStatus.LIVE,
            reward_per_action=200.0,
            platform_fee_per_action=30.0,
            total_capacity=50,
            remaining_capacity=49,
            total_budget=11500.0,
            budget_spent=230.0,
            estimated_time_minutes=15,
            proof_instructions="Scan the dynamic in-store QR code and submit photo of your visit receipt or lounge card.",
            verification_method="MANUAL_REVIEW",
            target_audience_json={"city": ["Bengaluru"]}
        )
        db.add_all([c1, c2, c3, c4])
        await db.flush()

        # Hold campaign budgets in ledger escrow
        await LedgerService.hold_campaign_budget(db, vendor_verified.id, c1.id, c1.total_budget)
        await LedgerService.hold_campaign_budget(db, vendor_verified.id, c2.id, c2.total_budget)
        await LedgerService.hold_campaign_budget(db, vendor_verified.id, c3.id, c3.total_budget)
        await LedgerService.hold_campaign_budget(db, vendor_verified.id, c4.id, c4.total_budget)

        # Questions for Campaign 1
        q1 = CampaignQuestion(
            campaign_id=c1.id,
            question_text="How would you rate the texture balance of the Almond Fudge bar?",
            question_type="SINGLE_CHOICE",
            order_index=1,
            is_required=True,
            options_json=["Too dense/chewy", "Perfect texture balance", "A bit dry/crumbly", "Too soft"]
        )
        q2 = CampaignQuestion(
            campaign_id=c1.id,
            question_text="Did you experience any lingering artificial or stevia aftertaste?",
            question_type="SINGLE_CHOICE",
            order_index=2,
            is_required=True,
            options_json=["No aftertaste (clean finish)", "Mild stevia note", "Noticeable aftertaste"]
        )
        q3 = CampaignQuestion(
            campaign_id=c1.id,
            question_text="What flavor variation would you be most excited to see next?",
            question_type="TEXT",
            order_index=3,
            is_required=False,
            options_json=[]
        )
        db.add_all([q1, q2, q3])
        await db.flush()

        # 6. Create Completed & Approved Mission Submissions (Simulating genuine user participation)
        # Participant 0 (Ananya) completes Survey -> APPROVED -> Ledger settlement
        assign1 = MissionAssignment(
            campaign_id=c1.id,
            participant_id=participant_users[0].id,
            status=MissionStatus.APPROVED,
            reserved_at=now - timedelta(days=2),
            expires_at=now - timedelta(days=1),
            submitted_at=now - timedelta(days=2, hours=-1),
            completed_at=now - timedelta(days=1, hours=20)
        )
        db.add(assign1)
        await db.flush()

        sub1 = Submission(
            assignment_id=assign1.id,
            campaign_id=c1.id,
            participant_id=participant_users[0].id,
            status=SubmissionStatus.APPROVED,
            risk_score=0.02,
            automated_checks_passed=True,
            submitted_at=now - timedelta(days=2, hours=-1)
        )
        db.add(sub1)
        await db.flush()

        db.add(SubmissionAnswer(submission_id=sub1.id, question_id=q1.id, answer_text="Perfect texture balance"))
        db.add(SubmissionAnswer(submission_id=sub1.id, question_id=q2.id, answer_text="No aftertaste (clean finish)"))
        db.add(SubmissionAnswer(submission_id=sub1.id, question_id=q3.id, answer_text="Roasted Hazelnut Dark Chocolate"))
        db.add(ProofArtifact(submission_id=sub1.id, artifact_type="RECEIPT", file_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c", file_name="sample_unpack.jpg", file_size_bytes=420000))
        db.add(VerificationDecision(submission_id=sub1.id, decided_by_user_id=vendor_owner_user.id, decision="APPROVED", decided_at=now - timedelta(days=1, hours=20), participant_feedback="Detailed and thoughtful feedback. Thank you!"))

        # Settle ledger for sub1
        await LedgerService.settle_approved_mission(db, sub1.id, participant_users[0].id, c1.reward_per_action, c1.platform_fee_per_action)

        # Participant 1 (Rohit) completes UGC video -> APPROVED -> Ledger settlement
        assign2 = MissionAssignment(
            campaign_id=c2.id,
            participant_id=participant_users[1].id,
            status=MissionStatus.APPROVED,
            reserved_at=now - timedelta(days=3),
            expires_at=now - timedelta(days=2),
            submitted_at=now - timedelta(days=2, hours=18),
            completed_at=now - timedelta(days=2, hours=10)
        )
        db.add(assign2)
        await db.flush()

        sub2 = Submission(
            assignment_id=assign2.id,
            campaign_id=c2.id,
            participant_id=participant_users[1].id,
            status=SubmissionStatus.APPROVED,
            risk_score=0.01,
            automated_checks_passed=True,
            submitted_at=now - timedelta(days=2, hours=18)
        )
        db.add(sub2)
        await db.flush()

        db.add(ProofArtifact(submission_id=sub2.id, artifact_type="VIDEO", file_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", file_name="morning_matcha_routine_hd.mp4", file_size_bytes=18500000))
        db.add(VerificationDecision(submission_id=sub2.id, decided_by_user_id=vendor_owner_user.id, decision="APPROVED", decided_at=now - timedelta(days=2, hours=10), participant_feedback="Crisp lighting, natural aesthetic, perfectly fits our brand guidelines."))
        await LedgerService.settle_approved_mission(db, sub2.id, participant_users[1].id, c2.reward_per_action, c2.platform_fee_per_action)

        # Participant 2 (Kavita) - Payout Request (₹850)
        payout_req = PayoutRequest(
            user_id=participant_users[1].id,
            payout_account_id=payout_accounts_list[1].id,
            amount=500.0,
            currency="INR",
            status="PAID",
            provider_reference="RZP_PAYOUT_992147",
            processed_at=now - timedelta(days=1)
        )
        db.add(payout_req)

        # Participant 3 (Vikram) has a pending submission in review
        assign3 = MissionAssignment(
            campaign_id=c1.id,
            participant_id=participant_users[3].id,
            status=MissionStatus.SUBMITTED,
            reserved_at=now - timedelta(hours=5),
            expires_at=now + timedelta(hours=19),
            submitted_at=now - timedelta(hours=2)
        )
        db.add(assign3)
        await db.flush()

        sub3 = Submission(
            assignment_id=assign3.id,
            campaign_id=c1.id,
            participant_id=participant_users[3].id,
            status=SubmissionStatus.PENDING_REVIEW,
            risk_score=0.03,
            automated_checks_passed=True,
            submitted_at=now - timedelta(hours=2)
        )
        db.add(sub3)
        await db.flush()

        db.add(SubmissionAnswer(submission_id=sub3.id, question_id=q1.id, answer_text="A bit dry/crumbly"))
        db.add(SubmissionAnswer(submission_id=sub3.id, question_id=q2.id, answer_text="Mild stevia note"))
        db.add(SubmissionAnswer(submission_id=sub3.id, question_id=q3.id, answer_text="Cardamom Pistachio Crunch"))

        # Participant 4 (Sneha) has 1 open dispute regarding a rejected photo resolution
        assign4 = MissionAssignment(
            campaign_id=c2.id,
            participant_id=participant_users[4].id,
            status=MissionStatus.DISPUTED,
            reserved_at=now - timedelta(days=4),
            expires_at=now - timedelta(days=3),
            submitted_at=now - timedelta(days=3, hours=12)
        )
        db.add(assign4)
        await db.flush()

        sub4 = Submission(
            assignment_id=assign4.id,
            campaign_id=c2.id,
            participant_id=participant_users[4].id,
            status=SubmissionStatus.DISPUTED,
            risk_score=0.15,
            automated_checks_passed=True,
            submitted_at=now - timedelta(days=3, hours=12)
        )
        db.add(sub4)
        await db.flush()

        db.add(VerificationDecision(submission_id=sub4.id, decided_by_user_id=vendor_owner_user.id, decision="REJECTED", rejection_reason_code="VIDEO_ORIENTATION_INCORRECT", internal_notes="Video submitted in 16:9 instead of 9:16 vertical", participant_feedback="Please submit vertical 9:16 framing", decided_at=now - timedelta(days=2)))

        disp = Dispute(
            submission_id=sub4.id,
            raised_by_user_id=participant_users[4].id,
            target_vendor_id=vendor_verified.id,
            dispute_reason="Video format clarification",
            explanation="I re-exported the 9:16 vertical crop at full 1080x1920 60fps and uploaded the updated master link.",
            status=DisputeStatus.UNDER_INVESTIGATION,
            assigned_moderator_id=mod_user.id
        )
        db.add(disp)

        # 1 Fraud Event for security demonstration
        db.add(FraudEvent(
            user_id=participant_users[3].id,
            campaign_id=c1.id,
            rule_triggered="COMPLETION_SPEED_ANOMALY_CHECK",
            risk_severity="LOW",
            risk_score_delta=0.03,
            details_json={"completion_time_seconds": 185, "average_expected_seconds": 480},
            is_reviewed=True,
            action_taken="ALLOWED_WITH_LOGGING"
        ))

        await db.commit()
        print("✅ Incorvo Reach Database seeded successfully with realistic test data!")

if __name__ == "__main__":
    asyncio.run(seed_all())
