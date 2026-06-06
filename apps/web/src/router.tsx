import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Step1Identity } from './pages/onboarding/Step1Identity';
import { Step2Workstreams } from './pages/onboarding/Step2Workstreams';
import { Step3Milestones } from './pages/onboarding/Step3Milestones';
import { Step4Risks } from './pages/onboarding/Step4Risks';
import { Step5Users } from './pages/onboarding/Step5Users';
import { Step6Prompts } from './pages/onboarding/Step6Prompts';
import { DirectorCC } from './pages/command-centre/Director';
import { FarmerCC } from './pages/command-centre/Farmer';
import { TechnicalCC } from './pages/command-centre/Tech';
import { OfftakerCC } from './pages/command-centre/Offtaker';
import { PSC_CC } from './pages/command-centre/PSC';
import { GrowersCC } from './pages/command-centre/Growers';
import { MyFarm } from './pages/farmer/MyFarm';
import { Verifications } from './pages/command-centre/Verifications';
import { Authorisations } from './pages/command-centre/Authorisations';
import { PaymentLoader } from './pages/payments/Loader';
import { EcrdaDashboard } from './pages/command-centre/EcrdaDashboard';
import { IBSHub } from './pages/tenants/IBS';
import { RainmakerHub } from './pages/tenants/Rainmaker';
import {
  MTNaidooPropertiesHub,
  Property14WellingtonStreetPage, PropertyMTNFT9BotanicStreetPage, PropertyPDGrant25PanoramaPage,
} from './pages/tenants/MTNaidoo';
import { JKMNaidooFamilyTrustPage, RMNaidooFamilyTrustPage } from './pages/tenants/OtherTenants';
import {
  KhulaWoyiseHub,
  HighRollerzPage, LesembaGalleryPage, CellMaxPage,
  SignatureCoffeeCoPage, ThabosTutoringPage,
} from './pages/tenants/KhulaWoyise';
import {
  WelliesHub, WelliesSalesHub, WelliesOutboundSalesHub,
  WelliesProductionHub,
  WelliesProduction500mlPage, WelliesProduction1_5LPage, WelliesProduction5LPage,
  WelliesProductDevelopmentPage,
  WelliesSignatureRetailPage,
  WelliesPersonalisedLabelsPage, WelliesWaterPage, WelliesEuphoriaPage,
} from './pages/tenants/Wellies';
import {
  SharedServicesHub,
  UpSkillTrainingPage, MaintenanceCoPage,
} from './pages/tenants/SharedServices';
import {
  KnockoutMarketingHub,
  BrandDevelopmentService,
  ContentDevelopmentService,
  CampaignDeploymentService,
  ContentDevAdvertisingSocialService,
  ContentDevTrainingProgrammesService,
  KomCustomersPage,
  PerformanceReportsPage,
} from './pages/tenants/KnockoutMarketing';
import { IBSConsultingHub, MSCECPlaceholder } from './pages/tenants/IBSConsulting';
import { HempireECHub, Ecrda2026MoaWorkspace } from './pages/tenants/HempireEC';
import { OfftakerVettingWorkflow } from './pages/tenants/OfftakerVetting';
import { OfftakerDashboard } from './pages/tenants/OfftakerDashboard';
import {
  GrowerOnboardingHub,
  TrainingPillarPage,
  FarmInfrastructurePillarPage,
  InputsConsumablesPillarPage,
} from './pages/tenants/GrowerOnboarding';
import { SaqaModuleLibrary, SaqaModuleDetail, TrainingDashboard } from './pages/tenants/TrainingSaqa';
import { EngagementsCC } from './pages/command-centre/Engagements';
import { EngagementDetailCC } from './pages/command-centre/EngagementDetail';
import {
  SkillsCentreHub,
  SetaLearnershipsPage,
  FarmerTrainingPage,
  CorporateWorkshopsPage,
  TrainTheTrainerPage,
  CustomProgrammesPage,
} from './pages/tenants/SkillsCentre';
import {
  AffinityAccountingHub,
  MonthlyBookkeepingPage,
  VatProvTaxPage,
  AnnualTaxAfsPage,
  CipcSecretarialPage,
  AuditPrepPage,
} from './pages/tenants/AffinityAccounting';
import {
  IntelligentCapitalHub,
  GrantApplicationPage,
  BlendedFinancePage,
  InvestorIntroductionsPage,
  FinancialModellingPage,
  DueDiligenceSupportPage,
} from './pages/tenants/IntelligentCapital';
import { PSCHub, DEDEATPage, ECDCPage, SEDFAPage, DSBDPage } from './pages/tenants/PSCHub';
import { EcrdaHub, SomdyalaPage, QuvilePage, BlouwPage, QongqoPage, VusoPage } from './pages/tenants/EcrdaHub';
import { MembersHub, HubsPlaceholder } from './pages/tenants/MembersHub';
import { CohortsHub, SeedCohort2Placeholder } from './pages/tenants/CohortsHub';
import { OfftakersHub, FlowerPage, SeedGrainPage, TextileFibresPage, IndustrialFibresPage } from './pages/tenants/OfftakersHub';
import { MonthlyOps } from './pages/ai-skills/MonthlyOps';
import { RiskUpdate } from './pages/ai-skills/RiskUpdate';
import { MovPack } from './pages/ai-skills/MovPack';
import { Quarterly } from './pages/ai-skills/Quarterly';
import { Stakeholder } from './pages/ai-skills/Stakeholder';
import { Subscription } from './pages/billing/Subscription';
import { Invoices } from './pages/billing/Invoices';
// 0010-0011 — Unified Billing + Master Calendar
import { BillingDashboard } from './pages/billing/BillingDashboard';
import { CustomersList } from './pages/billing/CustomersList';
import { CustomerDetail } from './pages/billing/CustomerDetail';
import { InvoicesLedger } from './pages/billing/InvoicesList';
import { InvoiceDetail } from './pages/billing/InvoiceDetail';
import { InvoiceNew } from './pages/billing/InvoiceNew';
import { MasterCalendar } from './pages/calendar/MasterCalendar';
import { useAuthStore } from './lib/auth';

