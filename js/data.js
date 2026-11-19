// ============================================================
// Commission IQ — Mock Data Store
// ============================================================

const MockData = (() => {

  // ── Users ──────────────────────────────────────────────────
  const users = [
    { id: 'U001', username: 'sysadmin',   password: 'admin123',   name: 'Sarah Chen',        email: 'sarah.chen@commissioniq.com',      role: 'System Administrator', avatar: 'SC', department: 'IT & Operations',  status: 'active', lastLogin: '2026-11-18T09:30:00Z', createdAt: '2025-01-15T08:00:00Z' },
    { id: 'U002', username: 'execsponsor', password: 'exec123',   name: 'Michael Torres',    email: 'michael.torres@commissioniq.com',  role: 'Executive Sponsor',   avatar: 'MT', department: 'Executive',        status: 'active', lastLogin: '2026-11-18T08:45:00Z', createdAt: '2025-02-10T08:00:00Z' },
    { id: 'U003', username: 'procmgr',    password: 'proc123',    name: 'Jessica Williams',  email: 'jessica.w@commissioniq.com',       role: 'Procurement Manager', avatar: 'JW', department: 'Procurement',       status: 'active', lastLogin: '2026-11-17T16:20:00Z', createdAt: '2025-03-20T08:00:00Z' },
    { id: 'U004', username: 'catmgr',     password: 'cat123',     name: 'David Park',        email: 'david.park@commissioniq.com',      role: 'Category Manager',    avatar: 'DP', department: 'Category Mgmt',    status: 'active', lastLogin: '2026-11-18T10:00:00Z', createdAt: '2025-04-05T08:00:00Z' },
    { id: 'U005', username: 'finanalyst', password: 'fin123',     name: 'Rachel Nguyen',     email: 'rachel.n@commissioniq.com',        role: 'Finance Analyst',     avatar: 'RN', department: 'Finance',          status: 'active', lastLogin: '2026-11-16T14:30:00Z', createdAt: '2025-05-12T08:00:00Z' },
    { id: 'U006', username: 'vendor1',    password: 'vendor123',  name: 'James Mitchell',    email: 'james.m@giftflow.com',             role: 'Vendor User',         avatar: 'JM', department: 'GiftFlow Inc.',     status: 'active', lastLogin: '2026-11-15T11:00:00Z', createdAt: '2025-06-01T08:00:00Z' },
    { id: 'U007', username: 'finanalyst2', password: 'fin123',    name: 'Emily Rodriguez',   email: 'emily.r@commissioniq.com',         role: 'Finance Analyst',     avatar: 'ER', department: 'Finance',          status: 'inactive', lastLogin: '2026-10-30T09:15:00Z', createdAt: '2025-07-18T08:00:00Z' },
    { id: 'U008', username: 'catmgr2',    password: 'cat123',     name: 'Robert Kim',        email: 'robert.kim@commissioniq.com',      role: 'Category Manager',    avatar: 'RK', department: 'Category Mgmt',    status: 'active', lastLogin: '2026-11-18T07:50:00Z', createdAt: '2025-08-22T08:00:00Z' },
    { id: 'U009', username: 'vendor2',    password: 'vendor123',  name: 'Carlos Mendez',     email: 'carlos@swifttransfer.com',         role: 'Vendor User',         avatar: 'CM', department: 'SwiftTransfer',    status: 'active', lastLogin: '2026-11-17T09:00:00Z', createdAt: '2025-09-10T08:00:00Z' }
  ];

  // ── Vendors ────────────────────────────────────────────────
  const vendors = [
    {
      id: 'V001',
      name: 'GiftFlow Inc.',
      category: 'Gift Cards',
      contact: 'Amanda Foster',
      email: 'amanda@giftflow.com',
      phone: '(555) 100-2001',
      status: 'active',
      rating: 4.8,
      contractStart: '2025-01-01',
      contractEnd: '2027-01-01',
      totalVolume: 2450000,
      commissionRate: 3.5,
      region: 'National',
      paymentTerms: 'Net 30',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE001'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 95,
      biddingContacts: [
        { name: 'Amanda Foster', title: 'VP of Commercial Accounts', email: 'amanda@giftflow.com', phone: '(555) 100-2001', isPrimary: true, authorizedBidder: true },
        { name: 'James Morris', title: 'Director of Sourcing & Bids', email: 'jmorris@giftflow.com', phone: '(555) 100-2014', isPrimary: false, authorizedBidder: true },
        { name: 'Rachel Vance', title: 'Contract & Legal Counsel', email: 'rvance@giftflow.com', phone: '(555) 100-2015', isPrimary: false, authorizedBidder: false }
      ],
      documents: [
        { id: 'DOC-V001-1', title: 'W-9 Form (2026 Validated)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.2 MB', uploadDate: '2026-01-15' },
        { id: 'DOC-V001-2', title: 'Certificate of Commercial Liability Insurance ($5M)', type: 'Insurance', status: 'Verified', expiryDate: '2027-03-31', size: '2.4 MB', uploadDate: '2026-02-10' },
        { id: 'DOC-V001-3', title: 'SOC 2 Type II Security Attestation', type: 'Security Audit', status: 'Verified', expiryDate: '2027-01-15', size: '4.8 MB', uploadDate: '2026-01-20' },
        { id: 'DOC-V001-4', title: 'ACH Direct Settlement Agreement', type: 'Banking', status: 'Verified', expiryDate: 'Perpetual', size: '850 KB', uploadDate: '2026-01-18' }
      ],
      submittedProducts: [
        { id: 'SKU-001', name: 'PlayStation Plus $79.99 Digital Code', category: 'Digital Gaming', proposedRate: 4.50, fraudSubsidy: 0.15, marketingSubsidy: 5000, status: 'Approved', submittedDate: '2026-10-15', reviewedBy: 'Sarah Chen' },
        { id: 'SKU-002', name: 'Roblox $25 Digital Gift Card (Physical J-Hook)', category: 'Gaming Cards', proposedRate: 4.25, fraudSubsidy: 0.10, marketingSubsidy: 2500, status: 'Under Review', submittedDate: '2026-11-04', reviewedBy: 'Pending' },
        { id: 'SKU-003', name: 'Paramount+ Annual Subscription Card', category: 'Streaming Media', proposedRate: 5.00, fraudSubsidy: 0.20, marketingSubsidy: 3500, status: 'Pending Retailer Approval', submittedDate: '2026-11-12', reviewedBy: 'Pending' }
      ]
    },
    {
      id: 'V002',
      name: 'CardVault Solutions',
      category: 'Gift Cards',
      contact: 'Brian Hayes',
      email: 'brian@cardvault.com',
      phone: '(555) 100-2002',
      status: 'active',
      rating: 4.5,
      contractStart: '2025-03-15',
      contractEnd: '2027-03-15',
      totalVolume: 1870000,
      commissionRate: 3.2,
      region: 'East Coast',
      paymentTerms: 'Net 45',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE001'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 88,
      biddingContacts: [
        { name: 'Brian Hayes', title: 'Managing Director, Retail Programs', email: 'brian@cardvault.com', phone: '(555) 100-2002', isPrimary: true, authorizedBidder: true },
        { name: 'Linda Sterling', title: 'Enterprise Bid Specialist', email: 'lsterling@cardvault.com', phone: '(555) 100-2022', isPrimary: false, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V002-1', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.1 MB', uploadDate: '2026-03-15' },
        { id: 'DOC-V002-2', title: 'Certificate of Insurance (COI)', type: 'Insurance', status: 'Verified', expiryDate: '2027-04-15', size: '2.1 MB', uploadDate: '2026-03-20' },
        { id: 'DOC-V002-3', title: 'PCI-DSS Level 1 Compliance Certificate', type: 'Security Audit', status: 'Verified', expiryDate: '2026-11-30', size: '3.6 MB', uploadDate: '2025-11-30' }
      ],
      submittedProducts: [
        { id: 'SKU-004', name: 'Mastercard $100 Variable Fee Card', category: 'Open-Loop Debit', proposedRate: 3.40, fraudSubsidy: 0.25, marketingSubsidy: 4000, status: 'Approved', submittedDate: '2026-09-20', reviewedBy: 'Jessica Williams' }
      ]
    },
    {
      id: 'V003',
      name: 'SwiftTransfer Global',
      category: 'Money Transfer',
      contact: 'Carlos Mendez',
      email: 'carlos@swifttransfer.com',
      phone: '(555) 100-2003',
      status: 'active',
      rating: 4.6,
      contractStart: '2025-02-01',
      contractEnd: '2026-12-31',
      totalVolume: 5620000,
      commissionRate: 1.8,
      region: 'International',
      paymentTerms: 'Net 15',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE003'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 72,
      biddingContacts: [
        { name: 'Carlos Mendez', title: 'Head of Global Remittance Partnerships', email: 'carlos@swifttransfer.com', phone: '(555) 100-2003', isPrimary: true, authorizedBidder: true },
        { name: 'Patricia Gomez', title: 'Treasury & Settlements Lead', email: 'pgomez@swifttransfer.com', phone: '(555) 100-2033', isPrimary: false, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V003-1', title: 'FinCEN Money Services Business (MSB) Registration', type: 'Regulatory License', status: 'Verified', expiryDate: '2027-06-30', size: '2.9 MB', uploadDate: '2026-02-01' },
        { id: 'DOC-V003-2', title: 'Corporate W-9 Form', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '980 KB', uploadDate: '2026-02-01' },
        { id: 'DOC-V003-3', title: 'Anti-Money Laundering (AML) Compliance Policy', type: 'Compliance', status: 'Verified', expiryDate: '2027-01-31', size: '5.2 MB', uploadDate: '2026-02-05' }
      ],
      submittedProducts: [
        { id: 'SKU-005', name: 'Direct-to-Account Express Remittance (Mexico & LATAM)', category: 'Money Transfer', proposedRate: 2.10, fraudSubsidy: 0.30, marketingSubsidy: 6000, status: 'Under Review', submittedDate: '2026-10-28', reviewedBy: 'Pending' }
      ]
    },
    {
      id: 'V004',
      name: 'MoneyLink Express',
      category: 'Money Transfer',
      contact: 'Diana Russo',
      email: 'diana@moneylink.com',
      phone: '(555) 100-2004',
      status: 'active',
      rating: 4.3,
      contractStart: '2025-06-01',
      contractEnd: '2027-06-01',
      totalVolume: 3340000,
      commissionRate: 2.1,
      region: 'National',
      paymentTerms: 'Net 30',
      biddingStatus: 'offer_pending',
      biddingOfferStatus: 'pending',
      activeEventInvites: ['SE003'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 81,
      biddingContacts: [
        { name: 'Diana Russo', title: 'Director of North America Commercial Ops', email: 'diana@moneylink.com', phone: '(555) 100-2004', isPrimary: true, authorizedBidder: true },
        { name: 'Marcus Brody', title: 'Strategic Account Executive', email: 'mbrody@moneylink.com', phone: '(555) 100-2044', isPrimary: false, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V004-1', title: 'MSB State Licenses (All 50 States)', type: 'Regulatory License', status: 'Verified', expiryDate: '2027-12-31', size: '8.4 MB', uploadDate: '2025-06-01' },
        { id: 'DOC-V004-2', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.0 MB', uploadDate: '2026-06-01' }
      ],
      submittedProducts: []
    },
    {
      id: 'V005',
      name: 'PrepaidPlus Corp',
      category: 'Prepaid Products',
      contact: 'Edward Lin',
      email: 'edward@prepaidplus.com',
      phone: '(555) 100-2005',
      status: 'active',
      rating: 4.7,
      contractStart: '2025-04-01',
      contractEnd: '2027-04-01',
      totalVolume: 1950000,
      commissionRate: 4.2,
      region: 'West Coast',
      paymentTerms: 'Net 30',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE002'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 93,
      biddingContacts: [
        { name: 'Edward Lin', title: 'Senior VP of Partner Revenue', email: 'edward@prepaidplus.com', phone: '(555) 100-2005', isPrimary: true, authorizedBidder: true },
        { name: 'Chloe Davenport', title: 'Bidding Coordinator', email: 'cdavenport@prepaidplus.com', phone: '(555) 100-2055', isPrimary: false, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V005-1', title: 'Master Distribution Agreement', type: 'Contract', status: 'Verified', expiryDate: '2027-04-01', size: '3.3 MB', uploadDate: '2025-04-01' },
        { id: 'DOC-V005-2', title: 'Certificate of Insurance', type: 'Insurance', status: 'Verified', expiryDate: '2027-05-01', size: '2.0 MB', uploadDate: '2026-04-10' }
      ],
      submittedProducts: [
        { id: 'SKU-006', name: 'Ultra-Mobile 30-Day Unlimited 5G SIM Pack', category: 'Prepaid Wireless', proposedRate: 4.85, fraudSubsidy: 0.15, marketingSubsidy: 3000, status: 'Approved', submittedDate: '2026-09-10', reviewedBy: 'Michael Torres' }
      ]
    },
    {
      id: 'V006',
      name: 'ReloadNow Services',
      category: 'Prepaid Products',
      contact: 'Fiona Grant',
      email: 'fiona@reloadnow.com',
      phone: '(555) 100-2006',
      status: 'pending',
      rating: 4.1,
      contractStart: '2026-01-01',
      contractEnd: '2027-12-31',
      totalVolume: 890000,
      commissionRate: 3.8,
      region: 'Midwest',
      paymentTerms: 'Net 45',
      biddingStatus: 'offer_pending',
      biddingOfferStatus: 'pending',
      activeEventInvites: ['SE002'],
      onboardingStage: 'Banking Setup',
      onboardingProgress: 60,
      complianceScore: 55,
      biddingContacts: [
        { name: 'Fiona Grant', title: 'VP Commercial Distribution', email: 'fiona@reloadnow.com', phone: '(555) 100-2006', isPrimary: true, authorizedBidder: true },
        { name: 'Derek Shaw', title: 'Legal & Procurement Officer', email: 'dshaw@reloadnow.com', phone: '(555) 100-2066', isPrimary: false, authorizedBidder: false }
      ],
      documents: [
        { id: 'DOC-V006-1', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.3 MB', uploadDate: '2026-01-10' },
        { id: 'DOC-V006-2', title: 'Bank Voided Check & ACH Mandate', type: 'Banking', status: 'Pending Verification', expiryDate: 'N/A', size: '640 KB', uploadDate: '2026-10-25' }
      ],
      submittedProducts: [
        { id: 'SKU-007', name: 'Metro by T-Mobile $40 Instant Pin Reload', category: 'Prepaid Wireless', proposedRate: 4.10, fraudSubsidy: 0.10, marketingSubsidy: 1500, status: 'Pending Retailer Approval', submittedDate: '2026-11-09', reviewedBy: 'Pending' }
      ]
    },
    {
      id: 'V007',
      name: 'DebitDirect Financial',
      category: 'Debit Services',
      contact: 'George Patel',
      email: 'george@debitdirect.com',
      phone: '(555) 100-2007',
      status: 'active',
      rating: 4.4,
      contractStart: '2025-05-01',
      contractEnd: '2027-05-01',
      totalVolume: 4210000,
      commissionRate: 1.5,
      region: 'National',
      paymentTerms: 'Net 15',
      biddingStatus: 'not_invited',
      biddingOfferStatus: 'not_sent',
      activeEventInvites: [],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 86,
      biddingContacts: [
        { name: 'George Patel', title: 'Chief Commercial Officer', email: 'george@debitdirect.com', phone: '(555) 100-2007', isPrimary: true, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V007-1', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.0 MB', uploadDate: '2026-05-01' }
      ],
      submittedProducts: []
    },
    {
      id: 'V008',
      name: 'SecurePay Networks',
      category: 'Debit Services',
      contact: 'Hannah Brooks',
      email: 'hannah@securepay.com',
      phone: '(555) 100-2008',
      status: 'active',
      rating: 4.9,
      contractStart: '2025-07-01',
      contractEnd: '2027-07-01',
      totalVolume: 3780000,
      commissionRate: 1.6,
      region: 'East Coast',
      paymentTerms: 'Net 30',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE001'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 97,
      biddingContacts: [
        { name: 'Hannah Brooks', title: 'Head of Enterprise Bidding & Alliances', email: 'hannah@securepay.com', phone: '(555) 100-2008', isPrimary: true, authorizedBidder: true },
        { name: 'Scott Turner', title: 'Contracts Specialist', email: 'sturner@securepay.com', phone: '(555) 100-2088', isPrimary: false, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V008-1', title: 'SOC 1 & SOC 2 Type II Bundle', type: 'Security Audit', status: 'Verified', expiryDate: '2027-07-01', size: '7.1 MB', uploadDate: '2026-07-01' },
        { id: 'DOC-V008-2', title: 'Comprehensive Insurance Package ($10M)', type: 'Insurance', status: 'Verified', expiryDate: '2027-08-15', size: '3.1 MB', uploadDate: '2026-07-15' }
      ],
      submittedProducts: []
    },
    {
      id: 'V009',
      name: 'FinServ Commission Co.',
      category: 'Financial Services',
      contact: 'Ivan Kowalski',
      email: 'ivan@finserv.com',
      phone: '(555) 100-2009',
      status: 'active',
      rating: 4.2,
      contractStart: '2025-08-01',
      contractEnd: '2027-08-01',
      totalVolume: 6150000,
      commissionRate: 2.5,
      region: 'National',
      paymentTerms: 'Net 30',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE001'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 79,
      biddingContacts: [
        { name: 'Ivan Kowalski', title: 'Executive VP of Institutional Sales', email: 'ivan@finserv.com', phone: '(555) 100-2009', isPrimary: true, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V009-1', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.1 MB', uploadDate: '2026-08-01' }
      ],
      submittedProducts: []
    },
    {
      id: 'V010',
      name: 'ValueCard Partners',
      category: 'Gift Cards',
      contact: 'Julia Adams',
      email: 'julia@valuecard.com',
      phone: '(555) 100-2010',
      status: 'inactive',
      rating: 3.8,
      contractStart: '2024-06-01',
      contractEnd: '2026-06-01',
      totalVolume: 720000,
      commissionRate: 3.0,
      region: 'South',
      paymentTerms: 'Net 60',
      biddingStatus: 'not_invited',
      biddingOfferStatus: 'not_sent',
      activeEventInvites: [],
      onboardingStage: 'KYC In Review',
      onboardingProgress: 35,
      complianceScore: 48,
      biddingContacts: [
        { name: 'Julia Adams', title: 'Account Executive', email: 'julia@valuecard.com', phone: '(555) 100-2010', isPrimary: true, authorizedBidder: false }
      ],
      documents: [
        { id: 'DOC-V010-1', title: 'Expired Certificate of Insurance', type: 'Insurance', status: 'Expired', expiryDate: '2026-06-01', size: '1.9 MB', uploadDate: '2024-06-01' }
      ],
      submittedProducts: []
    },
    {
      id: 'V011',
      name: 'QuickRemit International',
      category: 'Money Transfer',
      contact: 'Kevin Zhao',
      email: 'kevin@quickremit.com',
      phone: '(555) 100-2011',
      status: 'active',
      rating: 4.0,
      contractStart: '2025-09-01',
      contractEnd: '2027-09-01',
      totalVolume: 2890000,
      commissionRate: 2.3,
      region: 'International',
      paymentTerms: 'Net 30',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE001'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 83,
      biddingContacts: [
        { name: 'Kevin Zhao', title: 'Director of Retail Bidding & Expansion', email: 'kevin@quickremit.com', phone: '(555) 100-2011', isPrimary: true, authorizedBidder: true },
        { name: 'Elena Rostova', title: 'Commercial Operations Manager', email: 'erostova@quickremit.com', phone: '(555) 100-2016', isPrimary: false, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V011-1', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.2 MB', uploadDate: '2026-09-01' },
        { id: 'DOC-V011-2', title: 'Money Transmitter License Proof', type: 'Regulatory License', status: 'Verified', expiryDate: '2027-09-30', size: '3.4 MB', uploadDate: '2026-09-15' }
      ],
      submittedProducts: []
    },
    {
      id: 'V012',
      name: 'TopUp Technologies',
      category: 'Prepaid Products',
      contact: 'Laura Singh',
      email: 'laura@topuptech.com',
      phone: '(555) 100-2012',
      status: 'active',
      rating: 4.6,
      contractStart: '2025-10-01',
      contractEnd: '2027-10-01',
      totalVolume: 1340000,
      commissionRate: 4.0,
      region: 'National',
      paymentTerms: 'Net 30',
      biddingStatus: 'active_bidder',
      biddingOfferStatus: 'accepted',
      activeEventInvites: ['SE001'],
      onboardingStage: 'Completed',
      onboardingProgress: 100,
      complianceScore: 91,
      biddingContacts: [
        { name: 'Laura Singh', title: 'VP of Commercial Strategy', email: 'laura@topuptech.com', phone: '(555) 100-2012', isPrimary: true, authorizedBidder: true }
      ],
      documents: [
        { id: 'DOC-V012-1', title: 'W-9 Form (2026)', type: 'Tax Form', status: 'Verified', expiryDate: '2026-12-31', size: '1.0 MB', uploadDate: '2026-10-01' },
        { id: 'DOC-V012-2', title: 'Certificate of Commercial Insurance', type: 'Insurance', status: 'Verified', expiryDate: '2027-10-15', size: '2.2 MB', uploadDate: '2026-10-10' }
      ],
      submittedProducts: []
    }
  ];

  // ── Commission Rates ───────────────────────────────────────
  const commissionRates = [
    { id: 'CR001', vendorId: 'V001', vendorName: 'GiftFlow Inc.',          product: 'Visa Gift Cards',         category: 'Gift Cards',       baseRate: 3.5, negotiatedRate: 3.5, volume: 850000,  effectiveDate: '2025-01-01', expiryDate: '2027-01-01', status: 'active', tier: 'Gold' },
    { id: 'CR002', vendorId: 'V001', vendorName: 'GiftFlow Inc.',          product: 'Mastercard Gift Cards',   category: 'Gift Cards',       baseRate: 3.2, negotiatedRate: 3.5, volume: 720000,  effectiveDate: '2025-01-01', expiryDate: '2027-01-01', status: 'active', tier: 'Gold' },
    { id: 'CR003', vendorId: 'V002', vendorName: 'CardVault Solutions',    product: 'Store Gift Cards',        category: 'Gift Cards',       baseRate: 3.0, negotiatedRate: 3.2, volume: 940000,  effectiveDate: '2025-03-15', expiryDate: '2027-03-15', status: 'active', tier: 'Silver' },
    { id: 'CR004', vendorId: 'V003', vendorName: 'SwiftTransfer Global',   product: 'International Wire',      category: 'Money Transfer',   baseRate: 1.5, negotiatedRate: 1.8, volume: 2800000, effectiveDate: '2025-02-01', expiryDate: '2026-12-31', status: 'active', tier: 'Platinum' },
    { id: 'CR005', vendorId: 'V004', vendorName: 'MoneyLink Express',      product: 'Domestic Transfer',       category: 'Money Transfer',   baseRate: 2.0, negotiatedRate: 2.1, volume: 1670000, effectiveDate: '2025-06-01', expiryDate: '2027-06-01', status: 'active', tier: 'Gold' },
    { id: 'CR006', vendorId: 'V005', vendorName: 'PrepaidPlus Corp',       product: 'Mobile Prepaid',          category: 'Prepaid Products', baseRate: 4.0, negotiatedRate: 4.2, volume: 975000,  effectiveDate: '2025-04-01', expiryDate: '2027-04-01', status: 'active', tier: 'Gold' },
    { id: 'CR007', vendorId: 'V007', vendorName: 'DebitDirect Financial',  product: 'Prepaid Debit Cards',     category: 'Debit Services',   baseRate: 1.2, negotiatedRate: 1.5, volume: 2100000, effectiveDate: '2025-05-01', expiryDate: '2027-05-01', status: 'active', tier: 'Silver' },
    { id: 'CR008', vendorId: 'V008', vendorName: 'SecurePay Networks',     product: 'Payroll Debit',           category: 'Debit Services',   baseRate: 1.4, negotiatedRate: 1.6, volume: 1890000, effectiveDate: '2025-07-01', expiryDate: '2027-07-01', status: 'active', tier: 'Gold' },
    { id: 'CR009', vendorId: 'V009', vendorName: 'FinServ Commission Co.', product: 'Bill Pay Services',       category: 'Financial Services', baseRate: 2.2, negotiatedRate: 2.5, volume: 3075000, effectiveDate: '2025-08-01', expiryDate: '2027-08-01', status: 'active', tier: 'Platinum' },
    { id: 'CR010', vendorId: 'V010', vendorName: 'ValueCard Partners',     product: 'Retail Gift Cards',       category: 'Gift Cards',       baseRate: 2.8, negotiatedRate: 3.0, volume: 360000,  effectiveDate: '2024-06-01', expiryDate: '2026-06-01', status: 'expiring', tier: 'Bronze' },
    { id: 'CR011', vendorId: 'V011', vendorName: 'QuickRemit International', product: 'Remittance Services',   category: 'Money Transfer',   baseRate: 2.0, negotiatedRate: 2.3, volume: 1445000, effectiveDate: '2025-09-01', expiryDate: '2027-09-01', status: 'active', tier: 'Silver' },
    { id: 'CR012', vendorId: 'V012', vendorName: 'TopUp Technologies',     product: 'Gaming Prepaid',          category: 'Prepaid Products', baseRate: 3.8, negotiatedRate: 4.0, volume: 670000,  effectiveDate: '2025-10-01', expiryDate: '2027-10-01', status: 'active', tier: 'Silver' }
  ];

  // ── Subsidy Data ───────────────────────────────────────────
  const subsidies = [
    { id: 'S001', vendorId: 'V001', vendorName: 'GiftFlow Inc.',       type: 'Marketing Co-op',    amount: 45000,  period: 'Q4 2026', status: 'approved',  requestedBy: 'U003', approvedBy: 'U002', requestDate: '2026-09-15', approvalDate: '2026-09-20' },
    { id: 'S002', vendorId: 'V003', vendorName: 'SwiftTransfer Global', type: 'Volume Bonus',       amount: 82000,  period: 'Q4 2026', status: 'approved',  requestedBy: 'U003', approvedBy: 'U001', requestDate: '2026-10-01', approvalDate: '2026-10-05' },
    { id: 'S003', vendorId: 'V005', vendorName: 'PrepaidPlus Corp',     type: 'Promotional Fund',   amount: 25000,  period: 'Q4 2026', status: 'pending',   requestedBy: 'U008', approvedBy: null,   requestDate: '2026-11-01', approvalDate: null },
    { id: 'S004', vendorId: 'V007', vendorName: 'DebitDirect Financial', type: 'Training Support',  amount: 15000,  period: 'Q3 2026', status: 'approved',  requestedBy: 'U003', approvedBy: 'U002', requestDate: '2026-07-10', approvalDate: '2026-07-15' },
    { id: 'S005', vendorId: 'V009', vendorName: 'FinServ Commission Co.', type: 'Integration Rebate', amount: 60000, period: 'Q4 2026', status: 'pending',  requestedBy: 'U008', approvedBy: null,   requestDate: '2026-11-10', approvalDate: null },
    { id: 'S006', vendorId: 'V002', vendorName: 'CardVault Solutions',  type: 'Marketing Co-op',    amount: 32000,  period: 'Q3 2026', status: 'rejected', requestedBy: 'U003', approvedBy: 'U001', requestDate: '2026-06-20', approvalDate: '2026-06-25' }
  ];

  // ── Contracts & AI Contract Intelligence Data ────────────────
  const contracts = [
    {
      id: 'CON001',
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      category: 'Gift Cards',
      title: 'Master Gift Card Agreement',
      value: 2450000,
      annualVolume: 3500000,
      startDate: '2025-01-01',
      endDate: '2027-01-01',
      renewalDate: '2027-01-01',
      status: 'active',
      type: 'Master',
      renewalType: 'Auto-renew',
      owner: 'U003',
      noticePeriodDays: 60,
      noticeDeadline: '2026-11-02',
      noticeStatus: 'critical', // Within / past 60-day window for 2027-01-01 renewal
      workflowState: 'active',
      commission: {
        rate: 3.00,
        rateType: 'percent',
        rateDisplay: '3.00% of transaction GMV',
        benchmarkRate: 4.10,
        varianceBps: -110,
        annualLeakage: 38500,
        minimumGuarantee: 0,
        minimumGuaranteeDisplay: '$0 (Missing Floor Protection)',
        volumeTiers: 'Base 3.00% up to $2.5M; 3.20% on incremental volume above $2.5M',
        subsidies: [
          { name: 'Fraud Protection Subsidy', amount: '$12,000 / yr', status: 'contracted' },
          { name: 'IT Integration Rebate', amount: '$8,500 one-time', status: 'collected' },
          { name: 'Marketing Co-Op Subsidy', amount: '$0 / yr', status: 'unclaimed' }
        ]
      },
      exclusivity: {
        isExclusive: true,
        type: 'Sole & Exclusive In-Store Provider',
        scope: 'Open-Loop Visa & Mastercard Gift Card Mall Fixtures',
        clauseRef: 'Section 8.2 (Exclusivity & Restrictive Covenants)',
        clauseText: 'During the Initial Term and any Renewal Term, Retailer covenants and agrees that Vendor shall serve as the sole and exclusive provider, distributor, and display aggregator of open-loop prepaid gift cards across all physical retail stores operated by Retailer.',
        riskLevel: 'High',
        impact: 'Restricts running competitive gift card mall auctions or adding parallel kiosk distributors until non-renewal notice is served.',
        carveOut: 'Excludes proprietary closed-loop retailer-branded store cards.'
      },
      aiExtraction: {
        confidence: 98.4,
        docType: 'Digital PDF (Vector Text)',
        fileName: 'GiftFlow_Master_Agreement_Executed.pdf',
        fileSize: '2.4 MB',
        extractedAt: '2026-10-15T14:22:10Z',
        clausesExtracted: 28,
        ocrQuality: '100% Native Vector',
        summary: 'Auto-renewing master agreement for open-loop gift cards with 3.00% commission. Requires 60-day prior written non-renewal notice. Section 8.2 enforces strict category exclusivity across all store doors.'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON001-1',
          severity: 'danger',
          type: 'notice_deadline',
          title: 'Critical 60-Day Notice Deadline Due',
          message: 'Contract expires 2027-01-01. Notice deadline (2026-11-02) is due NOW. If formal non-renewal notice is not served immediately, contract auto-renews for 12 months at sub-market 3.00% rate.',
          actionType: 'serve_notice',
          actionLabel: 'Serve Non-Renewal Notice'
        },
        {
          id: 'ALT-CON001-2',
          severity: 'warning',
          type: 'exclusivity',
          title: 'Exclusivity Clause Blocks Q1 Sourcing Auction',
          message: 'Section 8.2 exclusivity restricts parallel vendor RFP participation without non-renewal certification or written waiver.',
          actionType: 'launch_rfp',
          actionLabel: 'Prepare RFP with Carve-Out'
        },
        {
          id: 'ALT-CON001-3',
          severity: 'info',
          type: 'rate_variance',
          title: 'Rate Disadvantage: 110 bps below peer benchmark',
          message: 'Peer median rate is 4.10%. Current 3.00% leaves $38,500/year uncollected.',
          actionType: 'draft_addendum',
          actionLabel: 'Draft 4.1% Rate Addendum'
        }
      ]
    },
    {
      id: 'CON002',
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      category: 'Money Transfer',
      title: 'Wire Transfer Services Contract',
      value: 5620000,
      annualVolume: 5620000,
      startDate: '2025-02-01',
      endDate: '2026-12-31',
      renewalDate: '2026-12-31',
      status: 'expiring',
      type: 'Master',
      renewalType: 'Manual',
      owner: 'U003',
      noticePeriodDays: 60,
      noticeDeadline: '2026-11-01',
      noticeStatus: 'critical', // 43 days left until Dec 31, 2026 expiration!
      workflowState: 'active',
      commission: {
        rate: 1.50,
        rateType: 'hybrid',
        rateDisplay: '1.50% + $0.45 per transaction',
        benchmarkRate: 2.10,
        varianceBps: -60,
        annualLeakage: 28100,
        minimumGuarantee: 0,
        minimumGuaranteeDisplay: '$0 (Missing Floor Protection)',
        volumeTiers: 'Flat rate across all transaction volumes',
        subsidies: [
          { name: 'Fraud Loss Indemnity', amount: 'Up to $25,000 / event', status: 'contracted' },
          { name: 'Hardware Kiosk Maintenance', amount: '$450 / store / yr', status: 'collected' }
        ]
      },
      exclusivity: {
        isExclusive: false,
        type: 'Non-Exclusive with ROFR',
        scope: 'Over-the-counter wire transfers',
        clauseRef: 'Section 12.4 (Right of First Refusal)',
        clauseText: 'Vendor holds a thirty (30) day Right of First Refusal to match any bona fide third-party digital remittance offering introduced to Retailer customers.',
        riskLevel: 'Medium',
        impact: 'Does not block physical auctions, but requires 30-day matching period before onboarding alternate digital transfer providers.',
        carveOut: 'Domestic intra-state transfers under $100.'
      },
      aiExtraction: {
        confidence: 97.8,
        docType: 'Scanned PDF with OCR',
        fileName: 'SwiftTransfer_Wire_Services_Executed.pdf',
        fileSize: '3.8 MB',
        extractedAt: '2026-10-18T09:12:45Z',
        clausesExtracted: 34,
        ocrQuality: '99.1% High OCR Confidence',
        summary: 'Fixed-term wire transfer contract expiring Dec 31, 2026. Retailer carries 100% volume downside risk due to lack of a contractual floor guarantee ($12,500/mo needed).'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON002-1',
          severity: 'danger',
          type: 'expiration_urgent',
          title: 'Contract Expires in 43 Days (Dec 31, 2026)',
          message: 'Fixed-term contract without auto-renew clause. Service and commission flow will cease unless renewed or transitioned to winning RFP vendor.',
          actionType: 'launch_rfp',
          actionLabel: 'Launch Competitive RFP'
        },
        {
          id: 'ALT-CON002-2',
          severity: 'warning',
          type: 'missing_floor',
          title: 'Missing Minimum Guarantee Clause',
          message: 'Contract has $0 floor protection. Exposes retailer to 31% seasonal volume swings. Negotiate $12,500/month floor guarantee.',
          actionType: 'add_clause',
          actionLabel: 'Add Floor Guarantee'
        },
        {
          id: 'ALT-CON002-3',
          severity: 'warning',
          type: 'rate_variance',
          title: 'Remittance Rate 22% Below Market',
          message: 'Contracted 1.50% trails market median of 2.10% by 60 bps ($28,100 annual opportunity).',
          actionType: 'draft_addendum',
          actionLabel: 'Request Rate Parity'
        }
      ]
    },
    {
      id: 'CON003',
      vendorId: 'V005',
      vendorName: 'PrepaidPlus Corp',
      category: 'Prepaid & Streaming',
      title: 'Mobile Prepaid Distribution Agreement',
      value: 1950000,
      annualVolume: 3400000,
      startDate: '2025-04-01',
      endDate: '2027-04-01',
      renewalDate: '2027-04-01',
      status: 'active',
      type: 'Standard',
      renewalType: 'Auto-renew',
      owner: 'U008',
      noticePeriodDays: 90,
      noticeDeadline: '2027-01-01',
      noticeStatus: 'safe', // 44 days until notice deadline
      workflowState: 'active',
      commission: {
        rate: 1.55,
        rateType: 'percent',
        rateDisplay: '1.55% on Netflix & Digital; 4.00% on Prepaid Airtime',
        benchmarkRate: 2.50,
        varianceBps: -95,
        annualLeakage: 32400,
        minimumGuarantee: 5000,
        minimumGuaranteeDisplay: '$5,000 / month floor guarantee',
        volumeTiers: 'Standard retail distribution tiers',
        subsidies: [
          { name: 'POS Terminal Maintenance', amount: '$3,200 / yr', status: 'contracted' },
          { name: 'Marketing Co-Op Fund', amount: '$18,000 / yr pool (0.35% GMV)', status: 'unclaimed' }
        ]
      },
      exclusivity: {
        isExclusive: false,
        type: 'Non-Exclusive',
        scope: 'Multi-carrier mobile top-up and digital streaming subscriptions',
        clauseRef: 'Section 4.1 (Non-Exclusive Appointment)',
        clauseText: 'Retailer is appointed as a non-exclusive authorized reseller of digital prepaid codes and direct carrier top-up pins.',
        riskLevel: 'Low',
        impact: 'Retailer is free to onboard competing digital aggregator networks or direct brand partnerships without contractual penalty.',
        carveOut: 'None required'
      },
      aiExtraction: {
        confidence: 99.1,
        docType: 'Digital PDF',
        fileName: 'PrepaidPlus_Distribution_2025.pdf',
        fileSize: '1.9 MB',
        extractedAt: '2026-10-12T11:05:00Z',
        clausesExtracted: 24,
        ocrQuality: '100% Native',
        summary: 'Agreement covers wireless top-up and digital streaming codes. AI flagged Netflix commission of 1.55% as 38% below peer market (2.50%). Also identified an unrequested $18,000 marketing co-op subsidy.'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON003-1',
          severity: 'danger',
          type: 'rate_variance',
          title: 'Netflix Commissions Are 38% Below Market',
          message: 'Retailer receives 1.55% vs peer benchmark of 2.50% on Netflix cards. Annual leakage: $32,400.',
          actionType: 'launch_rfp',
          actionLabel: 'Trigger Renegotiation RFP'
        },
        {
          id: 'ALT-CON003-2',
          severity: 'info',
          type: 'unclaimed_subsidy',
          title: 'Unclaimed Marketing Co-Op Subsidy ($18,000)',
          message: 'Section 9.3 reserves 0.35% of GMV ($18,000) for retail display co-op funding. No claims have been submitted.',
          actionType: 'claim_subsidy',
          actionLabel: 'Dispatch Co-Op Claim'
        }
      ]
    },
    {
      id: 'CON004',
      vendorId: 'V007',
      vendorName: 'DebitDirect Financial',
      category: 'Debit Services',
      title: 'Debit Card Program Agreement',
      value: 4210000,
      annualVolume: 4210000,
      startDate: '2025-05-01',
      endDate: '2027-05-01',
      renewalDate: '2027-05-01',
      status: 'active',
      type: 'Master',
      renewalType: 'Auto-renew',
      owner: 'U003',
      noticePeriodDays: 90,
      noticeDeadline: '2027-02-01',
      noticeStatus: 'safe',
      workflowState: 'active',
      commission: {
        rate: 1.25,
        rateType: 'percent',
        rateDisplay: '1.25% reload interchange',
        benchmarkRate: 1.65,
        varianceBps: -40,
        annualLeakage: 16800,
        minimumGuarantee: 5000,
        minimumGuaranteeDisplay: '$5,000 / month floor guarantee',
        volumeTiers: 'Tier 1: 1.25% (<$4.0M); Tier 2: 1.45% (>$4.0M)',
        subsidies: [
          { name: 'Hardware Integration Subsidy', amount: '$15,000 one-time', status: 'collected' }
        ]
      },
      exclusivity: {
        isExclusive: true,
        type: 'Preferred In-Store Cash Reload Partner',
        scope: 'General purpose reloadable (GPR) debit cards',
        clauseRef: 'Section 7.3 (Primary Network Placement)',
        clauseText: 'Retailer agrees that DebitDirect shall receive top-shelf display placement and primary POS routing for all PIN-based debit cash load transactions.',
        riskLevel: 'Medium',
        impact: 'Permits secondary networks but obligates primary POS terminal reload prompts to route to DebitDirect.',
        carveOut: 'Government EBT and payroll disbursement reload cards.'
      },
      aiExtraction: {
        confidence: 96.5,
        docType: 'Digital PDF',
        fileName: 'DebitDirect_Master_2025.pdf',
        fileSize: '3.1 MB',
        extractedAt: '2026-10-10T16:40:00Z',
        clausesExtracted: 31,
        ocrQuality: '100% Native',
        summary: 'GPR debit reload program agreement. Identified 1.25% base rate which is 40 bps below 1.65% peer median. Annual volume ($4.21M) qualified for Tier 2 bump (+20 bps).'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON004-1',
          severity: 'info',
          type: 'tier_unlock',
          title: 'Volume Hurdle Qualified for +20 bps Bump',
          message: 'Current run-rate ($4.21M) qualifies for Tier 2 rate (1.45%). Vendor has not auto-applied the rate upgrade.',
          actionType: 'audit_rate',
          actionLabel: 'Claim Tier Upgrade ($8,400)'
        }
      ]
    },
    {
      id: 'CON005',
      vendorId: 'V009',
      vendorName: 'FinServ Commission Co.',
      category: 'Financial Services',
      title: 'Financial Services Commission Plan',
      value: 6150000,
      annualVolume: 6150000,
      startDate: '2025-08-01',
      endDate: '2027-08-01',
      renewalDate: '2027-08-01',
      status: 'active',
      type: 'Enterprise',
      renewalType: 'Negotiated',
      owner: 'U003',
      noticePeriodDays: 120,
      noticeDeadline: '2027-04-01',
      noticeStatus: 'safe',
      workflowState: 'active',
      commission: {
        rate: 2.10,
        rateType: 'hybrid',
        rateDisplay: '2.10% + $0.35 utility bill fee',
        benchmarkRate: 2.35,
        varianceBps: -25,
        annualLeakage: 15400,
        minimumGuarantee: 10000,
        minimumGuaranteeDisplay: '$10,000 / month floor guarantee',
        volumeTiers: 'Enterprise tiered scale',
        subsidies: [
          { name: 'System Integration Subsidy', amount: '$60,000', status: 'pending_review' },
          { name: 'Annual Training Allowance', amount: '$12,000 / yr', status: 'contracted' }
        ]
      },
      exclusivity: {
        isExclusive: false,
        type: 'Non-Exclusive',
        scope: 'Walk-in utility, telecom, and municipal bill payments',
        clauseRef: 'Section 3.2 (Non-Exclusivity)',
        clauseText: 'This Agreement is non-exclusive and shall not restrict Retailer from offering other financial or payment processing services.',
        riskLevel: 'Low',
        impact: 'Full commercial freedom to integrate supplementary regional billers or kiosk services.',
        carveOut: 'None'
      },
      aiExtraction: {
        confidence: 98.9,
        docType: 'Digital PDF',
        fileName: 'FinServ_Enterprise_Plan_2025.pdf',
        fileSize: '4.2 MB',
        extractedAt: '2026-09-28T13:15:00Z',
        clausesExtracted: 42,
        ocrQuality: '100% Native',
        summary: 'Comprehensive financial services commission plan covering bill payments. 120-day notice period. Unsettled $60,000 integration rebate pending validation.'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON005-1',
          severity: 'warning',
          type: 'subsidy_unsettled',
          title: 'Unsettled Integration Subsidy Rebate ($60,000)',
          message: 'Clause 14.1 integration milestone rebate ($60,000) was invoiced 45 days ago and remains uncollected.',
          actionType: 'track_subsidy',
          actionLabel: 'Escalate to Recovery'
        }
      ]
    },
    {
      id: 'CON006',
      vendorId: 'V010',
      vendorName: 'ValueCard Partners',
      category: 'Gift Cards',
      title: 'Retail Gift Card Addendum',
      value: 720000,
      annualVolume: 720000,
      startDate: '2024-06-01',
      endDate: '2026-06-01',
      renewalDate: '2026-06-01',
      status: 'expired',
      type: 'Addendum',
      renewalType: 'Manual',
      owner: 'U008',
      noticePeriodDays: 30,
      noticeDeadline: '2026-05-01',
      noticeStatus: 'expired',
      workflowState: 'expired',
      commission: {
        rate: 2.50,
        rateType: 'percent',
        rateDisplay: '2.50% of card load',
        benchmarkRate: 4.10,
        varianceBps: -160,
        annualLeakage: 11500,
        minimumGuarantee: 0,
        minimumGuaranteeDisplay: '$0 (Expired)',
        volumeTiers: 'None',
        subsidies: []
      },
      exclusivity: {
        isExclusive: false,
        type: 'Non-Exclusive',
        scope: 'Secondary gift card display spinner',
        clauseRef: 'Section 2.1 (Scope)',
        clauseText: 'Addendum governs secondary perimeter spinner racks only.',
        riskLevel: 'Low',
        impact: 'Expired agreement; stores operating on month-to-month implied terms.',
        carveOut: 'None'
      },
      aiExtraction: {
        confidence: 95.0,
        docType: 'Scanned Document (OCR)',
        fileName: 'ValueCard_Addendum_2024.pdf',
        fileSize: '1.4 MB',
        extractedAt: '2026-08-14T10:00:00Z',
        clausesExtracted: 16,
        ocrQuality: '95% OCR Clean',
        summary: 'Expired addendum for secondary gift card racks. Operating without contract coverage since June 2026.'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON006-1',
          severity: 'danger',
          type: 'expired_contract',
          title: 'Agreement Expired 170 Days Ago',
          message: 'Retailer is operating without active indemnity or contracted rate protection. Vendor is underpaying by 160 bps vs current benchmark.',
          actionType: 'terminate_or_rebind',
          actionLabel: 'Rebind or Remove Racks'
        }
      ]
    },
    {
      id: 'CON007',
      vendorId: 'V002',
      vendorName: 'CardVault Solutions',
      category: 'Gift Cards',
      title: 'Store Card Distribution Agreement',
      value: 1870000,
      annualVolume: 3500000,
      startDate: '2025-03-15',
      endDate: '2027-03-15',
      renewalDate: '2027-03-15',
      status: 'active',
      type: 'Standard',
      renewalType: 'Auto-renew',
      owner: 'U003',
      noticePeriodDays: 60,
      noticeDeadline: '2027-01-14',
      noticeStatus: 'upcoming', // Notice deadline is 57 days away!
      workflowState: 'active',
      commission: {
        rate: 3.00,
        rateType: 'percent',
        rateDisplay: '3.00% of face value',
        benchmarkRate: 4.10,
        varianceBps: -110,
        annualLeakage: 38500,
        minimumGuarantee: 0,
        minimumGuaranteeDisplay: '$0 (Missing Floor Protection)',
        volumeTiers: 'Standard retail tier',
        subsidies: [
          { name: 'Card Stock Production Subsidy', amount: '$4,500 / yr', status: 'contracted' }
        ]
      },
      exclusivity: {
        isExclusive: false,
        type: 'Non-Exclusive',
        scope: 'Retailer-branded store cards & merchandise return credit',
        clauseRef: 'Section 5.1 (Reseller Rights)',
        clauseText: 'Non-exclusive distribution of retailer private label gift cards.',
        riskLevel: 'Low',
        impact: 'No exclusivity restrictions.',
        carveOut: 'None'
      },
      aiExtraction: {
        confidence: 97.9,
        docType: 'Digital PDF',
        fileName: 'CardVault_Store_Cards_2025.pdf',
        fileSize: '2.1 MB',
        extractedAt: '2026-10-02T15:30:00Z',
        clausesExtracted: 26,
        ocrQuality: '100% Native',
        summary: 'Store card distribution agreement. AI Consultant identified 3.00% commission is 110 bps below peer benchmark of 4.10%. Notice deadline is Jan 14, 2027.'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON007-1',
          severity: 'warning',
          type: 'notice_upcoming',
          title: '60-Day Notice Deadline Approaches (Jan 14, 2027)',
          message: 'Notice window opens in 57 days. Prime leverage opportunity to serve notice and demand 4.10% benchmark rate.',
          actionType: 'draft_addendum',
          actionLabel: 'Draft 4.1% Rate Addendum'
        }
      ]
    },
    {
      id: 'CON008',
      vendorId: 'V008',
      vendorName: 'SecurePay Networks',
      category: 'Debit Services',
      title: 'Payroll Debit Processing Agreement',
      value: 3780000,
      annualVolume: 3780000,
      startDate: '2025-07-01',
      endDate: '2027-07-01',
      renewalDate: '2027-07-01',
      status: 'active',
      type: 'Master',
      renewalType: 'Auto-renew',
      owner: 'U008',
      noticePeriodDays: 90,
      noticeDeadline: '2027-04-01',
      noticeStatus: 'safe',
      workflowState: 'active',
      commission: {
        rate: 1.40,
        rateType: 'percent',
        rateDisplay: '1.40% reload interchange + $0.25 ATM surcharge split',
        benchmarkRate: 1.65,
        varianceBps: -25,
        annualLeakage: 9450,
        minimumGuarantee: 8000,
        minimumGuaranteeDisplay: '$8,000 / month floor guarantee',
        volumeTiers: 'Tiered by active cardholder base',
        subsidies: [
          { name: 'ATM Hardware Maintenance', amount: '$750 / machine / yr', status: 'contracted' },
          { name: 'Branded Card Carrier Subsidy', amount: '$6,000 / yr', status: 'collected' }
        ]
      },
      exclusivity: {
        isExclusive: true,
        type: 'Exclusive Employer Payroll Card Dispenser',
        scope: 'On-premise payroll card issuing kiosks',
        clauseRef: 'Section 11.1 (Exclusivity on Payroll Kiosks)',
        clauseText: 'Retailer grants Vendor sole and exclusive rights to install and operate automated payroll debit card distribution terminals across participating convenience locations.',
        riskLevel: 'Medium',
        impact: 'Exclusivity is limited to automated payroll card dispensers; does not impact general financial services or ATM network.',
        carveOut: 'Third-party independent ATMs not affiliated with employer payroll programs.'
      },
      aiExtraction: {
        confidence: 98.6,
        docType: 'Digital PDF',
        fileName: 'SecurePay_Payroll_Master_2025.pdf',
        fileSize: '3.5 MB',
        extractedAt: '2026-09-15T11:45:00Z',
        clausesExtracted: 36,
        ocrQuality: '100% Native',
        summary: 'Payroll debit card issuing agreement. Strong vendor compliance score (97%). Contract contains an $8,000/mo minimum guarantee protecting baseline revenue.'
      },
      proactiveAlerts: [
        {
          id: 'ALT-CON008-1',
          severity: 'info',
          type: 'compliance_leverage',
          title: 'High Vendor Compliance Score (97%)',
          message: 'Vendor has 99% payment timeliness and zero SLA breaches. Recommended candidate for long-term contract extension with volume bonus.',
          actionType: 'review_performance',
          actionLabel: 'View Vendor Scorecard'
        }
      ]
    }
  ];

  // ── Audit Logs ─────────────────────────────────────────────
  const auditLogs = [
    { id: 'AL001', userId: 'U001', userName: 'Sarah Chen',       action: 'login',           module: 'Auth',        details: 'Successful login',                              timestamp: '2026-11-18T09:30:00Z', ipAddress: '192.168.1.100' },
    { id: 'AL002', userId: 'U002', userName: 'Michael Torres',   action: 'update',          module: 'Vendors',     details: 'Updated vendor V003 commission rate from 1.5% to 1.8%', timestamp: '2026-11-18T08:50:00Z', ipAddress: '192.168.1.101' },
    { id: 'AL003', userId: 'U003', userName: 'Jessica Williams', action: 'create',          module: 'Subsidies',   details: 'Created subsidy request S005 for FinServ Commission Co.', timestamp: '2026-11-17T16:30:00Z', ipAddress: '192.168.1.102' },
    { id: 'AL004', userId: 'U001', userName: 'Sarah Chen',       action: 'approve',         module: 'Subsidies',   details: 'Approved subsidy S002 — $82,000 volume bonus',  timestamp: '2026-11-17T14:00:00Z', ipAddress: '192.168.1.100' },
    { id: 'AL005', userId: 'U004', userName: 'David Park',       action: 'export',          module: 'Reports',     details: 'Exported Q3 2026 Commission Summary Report',    timestamp: '2026-11-17T11:20:00Z', ipAddress: '192.168.1.103' },
    { id: 'AL006', userId: 'U005', userName: 'Rachel Nguyen',    action: 'view',            module: 'Audit',       details: 'Viewed audit trail for vendor V007',            timestamp: '2026-11-16T14:35:00Z', ipAddress: '192.168.1.104' },
    { id: 'AL007', userId: 'U002', userName: 'Michael Torres',   action: 'update',          module: 'Contracts',   details: 'Extended contract CON002 renewal date',         timestamp: '2026-11-16T10:15:00Z', ipAddress: '192.168.1.101' },
    { id: 'AL008', userId: 'U003', userName: 'Jessica Williams', action: 'create',          module: 'Vendors',     details: 'Added new vendor TopUp Technologies (V012)',     timestamp: '2026-11-15T09:00:00Z', ipAddress: '192.168.1.102' },
    { id: 'AL009', userId: 'U001', userName: 'Sarah Chen',       action: 'delete',          module: 'Users',       details: 'Deactivated user account U007',                 timestamp: '2026-11-14T16:45:00Z', ipAddress: '192.168.1.100' },
    { id: 'AL010', userId: 'U008', userName: 'Robert Kim',       action: 'update',          module: 'Commission',  details: 'Renegotiated rate CR006 from 4.0% to 4.2%',     timestamp: '2026-11-14T13:30:00Z', ipAddress: '192.168.1.105' },
    { id: 'AL011', userId: 'U004', userName: 'David Park',       action: 'export',          module: 'Reports',     details: 'Exported vendor performance analytics',         timestamp: '2026-11-13T15:00:00Z', ipAddress: '192.168.1.103' },
    { id: 'AL012', userId: 'U002', userName: 'Michael Torres',   action: 'approve',         module: 'Subsidies',   details: 'Approved subsidy S004 — $15,000 training support', timestamp: '2026-11-12T10:30:00Z', ipAddress: '192.168.1.101' }
  ];

  // ── Notifications ──────────────────────────────────────────
  const notifications = [
    { id: 'N001', userId: 'U001', title: 'Contract Expiring Soon',      message: 'SwiftTransfer Global contract (CON002) expires in 43 days.',       type: 'warning',  read: false, timestamp: '2026-11-18T09:00:00Z', link: '#/contracts' },
    { id: 'N002', userId: 'U001', title: 'New Subsidy Request',         message: 'PrepaidPlus Corp submitted a $25,000 promotional fund request.',    type: 'info',     read: false, timestamp: '2026-11-18T08:30:00Z', link: '#/subsidies' },
    { id: 'N003', userId: 'U001', title: 'Commission Rate Updated',     message: 'PrepaidPlus Corp rate adjusted to 4.2% (was 4.0%).',               type: 'info',     read: true,  timestamp: '2026-11-17T14:00:00Z', link: '#/commissions' },
    { id: 'N004', userId: 'U002', title: 'Subsidy Pending Approval',    message: 'FinServ Commission Co. integration rebate ($60,000) needs review.', type: 'warning',  read: false, timestamp: '2026-11-17T10:00:00Z', link: '#/subsidies' },
    { id: 'N005', userId: 'U003', title: 'Vendor Rating Alert',         message: 'ValueCard Partners rating dropped below 4.0 threshold.',           type: 'danger',   read: false, timestamp: '2026-11-16T16:00:00Z', link: '#/vendors' },
    { id: 'N006', userId: 'U001', title: 'Monthly Report Ready',        message: 'October 2026 Commission Summary Report is available for review.',  type: 'success',  read: true,  timestamp: '2026-11-15T09:00:00Z', link: '#/reports' },
    { id: 'N007', userId: 'U002', title: 'New Vendor Onboarded',        message: 'TopUp Technologies has been added and is pending contract review.', type: 'info',    read: true,  timestamp: '2026-11-15T09:05:00Z', link: '#/vendors' },
    { id: 'N008', userId: 'U001', title: 'System Update Complete',      message: 'Commission IQ v2.4.1 deployed successfully.',                      type: 'success',  read: true,  timestamp: '2026-11-14T06:00:00Z', link: '#/settings' }
  ];

  // ── Dashboard KPIs ─────────────────────────────────────────
  const dashboardKPIs = {
    totalCommissionRevenue:  { value: 1200000, previousValue: 1098200, format: 'currency' },
    marketBenchmarkRevenue:  { value: 1630000, previousValue: 1510000, format: 'currency' },
    moneyLeftOnTable:        { value: 430000,  previousValue: 411800, format: 'currency' },
    activeVendors:           { value: 10,      previousValue: 9,       format: 'number' },
    avgCommissionRate:       { value: 2.72,    previousValue: 2.58,    format: 'percent' },
    pendingSubsidies:        { value: 2,       previousValue: 4,       format: 'number' },
    totalContractValue:      { value: 26750000, previousValue: 24300000, format: 'currency' },
    expiringContracts:       { value: 2,       previousValue: 1,       format: 'number' },
    monthlyTransactions:     { value: 34582,   previousValue: 31204,   format: 'number' },
    complianceScore:         { value: 94.6,    previousValue: 92.1,    format: 'percent' }
  };

  // ── AI Profit Opportunity Engine™ Flagship Data ───────────
  const profitOpportunityEngine = {
    currentCommissions: 1200000,
    marketCommissions: 1630000,
    moneyLeftOnTable: 430000,
    topOpportunities: [
      { name: 'Netflix', category: 'Prepaid & Streaming', current: '$52K', market: '$134K', opportunity: 82000, tag: 'Rate Renegotiation', vendor: 'PrepaidPlus Corp' },
      { name: 'Visa Gift', category: 'Gift Cards', current: '$434K', market: '$505K', opportunity: 71000, tag: 'Volume Tier Reverse Auction', vendor: 'GiftFlow Inc.' },
      { name: 'MoneyGram', category: 'Money Transfer', current: '$182K', market: '$245K', opportunity: 63000, tag: 'Remittance Parity RFP', vendor: 'MoneyGram / SwiftTransfer' },
      { name: 'Store Brand Gift', category: 'Gift Cards', current: '$245K', market: '$299K', opportunity: 54000, tag: 'Direct Issuer Addendum', vendor: 'CardVault Solutions' },
      { name: 'Bill Payment', category: 'Financial Services', current: '$153K', market: '$195K', opportunity: 42000, tag: 'Interchange Rebate', vendor: 'FinServ Commission Co.' },
      { name: 'Reloadable Debit', category: 'Debit Services', current: '$84K', market: '$122K', opportunity: 38000, tag: 'Floor Guarantee', vendor: 'DebitDirect Financial' }
    ]
  };

  // ── Monthly Revenue (for charts) ───────────────────────────
  const monthlyRevenue = [
    { month: 'Jan', giftCards: 85000,  moneyTransfer: 112000, prepaid: 45000, debit: 78000, finServices: 92000 },
    { month: 'Feb', giftCards: 82000,  moneyTransfer: 118000, prepaid: 48000, debit: 81000, finServices: 95000 },
    { month: 'Mar', giftCards: 91000,  moneyTransfer: 125000, prepaid: 52000, debit: 85000, finServices: 98000 },
    { month: 'Apr', giftCards: 95000,  moneyTransfer: 130000, prepaid: 55000, debit: 88000, finServices: 102000 },
    { month: 'May', giftCards: 103000, moneyTransfer: 128000, prepaid: 58000, debit: 92000, finServices: 105000 },
    { month: 'Jun', giftCards: 110000, moneyTransfer: 135000, prepaid: 61000, debit: 95000, finServices: 110000 },
    { month: 'Jul', giftCards: 108000, moneyTransfer: 140000, prepaid: 64000, debit: 98000, finServices: 112000 },
    { month: 'Aug', giftCards: 115000, moneyTransfer: 142000, prepaid: 67000, debit: 101000, finServices: 118000 },
    { month: 'Sep', giftCards: 120000, moneyTransfer: 148000, prepaid: 70000, debit: 105000, finServices: 122000 },
    { month: 'Oct', giftCards: 125000, moneyTransfer: 155000, prepaid: 73000, debit: 108000, finServices: 128000 },
    { month: 'Nov', giftCards: 130000, moneyTransfer: 158000, prepaid: 72000, debit: 107500, finServices: 130000 }
  ];

  // ── Category Distribution (for charts) ─────────────────────
  const categoryDistribution = [
    { category: 'Gift Cards',         value: 34, color: '#6366f1' },
    { category: 'Money Transfer',     value: 28, color: '#22c55e' },
    { category: 'Prepaid Products',   value: 16, color: '#f59e0b' },
    { category: 'Debit Services',     value: 14, color: '#ef4444' },
    { category: 'Financial Services', value: 8,  color: '#1a73e8' }
  ];

  // ── Recent Activity ────────────────────────────────────────
  const recentActivity = [
    { id: 'RA001', type: 'commission',  icon: 'percent',       title: 'Commission Rate Updated',      description: 'PrepaidPlus Corp rate renegotiated to 4.2%',         user: 'Robert Kim',       timestamp: '2026-11-18T10:30:00Z' },
    { id: 'RA002', type: 'contract',    icon: 'file-text',     title: 'Contract Review Due',           description: 'SwiftTransfer Global contract expires Dec 31, 2026', user: 'System',           timestamp: '2026-11-18T09:00:00Z' },
    { id: 'RA003', type: 'vendor',      icon: 'building',      title: 'New Vendor Added',              description: 'TopUp Technologies onboarded for gaming prepaid',    user: 'Jessica Williams', timestamp: '2026-11-17T16:30:00Z' },
    { id: 'RA004', type: 'subsidy',     icon: 'dollar-sign',   title: 'Subsidy Approved',              description: 'SwiftTransfer $82,000 volume bonus approved',        user: 'Sarah Chen',       timestamp: '2026-11-17T14:00:00Z' },
    { id: 'RA005', type: 'report',      icon: 'bar-chart',     title: 'Report Exported',               description: 'Q3 2026 Commission Summary exported as PDF',         user: 'David Park',       timestamp: '2026-11-17T11:20:00Z' },
    { id: 'RA006', type: 'audit',       icon: 'shield',        title: 'Compliance Check Complete',     description: 'Quarterly audit trail review completed',             user: 'Rachel Nguyen',    timestamp: '2026-11-16T14:35:00Z' },
    { id: 'RA007', type: 'commission',  icon: 'trending-up',   title: 'Rate Renegotiation Started',    description: 'CardVault Solutions rate review initiated',           user: 'Jessica Williams', timestamp: '2026-11-16T10:00:00Z' },
    { id: 'RA008', type: 'contract',    icon: 'alert-triangle', title: 'Contract Expired',             description: 'ValueCard Partners contract (CON006) has expired',   user: 'System',           timestamp: '2026-11-15T00:00:00Z' }
  ];

  // ── Top Vendors by Revenue ─────────────────────────────────
  const topVendors = [
    { vendorId: 'V009', name: 'FinServ Commission Co.',  revenue: 153750,  change: 8.2  },
    { vendorId: 'V003', name: 'SwiftTransfer Global',    revenue: 101160,  change: 5.4  },
    { vendorId: 'V008', name: 'SecurePay Networks',      revenue: 60480,   change: 12.1 },
    { vendorId: 'V004', name: 'MoneyLink Express',       revenue: 70140,   change: -2.3 },
    { vendorId: 'V001', name: 'GiftFlow Inc.',           revenue: 85750,   change: 6.7  }
  ];

  // ── Leakage Data ───────────────────────────────────────────
  const leakageData = [
    { id: 'LK001', vendorId: 'V001', vendor: 'GiftFlow Inc.',          product: 'Visa Gift Cards',         expectedRate: 3.5,  actualRate: 3.1,  variance: -0.4, amountLost: 34000, status: 'Detected',     date: '2026-11-01', category: 'Gift Cards' },
    { id: 'LK002', vendorId: 'V003', vendor: 'SwiftTransfer Global',   product: 'International Wire',      expectedRate: 1.8,  actualRate: 1.5,  variance: -0.3, amountLost: 84000, status: 'Under Review', date: '2026-10-28', category: 'Money Transfer' },
    { id: 'LK003', vendorId: 'V007', vendor: 'DebitDirect Financial',  product: 'Prepaid Debit Cards',     expectedRate: 1.5,  actualRate: 1.2,  variance: -0.3, amountLost: 63000, status: 'Recovered',    date: '2026-10-15', category: 'Debit Services' },
    { id: 'LK004', vendorId: 'V005', vendor: 'PrepaidPlus Corp',       product: 'Mobile Prepaid',          expectedRate: 4.2,  actualRate: 3.8,  variance: -0.4, amountLost: 39000, status: 'Disputed',     date: '2026-10-10', category: 'Prepaid Products' },
    { id: 'LK005', vendorId: 'V009', vendor: 'FinServ Commission Co.', product: 'Bill Pay Services',       expectedRate: 2.5,  actualRate: 2.1,  variance: -0.4, amountLost: 61500, status: 'Detected',     date: '2026-11-05', category: 'Financial Services' },
    { id: 'LK006', vendorId: 'V002', vendor: 'CardVault Solutions',    product: 'Store Gift Cards',        expectedRate: 3.2,  actualRate: 2.9,  variance: -0.3, amountLost: 28200, status: 'Recovered',    date: '2026-09-20', category: 'Gift Cards' },
    { id: 'LK007', vendorId: 'V004', vendor: 'MoneyLink Express',      product: 'Domestic Transfer',       expectedRate: 2.1,  actualRate: 1.8,  variance: -0.3, amountLost: 50100, status: 'Under Review', date: '2026-10-22', category: 'Money Transfer' },
    { id: 'LK008', vendorId: 'V008', vendor: 'SecurePay Networks',     product: 'Payroll Debit',           expectedRate: 1.6,  actualRate: 1.4,  variance: -0.2, amountLost: 37800, status: 'Recovered',    date: '2026-09-05', category: 'Debit Services' },
    { id: 'LK009', vendorId: 'V011', vendor: 'QuickRemit International', product: 'Remittance Services',  expectedRate: 2.3,  actualRate: 1.9,  variance: -0.4, amountLost: 11600, status: 'Detected',     date: '2026-11-10', category: 'Money Transfer' },
    { id: 'LK010', vendorId: 'V012', vendor: 'TopUp Technologies',     product: 'Gaming Prepaid',          expectedRate: 4.0,  actualRate: 3.5,  variance: -0.5, amountLost: 6700,  status: 'Under Review', date: '2026-11-08', category: 'Prepaid Products' },
    { id: 'LK011', vendorId: 'V006', vendor: 'ReloadNow Services',     product: 'Retail Reload',           expectedRate: 3.8,  actualRate: 3.2,  variance: -0.6, amountLost: 5340,  status: 'Disputed',     date: '2026-10-30', category: 'Prepaid Products' },
    { id: 'LK012', vendorId: 'V010', vendor: 'ValueCard Partners',     product: 'Retail Gift Cards',       expectedRate: 3.0,  actualRate: 2.7,  variance: -0.3, amountLost: 10800, status: 'Recovered',    date: '2026-09-15', category: 'Gift Cards' }
  ];

  // ── Benchmark Data (Commission Benchmark Analyzer) ─────────
  // Supports exact Excel upload structure:
  // Service Name, Transaction count (annual), Commission Rate/Transaction,
  // Fraud Protection Subsidy, IT Integration Subsidy, Marketing Subsidy
  const benchmarkData = [
    {
      id: 'BM001',
      serviceName: 'Netflix Card',
      product: 'Netflix Card',
      category: 'Prepaid Products',
      vendor: 'PrepaidPlus Corp',
      region: 'National',
      annualTransactions: 145000,
      avgTxSize: 25.00,
      annualVolume: 3625000,
      commissionRatePerTx: 1.55,
      fraudSubsidy: 12000,
      itSubsidy: 8000,
      marketingSubsidy: 15000,
      marketRatePerTx: 2.50,
      marketFraudSubsidy: 15000,
      marketItSubsidy: 10000,
      marketMarketingSubsidy: 22000,
      percentile: 14,
      status: 'Below Benchmark',
      yourRate: 1.55,
      marketLow: 2.10,
      marketAvg: 2.50,
      marketHigh: 2.85,
      opportunity: '-$46,425'
    },
    {
      id: 'BM002',
      serviceName: 'Money Transfer',
      product: 'Money Transfer',
      category: 'Money Transfer',
      vendor: 'SwiftTransfer Global',
      region: 'International',
      annualTransactions: 210000,
      avgTxSize: 280.00,
      annualVolume: 58800000,
      commissionRatePerTx: 1.80,
      fraudSubsidy: 25000,
      itSubsidy: 18000,
      marketingSubsidy: 20000,
      marketRatePerTx: 2.30,
      marketFraudSubsidy: 35000,
      marketItSubsidy: 25000,
      marketMarketingSubsidy: 32000,
      percentile: 22,
      status: 'Below Benchmark',
      yourRate: 1.80,
      marketLow: 1.95,
      marketAvg: 2.30,
      marketHigh: 2.65,
      opportunity: '-$323,000'
    },
    {
      id: 'BM003',
      serviceName: 'Bill Payment',
      product: 'Bill Payment',
      category: 'Financial Services',
      vendor: 'FinServ Commission Co.',
      region: 'National',
      annualTransactions: 380000,
      avgTxSize: 85.00,
      annualVolume: 32300000,
      commissionRatePerTx: 2.50,
      fraudSubsidy: 15000,
      itSubsidy: 12000,
      marketingSubsidy: 10000,
      marketRatePerTx: 2.35,
      marketFraudSubsidy: 15000,
      marketItSubsidy: 12000,
      marketMarketingSubsidy: 10000,
      percentile: 74,
      status: 'Above Benchmark',
      yourRate: 2.50,
      marketLow: 2.00,
      marketAvg: 2.35,
      marketHigh: 2.70,
      opportunity: '+$48,450'
    },
    {
      id: 'BM004',
      serviceName: 'Visa Gift Card',
      product: 'Visa Gift Card',
      category: 'Gift Cards',
      vendor: 'GiftFlow Inc.',
      region: 'National',
      annualTransactions: 280000,
      avgTxSize: 50.00,
      annualVolume: 14000000,
      commissionRatePerTx: 3.10,
      fraudSubsidy: 32000,
      itSubsidy: 20000,
      marketingSubsidy: 25000,
      marketRatePerTx: 3.55,
      marketFraudSubsidy: 40000,
      marketItSubsidy: 25000,
      marketMarketingSubsidy: 35000,
      percentile: 32,
      status: 'Below Benchmark',
      yourRate: 3.10,
      marketLow: 3.00,
      marketAvg: 3.55,
      marketHigh: 4.10,
      opportunity: '-$86,000'
    },
    {
      id: 'BM005',
      serviceName: 'Store Brand Gift Card',
      product: 'Store Brand Gift Card',
      category: 'Gift Cards',
      vendor: 'CardVault Solutions',
      region: 'East Coast',
      annualTransactions: 195000,
      avgTxSize: 45.00,
      annualVolume: 8775000,
      commissionRatePerTx: 2.80,
      fraudSubsidy: 18000,
      itSubsidy: 14000,
      marketingSubsidy: 16000,
      marketRatePerTx: 3.40,
      marketFraudSubsidy: 22000,
      marketItSubsidy: 18000,
      marketMarketingSubsidy: 25000,
      percentile: 26,
      status: 'Below Benchmark',
      yourRate: 2.80,
      marketLow: 2.70,
      marketAvg: 3.40,
      marketHigh: 4.00,
      opportunity: '-$69,650'
    },
    {
      id: 'BM006',
      serviceName: 'Mastercard Gift Card',
      product: 'Mastercard Gift Card',
      category: 'Gift Cards',
      vendor: 'GiftFlow Inc.',
      region: 'National',
      annualTransactions: 165000,
      avgTxSize: 50.00,
      annualVolume: 8250000,
      commissionRatePerTx: 3.45,
      fraudSubsidy: 22000,
      itSubsidy: 15000,
      marketingSubsidy: 18000,
      marketRatePerTx: 3.40,
      marketFraudSubsidy: 20000,
      marketItSubsidy: 15000,
      marketMarketingSubsidy: 18000,
      percentile: 65,
      status: 'At Benchmark',
      yourRate: 3.45,
      marketLow: 2.90,
      marketAvg: 3.40,
      marketHigh: 3.90,
      opportunity: '+$6,125'
    },
    {
      id: 'BM007',
      serviceName: 'Prepaid Debit Card',
      product: 'Prepaid Debit Card',
      category: 'Debit Services',
      vendor: 'DebitDirect Financial',
      region: 'National',
      annualTransactions: 160000,
      avgTxSize: 35.00,
      annualVolume: 5600000,
      commissionRatePerTx: 1.20,
      fraudSubsidy: 22000,
      itSubsidy: 15000,
      marketingSubsidy: 12000,
      marketRatePerTx: 1.65,
      marketFraudSubsidy: 28000,
      marketItSubsidy: 18000,
      marketMarketingSubsidy: 18000,
      percentile: 28,
      status: 'Below Benchmark',
      yourRate: 1.20,
      marketLow: 1.30,
      marketAvg: 1.65,
      marketHigh: 2.05,
      opportunity: '-$40,200'
    },
    {
      id: 'BM008',
      serviceName: 'Mobile Airtime Top-Up',
      product: 'Mobile Airtime Top-Up',
      category: 'Prepaid Products',
      vendor: 'ReloadNow Services',
      region: 'West Coast',
      annualTransactions: 95000,
      avgTxSize: 20.00,
      annualVolume: 1900000,
      commissionRatePerTx: 3.80,
      fraudSubsidy: 8000,
      itSubsidy: 5000,
      marketingSubsidy: 6000,
      marketRatePerTx: 4.15,
      marketFraudSubsidy: 10000,
      marketItSubsidy: 6000,
      marketMarketingSubsidy: 8000,
      percentile: 45,
      status: 'Below Benchmark',
      yourRate: 3.80,
      marketLow: 3.40,
      marketAvg: 4.15,
      marketHigh: 4.75,
      opportunity: '-$11,650'
    },
    {
      id: 'BM009',
      serviceName: 'Domestic Transfer',
      product: 'Domestic Transfer',
      category: 'Money Transfer',
      vendor: 'MoneyLink Express',
      region: 'National',
      annualTransactions: 110000,
      avgTxSize: 180.00,
      annualVolume: 19800000,
      commissionRatePerTx: 2.10,
      fraudSubsidy: 16000,
      itSubsidy: 12000,
      marketingSubsidy: 14000,
      marketRatePerTx: 2.05,
      marketFraudSubsidy: 16000,
      marketItSubsidy: 12000,
      marketMarketingSubsidy: 14000,
      percentile: 62,
      status: 'At Benchmark',
      yourRate: 2.10,
      marketLow: 1.80,
      marketAvg: 2.05,
      marketHigh: 2.45,
      opportunity: '+$9,900'
    },
    {
      id: 'BM010',
      serviceName: 'Payroll Debit',
      product: 'Payroll Debit',
      category: 'Debit Services',
      vendor: 'SecurePay Networks',
      region: 'East Coast',
      annualTransactions: 125000,
      avgTxSize: 65.00,
      annualVolume: 8125000,
      commissionRatePerTx: 1.60,
      fraudSubsidy: 18000,
      itSubsidy: 14000,
      marketingSubsidy: 15000,
      marketRatePerTx: 1.65,
      marketFraudSubsidy: 18000,
      marketItSubsidy: 14000,
      marketMarketingSubsidy: 15000,
      percentile: 51,
      status: 'At Benchmark',
      yourRate: 1.60,
      marketLow: 1.35,
      marketAvg: 1.65,
      marketHigh: 2.00,
      opportunity: '-$4,062'
    }
  ];

  // ── Sourcing & Reverse Auction Engine Data ───────────────────
  const sourcingEvents = [
    {
      id: 'SE001',
      name: 'Master Gift Card Program Reverse Auction (Live Bidding)',
      category: 'Gift Cards',
      auctionType: 'realtime_reverse', // 'realtime_reverse' | 'sealed_bid' | 'target_pricing'
      visibilityRule: 'rank_only',    // 'rank_only' | 'open' | 'anonymous_lead' | 'sealed'
      status: 'Live',
      startDate: '2026-11-18',
      endDate: '2026-11-18',
      vendorsInvited: 6,
      bidsReceived: 9,
      annualVolume: 3500000,
      currentBaselineRate: 3.00, // baseline GiftFlow contract CON001
      currentBaselineAnnual: 105000,
      description: 'Real-time reverse auction for open-loop Visa, Mastercard & retailer gift card mall display distribution across 180 store locations.',
      budget: 3500000,
      aiReserveRecommendation: {
        recommendedStartingRate: 3.60,
        optimalReserveRate: 4.25,     // Dynamic AI Reserve Price
        stretchTargetRate: 4.45,
        confidenceScore: 98.4,
        historicalBenchmarkMedian: 4.10,
        peerDoorsAnalyzed: 1420,
        rationale: 'AI analyzed 1,420 peer convenience locations from Index v2.4. A 4.25% reserve rate captures top-quartile EBITDA (+$43,750/yr) without chilling bidder competition.'
      },
      currentLeadingBid: {
        vendorName: 'Incomm Payments Inc.',
        vendorId: 'V999',
        rate: 4.30,
        timestamp: '14:48:10',
        round: 5,
        reserveMet: true,
        annualRevenue: 150500,
        annualGain: 45500
      },
      liveTimer: {
        totalMinutes: 20,
        secondsRemaining: 272, // 04:32 remaining
        antiSnipingExtendedCount: 1,
        isPaused: false
      },
      config: {
        minBidIncrementBps: 5, // 0.05%
        antiSnipingMinutes: 3,
        autoAwardOnReserveMet: false,
        visibilityRule: 'rank_only'
      },
      bids: [
        { id: 'BID-001', vendorId: 'V002', vendorName: 'CardVault Solutions', rate: 3.85, timestamp: '14:32:10', round: 1, annualYield: 134750, isLeading: false },
        { id: 'BID-002', vendorId: 'V001', vendorName: 'GiftFlow Inc.', rate: 4.00, timestamp: '14:35:45', round: 2, annualYield: 140000, isLeading: false },
        { id: 'BID-003', vendorId: 'V005', vendorName: 'Blackhawk Network', rate: 4.15, timestamp: '14:39:20', round: 3, annualYield: 145250, isLeading: false },
        { id: 'BID-004', vendorId: 'V002', vendorName: 'CardVault Solutions', rate: 4.18, timestamp: '14:41:05', round: 3, annualYield: 146300, isLeading: false },
        { id: 'BID-005', vendorId: 'V001', vendorName: 'GiftFlow Inc.', rate: 4.22, timestamp: '14:43:50', round: 4, annualYield: 147700, isLeading: false },
        { id: 'BID-006', vendorId: 'V005', vendorName: 'Blackhawk Network', rate: 4.25, timestamp: '14:45:15', round: 4, annualYield: 148750, isLeading: false },
        { id: 'BID-007', vendorId: 'V001', vendorName: 'GiftFlow Inc.', rate: 4.26, timestamp: '14:46:00', round: 5, annualYield: 149100, isLeading: false },
        { id: 'BID-008', vendorId: 'V005', vendorName: 'Blackhawk Network', rate: 4.28, timestamp: '14:47:12', round: 5, annualYield: 149800, isLeading: false },
        { id: 'BID-009', vendorId: 'V999', vendorName: 'Incomm Payments Inc.', rate: 4.30, timestamp: '14:48:10', round: 5, annualYield: 150500, isLeading: true }
      ]
    },
    {
      id: 'SE002',
      name: 'Global Wire Remittance & Transfer Services (Sealed Bid)',
      category: 'Money Transfer',
      auctionType: 'sealed_bid',
      visibilityRule: 'sealed',
      status: 'Evaluation',
      startDate: '2026-10-15',
      endDate: '2026-11-15',
      vendorsInvited: 6,
      bidsReceived: 4,
      annualVolume: 5620000,
      currentBaselineRate: 1.50, // SwiftTransfer CON002 ($0 floor)
      currentBaselineAnnual: 84300,
      description: 'Sealed-bid competitive tender for nationwide domestic & cross-border wire transfer services. Requires mandatory monthly minimum floor guarantee.',
      budget: 5620000,
      aiReserveRecommendation: {
        recommendedStartingRate: 1.85,
        optimalReserveRate: 2.15,     // Dynamic Reserve Price
        stretchTargetRate: 2.35,
        confidenceScore: 97.8,
        historicalBenchmarkMedian: 2.10,
        peerDoorsAnalyzed: 1040,
        rationale: 'AI analyzed 1,040 peer stores. In addition to 2.15% commission, AI recommends mandating a $12,500/month minimum floor guarantee to eliminate downside volume risk.'
      },
      currentLeadingBid: {
        vendorName: 'MoneyGram International',
        vendorId: 'V004',
        rate: 2.20,
        timestamp: '2026-11-15T16:00:00Z',
        round: 1,
        reserveMet: true,
        annualRevenue: 123640,
        annualGain: 39340
      },
      config: {
        visibilityRule: 'sealed',
        unsealDate: '2026-11-16T09:00:00Z'
      },
      bids: [
        { id: 'SBID-001', vendorId: 'V003', vendorName: 'SwiftTransfer Global', rate: 1.95, floorGuarantee: '$10,000 / mo', timestamp: '2026-11-14T11:20:00Z', isLeading: false, score: 79 },
        { id: 'SBID-002', vendorId: 'V011', vendorName: 'QuickRemit International', rate: 2.05, floorGuarantee: '$12,000 / mo', timestamp: '2026-11-14T15:30:00Z', isLeading: false, score: 84 },
        { id: 'SBID-003', vendorId: 'V004', vendorName: 'MoneyLink Express', rate: 2.10, floorGuarantee: '$12,500 / mo', timestamp: '2026-11-15T10:15:00Z', isLeading: false, score: 87 },
        { id: 'SBID-004', vendorId: 'V998', vendorName: 'MoneyGram International', rate: 2.20, floorGuarantee: '$15,000 / mo', timestamp: '2026-11-15T14:40:00Z', isLeading: true, score: 95 }
      ]
    },
    {
      id: 'SE003',
      name: 'Digital Streaming & Subscription Code RFP (Target Pricing)',
      category: 'Prepaid Products',
      auctionType: 'target_pricing',
      visibilityRule: 'anonymous_lead',
      status: 'Open',
      startDate: '2026-11-10',
      endDate: '2026-12-05',
      vendorsInvited: 5,
      bidsReceived: 3,
      annualVolume: 3400000,
      currentBaselineRate: 1.55, // Netflix rate in CON003
      currentBaselineAnnual: 52700,
      description: 'Target pricing RFP for digital streaming codes (Netflix, Spotify, Hulu, YouTube). Target pricing set at 2.65% with $15K co-op marketing subsidy.',
      budget: 3400000,
      aiReserveRecommendation: {
        recommendedStartingRate: 2.20,
        optimalReserveRate: 2.50,     // Dynamic Reserve Price
        stretchTargetRate: 2.85,
        confidenceScore: 99.2,
        historicalBenchmarkMedian: 2.50,
        peerDoorsAnalyzed: 1120,
        rationale: 'Peer digital retailers command 2.50% minimum from authorized aggregators. Target pricing set at 2.65% to force premium bids.'
      },
      currentLeadingBid: {
        vendorName: 'Blackhawk Network',
        vendorId: 'V005',
        rate: 2.70,
        timestamp: '2026-11-17T11:00:00Z',
        round: 1,
        reserveMet: true,
        annualRevenue: 91800,
        annualGain: 39100
      },
      config: {
        targetRate: 2.65,
        targetSubsidy: 15000,
        visibilityRule: 'anonymous_lead'
      },
      bids: [
        { id: 'TP-001', vendorId: 'V005', vendorName: 'PrepaidPlus Corp', rate: 2.45, timestamp: '2026-11-12T10:00:00Z', isLeading: false },
        { id: 'TP-002', vendorId: 'V997', vendorName: 'Euronet Worldwide', rate: 2.60, timestamp: '2026-11-15T14:30:00Z', isLeading: false },
        { id: 'TP-003', vendorId: 'V005', vendorName: 'Blackhawk Network', rate: 2.70, timestamp: '2026-11-17T11:00:00Z', isLeading: true }
      ]
    },
    {
      id: 'SE004',
      name: 'Debit Services & ATM Interchange Reverse Auction',
      category: 'Debit Services',
      auctionType: 'realtime_reverse',
      visibilityRule: 'open',
      status: 'Awarded',
      startDate: '2026-08-01',
      endDate: '2026-09-15',
      vendorsInvited: 7,
      bidsReceived: 8,
      annualVolume: 4210000,
      currentBaselineRate: 1.25,
      currentBaselineAnnual: 52625,
      description: 'Completed real-time reverse auction for GPR debit cash reloading and PIN-debit interchange routing.',
      budget: 4210000,
      aiReserveRecommendation: {
        recommendedStartingRate: 1.45,
        optimalReserveRate: 1.65,
        stretchTargetRate: 1.80,
        confidenceScore: 96.8,
        historicalBenchmarkMedian: 1.65,
        peerDoorsAnalyzed: 860,
        rationale: 'Benchmark median of 1.65% was established as reserve. Auction concluded at 1.68% (+43 bps lift).'
      },
      currentLeadingBid: {
        vendorName: 'DebitDirect Financial',
        vendorId: 'V007',
        rate: 1.68,
        timestamp: '2026-09-15T16:00:00Z',
        round: 4,
        reserveMet: true,
        annualRevenue: 70728,
        annualGain: 18103
      },
      config: {
        visibilityRule: 'open'
      },
      bids: [
        { id: 'BID-D01', vendorId: 'V008', vendorName: 'SecurePay Networks', rate: 1.55, timestamp: '2026-09-15T15:20:00Z', isLeading: false },
        { id: 'BID-D02', vendorId: 'V007', vendorName: 'DebitDirect Financial', rate: 1.68, timestamp: '2026-09-15T15:58:00Z', isLeading: true }
      ]
    },
    {
      id: 'SE005',
      name: 'Financial Services Bill Payment Reverse RFP',
      category: 'Financial Services',
      auctionType: 'target_pricing',
      visibilityRule: 'rank_only',
      status: 'Draft',
      startDate: '2026-12-01',
      endDate: '2027-01-15',
      vendorsInvited: 4,
      bidsReceived: 0,
      annualVolume: 6150000,
      currentBaselineRate: 2.10,
      currentBaselineAnnual: 129150,
      description: 'Scheduled target pricing event for walk-in utility bill pay with $60,000 integration rebate.',
      budget: 6150000,
      aiReserveRecommendation: {
        recommendedStartingRate: 2.15,
        optimalReserveRate: 2.35,
        stretchTargetRate: 2.50,
        confidenceScore: 98.2,
        historicalBenchmarkMedian: 2.35,
        peerDoorsAnalyzed: 1190,
        rationale: 'AI calibration pending final RFP publication.'
      },
      config: {
        visibilityRule: 'rank_only'
      },
      bids: []
    },
    {
      id: 'SE006',
      name: 'Gaming Prepaid Card & Digital Console Pilot Auction',
      category: 'Prepaid Products',
      auctionType: 'realtime_reverse',
      visibilityRule: 'anonymous_lead',
      status: 'Open',
      startDate: '2026-11-15',
      endDate: '2026-12-20',
      vendorsInvited: 10,
      bidsReceived: 3,
      annualVolume: 1500000,
      currentBaselineRate: 3.50,
      currentBaselineAnnual: 52500,
      description: 'Competitive reverse auction for digital gaming currency (PlayStation, Xbox, Nintendo, Roblox).',
      budget: 1500000,
      aiReserveRecommendation: {
        recommendedStartingRate: 3.80,
        optimalReserveRate: 4.35,
        stretchTargetRate: 4.60,
        confidenceScore: 97.4,
        historicalBenchmarkMedian: 4.25,
        peerDoorsAnalyzed: 950,
        rationale: 'High-growth gaming segment supports aggressive 4.35% reserve rate.'
      },
      currentLeadingBid: {
        vendorName: 'Blackhawk Network',
        vendorId: 'V005',
        rate: 4.20,
        timestamp: '2026-11-18T10:15:00Z',
        round: 2,
        reserveMet: false,
        annualRevenue: 63000,
        annualGain: 10500
      },
      config: {
        visibilityRule: 'anonymous_lead'
      },
      bids: [
        { id: 'GP-01', vendorId: 'V002', vendorName: 'CardVault Solutions', rate: 3.90, timestamp: '2026-11-17T09:00:00Z', isLeading: false },
        { id: 'GP-02', vendorId: 'V005', vendorName: 'PrepaidPlus Corp', rate: 4.10, timestamp: '2026-11-17T14:20:00Z', isLeading: false },
        { id: 'GP-03', vendorId: 'V005', vendorName: 'Blackhawk Network', rate: 4.20, timestamp: '2026-11-18T10:15:00Z', isLeading: true }
      ]
    }
  ];

  const reverseAuctionConfig = {
    defaultVisibility: 'rank_only',
    defaultAntiSnipingMinutes: 3,
    defaultMinBidIncrementBps: 5,
    reservePriceAggressiveness: 'balanced', // 'conservative' | 'balanced' | 'aggressive'
    autoNotifyProcurementOnReserveMet: true
  };

  // ── Compliance Scores ──────────────────────────────────────
  const complianceScores = [
    { id: 'CS001', vendorId: 'V001', vendor: 'GiftFlow Inc.',          overallScore: 95, paymentTimeliness: 98, rateAccuracy: 94, sla: 96, reportingQuality: 92 },
    { id: 'CS002', vendorId: 'V002', vendor: 'CardVault Solutions',    overallScore: 88, paymentTimeliness: 85, rateAccuracy: 90, sla: 88, reportingQuality: 89 },
    { id: 'CS003', vendorId: 'V003', vendor: 'SwiftTransfer Global',   overallScore: 72, paymentTimeliness: 68, rateAccuracy: 75, sla: 74, reportingQuality: 71 },
    { id: 'CS004', vendorId: 'V004', vendor: 'MoneyLink Express',      overallScore: 81, paymentTimeliness: 83, rateAccuracy: 80, sla: 82, reportingQuality: 79 },
    { id: 'CS005', vendorId: 'V005', vendor: 'PrepaidPlus Corp',       overallScore: 93, paymentTimeliness: 95, rateAccuracy: 92, sla: 94, reportingQuality: 91 },
    { id: 'CS006', vendorId: 'V006', vendor: 'ReloadNow Services',     overallScore: 55, paymentTimeliness: 50, rateAccuracy: 58, sla: 55, reportingQuality: 57 },
    { id: 'CS007', vendorId: 'V007', vendor: 'DebitDirect Financial',  overallScore: 86, paymentTimeliness: 88, rateAccuracy: 85, sla: 87, reportingQuality: 84 },
    { id: 'CS008', vendorId: 'V008', vendor: 'SecurePay Networks',     overallScore: 97, paymentTimeliness: 99, rateAccuracy: 96, sla: 98, reportingQuality: 95 },
    { id: 'CS009', vendorId: 'V009', vendor: 'FinServ Commission Co.', overallScore: 79, paymentTimeliness: 77, rateAccuracy: 80, sla: 81, reportingQuality: 78 },
    { id: 'CS010', vendorId: 'V010', vendor: 'ValueCard Partners',     overallScore: 48, paymentTimeliness: 45, rateAccuracy: 50, sla: 48, reportingQuality: 49 },
    { id: 'CS011', vendorId: 'V011', vendor: 'QuickRemit International', overallScore: 83, paymentTimeliness: 82, rateAccuracy: 84, sla: 83, reportingQuality: 83 },
    { id: 'CS012', vendorId: 'V012', vendor: 'TopUp Technologies',     overallScore: 91, paymentTimeliness: 92, rateAccuracy: 90, sla: 93, reportingQuality: 89 }
  ];

  const complianceViolations = [
    { id: 'CV001', vendor: 'SwiftTransfer Global',   type: 'Late Payment',         severity: 'High',   date: '2026-11-10', resolution: 'Pending', description: 'Net-15 payment 12 days overdue' },
    { id: 'CV002', vendor: 'ReloadNow Services',     type: 'Rate Discrepancy',     severity: 'High',   date: '2026-11-08', resolution: 'Pending', description: 'Actual rate 0.6% below contracted rate' },
    { id: 'CV003', vendor: 'ValueCard Partners',     type: 'SLA Breach',           severity: 'High',   date: '2026-11-05', resolution: 'Escalated', description: 'Response SLA breached for 3rd consecutive month' },
    { id: 'CV004', vendor: 'MoneyLink Express',      type: 'Reporting Delay',      severity: 'Medium', date: '2026-10-30', resolution: 'Resolved', description: 'Monthly report submitted 5 days late' },
    { id: 'CV005', vendor: 'FinServ Commission Co.', type: 'Rate Discrepancy',     severity: 'Medium', date: '2026-10-22', resolution: 'Under Review', description: 'Bill pay rate calculation error detected' },
    { id: 'CV006', vendor: 'SwiftTransfer Global',   type: 'Documentation Missing', severity: 'Low',  date: '2026-10-15', resolution: 'Resolved', description: 'Quarterly compliance certificate not submitted' },
    { id: 'CV007', vendor: 'ReloadNow Services',     type: 'Late Payment',         severity: 'Medium', date: '2026-10-10', resolution: 'Resolved', description: 'Net-45 payment 8 days overdue' },
    { id: 'CV008', vendor: 'ValueCard Partners',     type: 'Rate Discrepancy',     severity: 'High',   date: '2026-10-01', resolution: 'Escalated', description: 'Persistent rate underreporting pattern identified' },
    { id: 'CV009', vendor: 'MoneyLink Express',      type: 'SLA Breach',           severity: 'Low',    date: '2026-09-25', resolution: 'Resolved', description: 'Customer dispute resolution SLA exceeded by 2 days' }
  ];

  // ── Recovery Pipeline ──────────────────────────────────────
  const recoveryPipeline = [
    { id: 'RC001', vendor: 'SwiftTransfer Global',   type: 'Commission Shortfall', amount: 84000,  status: 'In Progress',  priority: 'High',   assignedTo: 'Jessica Williams', age: 21, notes: 'Formal dispute letter sent. Awaiting vendor response.' },
    { id: 'RC002', vendor: 'GiftFlow Inc.',          type: 'Subsidy Underpayment', amount: 34000,  status: 'Identified',   priority: 'High',   assignedTo: 'Robert Kim',       age: 17, notes: 'Variance analysis complete. Documentation being compiled.' },
    { id: 'RC003', vendor: 'PrepaidPlus Corp',       type: 'Rate Discrepancy',     amount: 39000,  status: 'Disputed',     priority: 'Medium', assignedTo: 'David Park',       age: 39, notes: 'Vendor disputes calculation methodology. Legal reviewing.' },
    { id: 'RC004', vendor: 'FinServ Commission Co.', type: 'Commission Shortfall', amount: 61500,  status: 'In Progress',  priority: 'High',   assignedTo: 'Jessica Williams', age: 13, notes: 'Invoice reconciliation underway with vendor finance team.' },
    { id: 'RC005', vendor: 'MoneyLink Express',      type: 'SLA Penalty',          amount: 50100,  status: 'In Progress',  priority: 'Medium', assignedTo: 'Robert Kim',       age: 27, notes: 'SLA breach confirmed. Penalty clause invoked per contract.' },
    { id: 'RC006', vendor: 'DebitDirect Financial',  type: 'Commission Shortfall', amount: 63000,  status: 'Recovered',    priority: 'High',   assignedTo: 'Sarah Chen',       age: 44, notes: 'Full recovery achieved. Payment received Nov 1, 2026.' },
    { id: 'RC007', vendor: 'CardVault Solutions',    type: 'Subsidy Underpayment', amount: 28200,  status: 'Recovered',    priority: 'Low',    assignedTo: 'David Park',       age: 59, notes: 'Partial recovery: $28,200 of $31,000 identified.' },
    { id: 'RC008', vendor: 'SecurePay Networks',     type: 'Rate Discrepancy',     amount: 37800,  status: 'Recovered',    priority: 'Medium', assignedTo: 'Rachel Nguyen',    age: 74, notes: 'Recovery confirmed. Rate corrected going forward.' },
    { id: 'RC009', vendor: 'QuickRemit International', type: 'Commission Shortfall', amount: 11600, status: 'Identified',  priority: 'Low',    assignedTo: 'Robert Kim',       age: 8, notes: 'Initial analysis complete. Outreach to vendor scheduled.' },
    { id: 'RC010', vendor: 'TopUp Technologies',     type: 'Rate Discrepancy',     amount: 6700,   status: 'In Progress',  priority: 'Low',    assignedTo: 'Emily Rodriguez',  age: 10, notes: 'Rate table discrepancy confirmed. Correction request sent.' }
  ];

  // ── Workflow Items ─────────────────────────────────────────
  const workflowItems = [
    { id: 'WF001', name: 'Subsidy Approval — PrepaidPlus Corp',   type: 'Subsidy Approval',      status: 'In Progress',  currentStep: 2, totalSteps: 4, assignee: 'Michael Torres',   createdDate: '2026-11-14', steps: ['Submission', 'Manager Review', 'Finance Approval', 'Complete'] },
    { id: 'WF002', name: 'Vendor Onboarding — TopUp Technologies',type: 'Vendor Onboarding',     status: 'In Progress',  currentStep: 3, totalSteps: 5, assignee: 'Jessica Williams', createdDate: '2026-11-10', steps: ['Application', 'KYC Check', 'Contract Review', 'Rate Setup', 'Go Live'] },
    { id: 'WF003', name: 'Contract Renewal — SwiftTransfer Global', type: 'Contract Renewal',    status: 'Pending',      currentStep: 1, totalSteps: 3, assignee: 'Robert Kim',       createdDate: '2026-11-16', steps: ['Negotiation', 'Legal Review', 'Sign Off'] },
    { id: 'WF004', name: 'Rate Renegotiation — CardVault Solutions', type: 'Rate Renegotiation', status: 'In Progress',  currentStep: 2, totalSteps: 4, assignee: 'Jessica Williams', createdDate: '2026-11-08', steps: ['Analysis', 'Proposal', 'Negotiation', 'Approval'] },
    { id: 'WF005', name: 'Compliance Audit — Q4 2026',            type: 'Compliance Audit',      status: 'Completed',    currentStep: 4, totalSteps: 4, assignee: 'Rachel Nguyen',   createdDate: '2026-10-20', steps: ['Planning', 'Data Collection', 'Analysis', 'Report'] },
    { id: 'WF006', name: 'Subsidy Approval — FinServ Commission', type: 'Subsidy Approval',      status: 'Pending',      currentStep: 1, totalSteps: 4, assignee: 'Sarah Chen',       createdDate: '2026-11-18', steps: ['Submission', 'Manager Review', 'Finance Approval', 'Complete'] },
    { id: 'WF007', name: 'Recovery Case — DebitDirect Financial', type: 'Revenue Recovery',      status: 'Completed',    currentStep: 3, totalSteps: 3, assignee: 'Sarah Chen',       createdDate: '2026-10-01', steps: ['Identification', 'Dispute Resolution', 'Recovery'] },
    { id: 'WF008', name: 'New Sourcing Event — Gift Cards Q1',    type: 'Sourcing Event',        status: 'In Progress',  currentStep: 2, totalSteps: 5, assignee: 'Robert Kim',       createdDate: '2026-11-01', steps: ['Draft', 'Review', 'Publish', 'Evaluate', 'Award'] }
  ];

  // ── Generated Reports ──────────────────────────────────────
  const generatedReports = [
    { id: 'GR001', name: 'Q3 2026 Commission Summary',      created: '2026-11-17T11:20:00Z', type: 'Commission Summary',    format: 'PDF',  createdBy: 'David Park' },
    { id: 'GR002', name: 'October Vendor Performance',      created: '2026-11-15T09:00:00Z', type: 'Vendor Scorecard',       format: 'Excel', createdBy: 'David Park' },
    { id: 'GR003', name: 'Leakage Report — Nov 2026',       created: '2026-11-12T14:30:00Z', type: 'Leakage Report',         format: 'PDF',  createdBy: 'Jessica Williams' },
    { id: 'GR004', name: 'Benchmark Analysis Q4 2026',      created: '2026-11-10T10:00:00Z', type: 'Benchmark Analysis',     format: 'Excel', createdBy: 'Robert Kim' },
    { id: 'GR005', name: 'Audit Trail Export Nov 1–18',     created: '2026-11-18T08:00:00Z', type: 'Audit Trail',            format: 'CSV',  createdBy: 'Rachel Nguyen' },
    { id: 'GR006', name: 'Recovery Pipeline Summary',       created: '2026-11-11T16:00:00Z', type: 'Recovery Report',        format: 'PDF',  createdBy: 'Sarah Chen' }
  ];

  // ── AI Feasibility & Proactive Intelligence Findings ──────
  const aiFindings = [
    {
      id: 'AIF-001',
      title: 'Netflix commissions are 38% below market.',
      headline: 'Netflix commissions are 38% below market',
      category: 'Prepaid Products',
      product: 'Netflix e-Gift & Subscription Codes',
      vendor: 'PrepaidPlus Corp / Netflix Direct',
      currentRate: 1.55,
      marketRate: 2.50,
      marketLow: 2.10,
      marketHigh: 2.85,
      variancePct: -38.0,
      annualVolume: 3400000,
      annualLoss: 32400,
      severity: 'critical',
      urgency: 'Immediate Action',
      impact: '$32,400 / yr leakage',
      peerQuartile: 'Bottom 8th Percentile',
      confidence: '99.2%',
      explanation: 'Retailer currently captures a 1.55% distribution margin while benchmarked peer retailers with comparable transaction volumes ($3.4M/yr) command 2.50% from authorized digital aggregators.',
      recommendedAction: 'Trigger Renegotiation RFP',
      actionType: 'sourcing',
      status: 'Action Required',
      detectedDate: '2026-11-18'
    },
    {
      id: 'AIF-002',
      title: 'Gift card category is underperforming by $84,000 annually.',
      headline: 'Gift card category is underperforming by $84,000 annually',
      category: 'Gift Cards',
      product: 'Multi-Brand & Open-Loop Cards (Visa/Mastercard/Retail)',
      vendor: 'Blended: GiftFlow Inc. & CardVault Solutions',
      currentRate: 2.95,
      marketRate: 3.42,
      marketLow: 3.10,
      marketHigh: 3.80,
      variancePct: -13.7,
      annualVolume: 17850000,
      annualLoss: 84000,
      severity: 'high',
      urgency: 'High Priority',
      impact: '$84,000 / yr shortfall',
      peerQuartile: '24th Percentile',
      confidence: '97.8%',
      explanation: 'Across Visa, Mastercard and retail brand gift cards, your blended commission rate lags the top-quartile market rate by 47 basis points (2.95% vs. 3.42%). Consolidating multi-distributor volumes into a single master tier will eliminate the $84,000 drag.',
      recommendedAction: 'Consolidate & Run Auction',
      actionType: 'auction',
      status: 'Action Required',
      detectedDate: '2026-11-18'
    },
    {
      id: 'AIF-003',
      title: 'Vendor XYZ is paying 22% less than similar retailers.',
      headline: 'Vendor XYZ is paying 22% less than similar retailers',
      category: 'Money Transfer',
      product: 'Cross-Border Wire & Remittance',
      vendor: 'SwiftTransfer Global (Vendor XYZ)',
      currentRate: 1.80,
      marketRate: 2.30,
      marketLow: 2.05,
      marketHigh: 2.60,
      variancePct: -21.7,
      annualVolume: 5620000,
      annualLoss: 28100,
      severity: 'high',
      urgency: 'Immediate Action',
      impact: '$28,100 / yr underpayment',
      peerQuartile: '14th Percentile',
      confidence: '98.5%',
      explanation: 'Contracted commission rate is 1.80% on international money transfers. Peer retailers with over $5M in annual remittance volume average 2.30%, creating a 21.7% discount and $28,100 in uncollected revenue.',
      recommendedAction: 'Issue Clawback & Dispute',
      actionType: 'recovery',
      status: 'Action Required',
      detectedDate: '2026-11-17'
    },
    {
      id: 'AIF-004',
      title: 'Debit Card Interchange Subsidy clause expiring in 43 days.',
      headline: 'Debit Card Interchange Subsidy expiring in 43 days',
      category: 'Debit Services',
      product: 'Payroll & Prepaid Debit Cards',
      vendor: 'DebitDirect Financial',
      currentRate: 1.20,
      marketRate: 1.55,
      marketLow: 1.35,
      marketHigh: 1.70,
      variancePct: -22.6,
      annualVolume: 4210000,
      annualLoss: 14750,
      severity: 'medium',
      urgency: 'Review Pending',
      impact: '$14,750 / yr at risk',
      peerQuartile: '32nd Percentile',
      confidence: '95.1%',
      explanation: 'Contract review reveals co-op marketing subsidy agreement expires Dec 31, 2026 without automated rollover protection.',
      recommendedAction: 'Initiate Contract Addendum',
      actionType: 'contract',
      status: 'In Review',
      detectedDate: '2026-11-16'
    }
  ];

  // ── Ingested Retailer Datasets (Simulated for Upload/Analysis) ──
  const sampleUploadPresets = {
    'retailer_national': [
      { product: 'Netflix e-Gift & Subscriptions', vendor: 'PrepaidPlus Corp', category: 'Prepaid Products', yourRate: 1.55, marketAvg: 2.50, annualVol: 3400000, variancePct: -38.0, annualGap: 32400, aiNote: 'Critical 38% below market' },
      { product: 'Visa / MC Open-Loop Gift Cards', vendor: 'GiftFlow Inc.', category: 'Gift Cards', yourRate: 3.10, marketAvg: 3.55, annualVol: 9200000, variancePct: -12.7, annualGap: 41400, aiNote: 'Category drag of $41.4K' },
      { product: 'Store Retail Gift Cards', vendor: 'CardVault Solutions', category: 'Gift Cards', yourRate: 2.80, marketAvg: 3.30, annualVol: 8650000, variancePct: -15.2, annualGap: 42600, aiNote: 'Category drag of $42.6K ($84K total)' },
      { product: 'International Remittance', vendor: 'SwiftTransfer Global (Vendor XYZ)', category: 'Money Transfer', yourRate: 1.80, marketAvg: 2.30, annualVol: 5620000, variancePct: -21.7, annualGap: 28100, aiNote: 'Vendor XYZ paying 22% below peers' },
      { product: 'Mobile Airtime Top-Up', vendor: 'ReloadNow Services', category: 'Prepaid Products', yourRate: 3.80, marketAvg: 4.10, annualVol: 890000, variancePct: -7.3, annualGap: 2670, aiNote: 'Within acceptable threshold' },
      { product: 'Prepaid Debit Program', vendor: 'DebitDirect Financial', category: 'Debit Services', yourRate: 1.20, marketAvg: 1.55, annualVol: 4210000, variancePct: -22.6, annualGap: 14750, aiNote: 'Interchange subsidy renegotiation required' },
      { product: 'Bill Payment Kiosk Services', vendor: 'FinServ Commission Co.', category: 'Financial Services', yourRate: 2.50, marketAvg: 2.45, annualVol: 6150000, variancePct: +2.0, annualGap: 0, aiNote: 'Performing at or above market' }
    ]
  };

  // ── AI Procurement Consultant Strategic Advisory ──────────
  const aiConsultantAdvice = [
    {
      id: 'AIC-001',
      type: 'rate_benchmark',
      headline: '3.0% commission is below benchmark of 4.1%.',
      quote: '3.0% commission is below benchmark of 4.1%.',
      category: 'Gift Cards',
      vendor: 'CardVault Solutions & Retail Store Cards',
      currentRate: 3.00,
      benchmarkRate: 4.10,
      annualVolume: 3500000,
      annualOpportunity: 38500,
      priority: 'P1',
      urgency: 'Critical Renegotiation',
      adviceText: 'Instead of passively storing this contract, Commission IQ detects that your contracted 3.00% store gift card rate is severely depressed. Peer retail chains with 20+ locations automatically receive 4.10% via standardized distributor tiers.',
      actionLabel: 'Draft 4.1% Rate Addendum',
      status: 'Open Opportunity'
    },
    {
      id: 'AIC-002',
      type: 'contract_terms',
      headline: 'Recommend negotiating a minimum guarantee.',
      quote: 'Recommend negotiating a minimum guarantee.',
      category: 'Money Transfer',
      vendor: 'SwiftTransfer Global (Vendor XYZ)',
      currentRate: 1.80,
      annualVolume: 5620000,
      annualOpportunity: 24000,
      priority: 'P2',
      urgency: 'Contract Risk Mitigation',
      adviceText: 'Your contract contains zero floor protection against seasonal volume dips. During Q1 and Q2, monthly remittance commission dropped 31%. AI recommends inserting Clause 6.3: Contractual Minimum Guarantee of $12,500/month to secure predictable recurring retailer cashflow.',
      actionLabel: 'Add Minimum Guarantee Clause',
      status: 'Recommended Clause'
    },
    {
      id: 'AIC-003',
      type: 'subsidy_funding',
      headline: 'Recommend requesting marketing co-op funding.',
      quote: 'Recommend requesting marketing co-op funding.',
      category: 'Prepaid Products & Gift Cards',
      vendor: 'PrepaidPlus Corp & GiftFlow Inc.',
      currentRate: 3.50,
      annualVolume: 5120000,
      annualOpportunity: 18000,
      priority: 'P3',
      urgency: 'Subsidy Expansion',
      adviceText: 'Top retail networks receive an additional 0.35% in vendor-paid promotional co-op funding for endcap placement and checkout signage. Your current agreement omits this subsidy entirely, leaving $18,000 in vendor-funded marketing money on the table.',
      actionLabel: 'Dispatch Co-Op Funding Request',
      status: 'Untapped Subsidy'
    }
  ];

  const consultantSummaryOutputs = {
    revenueLeakageScore: {
      score: 74,
      scale: 100,
      level: 'High Leakage Risk',
      statusText: 'Severe Commission & Term Omissions Detected',
      rateLeakageSubscore: 78,
      termsRiskSubscore: 68,
      subsidyDeficitSubscore: 76
    },
    estimatedAnnualOpportunity: {
      total: 186500,
      rateOptimization: 144500,
      minimumGuarantees: 24000,
      marketingCoOp: 18000,
      threeYearTotal: 559500
    },
    priorityRanking: [
      { rank: 'P1', title: 'Gift card category consolidation auction', category: 'Gift Cards', estGain: 84000, type: 'Auction Consolidation', ease: 'Quick Win' },
      { rank: 'P1', title: 'Netflix subscription commission renegotiation (38% gap)', category: 'Prepaid Products', estGain: 32400, type: 'Rate Renegotiation', ease: 'High Leverage' },
      { rank: 'P2', title: 'SwiftTransfer remittance rate parity (22% gap)', category: 'Money Transfer', estGain: 28100, type: 'Dispute / Clawback', ease: 'Medium' },
      { rank: 'P2', title: 'Store Gift Card benchmark alignment (3.0% → 4.1%)', category: 'Gift Cards', estGain: 24000, type: 'Rate Addendum', ease: 'Quick Win' },
      { rank: 'P3', title: 'Contractual minimum guarantee clause', category: 'Money Transfer', estGain: 24000, type: 'Downside Protection', ease: 'Contract Renewal' },
      { rank: 'P3', title: 'Marketing co-op subsidy funding request', category: 'Prepaid & Gift', estGain: 18000, type: 'Subsidy Claim', ease: 'Immediate' }
    ]
  };

  // ── Benchmark Database Repository (Spec #6) ───────────────
  const benchmarkDatabaseRepo = {
    currentVersion: 'v2.4',
    lastCalibrationDate: '2026-10-15',
    activeDoorsInIndex: 1420,
    totalTxAudited: '18,450,000',
    overallConfidenceScore: 98.4,

    // Historical Benchmark Versions
    versions: [
      {
        version: 'v2.4',
        name: 'Q4 2026 Benchmark Release',
        status: 'Active',
        effectiveFrom: '2026-10-01',
        effectiveTo: '2026-12-31',
        publishedBy: 'Sarah Chen (System Admin)',
        publishedAt: '2026-10-01T08:00:00Z',
        sampleDoors: 1420,
        txCount: '18.4M',
        confidenceScore: 98.4,
        releaseNotes: 'Recalibrated digital streaming codes (+20 bps peer median) and consolidated open-loop gift card tiers.'
      },
      {
        version: 'v2.3',
        name: 'Q3 2026 Benchmark Release',
        status: 'Archived',
        effectiveFrom: '2026-07-01',
        effectiveTo: '2026-09-30',
        publishedBy: 'Michael Torres (Exec Sponsor)',
        publishedAt: '2026-07-01T08:00:00Z',
        sampleDoors: 1280,
        txCount: '15.9M',
        confidenceScore: 97.2,
        releaseNotes: 'Introduced regional geography multipliers for West Coast and East Coast urban convenience retail.'
      },
      {
        version: 'v2.2',
        name: 'Q2 2026 Benchmark Release',
        status: 'Archived',
        effectiveFrom: '2026-04-01',
        effectiveTo: '2026-06-30',
        publishedBy: 'Sarah Chen (System Admin)',
        publishedAt: '2026-04-01T08:00:00Z',
        sampleDoors: 1150,
        txCount: '14.1M',
        confidenceScore: 96.5,
        releaseNotes: 'Added cross-border wire remittance interchange benchmarks.'
      },
      {
        version: 'v2.1',
        name: 'Q1 2026 Benchmark Release',
        status: 'Archived',
        effectiveFrom: '2026-01-01',
        effectiveTo: '2026-03-31',
        publishedBy: 'Sarah Chen (System Admin)',
        publishedAt: '2026-01-01T08:00:00Z',
        sampleDoors: 980,
        txCount: '12.0M',
        confidenceScore: 95.1,
        releaseNotes: 'Annual recalibration of gift card and debit interchange rates.'
      },
      {
        version: 'v1.9',
        name: '2025 Annual Master Baseline',
        status: 'Archived',
        effectiveFrom: '2025-01-01',
        effectiveTo: '2025-12-31',
        publishedBy: 'System Administrator',
        publishedAt: '2025-01-01T08:00:00Z',
        sampleDoors: 740,
        txCount: '8.5M',
        confidenceScore: 93.4,
        releaseNotes: 'Foundational benchmark baseline across multi-store retailers.'
      }
    ],

    // Geography Adjustments
    geographyAdjustments: [
      {
        id: 'GEO-001',
        region: 'National Baseline',
        code: 'US-NAT',
        multiplier: 1.00,
        basisPointsAdj: 0,
        sampleDoors: 1420,
        economicDriver: 'Standard nationwide retailer cohort median',
        status: 'Active'
      },
      {
        id: 'GEO-002',
        region: 'West Coast (Metro/Urban)',
        code: 'US-WEST',
        multiplier: 1.12,
        basisPointsAdj: +35,
        sampleDoors: 340,
        economicDriver: 'High store foot-traffic, higher ticket values, competitive distributor density',
        status: 'Active'
      },
      {
        id: 'GEO-003',
        region: 'East Coast (Mid-Atlantic/NE)',
        code: 'US-EAST',
        multiplier: 1.08,
        basisPointsAdj: +24,
        sampleDoors: 410,
        economicDriver: 'Dense urban convenience footprint, higher card transaction velocity',
        status: 'Active'
      },
      {
        id: 'GEO-004',
        region: 'Midwest (Regional Hubs)',
        code: 'US-MW',
        multiplier: 0.95,
        basisPointsAdj: -15,
        sampleDoors: 290,
        economicDriver: 'Moderate volume tiers, lower distributor competition',
        status: 'Active'
      },
      {
        id: 'GEO-005',
        region: 'South (Suburban / Sunbelt)',
        code: 'US-SOUTH',
        multiplier: 0.97,
        basisPointsAdj: -10,
        sampleDoors: 380,
        economicDriver: 'High cash-to-card reload adoption, expanding multi-door footprints',
        status: 'Active'
      }
    ],

    // Master Market Rates Catalog
    rates: [
      {
        id: 'MR-001',
        serviceName: 'Netflix Card & Streaming',
        category: 'Prepaid Products',
        marketLow: 2.10,
        marketMedian: 2.50,
        marketHigh: 2.85,
        bestInClass: 3.10,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 99.2,
        sampleDoors: 1120,
        status: 'Active',
        version: 'v2.4',
        stability: 'High',
        quarterlyDelta: '+0.20%'
      },
      {
        id: 'MR-002',
        serviceName: 'Visa Open-Loop Gift Cards',
        category: 'Gift Cards',
        marketLow: 3.10,
        marketMedian: 3.55,
        marketHigh: 4.10,
        bestInClass: 4.35,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 98.8,
        sampleDoors: 1380,
        status: 'Active',
        version: 'v2.4',
        stability: 'Very High',
        quarterlyDelta: '+0.15%'
      },
      {
        id: 'MR-003',
        serviceName: 'Mastercard Gift Cards',
        category: 'Gift Cards',
        marketLow: 2.95,
        marketMedian: 3.40,
        marketHigh: 3.90,
        bestInClass: 4.15,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 98.1,
        sampleDoors: 1250,
        status: 'Active',
        version: 'v2.4',
        stability: 'High',
        quarterlyDelta: '+0.10%'
      },
      {
        id: 'MR-004',
        serviceName: 'Store Brand Retail Gift Cards',
        category: 'Gift Cards',
        marketLow: 2.80,
        marketMedian: 3.40,
        marketHigh: 4.10,
        bestInClass: 4.40,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 97.4,
        sampleDoors: 980,
        status: 'Active',
        version: 'v2.4',
        stability: 'Moderate',
        quarterlyDelta: '+0.25%'
      },
      {
        id: 'MR-005',
        serviceName: 'Money Transfer (International Wire)',
        category: 'Money Transfer',
        marketLow: 1.95,
        marketMedian: 2.30,
        marketHigh: 2.65,
        bestInClass: 2.85,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 98.5,
        sampleDoors: 1040,
        status: 'Active',
        version: 'v2.4',
        stability: 'High',
        quarterlyDelta: '+0.10%'
      },
      {
        id: 'MR-006',
        serviceName: 'Domestic Wire Transfer',
        category: 'Money Transfer',
        marketLow: 1.85,
        marketMedian: 2.05,
        marketHigh: 2.45,
        bestInClass: 2.60,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 97.9,
        sampleDoors: 920,
        status: 'Active',
        version: 'v2.4',
        stability: 'Very High',
        quarterlyDelta: '0.00%'
      },
      {
        id: 'MR-007',
        serviceName: 'Bill Payment Services',
        category: 'Financial Services',
        marketLow: 2.05,
        marketMedian: 2.35,
        marketHigh: 2.70,
        bestInClass: 2.90,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 98.2,
        sampleDoors: 1190,
        status: 'Active',
        version: 'v2.4',
        stability: 'High',
        quarterlyDelta: '+0.05%'
      },
      {
        id: 'MR-008',
        serviceName: 'Prepaid Debit Program',
        category: 'Debit Services',
        marketLow: 1.35,
        marketMedian: 1.65,
        marketHigh: 2.05,
        bestInClass: 2.25,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 96.8,
        sampleDoors: 860,
        status: 'Active',
        version: 'v2.4',
        stability: 'Moderate',
        quarterlyDelta: '+0.15%'
      },
      {
        id: 'MR-009',
        serviceName: 'Payroll Debit Card Program',
        category: 'Debit Services',
        marketLow: 1.40,
        marketMedian: 1.65,
        marketHigh: 2.00,
        bestInClass: 2.15,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 96.1,
        sampleDoors: 780,
        status: 'Active',
        version: 'v2.4',
        stability: 'High',
        quarterlyDelta: '+0.05%'
      },
      {
        id: 'MR-010',
        serviceName: 'Mobile Airtime Top-Up',
        category: 'Prepaid Products',
        marketLow: 3.50,
        marketMedian: 4.15,
        marketHigh: 4.75,
        bestInClass: 5.10,
        effectiveFrom: '2026-10-01',
        effectiveTo: '2027-09-30',
        confidenceScore: 97.5,
        sampleDoors: 950,
        status: 'Active',
        version: 'v2.4',
        stability: 'Moderate',
        quarterlyDelta: '+0.10%'
      }
    ]
  };

  // ── AI Contract Intelligence Configuration & Presets ────────
  const contractIntelligenceConfig = {
    noticeWarningHorizonDays: 90,
    criticalNoticeHorizonDays: 30,
    autoRenewAlertEnabled: true,
    minExtractionConfidence: 90,
    requireLegalReviewForNotice: true,
    enableOCRPreProcessing: true,
    defaultNoticeLetterTemplate: 'Formal Notice of Non-Renewal and Commercial Contract Renegotiation'
  };

  const sampleContractPresets = [
    {
      id: 'PRESET-001',
      title: 'Incomm Payments — National Gift Card Mall Agreement (New Ingestion)',
      vendorName: 'Incomm Payments Inc.',
      category: 'Gift Cards',
      fileName: 'Incomm_National_Agreement_Executed_2026.pdf',
      fileSize: '3.1 MB',
      sampleText: 'MASTER DISTRIBUTION AGREEMENT entered into between Retailer and Incomm Payments Inc. Section 4: Commission Rate. Vendor shall remit to Retailer a commission of 4.25% of gross face value on all open-loop prepaid gift cards. Section 7: Term & Renewal. This Agreement shall run for an initial term of twenty-four (24) months and automatically renew for successive twelve (12) month periods unless either party provides ninety (90) days advance written notice of non-renewal. Section 11: Subsidies & Funding. Vendor shall allocate $15,000 annually for POS display fixtures and $12,000 for marketing co-op. Section 14: Non-Exclusivity. Retailer retains the right to display alternative products on secondary fixtures.',
      extractedPreview: {
        vendor: 'Incomm Payments Inc.',
        category: 'Gift Cards',
        rate: 4.25,
        rateDisplay: '4.25% of GMV',
        benchmarkRate: 4.10,
        varianceBps: +15,
        annualOpportunity: '+125 bps vs current GiftFlow (+43,750/yr)',
        renewalDate: '2028-11-18',
        noticePeriodDays: 90,
        renewalType: 'Auto-renew',
        exclusivity: 'Non-Exclusive (Free to dual-source)',
        riskLevel: 'Low',
        minimumGuarantee: '$0 (No floor guarantee)',
        subsidies: '$15,000 display fixture + $12,000 marketing co-op',
        confidence: 99.4,
        proactiveAlerts: [
          'High commission yield: 4.25% exceeds current GiftFlow (3.00%) by 125 bps.',
          'Non-exclusive structure enables competitive dual-sourcing.',
          'Recommend inserting $10,000/month contractual minimum floor guarantee prior to final signature.'
        ]
      }
    },
    {
      id: 'PRESET-002',
      title: 'MoneyGram International — Global Wire & Digital Remittance Contract',
      vendorName: 'MoneyGram International',
      category: 'Money Transfer',
      fileName: 'MoneyGram_Master_Services_2026.pdf',
      fileSize: '4.4 MB',
      sampleText: 'REMITTANCE SERVICES AGREEMENT. Section 5: Compensation. Vendor agrees to remit 2.20% of transfer principal plus $0.65 per completed money transfer transaction. Section 6: Minimum Guaranteed Floor. Vendor guarantees an absolute baseline monthly commission payment of $15,000, payable regardless of transaction volume troughs. Section 9: Term. Fixed three (3) year term expiring December 31, 2029 with sixty (60) days non-renewal notice requirement. Section 15: Exclusivity. Non-exclusive across all operating retail doors.',
      extractedPreview: {
        vendor: 'MoneyGram International',
        category: 'Money Transfer',
        rate: 2.20,
        rateDisplay: '2.20% + $0.65 / trans',
        benchmarkRate: 2.10,
        varianceBps: +10,
        annualOpportunity: '+70 bps vs SwiftTransfer (+39,340/yr)',
        renewalDate: '2029-12-31',
        noticePeriodDays: 60,
        renewalType: 'Fixed Term',
        exclusivity: 'Non-Exclusive',
        riskLevel: 'Low',
        minimumGuarantee: '$15,000 / month ($180,000/yr floor protection)',
        subsidies: '$35,000 fraud indemnity pool',
        confidence: 98.7,
        proactiveAlerts: [
          'Includes $15,000/month minimum floor guarantee (resolves current SwiftTransfer $0 floor risk).',
          'Commission structure (2.20% + $0.65) yields +$39,340/yr vs existing agreement.',
          'Clean non-exclusive clause allows parallel remittance pilots.'
        ]
      }
    },
    {
      id: 'PRESET-003',
      title: 'Blackhawk Network — Digital Streaming & Omnichannel Prepaid Agreement',
      vendorName: 'Blackhawk Network Inc.',
      category: 'Prepaid & Streaming',
      fileName: 'Blackhawk_Omnichannel_Prepaid_2026.pdf',
      fileSize: '2.8 MB',
      sampleText: 'OMNICHANNEL DISTRIBUTION MASTER AGREEMENT. Section 3: Digital Streaming Commissions. Digital subscription gift cards (including Netflix, Spotify, PlayStation) shall yield 2.85% net distribution margin. Section 8: Exclusivity. Exclusive on primary endcap towers for digital gaming; non-exclusive on standard gift card racks. Section 10: Renewal & Notice. Auto-renews annually unless one hundred twenty (120) days prior written notice is delivered.',
      extractedPreview: {
        vendor: 'Blackhawk Network Inc.',
        category: 'Prepaid & Streaming',
        rate: 2.85,
        rateDisplay: '2.85% on digital streaming & gaming',
        benchmarkRate: 2.50,
        varianceBps: +35,
        annualOpportunity: '+130 bps on Netflix codes (+44,200/yr)',
        renewalDate: '2028-06-30',
        noticePeriodDays: 120,
        renewalType: 'Auto-renew',
        exclusivity: 'Partial Exclusivity (Endcap Towers Only)',
        riskLevel: 'Medium',
        minimumGuarantee: '$7,500 / month',
        subsidies: '$22,000 / yr Co-Op Marketing Fund',
        confidence: 97.9,
        proactiveAlerts: [
          'Fixes Netflix rate deficit: 2.85% vs current 1.55% (+130 bps, +$44,200/yr EBITDA expansion).',
          'Notice period requires 120 days advance notice (longer than standard 60-day window).',
          'Endcap tower exclusivity requires waiver if dual-branding with Incomm.'
        ]
      }
    }
  ];

  // ── AI Opportunity Ranking Engine Repository ───────────────
  const opportunityRankingRepo = {
    weights: {
      revenueImpact: 40,
      contractTiming: 25,
      vendorRisk: 20,
      negotiationComplexity: 15,
      minOpportunityThreshold: 5000
    },
    products: [
      {
        id: 'OPP-001',
        name: 'Netflix',
        productFullName: 'Netflix Digital Subscription Codes & e-Gift',
        category: 'Prepaid & Streaming',
        vendor: 'PrepaidPlus Corp',
        contractId: 'CON003',
        opportunity: 42000,
        currentRate: 1.55,
        marketRate: 2.50,
        varianceBps: -95,
        annualVolume: 3400000,
        currentRevenue: 52700,
        marketRevenue: 94700,
        revenueImpactScore: 96,
        contractTimingScore: 98,
        vendorRiskScore: 94,
        negotiationComplexityScore: 95,
        ppsScore: 96.0,
        priorityRank: 1,
        urgencyTier: 'P1 — Immediate Priority',
        easeLevel: 'High Ease / Quick Win',
        timingStatus: '44 Days to Notice Cutoff',
        whyNegotiateFirst: 'Highest immediate EBITDA expansion ($42,000). Notice window opens in 44 days (Jan 1, 2027 cutoff). Zero exclusivity restrictions permit an instant multi-vendor RFP across Incomm, Blackhawk, and Euronet.',
        playbook: 'Digital Aggregator Competitive RFP / 2.50% Parity Addendum',
        actionLabel: 'Launch Digital Streaming RFP',
        actionType: 'sourcing_rfp',
        status: 'Ready to Negotiate'
      },
      {
        id: 'OPP-002',
        name: 'Apple',
        productFullName: 'Apple App Store & iTunes Gift Cards',
        category: 'Gift Cards',
        vendor: 'GiftFlow Inc.',
        contractId: 'CON001',
        opportunity: 31000,
        currentRate: 3.20,
        marketRate: 4.10,
        varianceBps: -90,
        annualVolume: 3450000,
        currentRevenue: 110400,
        marketRevenue: 141400,
        revenueImpactScore: 89,
        contractTimingScore: 95,
        vendorRiskScore: 88,
        negotiationComplexityScore: 91,
        ppsScore: 90.5,
        priorityRank: 2,
        urgencyTier: 'P1 — Immediate Priority',
        easeLevel: 'High Ease / Quick Win',
        timingStatus: 'Notice Window Active',
        whyNegotiateFirst: '$31,000 annual margin expansion. Massive Q4 retail holiday card demand creates unmatched volume leverage to demand immediate distributor tier re-alignment to 4.10%.',
        playbook: 'Q4 Peak Volume Tier Addendum (+90 bps)',
        actionLabel: 'Draft Tier Upgrade Addendum',
        actionType: 'rate_addendum',
        status: 'Ready to Negotiate'
      },
      {
        id: 'OPP-003',
        name: 'Visa Gift',
        productFullName: 'Visa Open-Loop Variable & Fixed Prepaid Cards',
        category: 'Gift Cards',
        vendor: 'GiftFlow Inc.',
        contractId: 'CON001',
        opportunity: 28000,
        currentRate: 3.00,
        marketRate: 3.80,
        varianceBps: -80,
        annualVolume: 3500000,
        currentRevenue: 105000,
        marketRevenue: 133000,
        revenueImpactScore: 84,
        contractTimingScore: 96,
        vendorRiskScore: 82,
        negotiationComplexityScore: 86,
        ppsScore: 86.9,
        priorityRank: 3,
        urgencyTier: 'P1 — Immediate Priority',
        easeLevel: 'Medium / Requires Notice',
        timingStatus: '60d Notice Deadline Due',
        whyNegotiateFirst: '$28,000 recurring bottom-line gain on $3.5M GMV. Serving certified notice of non-renewal breaks vendor exclusivity and triggers 3 competing distributor bids.',
        playbook: 'Certified Non-Renewal Notice & Reverse Auction',
        actionLabel: 'Serve Notice & Launch Auction',
        actionType: 'serve_notice_rfp',
        status: 'Ready to Negotiate'
      },
      {
        id: 'OPP-004',
        name: 'MoneyGram Wire Transfer',
        productFullName: 'Domestic & International Over-the-Counter Remittance',
        category: 'Money Transfer',
        vendor: 'SwiftTransfer Global',
        contractId: 'CON002',
        opportunity: 24500,
        currentRate: 1.50,
        marketRate: 2.10,
        varianceBps: -60,
        annualVolume: 4100000,
        currentRevenue: 61500,
        marketRevenue: 86000,
        revenueImpactScore: 81,
        contractTimingScore: 97,
        vendorRiskScore: 78,
        negotiationComplexityScore: 80,
        ppsScore: 84.3,
        priorityRank: 4,
        urgencyTier: 'P2 — High Priority',
        easeLevel: 'Moderate / Hardware Integration',
        timingStatus: 'Expires in 43 Days',
        whyNegotiateFirst: '$24,500 recurring profit + critical risk mitigation. Contract expires Dec 31 with zero floor protection. Opportunity to negotiate a $12,500/month contractual minimum floor guarantee.',
        playbook: 'Competitive RFP with $12,500/mo Floor Guarantee Clause',
        actionLabel: 'Launch Remittance RFP',
        actionType: 'sourcing_rfp',
        status: 'In Sourcing Review'
      },
      {
        id: 'OPP-005',
        name: 'PlayStation Network (PSN)',
        productFullName: 'Sony PlayStation Store Digital & Physical Cards',
        category: 'Prepaid & Streaming',
        vendor: 'PrepaidPlus Corp',
        contractId: 'CON003',
        opportunity: 19800,
        currentRate: 3.50,
        marketRate: 4.40,
        varianceBps: -90,
        annualVolume: 2200000,
        currentRevenue: 77000,
        marketRevenue: 96800,
        revenueImpactScore: 78,
        contractTimingScore: 86,
        vendorRiskScore: 84,
        negotiationComplexityScore: 88,
        ppsScore: 82.7,
        priorityRank: 5,
        urgencyTier: 'P2 — High Priority',
        easeLevel: 'High Ease / Digital SKU',
        timingStatus: '74 Days to Window',
        whyNegotiateFirst: '$19,800 opportunity in surging digital gaming category. Highly portable product line with no terminal hardware dependencies.',
        playbook: 'Gaming Category Bundle Renegotiation',
        actionLabel: 'Bundle in Digital RFP',
        actionType: 'sourcing_rfp',
        status: 'Open Opportunity'
      },
      {
        id: 'OPP-006',
        name: 'Green Dot Reloadable Debit',
        productFullName: 'General Purpose Reloadable (GPR) Cash Load Network',
        category: 'Debit Services',
        vendor: 'DebitDirect Financial',
        contractId: 'CON004',
        opportunity: 18200,
        currentRate: 1.25,
        marketRate: 1.65,
        varianceBps: -40,
        annualVolume: 4210000,
        currentRevenue: 52625,
        marketRevenue: 69465,
        revenueImpactScore: 76,
        contractTimingScore: 80,
        vendorRiskScore: 82,
        negotiationComplexityScore: 78,
        ppsScore: 78.5,
        priorityRank: 6,
        urgencyTier: 'P2 — High Priority',
        easeLevel: 'Moderate / POS Prompt Routing',
        timingStatus: 'Safe (95 Days)',
        whyNegotiateFirst: '$18,200 annual interchange deficit. Volume ($4.21M) has crossed contractual Tier 2 hurdle but vendor has failed to apply the +20 bps rate bump.',
        playbook: 'Contractual Volume Audit & Rate Escalation Claim',
        actionLabel: 'Audit & Upgrade Tier',
        actionType: 'rate_addendum',
        status: 'Audit Flagged'
      },
      {
        id: 'OPP-007',
        name: 'Store Brand Retail Gift Cards',
        productFullName: 'Closed-Loop Retailer Branded Merchant Cards',
        category: 'Gift Cards',
        vendor: 'CardVault Solutions',
        contractId: 'CON007',
        opportunity: 24000,
        currentRate: 3.00,
        marketRate: 4.10,
        varianceBps: -110,
        annualVolume: 2180000,
        currentRevenue: 65400,
        marketRevenue: 89400,
        revenueImpactScore: 82,
        contractTimingScore: 72,
        vendorRiskScore: 74,
        negotiationComplexityScore: 75,
        ppsScore: 76.8,
        priorityRank: 7,
        urgencyTier: 'P2 — High Priority',
        easeLevel: 'Moderate Ease',
        timingStatus: 'Notice Due Jan 14',
        whyNegotiateFirst: 'Severe 110 bps rate gap vs peer chains. Straightforward rate addendum without hardware disruption.',
        playbook: 'Direct Issuer 4.10% Rate Addendum',
        actionLabel: 'Dispatch Rate Addendum',
        actionType: 'rate_addendum',
        status: 'Open Opportunity'
      },
      {
        id: 'OPP-008',
        name: 'Mastercard Gift Cards',
        productFullName: 'Mastercard Open-Loop Prepaid Malls',
        category: 'Gift Cards',
        vendor: 'GiftFlow Inc.',
        contractId: 'CON001',
        opportunity: 16000,
        currentRate: 2.95,
        marketRate: 3.40,
        varianceBps: -45,
        annualVolume: 3200000,
        currentRevenue: 94400,
        marketRevenue: 108800,
        revenueImpactScore: 72,
        contractTimingScore: 82,
        vendorRiskScore: 76,
        negotiationComplexityScore: 70,
        ppsScore: 75.0,
        priorityRank: 8,
        urgencyTier: 'P2 — High Priority',
        easeLevel: 'Medium / Shared Fixture',
        timingStatus: 'Coupled to CON001',
        whyNegotiateFirst: '$16,000 margin lift. Naturally bundles into the Visa Gift reverse auction package for maximum leverage.',
        playbook: 'Dual-Brand Master Card Reverse Auction',
        actionLabel: 'Include in Gift Card RFP',
        actionType: 'sourcing_rfp',
        status: 'Open Opportunity'
      },
      {
        id: 'OPP-009',
        name: 'Utility Bill Payment Processing',
        productFullName: 'Electric, Gas, Water & Telecom Walk-In Bill Pay',
        category: 'Financial Services',
        vendor: 'FinServ Commission Co.',
        contractId: 'CON005',
        opportunity: 15400,
        currentRate: 2.10,
        marketRate: 2.35,
        varianceBps: -25,
        annualVolume: 6150000,
        currentRevenue: 129150,
        marketRevenue: 144550,
        revenueImpactScore: 71,
        contractTimingScore: 68,
        vendorRiskScore: 75,
        negotiationComplexityScore: 74,
        ppsScore: 71.5,
        priorityRank: 9,
        urgencyTier: 'P3 — Moderate Priority',
        easeLevel: 'Complex / Regional Biller Feeds',
        timingStatus: 'Safe (134 Days)',
        whyNegotiateFirst: '$15,400 rate optimization coupled with $60,000 in uncollected integration rebates.',
        playbook: 'Interchange Rebate Parity & Milestone Settlement',
        actionLabel: 'Review Biller Terms',
        actionType: 'rate_addendum',
        status: 'Open Opportunity'
      },
      {
        id: 'OPP-010',
        name: 'Amazon Digital Codes',
        productFullName: 'Amazon E-Commerce Balance Codes & Cards',
        category: 'Prepaid & Streaming',
        vendor: 'PrepaidPlus Corp',
        contractId: 'CON003',
        opportunity: 14100,
        currentRate: 3.10,
        marketRate: 3.65,
        varianceBps: -55,
        annualVolume: 2560000,
        currentRevenue: 79360,
        marketRevenue: 93460,
        revenueImpactScore: 70,
        contractTimingScore: 70,
        vendorRiskScore: 72,
        negotiationComplexityScore: 68,
        ppsScore: 69.9,
        priorityRank: 10,
        urgencyTier: 'P3 — Moderate Priority',
        easeLevel: 'High Ease',
        timingStatus: 'Safe',
        whyNegotiateFirst: '$14,100 lift on top-selling retail digital SKU. Can be re-contracted alongside Netflix.',
        playbook: 'Digital Aggregator Multi-SKU Rate Rider',
        actionLabel: 'Attach to Digital RFP',
        actionType: 'sourcing_rfp',
        status: 'Open Opportunity'
      },
      {
        id: 'OPP-011',
        name: 'Xbox Live & Game Pass',
        productFullName: 'Microsoft Xbox Subscription & Currency Codes',
        category: 'Prepaid & Streaming',
        vendor: 'PrepaidPlus Corp',
        contractId: 'CON003',
        opportunity: 12500,
        currentRate: 3.60,
        marketRate: 4.25,
        varianceBps: -65,
        annualVolume: 1920000,
        currentRevenue: 69120,
        marketRevenue: 81600,
        revenueImpactScore: 68,
        contractTimingScore: 66,
        vendorRiskScore: 70,
        negotiationComplexityScore: 65,
        ppsScore: 67.4,
        priorityRank: 11,
        urgencyTier: 'P3 — Moderate Priority',
        easeLevel: 'High Ease',
        timingStatus: 'Safe',
        whyNegotiateFirst: '$12,500 margin improvement. Pairs with PlayStation Network gaming category pilot.',
        playbook: 'Gaming Digital Addendum',
        actionLabel: 'View Details',
        actionType: 'rate_addendum',
        status: 'Open Opportunity'
      },
      {
        id: 'OPP-012',
        name: 'Mobile Airtime Top-Up',
        productFullName: 'Domestic & International Wireless Airtime Refills',
        category: 'Prepaid & Streaming',
        vendor: 'PrepaidPlus Corp',
        contractId: 'CON003',
        opportunity: 9500,
        currentRate: 3.80,
        marketRate: 4.15,
        varianceBps: -35,
        annualVolume: 2710000,
        currentRevenue: 102980,
        marketRevenue: 112480,
        revenueImpactScore: 64,
        contractTimingScore: 62,
        vendorRiskScore: 68,
        negotiationComplexityScore: 60,
        ppsScore: 63.7,
        priorityRank: 12,
        urgencyTier: 'P3 — Moderate Priority',
        easeLevel: 'Moderate Ease',
        timingStatus: 'Safe',
        whyNegotiateFirst: '$9,500 lift on declining cash airtime volume. Modest ROI compared to streaming and gift cards.',
        playbook: 'Secondary Carrier Schedule Re-Alignment',
        actionLabel: 'View Details',
        actionType: 'rate_addendum',
        status: 'Deprioritized'
      },
      {
        id: 'OPP-013',
        name: 'In-Store ATM Processing Surcharge',
        productFullName: 'ATM Terminal Cash Dispensing & Interchange Fee Split',
        category: 'Debit Services',
        vendor: 'SecurePay Networks',
        contractId: 'CON008',
        opportunity: 7800,
        currentRate: 1.40,
        marketRate: 1.65,
        varianceBps: -25,
        annualVolume: 3120000,
        currentRevenue: 43680,
        marketRevenue: 51480,
        revenueImpactScore: 58,
        contractTimingScore: 60,
        vendorRiskScore: 62,
        negotiationComplexityScore: 50,
        ppsScore: 58.1,
        priorityRank: 13,
        urgencyTier: 'P3 — Moderate Priority',
        easeLevel: 'Complex / Hardware Lock-In',
        timingStatus: 'Safe',
        whyNegotiateFirst: '$7,800 opportunity. High ATM hardware switching friction makes this low ROI until full contract renewal.',
        playbook: 'Defer to 2027 Contract Renewal Window',
        actionLabel: 'View Details',
        actionType: 'rate_addendum',
        status: 'Deprioritized'
      }
    ],
    calculatePPS: function(p, weights) {
      const wRev = (weights.revenueImpact || 40) / 100;
      const wTime = (weights.contractTiming || 25) / 100;
      const wRisk = (weights.vendorRisk || 20) / 100;
      const wComp = (weights.negotiationComplexity || 15) / 100;
      return Number(((p.revenueImpactScore * wRev) + (p.contractTimingScore * wTime) + (p.vendorRiskScore * wRisk) + (p.negotiationComplexityScore * wComp)).toFixed(1));
    }
  };

  // ── Monthly Commission Reconciliation Ledger (Expected vs Actual) ───
  const monthlyCommissionReconciliation = [
    {
      id: 'REC-2026-10-001',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      category: 'Money Transfer',
      productName: 'International Wire Remittance',
      monthlyVolume: 485000,
      contractedRate: 1.80,
      contractedBaseCommission: 8730,
      contractedSubsidies: 1500, // IT integration subsidy
      expectedCommission: 10230,
      actualRemittedRate: 1.45,
      actualBaseCommission: 7032.50,
      actualSubsidiesReceived: 1000,
      actualCommission: 8032.50,
      varianceAmount: -2197.50,
      varianceBps: -35,
      paymentDate: '2026-11-10',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 15',
      reconciliationStatus: 'Shortfall Confirmed',
      leakageRootCause: 'Applied legacy non-tiered 1.45% base rate & deducted $500 IT subsidy arbitrarily',
      actionRequired: 'Issue formal demand letter & invoke dispute penalty',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-STG-202610-8841'
    },
    {
      id: 'REC-2026-10-002',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      category: 'Gift Cards',
      productName: 'Visa / MC Open-Loop Gift Cards',
      monthlyVolume: 210000,
      contractedRate: 3.50,
      contractedBaseCommission: 7350,
      contractedSubsidies: 1500, // Promotional Marketing Co-Op
      expectedCommission: 8850,
      actualRemittedRate: 3.00,
      actualBaseCommission: 6300,
      actualSubsidiesReceived: 0,
      actualCommission: 6300,
      varianceAmount: -2550.00,
      varianceBps: -50,
      paymentDate: '2026-11-02',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 30',
      reconciliationStatus: 'Escalated to Recovery',
      leakageRootCause: 'Omitted contractual $1,500 Marketing Co-Op subsidy & paid un-benchmarked 3.00% rate',
      actionRequired: 'Recovery case RC002 compiled for $34,000 YTD leakage',
      escalatedToRecovery: true,
      recoveryCaseId: 'RC002',
      remittanceRef: 'REM-GFT-202610-1092'
    },
    {
      id: 'REC-2026-10-003',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V006',
      vendorName: 'ReloadNow Services',
      category: 'Prepaid Products',
      productName: 'Prepaid Wireless Airtime',
      monthlyVolume: 78000,
      contractedRate: 3.80,
      contractedBaseCommission: 2964,
      contractedSubsidies: 400,
      expectedCommission: 3364,
      actualRemittedRate: 3.20,
      actualBaseCommission: 2496,
      actualSubsidiesReceived: 400,
      actualCommission: 2896,
      varianceAmount: -468.00,
      varianceBps: -60,
      paymentDate: '2026-11-08',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 45',
      reconciliationStatus: 'Shortfall Confirmed',
      leakageRootCause: 'Rate Discrepancy: Clearinghouse mapped retailer door tier to 3.20% instead of 3.80%',
      actionRequired: 'Submit automated rate correction ticket',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-RNW-202610-0043'
    },
    {
      id: 'REC-2026-10-004',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V010',
      vendorName: 'ValueCard Partners',
      category: 'Gift Cards',
      productName: 'Closed-Loop Retail Cards',
      monthlyVolume: 62000,
      contractedRate: 3.00,
      contractedBaseCommission: 1860,
      contractedSubsidies: 0,
      expectedCommission: 1860,
      actualRemittedRate: 2.40,
      actualBaseCommission: 1488,
      actualSubsidiesReceived: 0,
      actualCommission: 1488,
      varianceAmount: -372.00,
      varianceBps: -60,
      paymentDate: '2026-11-12',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 60',
      reconciliationStatus: 'Dispute In Progress',
      leakageRootCause: 'Chronic rate underreporting: calculated at legacy 2.40% rate with no explanation',
      actionRequired: 'Audit demand served; contract under termination review',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-VCP-202610-7711'
    },
    {
      id: 'REC-2026-10-005',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V009',
      vendorName: 'FinServ Commission Co.',
      category: 'Financial Services',
      productName: 'Bill Payment Processing',
      monthlyVolume: 520000,
      contractedRate: 2.50,
      contractedBaseCommission: 13000,
      contractedSubsidies: 0,
      expectedCommission: 13000,
      actualRemittedRate: 2.30,
      actualBaseCommission: 11960,
      actualSubsidiesReceived: 0,
      actualCommission: 11960,
      varianceAmount: -1040.00,
      varianceBps: -20,
      paymentDate: '2026-11-05',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 30',
      reconciliationStatus: 'Under Review',
      leakageRootCause: 'Tier 3 bill pay volume threshold incorrectly adjusted for utility sub-codes',
      actionRequired: 'Re-batching statement with vendor clearinghouse',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-FSC-202610-3301'
    },
    {
      id: 'REC-2026-10-006',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V005',
      vendorName: 'PrepaidPlus Corp',
      category: 'Prepaid Products',
      productName: 'Streaming Subscriptions (Netflix / Spotify)',
      monthlyVolume: 165000,
      contractedRate: 4.20,
      contractedBaseCommission: 6930,
      contractedSubsidies: 800,
      expectedCommission: 7730,
      actualRemittedRate: 4.20,
      actualBaseCommission: 6930,
      actualSubsidiesReceived: 800,
      actualCommission: 7730,
      varianceAmount: 0.00,
      varianceBps: 0,
      paymentDate: '2026-11-01',
      paymentStatus: 'Paid in Full',
      settlementCycle: 'Net 30',
      reconciliationStatus: 'Reconciled / Match',
      leakageRootCause: 'None - 100% Full Contract Compliance',
      actionRequired: 'None',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-PPC-202610-5544'
    },
    {
      id: 'REC-2026-10-007',
      month: '2026-10',
      monthLabel: 'October 2026',
      vendorId: 'V008',
      vendorName: 'SecurePay Networks',
      category: 'Debit Services',
      productName: 'Debit Card Reloads',
      monthlyVolume: 320000,
      contractedRate: 1.60,
      contractedBaseCommission: 5120,
      contractedSubsidies: 500,
      expectedCommission: 5620,
      actualRemittedRate: 1.60,
      actualBaseCommission: 5120,
      actualSubsidiesReceived: 500,
      actualCommission: 5620,
      varianceAmount: 0.00,
      varianceBps: 0,
      paymentDate: '2026-10-28',
      paymentStatus: 'Paid in Full',
      settlementCycle: 'Net 30',
      reconciliationStatus: 'Reconciled / Match',
      leakageRootCause: 'None - 100% Full Contract Compliance',
      actionRequired: 'None',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-SPN-202610-9011'
    },
    {
      id: 'REC-2026-09-001',
      month: '2026-09',
      monthLabel: 'September 2026',
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      category: 'Money Transfer',
      productName: 'International Wire Remittance',
      monthlyVolume: 492000,
      contractedRate: 1.80,
      contractedBaseCommission: 8856,
      contractedSubsidies: 1500,
      expectedCommission: 10356,
      actualRemittedRate: 1.45,
      actualBaseCommission: 7134,
      actualSubsidiesReceived: 1000,
      actualCommission: 8134,
      varianceAmount: -2222.00,
      varianceBps: -35,
      paymentDate: '2026-10-14',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 15',
      reconciliationStatus: 'Escalated to Recovery',
      leakageRootCause: 'Applied 1.45% base rate instead of contracted 1.80% & missed subsidy',
      actionRequired: 'Bundled into active legal dispute RC001',
      escalatedToRecovery: true,
      recoveryCaseId: 'RC001',
      remittanceRef: 'REM-STG-202609-7719'
    },
    {
      id: 'REC-2026-09-002',
      month: '2026-09',
      monthLabel: 'September 2026',
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      category: 'Gift Cards',
      productName: 'Visa / MC Open-Loop Gift Cards',
      monthlyVolume: 205000,
      contractedRate: 3.50,
      contractedBaseCommission: 7175,
      contractedSubsidies: 1500,
      expectedCommission: 8675,
      actualRemittedRate: 3.00,
      actualBaseCommission: 6150,
      actualSubsidiesReceived: 0,
      actualCommission: 6150,
      varianceAmount: -2525.00,
      varianceBps: -50,
      paymentDate: '2026-10-04',
      paymentStatus: 'Received (Shortfall)',
      settlementCycle: 'Net 30',
      reconciliationStatus: 'Escalated to Recovery',
      leakageRootCause: 'Unpaid Marketing Co-Op ($1,500) and rate discrepancy',
      actionRequired: 'Bundled into recovery case RC002',
      escalatedToRecovery: true,
      recoveryCaseId: 'RC002',
      remittanceRef: 'REM-GFT-202609-0944'
    },
    {
      id: 'REC-2026-09-003',
      month: '2026-09',
      monthLabel: 'September 2026',
      vendorId: 'V004',
      vendorName: 'MoneyLink Express',
      category: 'Money Transfer',
      productName: 'Domestic Money Orders',
      monthlyVolume: 290000,
      contractedRate: 2.10,
      contractedBaseCommission: 6090,
      contractedSubsidies: 600,
      expectedCommission: 6690,
      actualRemittedRate: 2.10,
      actualBaseCommission: 6090,
      actualSubsidiesReceived: 600,
      actualCommission: 6690,
      varianceAmount: 0.00,
      varianceBps: 0,
      paymentDate: '2026-10-01',
      paymentStatus: 'Paid in Full',
      settlementCycle: 'Net 30',
      reconciliationStatus: 'Reconciled / Match',
      leakageRootCause: 'None - Full Reconciliation',
      actionRequired: 'None',
      escalatedToRecovery: false,
      recoveryCaseId: null,
      remittanceRef: 'REM-MLK-202609-2210'
    }
  ];

  // ── Vendor Portal Configuration ────────────────────────────
  const vendorPortalConfig = {
    allowVendorSelfRegistration: true,
    requireCOIExpiryAlerts: true,
    coiAlertDaysBeforeExpiry: 30,
    autoActivateAccreditedVendors: false,
    rfpOfferAcceptanceGraceHours: 48,
    minimumScorecardThresholdForBidding: 70,
    allowedDocumentTypes: ['Tax Form', 'Insurance', 'Security Audit', 'Banking', 'Contract', 'Regulatory License'],
    activeBiddingEvents: [
      { id: 'SE001', name: 'Q4 Gift Card Processing Master Reverse Auction', category: 'Gift Cards', reserveRate: '4.25%', countdownRemaining: '1h 42m', invitedVendors: 6, acceptedVendors: 5 }
    ]
  };

  // ── Compliance Monitoring Configuration ─────────────────────
  const complianceConfig = {
    varianceAlertThresholdDollars: 250,
    varianceAlertThresholdBps: 10,
    autoEscalateGraceDays: 14,
    requireRemittanceAdvicePdf: true,
    notifyFinanceAnalystOnShortfall: true,
    notifyCategoryManagerOnDispute: true,
    toleranceLevel: 'Strict (0 Tolerance for Unexplained Shortfalls)',
    reconciliationSchedule: 'Monthly on the 5th business day'
  };

  // ── Predictive Compliance & Leakage Forensics Models (Spec) ────────
  const predictiveLeakageModels = [
    {
      id: 'PRED-001',
      period: '2026-11',
      periodLabel: 'November 2026 (Black Friday / Cyber Week)',
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      category: 'Gift Cards',
      baselineVolume: 210000,
      forecastedVolume: 380000,
      footTrafficMultiplier: 1.81,
      contractedRate: 3.50,
      predictedRemittedRate: 3.00,
      predictedLeakageAmount: 6840.00,
      leakageProbability: 92,
      riskTier: 'Critical Risk',
      primaryRiskDriver: 'Holiday Gift Card Velocity Surge: Volume will exceed base tier threshold ($250k) by 52%, but clearinghouse historical patterns indicate failure to apply accelerated 3.80% holiday tier, causing severe rate suppression.',
      proactiveRecommendation: 'Execute preemptive Tier Calibration Addendum prior to Nov 20 to mandate automatic 3.80% rate on all November/December card issuances.',
      expectedMonthlyCommission: 14800.00,
      forecastedRemittance: 7960.00,
      actionStatus: 'Preemptive Alert Dispatched'
    },
    {
      id: 'PRED-002',
      period: '2026-12',
      periodLabel: 'December 2026 (Year-End Remittance Spike)',
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      category: 'Money Transfer',
      baselineVolume: 485000,
      forecastedVolume: 640000,
      footTrafficMultiplier: 1.32,
      contractedRate: 1.80,
      predictedRemittedRate: 1.45,
      predictedLeakageAmount: 8960.00,
      leakageProbability: 88,
      riskTier: 'Critical Risk',
      primaryRiskDriver: 'Cross-Border Wire Surge & Surcharge Deductions: Increased holiday remittances historically trigger unapproved network pass-through deductions and reversion to 1.45% base rate.',
      proactiveRecommendation: 'Institute daily API transaction count polling starting Dec 1 with contractual zero-deduction mandate for holiday corridors.',
      expectedMonthlyCommission: 13020.00,
      forecastedRemittance: 4060.00,
      actionStatus: 'Recommended for Pre-Audit'
    },
    {
      id: 'PRED-003',
      period: '2026-11',
      periodLabel: 'November 2026',
      vendorId: 'V006',
      vendorName: 'ReloadNow Services',
      category: 'Prepaid Products',
      baselineVolume: 78000,
      forecastedVolume: 115000,
      footTrafficMultiplier: 1.47,
      contractedRate: 3.80,
      predictedRemittedRate: 3.20,
      predictedLeakageAmount: 1380.00,
      leakageProbability: 74,
      riskTier: 'Elevated Risk',
      primaryRiskDriver: 'Clearinghouse Net-45 Settlement Latency: Clearinghouse aggregation software maps door tiers to default 3.20% during high-volume batch runs.',
      proactiveRecommendation: 'Transition from Net-45 to bi-weekly reconciliation cadence with real-time terminal batch validation.',
      expectedMonthlyCommission: 4770.00,
      forecastedRemittance: 3390.00,
      actionStatus: 'Automated Rule Staged'
    },
    {
      id: 'PRED-004',
      period: '2026-12',
      periodLabel: 'December 2026',
      vendorId: 'V010',
      vendorName: 'ValueCard Partners',
      category: 'Gift Cards',
      baselineVolume: 62000,
      forecastedVolume: 95000,
      footTrafficMultiplier: 1.53,
      contractedRate: 3.00,
      predictedRemittedRate: 2.40,
      predictedLeakageAmount: 1900.00,
      leakageProbability: 85,
      riskTier: 'Critical Risk',
      primaryRiskDriver: 'Unclaimed Holiday Co-Op & Underreporting: Vendor has failed to remit $1,200 holiday endcap marketing subsidy for 2 consecutive years and continues 2.40% legacy calculations.',
      proactiveRecommendation: 'Issue formal Pre-Holiday Compliance Demand; hold back clearinghouse payments in escrow until 2026 reconciliations are settled.',
      expectedMonthlyCommission: 4050.00,
      forecastedRemittance: 2150.00,
      actionStatus: 'Legal Hold Recommended'
    },
    {
      id: 'PRED-005',
      period: '2026-12',
      periodLabel: 'December 2026',
      vendorId: 'V009',
      vendorName: 'FinServ Commission Co.',
      category: 'Financial Services',
      baselineVolume: 520000,
      forecastedVolume: 590000,
      footTrafficMultiplier: 1.13,
      contractedRate: 2.50,
      predictedRemittedRate: 2.30,
      predictedLeakageAmount: 2360.00,
      leakageProbability: 62,
      riskTier: 'Moderate Risk',
      primaryRiskDriver: 'Winter Heating Utility Surge: Municipal bill payment tiers miscalculated due to outdated utility classification table.',
      proactiveRecommendation: 'Sync updated utility classification mapping before Dec 1 billing cycle.',
      expectedMonthlyCommission: 14750.00,
      forecastedRemittance: 12390.00,
      actionStatus: 'Mapping Sync Pending'
    },
    {
      id: 'PRED-006',
      period: '2026-12',
      periodLabel: 'December 2026',
      vendorId: 'V005',
      vendorName: 'PrepaidPlus Corp',
      category: 'Prepaid Products',
      baselineVolume: 165000,
      forecastedVolume: 240000,
      footTrafficMultiplier: 1.45,
      contractedRate: 4.20,
      predictedRemittedRate: 4.20,
      predictedLeakageAmount: 480.00,
      leakageProbability: 18,
      riskTier: 'Low Risk',
      primaryRiskDriver: 'Strong Historical Compliance: Minimal risk; minor potential for uncollected POS display subsidy ($480) on streaming starter kits.',
      proactiveRecommendation: 'Standard monthly reconciliation schedule.',
      expectedMonthlyCommission: 10880.00,
      forecastedRemittance: 10400.00,
      actionStatus: 'Monitoring Only'
    }
  ];

  const transactionFeedAnomalies = [
    {
      id: 'ANOM-2026-1118-01',
      timestamp: 'Today, 15:42 EST',
      storeDoors: 'Doors #412–#428 (Midwest Fuel & Convenience Network)',
      region: 'Midwest',
      productCategory: 'Gift Cards (Open-Loop & Branded)',
      vendorName: 'GiftFlow Inc.',
      severity: 'Critical',
      expectedCountPerHour: 185,
      actualCountPerHour: 34,
      deficitPercentage: -81.6,
      rootCause: 'POS Terminal Firmware v4.11 socket timeout during card activation handshake with GiftFlow host; transactions failing or dropping subsidies silently',
      uncollectedSubsidiesLost: 1840,
      status: 'Active Anomaly',
      recommendedAction: 'Trigger automated switch failover to secondary card gateway and dispatch POS terminal firmware patch.'
    },
    {
      id: 'ANOM-2026-1118-02',
      timestamp: 'Today, 13:15 EST',
      storeDoors: 'Doors #104–#118 (Southeast Metro Doors)',
      region: 'Southeast',
      productCategory: 'Money Transfer (International Remittance)',
      vendorName: 'SwiftTransfer Global',
      severity: 'Critical',
      expectedCountPerHour: 62,
      actualCountPerHour: 0,
      deficitPercentage: -100.0,
      rootCause: 'API Gateway TLS certificate expiration on vendor endpoint; complete transaction blackout for 2.5 hours during peak lunchtime foot traffic',
      uncollectedSubsidiesLost: 1420,
      status: 'Active Anomaly',
      recommendedAction: 'Route traffic through standby SwiftTransfer gateway IP and log SLA outage penalty ticket.'
    },
    {
      id: 'ANOM-2026-1117-03',
      timestamp: 'Yesterday, 18:20 EST',
      storeDoors: 'Doors #801–#845 (Texas Regional Network)',
      region: 'Southwest',
      productCategory: 'Prepaid Airtime & SIM Reloads',
      vendorName: 'ReloadNow Services',
      severity: 'Medium',
      expectedCountPerHour: 95,
      actualCountPerHour: 58,
      deficitPercentage: -38.9,
      rootCause: 'Uncollected promotional marketing subsidy: POS PIN pad promotional prompt omitted due to caching glitch',
      uncollectedSubsidiesLost: 620,
      status: 'Auto-Healed',
      recommendedAction: 'Cache refreshed remotely; subsidies re-enabled.'
    },
    {
      id: 'ANOM-2026-1116-04',
      timestamp: 'Nov 16, 09:10 EST',
      storeDoors: 'Doors #012–#030 (Northeast Express Stores)',
      region: 'Northeast',
      productCategory: 'Bill Payment Processing',
      vendorName: 'FinServ Commission Co.',
      severity: 'Low',
      expectedCountPerHour: 45,
      actualCountPerHour: 42,
      deficitPercentage: -6.7,
      rootCause: 'Minor network latency during morning clearinghouse batch file transmission',
      uncollectedSubsidiesLost: 0,
      status: 'Resolved',
      recommendedAction: 'Settlement confirmed on secondary retry cycle.'
    }
  ];
  // ── AI Digital Procurement Twin & Bundle Optimizer Models (Spec) ───
  const digitalTwinScenarios = [
    {
      id: 'TWIN-001',
      query: 'If we move Netflix from InComm to Blackhawk, what happens?',
      productName: 'Netflix Streaming Subscription Cards',
      category: 'Streaming Media',
      currentVendorId: 'V001',
      currentVendorName: 'InComm / GiftFlow Inc.',
      currentCommissionRate: 3.00,
      currentAnnualVolume: 2400000,
      currentAnnualCommission: 72000,
      targetVendorId: 'V002',
      targetVendorName: 'Blackhawk Network / CardVault Solutions',
      targetCommissionRate: 4.75,
      targetAnnualCommission: 114000,
      commissionImpactDollars: 42000,
      commissionImpactBps: 175,
      implementationCostDollars: 14500,
      implementationCostBreakdown: [
        { item: 'POS Terminal Key Injection & SKU Mapping', cost: 6200 },
        { item: 'Clearinghouse Gateway Certification', cost: 4800 },
        { item: 'Store Associate Training & POS Quick-Cards', cost: 3500 }
      ],
      transitionRiskScore: 22,
      transitionRiskTier: 'Low Risk',
      transitionRiskFactors: [
        { factor: 'POS Integration Compatibility', level: 'Low', detail: 'Pre-existing Blackhawk API adapter already certified in POS release v4.9+' },
        { factor: 'Customer Experience Continuity', level: 'None', detail: 'Barcode 128 scan format identical; zero consumer checkout friction' },
        { factor: 'Inventory & Fixture Changeover', level: 'Low', detail: 'Single overnight J-hook peg change across 1,420 store doors' }
      ],
      paybackPeriodMonths: 4.1,
      netBenefit3YrNPV: 101340,
      firstYearROI: 289,
      transitionRoadmapWeeks: 4,
      aiRecommendation: 'STRONG MOVE: Decision intelligence models confirm +$42,000 annual EBITDA expansion with minimal operational friction and a rapid 4.1-month capital payback period.'
    },
    {
      id: 'TWIN-002',
      query: 'If we move Open-Loop Visa Gift Cards from GiftFlow to SecurePay Networks, what happens?',
      productName: 'Visa / MC Open-Loop Gift Cards',
      category: 'Gift Cards',
      currentVendorId: 'V001',
      currentVendorName: 'GiftFlow Inc.',
      currentCommissionRate: 3.50,
      currentAnnualVolume: 3320000,
      currentAnnualCommission: 116200,
      targetVendorId: 'V008',
      targetVendorName: 'SecurePay Networks',
      targetCommissionRate: 4.60,
      targetAnnualCommission: 152720,
      commissionImpactDollars: 36520,
      commissionImpactBps: 110,
      implementationCostDollars: 18200,
      implementationCostBreakdown: [
        { item: 'EMV Chip Reader Recertification', cost: 8900 },
        { item: 'Card Issuance Encryption HSM Keys', cost: 5300 },
        { item: 'Compliance Testing & End-to-End Pilot', cost: 4000 }
      ],
      transitionRiskScore: 48,
      transitionRiskTier: 'Moderate Risk',
      transitionRiskFactors: [
        { factor: 'EMV Kernel Certification', level: 'Moderate', detail: 'Requires firmware update on older Verifone terminal models in 180 rural stores' },
        { factor: 'Card Stock Return & Credit', level: 'Low', detail: 'Vendor buy-back clause guarantees 100% credit on unsold GiftFlow card blanks' }
      ],
      paybackPeriodMonths: 6.0,
      netBenefit3YrNPV: 82100,
      firstYearROI: 200,
      transitionRoadmapWeeks: 6,
      aiRecommendation: 'RECOMMENDED WITH PILOT: +$36,520/yr yield justifies 6-week phased rollout starting with Midwest doors.'
    },
    {
      id: 'TWIN-003',
      query: 'If we move Domestic Money Orders from MoneyLink to SwiftTransfer Global, what happens?',
      productName: 'Domestic Money Orders',
      category: 'Money Transfer',
      currentVendorId: 'V004',
      currentVendorName: 'MoneyLink Express',
      currentCommissionRate: 2.10,
      currentAnnualVolume: 4370000,
      currentAnnualCommission: 91770,
      targetVendorId: 'V003',
      targetVendorName: 'SwiftTransfer Global',
      targetCommissionRate: 2.75,
      targetAnnualCommission: 120175,
      commissionImpactDollars: 28405,
      commissionImpactBps: 65,
      implementationCostDollars: 9800,
      implementationCostBreakdown: [
        { item: 'Thermal Printer Driver Setup', cost: 3800 },
        { item: 'Money Order Document Security Alignment', cost: 3500 },
        { item: 'Audit Trail Telemetry Sync', cost: 2500 }
      ],
      transitionRiskScore: 18,
      transitionRiskTier: 'Low Risk',
      transitionRiskFactors: [
        { factor: 'Hardware Interchangeability', level: 'Low', detail: 'SwiftTransfer supports existing Epson thermal printer hardware' },
        { factor: 'State Regulatory Licensing', level: 'None', detail: 'SwiftTransfer is fully licensed in all 50 states with existing MSB bonds' }
      ],
      paybackPeriodMonths: 4.1,
      netBenefit3YrNPV: 68450,
      firstYearROI: 289,
      transitionRoadmapWeeks: 3,
      aiRecommendation: 'HIGH VALUE / LOW EFFORT: Plug-and-play printer drivers allow full 1,420-door migration in under 3 weeks.'
    }
  ];

  const bundleOptimizerData = [
    {
      id: 'BNDL-001',
      name: 'Financial Services Tri-Bundle (Money Orders + Reloads + Bill Pay)',
      discoveryStatement: 'Moving Money Orders + Reloads + Bill Pay to Vendor A increases overall yield by 2.8%.',
      targetVendor: 'Vendor A (FinServ Commission Co. / SecurePay Consolidated)',
      targetVendorId: 'V009',
      includedProducts: [
        { name: 'Domestic Money Orders', category: 'Money Transfer', currentVolume: 4370000, standaloneRate: 2.10, bundledRate: 4.80 },
        { name: 'Prepaid Debit Reloads', category: 'Debit Services', currentVolume: 3780000, standaloneRate: 1.60, bundledRate: 4.40 },
        { name: 'Utility & Telecom Bill Pay', category: 'Financial Services', currentVolume: 5550000, standaloneRate: 2.50, bundledRate: 5.30 }
      ],
      totalBundleVolume: 13700000,
      currentStandaloneWeightedYield: 2.12,
      bundledConsolidatedYield: 4.92,
      netYieldIncreaseBps: 280,
      netYieldIncreasePercent: 2.80,
      currentAnnualCommissions: 290450,
      bundledAnnualCommissions: 674040,
      annualEbitdaGain: 383590,
      threeYearCumulativeValue: 1150770,
      bundleSynergies: [
        { title: 'Volume Tier-Jumping (+115 bps)', detail: 'Combined $13.7M volume breaches Master Tier 4 threshold, unlocking accelerated commission brackets across all three products.' },
        { title: 'Unified POS Gateway Subsidy (+$36,000/yr)', detail: 'Vendor A eliminates three separate third-party middleware transaction fees by deploying single unified clearing switch.' },
        { title: 'Dedicated Marketing Co-Op Pool ($24,000/yr)', detail: 'Contractual annual fund for in-store pump-topper displays and register pin-pad promotional screens.' },
        { title: 'Full 100% Fraud Hold-Harmless', detail: 'Vendor A assumes all chargeback and counterfeit money order risk across the network.' }
      ],
      transitionComplexity: 'Medium (5-week coordinated cutover)',
      status: 'Recommended by AI'
    },
    {
      id: 'BNDL-002',
      name: 'Digital Entertainment & Gaming Master Bundle (Streaming + Console Codes)',
      discoveryStatement: 'Consolidating all Digital Streaming & Gaming SKUs under PrepaidPlus Corp increases category yield by 1.65%.',
      targetVendor: 'PrepaidPlus Corp',
      targetVendorId: 'V005',
      includedProducts: [
        { name: 'Netflix & Spotify Digital Codes', category: 'Streaming Media', currentVolume: 2400000, standaloneRate: 3.00, bundledRate: 4.70 },
        { name: 'PlayStation & Xbox Console Cards', category: 'Gaming Codes', currentVolume: 1850000, standaloneRate: 3.50, bundledRate: 5.10 }
      ],
      totalBundleVolume: 4250000,
      currentStandaloneWeightedYield: 3.22,
      bundledConsolidatedYield: 4.87,
      netYieldIncreaseBps: 165,
      netYieldIncreasePercent: 1.65,
      currentAnnualCommissions: 136850,
      bundledAnnualCommissions: 206975,
      annualEbitdaGain: 70125,
      threeYearCumulativeValue: 210375,
      bundleSynergies: [
        { title: 'Universal J-Hook Consolidation', detail: 'Consolidates 24 SKU facings to a single vendor distribution partner with automated replenishment.' },
        { title: 'Seasonal Co-Op Promo Fund ($15,000)', detail: 'Guaranteed Q4 holiday endcap promotional funding.' }
      ],
      transitionComplexity: 'Low (3-week peg realignment)',
      status: 'Ready to Launch RFP'
    },
    {
      id: 'BNDL-003',
      name: 'Cross-Border Remittance & Prepaid SIM Carrier Master Bundle',
      discoveryStatement: 'Bundling International Remittance with Prepaid Wireless SIMs under SwiftTransfer Global expands margin by 1.95%.',
      targetVendor: 'SwiftTransfer Global',
      targetVendorId: 'V003',
      includedProducts: [
        { name: 'International Wire Remittance', category: 'Money Transfer', currentVolume: 5620000, standaloneRate: 1.80, bundledRate: 3.75 },
        { name: 'Prepaid Carrier SIMs & Airtime', category: 'Prepaid Wireless', currentVolume: 1950000, standaloneRate: 4.20, bundledRate: 6.15 }
      ],
      totalBundleVolume: 7570000,
      currentStandaloneWeightedYield: 2.42,
      bundledConsolidatedYield: 4.37,
      netYieldIncreaseBps: 195,
      netYieldIncreasePercent: 1.95,
      currentAnnualCommissions: 183060,
      bundledAnnualCommissions: 330809,
      annualEbitdaGain: 147749,
      threeYearCumulativeValue: 443247,
      bundleSynergies: [
        { title: 'Cross-Promotion Loyalty Integration', detail: 'Customers sending wire transfers receive automatic instant 10% bonus minutes on prepaid airtime.' },
        { title: 'Zero Network Surcharge Mandate', detail: 'Contractual floor eliminating international clearing fees.' }
      ],
      transitionComplexity: 'Medium (4-week API sync)',
      status: 'Ready to Launch RFP'
    }
  ];
  // ── Recovery, Escalation, Executive & Copilot Models (Spec) ────────
  const escalationConfig = {
    level1MaxThreshold: 10000,   // Level 1: Finance Analyst (<= $10,000)
    level2MaxThreshold: 50000,   // Level 2: Procurement / Category Manager ($10,001 - $50,000)
    level3MinThreshold: 50001,   // Level 3: Executive Sponsor & General Counsel (> $50,000)
    slaDaysL1: 5,
    slaDaysL2: 7,
    slaDaysL3: 14,
    autoEscalateOnSLABreach: true,
    notifyExecutiveOnL3: true,
    requireLegalReviewAbove50k: true
  };

  const executiveBoardMetrics = {
    boardSummaryQuote: 'Commission revenues increased 14.2% this quarter. Reverse auctions generated $418,000 in additional annualized margin. Three vendors are currently underperforming, representing $72,000 of potential recovery.',
    quarterlyRevenueGrowthPct: 14.2,
    reverseAuctionMarginGenerated: 418000,
    underperformingVendorsCount: 3,
    underperformingRecoveryOpportunity: 72000,
    underperformingVendorsList: [
      { vendor: 'SwiftTransfer Global', shortfall: 34000, reason: 'Applied legacy non-tiered 1.45% base rate & deducted $500 IT subsidy' },
      { vendor: 'ReloadNow Services', shortfall: 21000, reason: 'Clearinghouse mapped retail door tier to 3.20% instead of 3.80%' },
      { vendor: 'ValueCard Partners', shortfall: 17000, reason: 'Persistent underreporting & unbilled $1,200 promotional co-op subsidy' }
    ],
    totalQuarterlyCommissions: 412500,
    activeRFPsTenderValue: 13700000,
    contractsExpiringNext90Days: 3,
    totalRecoveredYTD: 198000,
    activeRecoveryPipeline: 144000
  };

  const dailyBidStatusReports = [
    {
      eventId: 'SE001',
      eventName: 'Q4 Gift Card Processing Master Reverse Auction',
      category: 'Gift Cards',
      annualVolume: 2450000,
      reservePrice: '4.25%',
      currentBestBid: '4.35%',
      leaderVendor: 'CardVault Solutions',
      spreadCompressionBps: 85,
      bidsToday: 14,
      auctionStatus: 'Live (Ending Today)',
      biddersActive: 6
    },
    {
      eventId: 'SE002',
      eventName: 'Prepaid Streaming Cards Sealed Bid Tender',
      category: 'Streaming Media',
      annualVolume: 1850000,
      reservePrice: '4.50%',
      currentBestBid: '4.85%',
      leaderVendor: 'PrepaidPlus Corp',
      spreadCompressionBps: 65,
      bidsToday: 4,
      auctionStatus: 'Sealed Phase (Review in Progress)',
      biddersActive: 4
    },
    {
      eventId: 'SE003',
      eventName: 'International Money Transfer Target Pricing RFP',
      category: 'Money Transfer',
      annualVolume: 5620000,
      reservePrice: '2.40%',
      currentBestBid: '2.60%',
      leaderVendor: 'QuickRemit International',
      spreadCompressionBps: 50,
      bidsToday: 6,
      auctionStatus: 'Active Target Bidding',
      biddersActive: 5
    }
  ];

  const vendorConcernReports = [
    {
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      category: 'Gift Cards',
      currentBid: 4.25,
      isBAFOFlagged: true,
      bafoTimestamp: 'Today, 14:15 EST',
      dropoutThresholdRate: 4.30,
      dropoutWillingness: 'High Willingness to Dropout (85% probability if pushed beyond 4.30%)',
      concernCategory: 'Interchange Margin Compression',
      concernNotes: 'Vendor flagged that card network interchange fees leave zero operating margin above 4.30%. Declared 4.25% as their Best and Final Offer (BAFO).'
    },
    {
      vendorId: 'V002',
      vendorName: 'CardVault Solutions',
      category: 'Gift Cards',
      currentBid: 4.35,
      isBAFOFlagged: false,
      bafoTimestamp: 'Active Bidding',
      dropoutThresholdRate: 4.55,
      dropoutWillingness: 'Low Dropout Risk (Has capacity to reach 4.50%+)',
      concernCategory: 'Integration Timeline',
      concernNotes: 'Requests 30-day onboarding grace period for POS terminal key injection across rural store doors.'
    },
    {
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      category: 'Money Transfer',
      currentBid: 2.30,
      isBAFOFlagged: true,
      bafoTimestamp: 'Yesterday, 17:00 EST',
      dropoutThresholdRate: 2.45,
      dropoutWillingness: 'Moderate Dropout Risk (Will dropout if anti-sniping extends past 18:00)',
      concernCategory: 'Treasury Settlement Timing',
      concernNotes: 'Vendor requires Net-15 settlement terms if commission rate exceeds 2.35%.'
    },
    {
      vendorId: 'V008',
      vendorName: 'SecurePay Networks',
      category: 'Debit Services',
      currentBid: 4.15,
      isBAFOFlagged: false,
      bafoTimestamp: 'Active Bidding',
      dropoutThresholdRate: 4.45,
      dropoutWillingness: 'Low Dropout Risk',
      concernCategory: 'None',
      concernNotes: 'Aggressive bidder seeking to capture entire multi-door fuel network footprint.'
    }
  ];

  const vendorNetImpactSummaries = [
    {
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      productLine: 'Branded & Open-Loop Gift Cards',
      annualUnitSales: 78400,
      averageUnitFaceValue: 31.25,
      totalGmvVolume: 2450000,
      contractedCommissionRate: 4.25,
      netCommissionPaidToRetailer: 104125,
      vendorGrossRevenue: 159250,
      vendorNetRetainedMargin: 55125,
      vendorMarginYieldPct: 2.25,
      netImpactFormula: '78,400 Units X $31.25 Avg = $2,450,000 GMV X 4.25% = $104,125 Commission Paid'
    },
    {
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      productLine: 'International Money Remittance',
      annualUnitSales: 140500,
      averageUnitFaceValue: 40.00,
      totalGmvVolume: 5620000,
      contractedCommissionRate: 2.35,
      netCommissionPaidToRetailer: 132070,
      vendorGrossRevenue: 224800,
      vendorNetRetainedMargin: 92730,
      vendorMarginYieldPct: 1.65,
      netImpactFormula: '140,500 Wire Orders X $40.00 Avg = $5,620,000 GMV X 2.35% = $132,070 Commission Paid'
    },
    {
      vendorId: 'V005',
      vendorName: 'PrepaidPlus Corp',
      productLine: 'Digital Streaming & Gaming Subscriptions',
      annualUnitSales: 65000,
      averageUnitFaceValue: 30.00,
      totalGmvVolume: 1950000,
      contractedCommissionRate: 4.80,
      netCommissionPaidToRetailer: 93600,
      vendorGrossRevenue: 136500,
      vendorNetRetainedMargin: 42900,
      vendorMarginYieldPct: 2.20,
      netImpactFormula: '65,000 Code Activations X $30.00 Avg = $1,950,000 GMV X 4.80% = $93,600 Commission Paid'
    }
  ];

  const copilotPreloadedQnA = [
    {
      query: 'What is our total recovered revenue this quarter?',
      category: 'Revenue Recovery',
      answer: 'Commission IQ has successfully recovered $198,000 in underpaid commissions year-to-date across 4 resolved cases, achieving a 57.9% recovery rate. An additional $144,000 is actively being pursued across 6 active pipeline disputes, led by case RC001 against SwiftTransfer Global ($84,000).',
      actionText: 'Open Recovery Pipeline',
      actionRoute: '/recovery'
    },
    {
      query: 'Which vendors are currently underperforming and represent recovery opportunity?',
      category: 'Executive Insights',
      answer: 'Three vendors are currently underperforming, representing $72,000 of immediate recovery opportunity: 1) SwiftTransfer Global ($34,000 shortfall from unauthorized 1.45% base rate deductions), 2) ReloadNow Services ($21,000 from retail door tier downgrades), and 3) ValueCard Partners ($17,000 from chronic underreporting & missing marketing subsidies).',
      actionText: 'Review Underperforming Vendors',
      actionRoute: '/compliance'
    },
    {
      query: 'Which vendors have flagged BAFO or are at risk of dropping out in auction SE001?',
      category: 'Sourcing & Reverse Auctions',
      answer: 'GiftFlow Inc. has officially flagged their 4.25% bid as Best and Final Offer (BAFO) due to interchange cost ceilings, indicating an 85% probability of dropping out if reserve exceeds 4.30%. CardVault Solutions (current 4.35%) and SecurePay Networks (4.15%) retain headroom up to 4.50%+.',
      actionText: 'Inspect Live Sourcing Event SE001',
      actionRoute: '/sourcing'
    },
    {
      query: 'What reverse auction reserve rate does AI recommend for Gift Cards?',
      category: 'Sourcing Recommendations',
      answer: 'Based on 1,420 store transactions and Benchmark Index v2.4, the AI recommends an Optimal Reserve Rate of 4.25% (+125 bps over current baseline 3.00%), a Starting Price Ceiling of 3.60%, and an aggressive Stretch Target of 4.45% (backed by 15th percentile benchmark yields).',
      actionText: 'View AI Reserve Calibration',
      actionRoute: '/sourcing'
    },
    {
      query: 'Forecast Q4 holiday commission revenue and leakage risk',
      category: 'Predictive Forecasting',
      answer: 'Q4 transaction volume is projected to surge by +81% over Black Friday and +45% through Christmas, generating $412,500 in total earned commissions. However, predictive ML models forecast $22,920 in potential leakage across 3 critical risk contracts without preemptive rate tier calibration.',
      actionText: 'View Predictive Forensics',
      actionRoute: '/leakage'
    }
  ];
  // ── Security & Technical Infrastructure Models (Spec) ───────────────
  const securityConfig = {
    sso: {
      enabled: true,
      provider: 'Okta / SAML 2.0 & OIDC',
      entityId: 'https://auth.commissioniq.io/saml/metadata',
      ssoUrl: 'https://enterprise.okta.com/app/commissioniq/sso/saml',
      certExpiry: '2027-10-15',
      enforceSSOForInternal: true,
      supportedProviders: ['Okta', 'Microsoft Azure Active Directory (Entra ID)', 'Google Workspace SAML', 'PingIdentity']
    },
    mfa: {
      enabled: true,
      policy: 'Enforced for all System Admin, Executive Sponsor, and Finance Analyst roles',
      methods: [
        { name: 'TOTP Authenticator (Google / Microsoft Authenticator)', type: 'App-based', status: 'Active (Recommended)' },
        { name: 'FIDO2 / WebAuthn Hardware Security Key (YubiKey)', type: 'Hardware Token', status: 'Active (High Security)' },
        { name: 'SMS OTP Verified Backup', type: 'Telephony', status: 'Fallback Only' }
      ],
      gracePeriodDays: 3,
      sessionTimeoutMinutes: 60
    },
    encryption: {
      atRest: 'AES-256-GCM (Hardware Cryptographic Acceleration)',
      inTransit: 'TLS 1.3 with Perfect Forward Secrecy & HSTS Enforced',
      kmsProvider: 'AWS Key Management Service (KMS) & HashiCorp Vault Envelope Encryption',
      keyRotationSchedule: 'Automated 90-Day Key Rotation',
      lastRotated: '2026-10-01',
      nextScheduledRotation: '2026-12-30'
    },
    api: {
      apiFirst: true,
      openApiVersion: 'v3.1.0',
      activeTokensCount: 6,
      defaultRateLimit: '10,000 requests / hour',
      webhookEndpoints: [
        { id: 'WH001', name: 'POS Transaction Stream Ingestion Webhook', url: 'https://api.commissioniq.io/v1/pos/stream', status: 'Active', latency: '24ms' },
        { id: 'WH002', name: 'ERP / SAP NetWeaver Settlement Sync', url: 'https://api.commissioniq.io/v1/erp/settlement', status: 'Active', latency: '48ms' },
        { id: 'WH003', name: 'Vendor Remittance Advice Notification Feed', url: 'https://api.commissioniq.io/v1/vendors/remittances', status: 'Active', latency: '35ms' },
        { id: 'WH004', name: 'Automated Legal Dispute Webhook Relay', url: 'https://api.commissioniq.io/v1/disputes/dispatch', status: 'Active', latency: '31ms' }
      ]
    },
    multiTenant: {
      enabled: true,
      activeTenantId: 'TENANT-PFJ-01',
      activeTenantName: 'Pilot Flying J Travel Centers (National Door Network)',
      tenantDoorCount: 1420,
      tenantIsolationMode: 'Row-Level Security (RLS) + Encrypted Schema Separation',
      availableTenants: [
        { id: 'TENANT-PFJ-01', name: 'Pilot Flying J Travel Centers (1,420 Doors)', region: 'National', status: 'Active (Current)' },
        { id: 'TENANT-CK-02',  name: 'Circle K Southeast Division (890 Doors)', region: 'Southeast', status: 'Provisioned' },
        { id: 'TENANT-SPW-03', name: 'Speedway Midwest Network (640 Doors)', region: 'Midwest', status: 'Provisioned' }
      ]
    }
  };

  // ── MVP Roadmap & Detailed Functional Requirements Matrix ────────────
  const mvpRoadmapMatrix = [
    { id: 'M001', module: 'Analytics', requirement: 'Excel upload and auto column mapping', priority: 'High', phase: 'Phase 1', status: 'Delivered', completionPct: 100, verifiedRoute: '/benchmarking' },
    { id: 'M002', module: 'Analytics', requirement: 'Benchmark gap calculations', priority: 'High', phase: 'Phase 1', status: 'Delivered', completionPct: 100, verifiedRoute: '/benchmark-database' },
    { id: 'M003', module: 'RFP', requirement: 'Vendor event management', priority: 'High', phase: 'Phase 1', status: 'Delivered', completionPct: 100, verifiedRoute: '/sourcing' },
    { id: 'M004', module: 'Auction', requirement: 'Live reverse bidding', priority: 'High', phase: 'Phase 1', status: 'Delivered', completionPct: 100, verifiedRoute: '/sourcing' },
    { id: 'M005', module: 'Compliance', requirement: 'Expected vs actual commissions', priority: 'High', phase: 'Phase 2', status: 'Delivered', completionPct: 100, verifiedRoute: '/compliance' },
    { id: 'M006', module: 'Recovery', requirement: 'Case management', priority: 'Medium', phase: 'Phase 2', status: 'Delivered', completionPct: 100, verifiedRoute: '/recovery' },
    { id: 'M007', module: 'Workflow', requirement: 'Escalation engine', priority: 'High', phase: 'Phase 2', status: 'Delivered', completionPct: 100, verifiedRoute: '/workflow' },
    { id: 'M008', module: 'AI', requirement: 'Contract extraction', priority: 'Medium', phase: 'Phase 2', status: 'Delivered', completionPct: 100, verifiedRoute: '/contracts' },
    { id: 'M009', module: 'AI', requirement: 'Copilot Natural language insights', priority: 'Low', phase: 'Phase 3', status: 'Delivered', completionPct: 100, verifiedRoute: '/copilot' }
  ];

  // ── AI Auto-RFP Builder Specifications ──────────────────────────────
  const autoRfpPresets = [
    {
      id: 'AUTORFP-001',
      title: 'Q4 National Gift Card Processing & Distribution RFP',
      category: 'Gift Cards',
      productList: [
        { sku: 'Visa / Mastercard Open-Loop Gift Cards ($25 - $500 Variable)', volume: 1650000, currentRate: 3.50, targetRate: 4.35 },
        { sku: 'Top 25 Branded Retail & Dining Closed-Loop Cards', volume: 800000, currentRate: 3.00, targetRate: 4.10 }
      ],
      totalAnnualVolume: 2450000,
      doorCount: 1420,
      requirements: [
        'Real-time card activation via POS barcode scan and ISO 8583 switch protocol',
        'Automatic dual-BIN routing with sub-500ms transaction authorization latency',
        'Turnkey J-hook fixture replenishment with automated min/max inventory triggers'
      ],
      serviceExpectations: [
        'Platform uptime guarantee of 99.95% with 24/7/365 Tier 1 merchant desk',
        'Full chargeback and counterfeit hold-harmless indemnification across all network doors',
        'Resolution of card activation customer disputes within 48 hours'
      ],
      commercialTerms: [
        'Optimal Reserve Commission Floor: 4.25% (Benchmark Index v2.4 Certified)',
        'Mandatory Contractual Minimum Floor Guarantee: $12,500 / month',
        'Annual Promotional Marketing Co-Op Subsidy: $18,000 / year for register pump-topper displays',
        'Settlement Cadence: Net 30 direct ACH electronic wire deposit'
      ]
    },
    {
      id: 'AUTORFP-002',
      title: 'International Money Remittance & Wire Processing RFP',
      category: 'Money Transfer',
      productList: [
        { sku: 'Cross-Border Account & Cash Remittance (LATAM, Mexico, Asia)', volume: 5620000, currentRate: 1.80, targetRate: 2.65 }
      ],
      totalAnnualVolume: 5620000,
      doorCount: 1420,
      requirements: [
        'FinCEN registered MSB with licensed money transmitter compliance across all 50 states',
        'API integration supporting barcode scan driver license customer KYC intake'
      ],
      serviceExpectations: [
        'Sub-second rate quote API with guaranteed foreign exchange margin lock',
        'Strict anti-money laundering (AML) screening with automated FinCEN CTR / SAR filing'
      ],
      commercialTerms: [
        'Optimal Reserve Commission Floor: 2.40% (Benchmark Certified)',
        'IT Integration & Terminal Maintenance Subsidy: $1,500 / month',
        'Settlement Cadence: Net 15 direct settlement'
      ]
    }
  ];

  // ── AI Vendor Recommendation Engine ─────────────────────────────────
  const vendorRecommendationsData = {
    eventId: 'SE001',
    eventName: 'Q4 Gift Card Processing Master Reverse Auction',
    recommendations: {
      bestProfit: {
        vendorId: 'V002',
        vendorName: 'CardVault Solutions',
        badge: 'Best Profit Vendor',
        badgeColor: '#10b981',
        headline: 'Maximum Commission Yield',
        rate: 4.35,
        annualRevenue: 106575,
        upsideVsCurrent: '+125 bps (+$30,625 / yr)',
        reasoning: 'Submits the highest net commission yield in the live reverse auction arena at 4.35%, delivering the maximum EBITDA contribution.'
      },
      bestOperational: {
        vendorId: 'V001',
        vendorName: 'GiftFlow Inc.',
        badge: 'Best Operational Vendor',
        badgeColor: '#06b6d4',
        headline: 'Zero-Friction Integration',
        rate: 4.25,
        annualRevenue: 104125,
        upsideVsCurrent: '+75 bps (+$18,375 / yr)',
        reasoning: 'Incumbent provider already pre-integrated across all 1,420 POS terminal registers; zero capital capex required and zero customer downtime risk.'
      },
      bestStrategic: {
        vendorId: 'V005',
        vendorName: 'PrepaidPlus Corp',
        badge: 'Best Strategic Vendor',
        badgeColor: '#8b5cf6',
        headline: 'Long-Term Multi-Category Revenue',
        rate: 4.20,
        annualRevenue: 102900,
        upsideVsCurrent: '+70 bps (+$17,150 / yr)',
        reasoning: 'Offers multi-category bundling leverage across streaming digital codes and gaming cards, unlocking an additional +1.65% cross-category margin synergy.'
      },
      bestOverall: {
        vendorId: 'V002',
        vendorName: 'CardVault Solutions',
        badge: 'Best Overall Vendor',
        badgeColor: '#f59e0b',
        headline: 'Top Composite Decision Score (94.6 / 100)',
        rate: 4.35,
        annualRevenue: 106575,
        upsideVsCurrent: '+125 bps (+$30,625 / yr)',
        reasoning: 'Balances market-leading 4.35% commission yield with 88% operational reliability scorecard and an upfront $15,000 signing integration allowance.'
      }
    }
  };

  // ── AI Renewal Hunter Alerts ─────────────────────────────────────────
  const renewalHunterAlerts = [
    {
      id: 'HUNT-001',
      vendorId: 'V005',
      vendorName: 'PrepaidPlus Corp',
      category: 'Prepaid Products (Streaming Media)',
      contractId: 'CON005',
      daysUntilExpiry: 92,
      expiryDate: '2027-02-18',
      noticeDeadline: '2026-12-20 (32 Days Remaining)',
      currentRate: 4.20,
      marketBenchmarkRate: 4.85,
      estimatedUpsideDollars: 63000,
      quote: 'Contract expires in 92 days. Estimated renegotiation upside: $63,000.',
      status: 'Immediate Action Recommended',
      autoRenewalClause: 'Auto-renews for 12 months unless 60-day certified Notice of Non-Renewal is served',
      sourcingRecommendation: 'Preemptively launch Prepaid Streaming RFP to lock in 4.85% benchmark rate before auto-renewal locks in current rate.'
    },
    {
      id: 'HUNT-002',
      vendorId: 'V003',
      vendorName: 'SwiftTransfer Global',
      category: 'Money Transfer',
      contractId: 'CON003',
      daysUntilExpiry: 43,
      expiryDate: '2026-12-31',
      noticeDeadline: '2026-11-01 (Cutoff Passed - Action Required)',
      currentRate: 1.80,
      marketBenchmarkRate: 2.45,
      estimatedUpsideDollars: 36530,
      quote: 'Contract expires in 43 days. Estimated renegotiation upside: $36,530.',
      status: 'Critical Renewal Horizon',
      autoRenewalClause: 'Evergreen 1-year auto-extension with 60-day notice requirement',
      sourcingRecommendation: 'Issue formal Notice of Dispute & Waiver of Auto-Renewal per Section 14.3 to preserve competitive RFP leverage.'
    },
    {
      id: 'HUNT-003',
      vendorId: 'V001',
      vendorName: 'GiftFlow Inc.',
      category: 'Gift Cards',
      contractId: 'CON001',
      daysUntilExpiry: 44,
      expiryDate: '2027-01-01',
      noticeDeadline: '2026-10-03 (Notice Dispatched)',
      currentRate: 3.50,
      marketBenchmarkRate: 4.25,
      estimatedUpsideDollars: 18375,
      quote: 'Contract expires in 44 days. Estimated renegotiation upside: $18,375.',
      status: 'Active Reverse Auction Tender (SE001)',
      autoRenewalClause: 'Non-renewal notice served on Oct 3, 2026; contract entering competitive rebid',
      sourcingRecommendation: 'Award contract to leading reverse auction bidder (CardVault Solutions at 4.35%) upon auction close.'
    }
  ];
  // ── Public API ─────────────────────────────────────────────
  return {
    users,
    vendors,
    commissionRates,
    subsidies,
    contracts,
    auditLogs,
    notifications,
    dashboardKPIs,
    monthlyRevenue,
    categoryDistribution,
    recentActivity,
    topVendors,

    // helpers
    getUserById:   (id)   => users.find(u => u.id === id),
    getVendorById: (id)   => vendors.find(v => v.id === id),
    getUserNotifications: (userId) => notifications.filter(n => n.userId === userId),
    getUnreadCount: (userId) => notifications.filter(n => n.userId === userId && !n.read).length,
    getVendorsByCategory: (cat) => vendors.filter(v => v.category === cat),
    getActiveVendors: () => vendors.filter(v => v.status === 'active'),
    getCommissionsByVendor: (vendorId) => commissionRates.filter(c => c.vendorId === vendorId),
    getContractsByVendor:   (vendorId) => contracts.filter(c => c.vendorId === vendorId),
    getSubsidiesByVendor:   (vendorId) => subsidies.filter(s => s.vendorId === vendorId),
    leakageData,
    benchmarkData,
    sourcingEvents,
    complianceScores,
    complianceViolations,
    recoveryPipeline,
    workflowItems,
    generatedReports,
    aiFindings,
    sampleUploadPresets,
    aiConsultantAdvice,
    consultantSummaryOutputs,
    profitOpportunityEngine,
    benchmarkDatabaseRepo,
    contractIntelligenceConfig,
    sampleContractPresets,
    opportunityRankingRepo,
    reverseAuctionConfig,
    monthlyCommissionReconciliation,
    predictiveLeakageModels,
    transactionFeedAnomalies,
    digitalTwinScenarios,
    bundleOptimizerData,
    escalationConfig,
    executiveBoardMetrics,
    dailyBidStatusReports,
    vendorConcernReports,
    vendorNetImpactSummaries,
    copilotPreloadedQnA,
    securityConfig,
    mvpRoadmapMatrix,
    autoRfpPresets,
    vendorRecommendationsData,
    renewalHunterAlerts,
    vendorPortalConfig,
    complianceConfig
  };
})();

if (typeof window !== 'undefined') window.MockData = MockData;
if (typeof module !== 'undefined') module.exports = MockData;
