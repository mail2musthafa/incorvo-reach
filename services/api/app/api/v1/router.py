from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.campaigns import router as campaigns_router
from app.api.v1.missions import router as missions_router
from app.api.v1.wallet import router as wallet_router
from app.api.v1.vendors import router as vendors_router
from app.api.v1.admin import router as admin_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.disputes import router as disputes_router
from app.api.v1.proofs import router as proofs_router
from app.api.v1.users import router as users_router
from app.api.v1.ai import router as ai_router
from app.api.v1.leads import router as leads_router
from app.api.v1.reputation import router as reputation_router
from app.api.v1.developer import router as developer_router
from app.api.v1.research_studio import router as research_studio_router
from app.api.v1.sampling import router as sampling_router
from app.api.v1.content_studio import router as content_studio_router
from app.api.v1.field_operations import router as field_operations_router
from app.api.v1.partner_attribution import router as partner_attribution_router
from app.api.v1.sales_enablement import router as sales_enablement_router
from app.api.v1.benchmarks import router as benchmarks_router
from app.api.v1.managed_ops import router as managed_ops_router
from app.api.v1.supply import router as supply_router
from app.api.v1.health import router as health_router
from app.api.v1.erah.router import router as erah_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(campaigns_router)
api_v1_router.include_router(missions_router)
api_v1_router.include_router(wallet_router)
api_v1_router.include_router(vendors_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(disputes_router)
api_v1_router.include_router(proofs_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(erah_router)
api_v1_router.include_router(leads_router)
api_v1_router.include_router(reputation_router)
api_v1_router.include_router(developer_router)
api_v1_router.include_router(research_studio_router)
api_v1_router.include_router(sampling_router)
api_v1_router.include_router(content_studio_router)
api_v1_router.include_router(field_operations_router)
api_v1_router.include_router(partner_attribution_router)
api_v1_router.include_router(sales_enablement_router)
api_v1_router.include_router(benchmarks_router)
api_v1_router.include_router(managed_ops_router)
api_v1_router.include_router(supply_router)