function RequireAuth({ children, role }: { children: JSX.Element; role?: string | string[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (role && !(Array.isArray(role) ? role.includes(user.role) : user.role === role))
    return <Navigate to="/" replace />;
  return children;
}

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cc/director" replace />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/forgot" element={<ForgotPassword />} />
      <Route path="/onboarding/1" element={<RequireAuth role="director"><Step1Identity /></RequireAuth>} />
      <Route path="/onboarding/2" element={<RequireAuth role="director"><Step2Workstreams /></RequireAuth>} />
      <Route path="/onboarding/3" element={<RequireAuth role="director"><Step3Milestones /></RequireAuth>} />
      <Route path="/onboarding/4" element={<RequireAuth role="director"><Step4Risks /></RequireAuth>} />
      <Route path="/onboarding/5" element={<RequireAuth role="director"><Step5Users /></RequireAuth>} />
      <Route path="/onboarding/6" element={<RequireAuth role="director"><Step6Prompts /></RequireAuth>} />
      <Route path="/cc/director" element={<RequireAuth role="director"><DirectorCC /></RequireAuth>} />
      <Route path="/cc/farmer" element={<RequireAuth role="farmer"><FarmerCC /></RequireAuth>} />
      <Route path="/cc/technical" element={<RequireAuth role="technical"><TechnicalCC /></RequireAuth>} />
      <Route path="/cc/offtaker" element={<RequireAuth role="offtaker"><OfftakerCC /></RequireAuth>} />
      <Route path="/cc/psc" element={<RequireAuth role={["director", "psc"]}><PSC_CC /></RequireAuth>} />
      <Route path="/cc/growers" element={<RequireAuth role={["director", "technical", "psc"]}><GrowersCC /></RequireAuth>} />
      <Route path="/my-farm" element={<MyFarm />} />
      <Route path="/cc/verifications" element={<RequireAuth role={["verifier", "director", "psc"]}><Verifications /></RequireAuth>} />
      <Route path="/cc/authorisations" element={<RequireAuth role={["authoriser", "director", "psc"]}><Authorisations /></RequireAuth>} />
      <Route path="/payments/loader" element={<RequireAuth role={["bookkeeper", "director"]}><PaymentLoader /></RequireAuth>} />
      <Route path="/cc/ecrda" element={<RequireAuth role={["ecrda_viewer", "director", "psc"]}><EcrdaDashboard /></RequireAuth>} />
      <Route path="/tenants/ibs" element={<RequireAuth role="director"><IBSHub /></RequireAuth>} />
      <Route path="/tenants/wellies" element={<RequireAuth role="director"><WelliesHub /></RequireAuth>} />
      <Route path="/tenants/wellies/production" element={<RequireAuth role="director"><WelliesProductionHub /></RequireAuth>} />
      <Route path="/tenants/wellies/production/500ml" element={<RequireAuth role="director"><WelliesProduction500mlPage /></RequireAuth>} />
      <Route path="/tenants/wellies/production/1-5l" element={<RequireAuth role="director"><WelliesProduction1_5LPage /></RequireAuth>} />
      <Route path="/tenants/wellies/production/5l" element={<RequireAuth role="director"><WelliesProduction5LPage /></RequireAuth>} />
      <Route path="/tenants/wellies/product-development" element={<RequireAuth role="director"><WelliesProductDevelopmentPage /></RequireAuth>} />
      <Route path="/tenants/wellies/sales" element={<RequireAuth role="director"><WelliesSalesHub /></RequireAuth>} />
      <Route path="/tenants/wellies/sales/signature-retail" element={<RequireAuth role="director"><WelliesSignatureRetailPage /></RequireAuth>} />
      <Route path="/tenants/wellies/sales/outbound" element={<RequireAuth role="director"><WelliesOutboundSalesHub /></RequireAuth>} />
      <Route path="/tenants/wellies/sales/outbound/personalised-labels" element={<RequireAuth role="director"><WelliesPersonalisedLabelsPage /></RequireAuth>} />
      <Route path="/tenants/wellies/sales/outbound/wellies-water" element={<RequireAuth role="director"><WelliesWaterPage /></RequireAuth>} />
      <Route path="/tenants/wellies/sales/outbound/euphoria-beverages" element={<RequireAuth role="director"><WelliesEuphoriaPage /></RequireAuth>} />
      <Route path="/tenants/khula-woyise" element={<RequireAuth role="director"><KhulaWoyiseHub /></RequireAuth>} />
      <Route path="/tenants/khula-woyise/high-rollerz" element={<RequireAuth role="director"><HighRollerzPage /></RequireAuth>} />
      <Route path="/tenants/khula-woyise/lesemba-gallery" element={<RequireAuth role="director"><LesembaGalleryPage /></RequireAuth>} />
      <Route path="/tenants/khula-woyise/cell-max" element={<RequireAuth role="director"><CellMaxPage /></RequireAuth>} />
      <Route path="/tenants/khula-woyise/signature-coffee-co" element={<RequireAuth role="director"><SignatureCoffeeCoPage /></RequireAuth>} />
      <Route path="/tenants/khula-woyise/thabos-tutoring-centre" element={<RequireAuth role="director"><ThabosTutoringPage /></RequireAuth>} />
      <Route path="/tenants/mt-naidoo-properties" element={<RequireAuth role="director"><MTNaidooPropertiesHub /></RequireAuth>} />
      <Route path="/tenants/mt-naidoo-properties/14-wellington-street" element={<RequireAuth role="director"><Property14WellingtonStreetPage /></RequireAuth>} />
      <Route path="/tenants/mt-naidoo-properties/mtnft-9-botanic-street" element={<RequireAuth role="director"><PropertyMTNFT9BotanicStreetPage /></RequireAuth>} />
      <Route path="/tenants/mt-naidoo-properties/pd-grant-25-panorama-drive" element={<RequireAuth role="director"><PropertyPDGrant25PanoramaPage /></RequireAuth>} />
      <Route path="/tenants/jkm-naidoo-family-trust" element={<RequireAuth role="director"><JKMNaidooFamilyTrustPage /></RequireAuth>} />
      <Route path="/tenants/rm-naidoo-family-trust" element={<RequireAuth role="director"><RMNaidooFamilyTrustPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker" element={<RequireAuth role="director"><RainmakerHub /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services" element={<RequireAuth role="director"><SharedServicesHub /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital" element={<RequireAuth role="director"><IntelligentCapitalHub /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital/grant-application" element={<RequireAuth role="director"><GrantApplicationPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital/blended-finance" element={<RequireAuth role="director"><BlendedFinancePage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital/investor-introductions" element={<RequireAuth role="director"><InvestorIntroductionsPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital/financial-modelling" element={<RequireAuth role="director"><FinancialModellingPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital/due-diligence" element={<RequireAuth role="director"><DueDiligenceSupportPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training" element={<RequireAuth role="director"><UpSkillTrainingPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/maintenance-co" element={<RequireAuth role="director"><MaintenanceCoPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing" element={<RequireAuth role="director"><KnockoutMarketingHub /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/brand-development" element={<RequireAuth role="director"><BrandDevelopmentService /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/content-development" element={<RequireAuth role="director"><ContentDevelopmentService /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/campaign-deployment" element={<RequireAuth role="director"><CampaignDeploymentService /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/content-development/advertising-social-brand" element={<RequireAuth role="director"><ContentDevAdvertisingSocialService /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/content-development/training-programmes" element={<RequireAuth role="director"><ContentDevTrainingProgrammesService /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/kom-customers" element={<RequireAuth role="director"><KomCustomersPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/performance-reports" element={<RequireAuth role="director"><PerformanceReportsPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting" element={<RequireAuth role="director"><AffinityAccountingHub /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting/monthly-bookkeeping" element={<RequireAuth role="director"><MonthlyBookkeepingPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting/vat-prov-tax" element={<RequireAuth role="director"><VatProvTaxPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting/annual-tax-afs" element={<RequireAuth role="director"><AnnualTaxAfsPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting/cipc-secretarial" element={<RequireAuth role="director"><CipcSecretarialPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting/audit-prep" element={<RequireAuth role="director"><AuditPrepPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre" element={<RequireAuth role="director"><SkillsCentreHub /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre/seta-learnerships" element={<RequireAuth role="director"><SetaLearnershipsPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre/farmer-training" element={<RequireAuth role="director"><FarmerTrainingPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre/corporate-workshops" element={<RequireAuth role="director"><CorporateWorkshopsPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre/train-the-trainer" element={<RequireAuth role="director"><TrainTheTrainerPage /></RequireAuth>} />
      <Route path="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre/custom-programmes" element={<RequireAuth role="director"><CustomProgrammesPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting" element={<RequireAuth role="director"><IBSConsultingHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/mscec" element={<RequireAuth role="director"><MSCECPlaceholder /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec" element={<RequireAuth role="director"><HempireECHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa" element={<RequireAuth role="director"><Ecrda2026MoaWorkspace /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-1-offtaker-vetting" element={<RequireAuth role="director"><OfftakerVettingWorkflow /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-1-offtaker-vetting/dashboard" element={<RequireAuth role="director"><OfftakerDashboard /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding" element={<RequireAuth role="director"><GrowerOnboardingHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training" element={<RequireAuth role="director"><TrainingPillarPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training/dashboard" element={<RequireAuth role="director"><TrainingDashboard /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training/saqa-modules" element={<RequireAuth role="director"><SaqaModuleLibrary /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training/saqa-modules/:moduleId" element={<RequireAuth role="director"><SaqaModuleDetail /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/farm-infrastructure" element={<RequireAuth role="director"><FarmInfrastructurePillarPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/inputs-consumables" element={<RequireAuth role="director"><InputsConsumablesPillarPage /></RequireAuth>} />
      <Route path="/cc/engagements" element={<RequireAuth role="director"><EngagementsCC /></RequireAuth>} />
      <Route path="/cc/engagements/:id" element={<RequireAuth role="director"><EngagementDetailCC /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc" element={<RequireAuth role="director"><PSCHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/dedeat" element={<RequireAuth role="director"><DEDEATPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecdc" element={<RequireAuth role="director"><ECDCPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/sedfa" element={<RequireAuth role="director"><SEDFAPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/dsbd" element={<RequireAuth role="director"><DSBDPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecrda" element={<RequireAuth role={["director", "psc", "ecrda_viewer"]}><EcrdaHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecrda/somdyala" element={<RequireAuth role={["director", "psc", "ecrda_viewer"]}><SomdyalaPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecrda/quvile" element={<RequireAuth role={["director", "psc", "ecrda_viewer"]}><QuvilePage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecrda/blouw" element={<RequireAuth role={["director", "psc", "ecrda_viewer"]}><BlouwPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecrda/qongqo" element={<RequireAuth role={["director", "psc", "ecrda_viewer"]}><QongqoPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/psc/ecrda/vuso" element={<RequireAuth role={["director", "psc", "ecrda_viewer"]}><VusoPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/members" element={<RequireAuth role="director"><MembersHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/members/hubs" element={<RequireAuth role="director"><HubsPlaceholder /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/members/cohorts" element={<RequireAuth role="director"><CohortsHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/members/cohorts/seed-cohort-2" element={<RequireAuth role="director"><SeedCohort2Placeholder /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/offtakers" element={<RequireAuth role="director"><OfftakersHub /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/offtakers/flower" element={<RequireAuth role="director"><FlowerPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/offtakers/seed-grain" element={<RequireAuth role="director"><SeedGrainPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/offtakers/textile-fibres" element={<RequireAuth role="director"><TextileFibresPage /></RequireAuth>} />
      <Route path="/tenants/ibs/consulting/hempire-ec/offtakers/industrial-fibres" element={<RequireAuth role="director"><IndustrialFibresPage /></RequireAuth>} />
      <Route path="/ai/monthly-ops" element={<RequireAuth><MonthlyOps /></RequireAuth>} />
      <Route path="/ai/risk-update" element={<RequireAuth><RiskUpdate /></RequireAuth>} />
      <Route path="/ai/mov-pack" element={<RequireAuth><MovPack /></RequireAuth>} />
      <Route path="/ai/quarterly" element={<RequireAuth><Quarterly /></RequireAuth>} />
      <Route path="/ai/stakeholder" element={<RequireAuth><Stakeholder /></RequireAuth>} />
      <Route path="/billing/subscription" element={<RequireAuth role="director"><Subscription /></RequireAuth>} />
      <Route path="/billing/invoices" element={<RequireAuth role="director"><Invoices /></RequireAuth>} />
      {/* 0010 — Unified Billing (group ledger) */}
      <Route path="/cc/billing" element={<RequireAuth role="director"><BillingDashboard /></RequireAuth>} />
      <Route path="/cc/billing/customers" element={<RequireAuth role="director"><CustomersList /></RequireAuth>} />
      <Route path="/cc/billing/customers/:id" element={<RequireAuth role="director"><CustomerDetail /></RequireAuth>} />
      <Route path="/cc/billing/invoices" element={<RequireAuth role="director"><InvoicesLedger /></RequireAuth>} />
      <Route path="/cc/billing/invoices/new" element={<RequireAuth role="director"><InvoiceNew /></RequireAuth>} />
      <Route path="/cc/billing/invoices/:id" element={<RequireAuth role="director"><InvoiceDetail /></RequireAuth>} />
      {/* 0011 — Master Calendar */}
      <Route path="/cc/calendar" element={<RequireAuth role="director"><MasterCalendar /></RequireAuth>} />
    </Routes>
  );
}
