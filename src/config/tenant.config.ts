export interface TenantConfig {
  firmName: string
  shortName: string
  tagline: string
  registrationNumber?: string
  icanMemberNumber?: string
  contact: {
    address: string
    city: string
    country: string
    email: string
    phone: string
    altPhone?: string
    mapEmbedUrl?: string
  }
  socials: {
    linkedin?: string
    facebook?: string
    twitter?: string
  }
  branding: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
}

export const tenantConfig: TenantConfig = {
  firmName: "Narahari Adhikari & Associates",
  shortName: "Narahari Adhikari",
  tagline: "Chartered Accountants | Delivering Excellence in Audit, Taxation & Advisory",
  registrationNumber: "ICAN-REG-2024",
  icanMemberNumber: "ICAN / Cop No. Available on Request",
  contact: {
    address: "New Baneshwor, Kathmandu",
    city: "Kathmandu",
    country: "Nepal",
    email: "info@narahariadhikari.com.np",
    phone: "+977-1-4780000",
    altPhone: "+977-9851000000",
  },
  socials: {
    linkedin: "https://linkedin.com/company/narahari-adhikari",
    facebook: "https://facebook.com/narahariadhikarica",
  },
  branding: {
    primaryColor: "#1e40af",
    secondaryColor: "#0f172a",
    fontFamily: "Plus Jakarta Sans",
  }
}
