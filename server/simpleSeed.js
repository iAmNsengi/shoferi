import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dbConnection from "./dbConfig/dbConnection.js";
import Users from "./models/userModel.js";
import Companies from "./models/companiesModel.js";
import Jobs from "./models/jobsModel.js";

dotenv.config();

const comprehensiveJobsData = [
  {
    jobTitle: "Professional Taxi Driver",
    jobType: "full-time",
    category: "ride_sharing",
    location: "Kigali, Rwanda",
    coordinates: { type: "Point", coordinates: [30.0599, -1.9536] },
    salary: 150000,
    salaryType: "monthly",
    priority: "normal",
    featured: true,
    urgent: false,
    vacancies: 3,
    experience: 2,
    details: [
      {
        desc: "Join our team as a professional taxi driver. We offer competitive compensation and excellent growth opportunities.",
        requirements:
          "Valid driving license with minimum 2 years experience\nClean driving record\nGood customer service skills",
      },
    ],
    vehicleRequirements: { vehicleType: ["sedan"], minYear: 2018 },
    schedule: "flexible",
    workingHours: {
      startTime: "08:00",
      endTime: "18:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 21,
      languages: ["English", "Kinyarwanda"],
      skills: ["Customer Service", "Navigation"],
      background_check: true,
      drug_test: false,
    },
    benefits: ["Health insurance", "Fuel allowance", "Performance bonus"],
    status: "active",
  },
  {
    jobTitle: "Delivery Driver - Motorcycle",
    jobType: "part-time",
    category: "delivery",
    location: "Gasabo District, Rwanda",
    coordinates: { type: "Point", coordinates: [30.0894, -1.9398] },
    salary: 80000,
    salaryType: "monthly",
    priority: "high",
    featured: false,
    urgent: true,
    vacancies: 8,
    experience: 1,
    details: [
      {
        desc: "Looking for reliable delivery drivers for our growing delivery service.",
        requirements:
          "Valid driving license\nOwn motorcycle or bicycle\nKnowledge of Kigali roads",
      },
    ],
    vehicleRequirements: { vehicleType: ["motorcycle"], minYear: 2015 },
    schedule: "shifts",
    workingHours: {
      startTime: "09:00",
      endTime: "17:00",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    requirements: {
      licenseType: ["A"],
      minimumAge: 20,
      languages: ["English", "Kinyarwanda"],
      skills: ["Time Management", "Navigation"],
      background_check: false,
      drug_test: false,
    },
    benefits: ["Flexible hours", "Performance bonus", "Fuel subsidy"],
    status: "active",
  },
  {
    jobTitle: "Corporate Chauffeur",
    jobType: "full-time",
    category: "chauffeur",
    location: "Nyarugenge District, Rwanda",
    coordinates: { type: "Point", coordinates: [30.0588, -1.9536] },
    salary: 200000,
    salaryType: "monthly",
    priority: "normal",
    featured: true,
    urgent: false,
    vacancies: 2,
    experience: 3,
    details: [
      {
        desc: "Seeking experienced chauffeur for corporate transportation services.",
        requirements:
          "Professional driving license\n3+ years experience\nExcellent presentation\nEnglish proficiency",
      },
    ],
    vehicleRequirements: { vehicleType: ["suv"], minYear: 2019 },
    schedule: "fixed",
    workingHours: {
      startTime: "07:00",
      endTime: "19:00",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 25,
      languages: ["English", "Kinyarwanda", "French"],
      skills: ["Professional Etiquette", "Customer Service"],
      background_check: true,
      drug_test: true,
    },
    benefits: [
      "Health insurance",
      "Uniform provided",
      "Training",
      "Annual bonus",
    ],
    status: "active",
  },
  {
    jobTitle: "Heavy Truck Driver",
    jobType: "contract",
    category: "logistics",
    location: "Kicukiro District, Rwanda",
    coordinates: { type: "Point", coordinates: [30.1028, -1.9706] },
    salary: 180000,
    salaryType: "monthly",
    priority: "urgent",
    featured: false,
    urgent: true,
    vacancies: 5,
    experience: 3,
    details: [
      {
        desc: "Heavy duty truck drivers needed for logistics company.",
        requirements:
          "Commercial driving license\nExperience with heavy vehicles\nPhysical fitness\nCargo handling experience",
      },
    ],
    vehicleRequirements: { vehicleType: ["truck"], minYear: 2016 },
    schedule: "shifts",
    workingHours: {
      startTime: "06:00",
      endTime: "18:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["C"],
      minimumAge: 23,
      languages: ["English", "Kinyarwanda"],
      skills: ["Heavy Vehicle Operation", "Cargo Handling"],
      background_check: true,
      drug_test: true,
    },
    benefits: ["Health insurance", "Overtime pay", "Safety training"],
    status: "active",
  },
  {
    jobTitle: "School Bus Driver",
    jobType: "part-time",
    category: "passenger_transport",
    location: "Musanze, Rwanda",
    coordinates: { type: "Point", coordinates: [29.6333, -1.5] },
    salary: 90000,
    salaryType: "monthly",
    priority: "normal",
    featured: false,
    urgent: false,
    vacancies: 3,
    experience: 1,
    details: [
      {
        desc: "Safe and reliable school bus drivers needed for student transportation.",
        requirements:
          "Valid driving license\nClean driving record\nPatience with children\nMorning availability",
      },
    ],
    vehicleRequirements: { vehicleType: ["bus"], minYear: 2017 },
    schedule: "fixed",
    workingHours: {
      startTime: "06:30",
      endTime: "08:00",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    requirements: {
      licenseType: ["D"],
      minimumAge: 24,
      languages: ["English", "Kinyarwanda"],
      skills: ["Child Safety", "Defensive Driving"],
      background_check: true,
      drug_test: false,
    },
    benefits: [
      "Regular schedule",
      "School holidays off",
      "Child safety training",
    ],
    status: "active",
  },
  {
    jobTitle: "Food Delivery Driver",
    jobType: "one-time",
    category: "delivery",
    location: "Kigali City Center, Rwanda",
    coordinates: { type: "Point", coordinates: [30.0644, -1.9441] },
    salary: 50000,
    salaryType: "per_trip",
    priority: "high",
    featured: true,
    urgent: true,
    vacancies: 12,
    experience: 0,
    details: [
      {
        desc: "Food delivery drivers needed for busy restaurant district.",
        requirements:
          "Motorcycle or bicycle\nSmartphone\nGood knowledge of Kigali\nFriendly attitude",
      },
    ],
    vehicleRequirements: { vehicleType: ["motorcycle"], minYear: 2014 },
    schedule: "flexible",
    workingHours: {
      startTime: "11:00",
      endTime: "22:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["A"],
      minimumAge: 18,
      languages: ["English", "Kinyarwanda"],
      skills: ["Navigation", "Customer Service"],
      background_check: false,
      drug_test: false,
    },
    benefits: [
      "Flexible schedule",
      "Tips",
      "Performance bonus",
      "Phone allowance",
    ],
    status: "active",
  },
  {
    jobTitle: "Tour Guide Driver",
    jobType: "temporary",
    category: "tour_guide",
    location: "Volcanoes National Park, Rwanda",
    coordinates: { type: "Point", coordinates: [29.5186, -1.4826] },
    salary: 120000,
    salaryType: "monthly",
    priority: "normal",
    featured: true,
    urgent: false,
    vacancies: 4,
    experience: 2,
    details: [
      {
        desc: "Tour guide drivers needed for safari and mountain gorilla tours.",
        requirements:
          "Tourism license\nExcellent English\nKnowledge of Rwanda's history and wildlife\n4WD driving experience",
      },
    ],
    vehicleRequirements: { vehicleType: ["suv"], minYear: 2018 },
    schedule: "flexible",
    workingHours: {
      startTime: "05:00",
      endTime: "19:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 25,
      languages: ["English", "Kinyarwanda", "French"],
      skills: ["Tourism", "Wildlife Knowledge", "Photography"],
      background_check: true,
      drug_test: false,
    },
    benefits: [
      "Tourism training",
      "Tips",
      "Nature exposure",
      "Language bonuses",
    ],
    status: "active",
  },
  {
    jobTitle: "Emergency Ambulance Driver",
    jobType: "full-time",
    category: "emergency_transport",
    location: "Rwanda Military Hospital, Kigali",
    coordinates: { type: "Point", coordinates: [30.0845, -1.9355] },
    salary: 220000,
    salaryType: "monthly",
    priority: "urgent",
    featured: true,
    urgent: true,
    vacancies: 2,
    experience: 4,
    details: [
      {
        desc: "Emergency medical services driver for ambulance operations.",
        requirements:
          "Emergency driving certification\nFirst aid training\nExcellent driving record\nStress management skills",
      },
    ],
    vehicleRequirements: { vehicleType: ["van"], minYear: 2019 },
    schedule: "shifts",
    workingHours: {
      startTime: "00:00",
      endTime: "23:59",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 26,
      languages: ["English", "Kinyarwanda"],
      skills: ["Emergency Response", "First Aid", "Stress Management"],
      background_check: true,
      drug_test: true,
    },
    benefits: [
      "Health insurance",
      "Emergency training",
      "Life insurance",
      "Overtime pay",
    ],
    status: "active",
  },
  {
    jobTitle: "Moving Services Driver",
    jobType: "contract",
    category: "moving_services",
    location: "Remera, Gasabo, Rwanda",
    coordinates: { type: "Point", coordinates: [30.0956, -1.9578] },
    salary: 100000,
    salaryType: "monthly",
    priority: "normal",
    featured: false,
    urgent: false,
    vacancies: 6,
    experience: 1,
    details: [
      {
        desc: "Moving and relocation services driver needed.",
        requirements:
          "Truck driving license\nPhysical strength\nCustomer service skills\nCareful handling of items",
      },
    ],
    vehicleRequirements: { vehicleType: ["truck", "van"], minYear: 2015 },
    schedule: "on_demand",
    workingHours: {
      startTime: "08:00",
      endTime: "17:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["C"],
      minimumAge: 22,
      languages: ["English", "Kinyarwanda"],
      skills: ["Physical Strength", "Customer Service"],
      background_check: false,
      drug_test: false,
    },
    benefits: ["Performance bonus", "Equipment provided", "Training"],
    status: "active",
  },
  {
    jobTitle: "VIP Executive Driver",
    jobType: "full-time",
    category: "chauffeur",
    location: "Kigali Convention Centre Area",
    coordinates: { type: "Point", coordinates: [30.0619, -1.9489] },
    salary: 300000,
    salaryType: "monthly",
    priority: "high",
    featured: true,
    urgent: false,
    vacancies: 1,
    experience: 5,
    details: [
      {
        desc: "VIP executive driver for high-profile clients and government officials.",
        requirements:
          "Security clearance\nImpeccable driving record\nProfessional appearance\nDiscretion and confidentiality",
      },
    ],
    vehicleRequirements: { vehicleType: ["sedan", "suv"], minYear: 2020 },
    schedule: "fixed",
    workingHours: {
      startTime: "06:00",
      endTime: "20:00",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 30,
      languages: ["English", "Kinyarwanda", "French"],
      skills: ["Executive Protection", "Etiquette", "Confidentiality"],
      background_check: true,
      drug_test: true,
    },
    benefits: [
      "Excellent salary",
      "Security training",
      "Uniform allowance",
      "Annual bonus",
      "Health insurance",
    ],
    status: "active",
  },
  {
    jobTitle: "Ride-Share Night Driver",
    jobType: "part-time",
    category: "ride_sharing",
    location: "Kigali Nightlife District",
    coordinates: { type: "Point", coordinates: [30.0588, -1.9441] },
    salary: 4000,
    salaryType: "hourly",
    priority: "high",
    featured: false,
    urgent: true,
    vacancies: 15,
    experience: 1,
    details: [
      {
        desc: "Night shift ride-share drivers for weekend and evening operations.",
        requirements:
          "Own vehicle preferred\nNight driving experience\nSafety awareness\nGood communication skills",
      },
    ],
    vehicleRequirements: { vehicleType: ["sedan"], minYear: 2016 },
    schedule: "shifts",
    workingHours: {
      startTime: "20:00",
      endTime: "06:00",
      daysOfWeek: ["Friday", "Saturday", "Sunday"],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 23,
      languages: ["English", "Kinyarwanda"],
      skills: ["Night Driving", "Safety Awareness"],
      background_check: true,
      drug_test: false,
    },
    benefits: ["Higher night rates", "Flexible schedule", "Safety equipment"],
    status: "active",
  },
  {
    jobTitle: "Airport Shuttle Driver",
    jobType: "full-time",
    category: "passenger_transport",
    location: "Kigali International Airport",
    coordinates: { type: "Point", coordinates: [30.1394, -1.9686] },
    salary: 160000,
    salaryType: "monthly",
    priority: "normal",
    featured: true,
    urgent: false,
    vacancies: 4,
    experience: 2,
    details: [
      {
        desc: "Airport shuttle service driver for hotel and business transfers.",
        requirements:
          "Professional appearance\nMultilingual preferred\nAirport area knowledge\nPunctuality essential",
      },
    ],
    vehicleRequirements: { vehicleType: ["van", "bus"], minYear: 2017 },
    schedule: "shifts",
    workingHours: {
      startTime: "04:00",
      endTime: "23:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["D"],
      minimumAge: 24,
      languages: ["English", "Kinyarwanda", "French"],
      skills: ["Customer Service", "Time Management"],
      background_check: true,
      drug_test: false,
    },
    benefits: [
      "Airport access badge",
      "Uniform provided",
      "Tips",
      "Language bonuses",
    ],
    status: "active",
  },
  {
    jobTitle: "Cargo Van Driver",
    jobType: "contract",
    category: "goods_transport",
    location: "Nyabugogo Commercial District",
    coordinates: { type: "Point", coordinates: [30.0588, -1.9756] },
    salary: 110000,
    salaryType: "monthly",
    priority: "normal",
    featured: false,
    urgent: false,
    vacancies: 7,
    experience: 2,
    details: [
      {
        desc: "Commercial cargo van driver for goods transportation within Kigali.",
        requirements:
          "Commercial driving experience\nCargo handling skills\nMarket knowledge\nReliable schedule keeping",
      },
    ],
    vehicleRequirements: { vehicleType: ["van"], minYear: 2014 },
    schedule: "fixed",
    workingHours: {
      startTime: "05:00",
      endTime: "15:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 21,
      languages: ["English", "Kinyarwanda"],
      skills: ["Cargo Handling", "Market Knowledge"],
      background_check: false,
      drug_test: false,
    },
    benefits: ["Loading assistance", "Route flexibility", "Performance bonus"],
    status: "active",
  },
  {
    jobTitle: "Medical Transport Driver",
    jobType: "full-time",
    category: "emergency_transport",
    location: "King Faisal Hospital, Kigali",
    coordinates: { type: "Point", coordinates: [30.0732, -1.9461] },
    salary: 170000,
    salaryType: "monthly",
    priority: "high",
    featured: true,
    urgent: false,
    vacancies: 3,
    experience: 2,
    details: [
      {
        desc: "Medical transport driver for patient transfers and medical equipment.",
        requirements:
          "Patient care awareness\nSmooth driving skills\nMedical transport certification\nCompassionate attitude",
      },
    ],
    vehicleRequirements: { vehicleType: ["van"], minYear: 2018 },
    schedule: "shifts",
    workingHours: {
      startTime: "06:00",
      endTime: "18:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 25,
      languages: ["English", "Kinyarwanda"],
      skills: ["Patient Care", "Medical Equipment"],
      background_check: true,
      drug_test: true,
    },
    benefits: [
      "Medical training",
      "Health insurance",
      "Compassion leave",
      "Professional development",
    ],
    status: "active",
  },
  {
    jobTitle: "Wedding Chauffeur",
    jobType: "temporary",
    category: "chauffeur",
    location: "Various Wedding Venues, Rwanda",
    coordinates: { type: "Point", coordinates: [30.0599, -1.9536] },
    salary: 75000,
    salaryType: "per_trip",
    priority: "normal",
    featured: false,
    urgent: false,
    vacancies: 8,
    experience: 1,
    details: [
      {
        desc: "Wedding and special event chauffeur services.",
        requirements:
          "Excellent presentation\nEvent experience\nFlexible schedule\nAttention to detail",
      },
    ],
    vehicleRequirements: { vehicleType: ["sedan", "suv"], minYear: 2018 },
    schedule: "on_demand",
    workingHours: {
      startTime: "06:00",
      endTime: "23:00",
      daysOfWeek: ["Friday", "Saturday", "Sunday"],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 22,
      languages: ["English", "Kinyarwanda"],
      skills: ["Event Management", "Photography"],
      background_check: false,
      drug_test: false,
    },
    benefits: [
      "Event bonuses",
      "Flexible schedule",
      "Networking opportunities",
    ],
    status: "active",
  },
  {
    jobTitle: "Construction Site Driver",
    jobType: "contract",
    category: "goods_transport",
    location: "Kigali Heights Construction Site",
    coordinates: { type: "Point", coordinates: [30.1156, -1.9706] },
    salary: 130000,
    salaryType: "monthly",
    priority: "high",
    featured: false,
    urgent: true,
    vacancies: 5,
    experience: 2,
    details: [
      {
        desc: "Construction site driver for material transport and equipment movement.",
        requirements:
          "Construction site experience\nHeavy machinery familiarity\nSafety protocol knowledge\nPhysical fitness",
      },
    ],
    vehicleRequirements: { vehicleType: ["truck"], minYear: 2015 },
    schedule: "fixed",
    workingHours: {
      startTime: "06:00",
      endTime: "16:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["C"],
      minimumAge: 23,
      languages: ["English", "Kinyarwanda"],
      skills: ["Construction Safety", "Heavy Equipment"],
      background_check: true,
      drug_test: true,
    },
    benefits: [
      "Safety equipment",
      "Construction training",
      "Overtime opportunities",
      "Safety bonuses",
    ],
    status: "active",
  },
  {
    jobTitle: "E-commerce Delivery Driver",
    jobType: "full-time",
    category: "delivery",
    location: "Kigali E-commerce Hub",
    coordinates: { type: "Point", coordinates: [30.0694, -1.9536] },
    salary: 95000,
    salaryType: "monthly",
    priority: "high",
    featured: true,
    urgent: true,
    vacancies: 20,
    experience: 1,
    details: [
      {
        desc: "E-commerce package delivery driver for online shopping platforms.",
        requirements:
          "Smartphone proficiency\nPackage handling experience\nCustomer service skills\nTime management",
      },
    ],
    vehicleRequirements: { vehicleType: ["motorcycle", "van"], minYear: 2014 },
    schedule: "flexible",
    workingHours: {
      startTime: "08:00",
      endTime: "18:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["A", "B"],
      minimumAge: 20,
      languages: ["English", "Kinyarwanda"],
      skills: ["Technology", "Package Handling"],
      background_check: false,
      drug_test: false,
    },
    benefits: [
      "Technology training",
      "Performance incentives",
      "Delivery bonuses",
      "Phone allowance",
    ],
    status: "active",
  },
  {
    jobTitle: "Hotel Guest Transport",
    jobType: "part-time",
    category: "chauffeur",
    location: "Kigali Marriott Hotel",
    coordinates: { type: "Point", coordinates: [30.0599, -1.9441] },
    salary: 65000,
    salaryType: "monthly",
    priority: "normal",
    featured: false,
    urgent: false,
    vacancies: 6,
    experience: 1,
    details: [
      {
        desc: "Hotel guest transport driver for airport transfers and city tours.",
        requirements:
          "Hospitality experience\nProfessional appearance\nTourism knowledge\nMultilingual preferred",
      },
    ],
    vehicleRequirements: { vehicleType: ["sedan"], minYear: 2017 },
    schedule: "shifts",
    workingHours: {
      startTime: "05:00",
      endTime: "22:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 22,
      languages: ["English", "Kinyarwanda", "French"],
      skills: ["Hospitality", "Tourism"],
      background_check: true,
      drug_test: false,
    },
    benefits: [
      "Hospitality training",
      "Tips",
      "Hotel discounts",
      "Language bonuses",
    ],
    status: "active",
  },
  {
    jobTitle: "Intercity Bus Driver",
    jobType: "full-time",
    category: "passenger_transport",
    location: "Nyabugogo Bus Terminal",
    coordinates: { type: "Point", coordinates: [30.0588, -1.9756] },
    salary: 185000,
    salaryType: "monthly",
    priority: "normal",
    featured: true,
    urgent: false,
    vacancies: 3,
    experience: 4,
    details: [
      {
        desc: "Intercity bus driver for routes between major Rwandan cities.",
        requirements:
          "Public transport license\nLong-distance driving experience\nPassenger safety certification\nRoute familiarity",
      },
    ],
    vehicleRequirements: { vehicleType: ["bus"], minYear: 2016 },
    schedule: "shifts",
    workingHours: {
      startTime: "05:00",
      endTime: "20:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    requirements: {
      licenseType: ["D"],
      minimumAge: 26,
      languages: ["English", "Kinyarwanda"],
      skills: ["Public Transport", "Route Knowledge"],
      background_check: true,
      drug_test: true,
    },
    benefits: [
      "Route bonuses",
      "Health insurance",
      "Pension plan",
      "Safety training",
    ],
    status: "active",
  },
  {
    jobTitle: "Farm Produce Transport",
    jobType: "temporary",
    category: "goods_transport",
    location: "Rural Agricultural Areas",
    coordinates: { type: "Point", coordinates: [29.8739, -1.9536] },
    salary: 85000,
    salaryType: "monthly",
    priority: "normal",
    featured: false,
    urgent: false,
    vacancies: 10,
    experience: 1,
    details: [
      {
        desc: "Agricultural produce transport from farms to markets and processing centers.",
        requirements:
          "Rural driving experience\nEarly morning availability\nPhysical strength for loading\nAgricultural knowledge helpful",
      },
    ],
    vehicleRequirements: { vehicleType: ["truck", "pickup"], minYear: 2012 },
    schedule: "on_demand",
    workingHours: {
      startTime: "04:00",
      endTime: "12:00",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    requirements: {
      licenseType: ["B", "C"],
      minimumAge: 21,
      languages: ["Kinyarwanda", "English"],
      skills: ["Rural Navigation", "Agricultural Knowledge"],
      background_check: false,
      drug_test: false,
    },
    benefits: [
      "Seasonal employment",
      "Fresh produce access",
      "Rural experience",
      "Physical fitness",
    ],
    status: "active",
  },
];

const comprehensiveCompaniesData = [
  {
    name: "Kigali Transport Co.",
    email: "info@kigalitransport.rw",
    password: "Password123!",
    contact: "+250788123456",
    location: "Kigali, Rwanda",
    about:
      "Leading transportation company in Rwanda providing professional taxi and ride-sharing services.",
    accountType: "company",
  },
  {
    name: "Swift Delivery Rwanda",
    email: "info@swiftdelivery.rw",
    password: "Password123!",
    contact: "+250788234567",
    location: "Gasabo District, Rwanda",
    about:
      "Fast and reliable delivery services across Rwanda with motorcycle and van delivery options.",
    accountType: "company",
  },
  {
    name: "Executive Transport Ltd",
    email: "info@executivetransport.rw",
    password: "Password123!",
    contact: "+250788345678",
    location: "Nyarugenge District, Rwanda",
    about:
      "Premium corporate transportation services for executives and VIP clients.",
    accountType: "company",
  },
  {
    name: "Rwanda Logistics Solutions",
    email: "contact@rwandalogistics.com",
    password: "Password123!",
    contact: "+250788456789",
    location: "Kicukiro District, Rwanda",
    about:
      "Comprehensive logistics and freight transportation services across East Africa.",
    accountType: "company",
  },
  {
    name: "Safari Tours & Transport",
    email: "bookings@safaritours.rw",
    password: "Password123!",
    contact: "+250788567890",
    location: "Musanze, Rwanda",
    about:
      "Premier tour operator providing safari and mountain gorilla tour transportation services.",
    accountType: "company",
  },
  {
    name: "City Bus Services",
    email: "operations@citybus.rw",
    password: "Password123!",
    contact: "+250788678901",
    location: "Nyabugogo, Kigali",
    about:
      "Public transportation services connecting major cities and districts in Rwanda.",
    accountType: "company",
  },
  {
    name: "MedTransport Rwanda",
    email: "emergency@medtransport.rw",
    password: "Password123!",
    contact: "+250788789012",
    location: "Kigali Medical District",
    about:
      "Specialized medical transportation and emergency ambulance services.",
    accountType: "company",
  },
  {
    name: "QuickMove Services",
    email: "hello@quickmove.rw",
    password: "Password123!",
    contact: "+250788890123",
    location: "Remera, Gasabo",
    about: "Professional moving and relocation services for homes and offices.",
    accountType: "company",
  },
  {
    name: "FoodFast Delivery",
    email: "support@foodfast.rw",
    password: "Password123!",
    contact: "+250788901234",
    location: "Kigali City Center",
    about:
      "On-demand food delivery service connecting restaurants with customers.",
    accountType: "company",
  },
  {
    name: "Airport Shuttle Pro",
    email: "reservations@airportshuttle.rw",
    password: "Password123!",
    contact: "+250789012345",
    location: "Kigali International Airport",
    about:
      "Professional airport transfer and shuttle services for travelers and businesses.",
    accountType: "company",
  },
];

const comprehensiveUsersData = [
  {
    firstName: "Jean",
    lastName: "Uwimana",
    email: "jean.uwimana@gmail.com",
    password: "Password123!",
    contact: "+250788111111",
    location: "Kigali, Rwanda",
    accountType: "user",
    jobTitle: "Professional Driver",
    aboutMe: "Experienced driver with 5 years in the transportation industry.",
  },
  {
    firstName: "Marie",
    lastName: "Mukamana",
    email: "marie.mukamana@gmail.com",
    password: "Password123!",
    contact: "+250788222222",
    location: "Gasabo District, Rwanda",
    accountType: "driver",
    jobTitle: "Delivery Driver",
    aboutMe:
      "Reliable delivery driver specializing in motorcycle delivery services.",
  },
  {
    firstName: "David",
    lastName: "Niyonsenga",
    email: "david.niyonsenga@gmail.com",
    password: "Password123!",
    contact: "+250788333333",
    location: "Kicukiro District, Rwanda",
    accountType: "driver",
    jobTitle: "Logistics Driver",
    aboutMe: "Heavy vehicle operator with experience in cargo transport.",
  },
  {
    firstName: "Grace",
    lastName: "Uwimpuhwe",
    email: "grace.uwimpuhwe@gmail.com",
    password: "Password123!",
    contact: "+250788444444",
    location: "Nyarugenge District, Rwanda",
    accountType: "driver",
    jobTitle: "Taxi Driver",
    aboutMe: "Customer-focused taxi driver with excellent city knowledge.",
  },
  {
    firstName: "Patrick",
    lastName: "Habimana",
    email: "patrick.habimana@gmail.com",
    password: "Password123!",
    contact: "+250788555555",
    location: "Musanze, Rwanda",
    accountType: "driver",
    jobTitle: "Tour Guide Driver",
    aboutMe: "Tourism expert with multilingual skills and wildlife knowledge.",
  },
  {
    firstName: "Agnes",
    lastName: "Nyirahabimana",
    email: "agnes.nyirahabimana@gmail.com",
    password: "Password123!",
    contact: "+250788666666",
    location: "Remera, Gasabo, Rwanda",
    accountType: "user",
    jobTitle: "Executive Assistant",
    aboutMe:
      "Seeking reliable transportation for business meetings and events.",
  },
  {
    firstName: "Emmanuel",
    lastName: "Bizimungu",
    email: "emmanuel.bizimungu@gmail.com",
    password: "Password123!",
    contact: "+250788777777",
    location: "Kigali Heights, Rwanda",
    accountType: "driver",
    jobTitle: "Construction Driver",
    aboutMe:
      "Experienced in construction site operations and heavy machinery transport.",
  },
  {
    firstName: "Immaculee",
    lastName: "Uwizeyimana",
    email: "immaculee.uwizeyimana@gmail.com",
    password: "Password123!",
    contact: "+250788888888",
    location: "Kimihurura, Rwanda",
    accountType: "user",
    jobTitle: "Healthcare Worker",
    aboutMe:
      "Medical professional requiring reliable transportation for patient visits.",
  },
  {
    firstName: "Claude",
    lastName: "Nsanzimana",
    email: "claude.nsanzimana@gmail.com",
    password: "Password123!",
    contact: "+250788999999",
    location: "Nyabugogo, Rwanda",
    accountType: "driver",
    jobTitle: "Bus Driver",
    aboutMe: "Public transport driver with passenger safety certification.",
  },
  {
    firstName: "Julienne",
    lastName: "Mukantwari",
    email: "julienne.mukantwari@gmail.com",
    password: "Password123!",
    contact: "+250789000000",
    location: "Gikondo, Rwanda",
    accountType: "driver",
    jobTitle: "Emergency Driver",
    aboutMe: "Emergency response driver with first aid certification.",
  },
  {
    firstName: "Damascene",
    lastName: "Uwineza",
    email: "damascene.uwineza@gmail.com",
    password: "Password123!",
    contact: "+250789111111",
    location: "Gisozi, Rwanda",
    accountType: "driver",
    jobTitle: "Food Delivery Driver",
    aboutMe:
      "Fast and efficient food delivery specialist with excellent customer ratings.",
  },
  {
    firstName: "Esperance",
    lastName: "Nyiramana",
    email: "esperance.nyiramana@gmail.com",
    password: "Password123!",
    contact: "+250789222222",
    location: "Kabuga, Rwanda",
    accountType: "user",
    jobTitle: "Business Owner",
    aboutMe:
      "Small business owner needing reliable goods transportation services.",
  },
  {
    firstName: "Faustin",
    lastName: "Rukundo",
    email: "faustin.rukundo@gmail.com",
    password: "Password123!",
    contact: "+250789333333",
    location: "Kimisagara, Rwanda",
    accountType: "driver",
    jobTitle: "Chauffeur",
    aboutMe:
      "Professional chauffeur with VIP client experience and security training.",
  },
  {
    firstName: "Vestine",
    lastName: "Uwimana",
    email: "vestine.uwimana@gmail.com",
    password: "Password123!",
    contact: "+250789444444",
    location: "Kacyiru, Rwanda",
    accountType: "user",
    jobTitle: "Event Planner",
    aboutMe:
      "Event coordinator requiring wedding and special occasion transportation.",
  },
  {
    firstName: "Theogene",
    lastName: "Nsengimana",
    email: "theogene.nsengimana@gmail.com",
    password: "Password123!",
    contact: "+250789555555",
    location: "Rwamagana, Rwanda",
    accountType: "driver",
    jobTitle: "Farm Transport Driver",
    aboutMe: "Agricultural transport specialist with rural area expertise.",
  },
];

const comprehensiveSeed = async () => {
  try {
    console.log("🌱 Starting comprehensive database seeding...");

    await dbConnection();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Jobs.deleteMany({});
    await Companies.deleteMany({});
    await Users.deleteMany({});

    // Create companies
    console.log("🏢 Creating companies...");
    const companies = [];
    for (let companyData of comprehensiveCompaniesData) {
      const hashedPassword = await bcrypt.hash(companyData.password, 10);
      const company = new Companies({
        ...companyData,
        password: hashedPassword,
        profileUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          companyData.name
        )}`,
        jobPosts: [], // Initialize empty job posts array
      });
      const savedCompany = await company.save();
      companies.push(savedCompany);
      console.log(`✅ Created company: ${companyData.name}`);
    }

    // Create users
    console.log("👥 Creating users...");
    for (let userData of comprehensiveUsersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new Users({
        ...userData,
        password: hashedPassword,
        profileUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}${userData.lastName}`,
      });
      await user.save();
      console.log(
        `✅ Created user: ${userData.firstName} ${userData.lastName}`
      );
    }

    // Create jobs
    console.log("💼 Creating jobs...");
    for (let i = 0; i < comprehensiveJobsData.length; i++) {
      const jobData = comprehensiveJobsData[i];
      const randomCompany = companies[i % companies.length];

      const job = new Jobs({
        ...jobData,
        company: randomCompany._id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        analytics: {
          views: Math.floor(Math.random() * 200),
          applications: Math.floor(Math.random() * 50),
        },
      });

      const savedJob = await job.save();

      // Update company's jobPosts array
      randomCompany.jobPosts.push(savedJob._id);
      await randomCompany.save();

      console.log(`✅ Created job: ${jobData.jobTitle}`);
    }

    console.log("🎉 Comprehensive seeding completed successfully!");
    console.log(
      `📊 Created: ${companies.length} companies, ${comprehensiveUsersData.length} users, ${comprehensiveJobsData.length} jobs`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error in comprehensive seeding:", error);
    process.exit(1);
  }
};

comprehensiveSeed();
