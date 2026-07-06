/** Builder mini websites + project microsites + plot finder module. */

export type BuilderPlanType = "basic" | "microsite" | "premium" | "enterprise";
export type BuilderPlanStatus = "active" | "trial" | "expired" | "cancelled";
export type BuilderStatus = "draft" | "published" | "archived";

export type ProjectType =
  | "plots"
  | "villas"
  | "apartments"
  | "commercial"
  | "industrial"
  | "farmhouse"
  | "mixed-use";

export type ProjectStatus = "upcoming" | "ongoing" | "ready" | "sold-out";

export type UnitType = "plot" | "apartment" | "villa" | "commercial";

export type UnitStatus =
  | "available"
  | "reserved"
  | "sold"
  | "coming-soon"
  | "hold"
  | "not-released";

export type SizeUnit = "sq-yd" | "sq-ft" | "marla" | "kanal" | "acre";

export type LeadSource =
  | "builder_page"
  | "project_page"
  | "buy_project_page"
  | "plot_popup"
  | "master_plan"
  | "brochure_download"
  | "floor_plan_download"
  | "featured_project"
  | "city_page"
  | "vip_waitlist"
  | "virtual_tour"
  | "project_agent"
  | "project_agent_auto";

export type LeadStatus =
  | "new"
  | "contacted"
  | "site-visit-scheduled"
  | "negotiation"
  | "closed"
  | "lost";

export type LeadRouting = "platform" | "direct";

export type BuilderUserRole = "builder_admin" | "builder_sales";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
}

export interface ProjectFaq {
  question: string;
  answer: string;
}

export interface HotspotCoord {
  xPercent: number;
  yPercent: number;
}

export type HotspotAngles = {
  default?: HotspotCoord;
  angle1?: HotspotCoord;
  angle2?: HotspotCoord;
  angle3?: HotspotCoord;
  angle4?: HotspotCoord;
};

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface Builder {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  reraNumber: string | null;
  establishedYear: number | null;
  socialLinks: SocialLinks;
  galleryUrls: string[];
  team: TeamMember[];
  status: BuilderStatus;
  isFeatured: boolean;
  builderPlan: BuilderPlanType;
  planStatus: BuilderPlanStatus;
  planStartDateMs: number | null;
  planEndDateMs: number | null;
  featuredUntilMs: number | null;
  maxProjects: number;
  maxLeads: number;
  allowedModules: string[];
  viewCount: number;
  enquiryCount: number;
  createdAtMs: number;
  updatedAtMs: number;
  createdBy: string | null;
  ownerUserId: string | null;
  leadRouting: LeadRouting;
  source: "web";
}

export interface BuilderProject {
  id: string;
  builderId: string;
  builderName: string;
  builderSlug: string;
  name: string;
  slug: string;
  description: string;
  projectType: ProjectType;
  status: ProjectStatus;
  reraNumber: string | null;
  address: string | null;
  city: string;
  citySlug: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  totalArea: string | null;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  /** Demo / aggregate coming-soon count when unit rows are not seeded */
  comingSoonUnits: number;
  priceMin: number | null;
  priceMax: number | null;
  sizeMin: number | null;
  sizeMax: number | null;
  sizeUnit: SizeUnit;
  possessionDate: string | null;
  amenities: string[];
  galleryUrls: string[];
  videoUrls: string[];
  brochureUrl: string | null;
  paymentPlan: string | null;
  faqs: ProjectFaq[];
  nearbyLandmarks: string[];
  constructionUpdates: string[];
  masterPlanImageUrl: string | null;
  /** Matterport / 360° / YouTube walkthrough embed URL */
  virtualTourUrl: string | null;
  /** VIP launch or registration opening date (ISO date) */
  launchDate: string | null;
  /** Project-level floor plan PDFs/images */
  floorPlanUrls: string[];
  testimonials: ProjectTestimonial[];
  isPublished: boolean;
  isFeatured: boolean;
  featuredUntilMs: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  /** SEO + AI search keyword tags */
  seoKeywords: string[];
  /** Short AI-search / concierge ranking snippet */
  aiSearchSnippet: string | null;
  viewCount: number;
  enquiryCount: number;
  createdAtMs: number;
  updatedAtMs: number;
  createdBy: string | null;
  ownerUserId: string | null;
  leadRouting: LeadRouting;
  source: "web";
}

export interface ProjectUnit {
  id: string;
  projectId: string;
  builderId: string;
  unitType: UnitType;
  plotNumber: string | null;
  block: string | null;
  tower: string | null;
  floor: number | null;
  bhk: string | null;
  size: number | null;
  sizeUnit: SizeUnit;
  facing: string | null;
  roadWidth: string | null;
  isCorner: boolean;
  isParkFacing: boolean;
  price: number | null;
  bookingAmount: number | null;
  status: UnitStatus;
  notes: string | null;
  imageUrls: string[];
  floorPlanUrls: string[];
  hotspots: HotspotAngles;
  createdAtMs: number;
  updatedAtMs: number;
  source: "web";
}

export interface ProjectLead {
  id: string;
  builderId: string;
  projectId: string | null;
  unitId: string | null;
  projectName: string | null;
  citySlug: string | null;
  source: LeadSource;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  preferredVisitDate: string | null;
  budgetRange: string | null;
  preferredSize: string | null;
  buyingTimeline: string | null;
  purchasePurpose: string | null;
  hearAboutUs: string | null;
  leadStatus: LeadStatus;
  notes: string | null;
  assignedTo: string | null;
  followUpDateMs: number | null;
  createdAtMs: number;
  updatedAtMs: number;
  source_channel: "web";
  /** Leads captured for RentalPins to sell — not shared with project owner by default. */
  platformManaged: boolean;
  visibleToBuilder: boolean;
  leadSoldAtMs: number | null;
}

export interface MasterPlanAngle {
  id: string;
  label: string;
  imageUrl: string;
}

export interface ProjectMasterPlan {
  projectId: string;
  builderId: string;
  defaultImageUrl: string | null;
  angles: MasterPlanAngle[];
  updatedAtMs: number;
}

export interface BuilderUser {
  id: string;
  userId: string;
  builderId: string;
  role: BuilderUserRole;
  createdAtMs: number;
}

export interface InventorySummary {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  comingSoon: number;
  hold: number;
  notReleased: number;
}

export interface CreateBuilderInput {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  reraNumber?: string;
  establishedYear?: number;
}

export interface CreateProjectInput {
  builderId: string;
  name: string;
  slug: string;
  citySlug: string;
  projectType: ProjectType;
  description?: string;
  status?: ProjectStatus;
}

/** Self-service: developer posts a project without admin approval. */
export interface CreateSelfServiceProjectInput {
  companyName: string;
  projectName: string;
  citySlug: string;
  projectType: ProjectType;
  phone?: string;
  email?: string;
  description?: string;
  address?: string;
}

export interface CreateUnitInput {
  projectId: string;
  unitType?: UnitType;
  plotNumber?: string;
  size?: number;
  sizeUnit?: SizeUnit;
  price?: number;
  status?: UnitStatus;
  facing?: string;
}

export interface CreateLeadInput {
  builderId: string;
  projectId?: string;
  unitId?: string;
  source: LeadSource;
  name: string;
  phone: string;
  email: string;
  message?: string;
  preferredVisitDate?: string;
  budgetRange?: string;
  preferredSize?: string;
  buyingTimeline?: string;
  purchasePurpose?: string;
  hearAboutUs?: string;
}
