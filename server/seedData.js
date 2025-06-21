import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dbConnection from "./dbConfig/dbConnection.js";
import Users from "./models/userModel.js";
import Companies from "./models/companiesModel.js";
import Jobs from "./models/jobsModel.js";

dotenv.config();

// Sample data arrays
const jobTitles = [
  "Professional Taxi Driver",
  "Delivery Driver",
  "Corporate Chauffeur",
  "School Bus Driver",
  "Truck Driver (Long Distance)",
  "Uber/Bolt Driver",
  "Motorcycle Taxi Driver",
  "Logistics Coordinator",
  "Fleet Manager",
  "Tour Guide Driver",
  "Medical Transport Driver",
  "Food Delivery Specialist",
  "Package Delivery Driver",
  "Construction Vehicle Operator",
  "Public Transport Driver",
];

const companyNames = [
  "Kigali Transport Co.",
  "Rwanda Express Delivery",
  "Executive Transport Ltd",
  "Safe Schools Transport",
  "Rwanda Logistics Hub",
  "City Ride Services",
  "Premier Chauffeur Services",
  "Quick Delivery Rwanda",
  "Mountain View Transport",
  "Horizon Logistics",
  "Swift Ride Rwanda",
  "Elite Driver Services",
  "Green Transport Solutions",
  "Capital City Cabs",
  "Unity Transport Group",
];

const locations = [
  "Kigali, Rwanda",
  "Gasabo District, Rwanda",
  "Kicukiro District, Rwanda",
  "Nyarugenge District, Rwanda",
  "Musanze, Rwanda",
  "Huye, Rwanda",
  "Rubavu, Rwanda",
  "Kayonza, Rwanda",
  "Muhanga, Rwanda",
  "Rwamagana, Rwanda",
];

const jobCategories = [
  "ride_sharing",
  "delivery",
  "logistics",
  "transport",
  "chauffeur",
  "moving_services",
  "tour_guide",
  "emergency_transport",
  "goods_transport",
  "passenger_transport",
];

const descriptions = [
  "Join our team and be part of Rwanda's growing transportation industry. We offer competitive compensation and excellent growth opportunities for professional drivers.",
  "We are looking for reliable drivers with excellent customer service skills and a clean driving record. Full training provided.",
  "Seeking experienced drivers for our premium transportation service. Must maintain highest standards of professionalism and vehicle care.",
  "Great opportunity for drivers looking for flexible hours and competitive pay. Vehicle maintenance and fuel support provided.",
  "Join our expanding fleet and enjoy steady work with performance bonuses. Professional development opportunities available.",
  "Looking for dedicated drivers to join our team. Excellent benefits package and growth opportunities in a supportive environment.",
];

const requirements = [
  "Valid driving license with minimum 2 years experience\nClean driving record with no major violations\nExcellent customer service skills\nBasic English and Kinyarwanda proficiency",
  "Professional driving license\n3+ years of driving experience\nGood knowledge of Kigali roads\nReliable and punctual\nPhysical fitness required",
  "Valid license and clean record\nExperience with GPS navigation\nCustomer service oriented\nTime management skills\nOwn smartphone required",
  "Commercial driving license\nExperience with heavy vehicles\nPhysical fitness and good health\nKnowledge of road safety regulations\nFlexible schedule availability",
];

// Generate random job data
const generateJobData = (companyId) => {
  const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  const category =
    jobCategories[Math.floor(Math.random() * jobCategories.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const salary = Math.floor(Math.random() * 200000) + 100000; // 100k - 300k
  const salaryTypes = ["monthly", "daily", "per_trip", "hourly"];
  const salaryType =
    salaryTypes[Math.floor(Math.random() * salaryTypes.length)];
  const jobTypes = ["full-time", "part-time", "contract", "temporary"];
  const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
  const priorities = ["normal", "high", "urgent"];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const vehicleTypes = [
    "sedan",
    "suv",
    "truck",
    "motorcycle",
    "bus",
    "van",
    "pickup",
  ];
  const scheduleTypes = ["flexible", "fixed", "shifts", "on_demand"];

  return {
    jobTitle: title,
    jobType: jobType,
    location: location,
    salary: salary,
    salaryType: salaryType,
    category: category,
    priority: priority,
    featured: Math.random() > 0.7, // 30% chance of being featured
    urgent: Math.random() > 0.85, // 15% chance of being urgent
    vacancies: Math.floor(Math.random() * 5) + 1,
    experience: Math.floor(Math.random() * 5),
    company: companyId,
    details: [
      {
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        requirements:
          requirements[Math.floor(Math.random() * requirements.length)],
      },
    ],
    vehicleRequirements: {
      vehicleType: [
        vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      ],
      minYear: 2015 + Math.floor(Math.random() * 8),
      features: [],
    },
    requirements: {
      licenseType: ["B"],
      minimumAge: 18 + Math.floor(Math.random() * 5),
      languages: ["English", "Kinyarwanda"],
      skills: ["Customer Service", "Navigation"],
      background_check: Math.random() > 0.5,
      drug_test: Math.random() > 0.7,
    },
    schedule: scheduleTypes[Math.floor(Math.random() * scheduleTypes.length)],
    workingHours: {
      startTime: "08:00",
      endTime: "17:00",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    commission:
      Math.random() > 0.5
        ? {
            percentage: Math.floor(Math.random() * 10) + 5,
            baseAmount: 50000,
          }
        : undefined,
    benefits: [
      "Health insurance",
      "Fuel allowance",
      "Performance bonus",
      "Training provided",
      "Flexible hours",
    ].slice(0, Math.floor(Math.random() * 3) + 2),
    expiresAt: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within 30 days
    analytics: {
      views: Math.floor(Math.random() * 200),
      applications: Math.floor(Math.random() * 30),
    },
    status: "active",
  };
};

// Generate random company data
const generateCompanyData = (index) => {
  const name = companyNames[Math.floor(Math.random() * companyNames.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  return {
    name: name,
    email: `info${index}@${name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")}.rw`,
    password: "Password123!",
    contact: `+250${Math.floor(Math.random() * 900000000) + 100000000}`,
    location: location,
    profileUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}`,
    about: `${name} is a leading transportation company in Rwanda, committed to providing excellent service and career opportunities for drivers.`,
    accountType: "company",
  };
};

// Generate random user data
const generateUserData = (accountType = "user", index = 0) => {
  const firstNames = [
    "Jean",
    "Marie",
    "Pierre",
    "Alice",
    "David",
    "Sarah",
    "Emmanuel",
    "Grace",
    "Patrick",
    "Diane",
  ];
  const lastNames = [
    "Uwimana",
    "Mukamana",
    "Niyonsenga",
    "Ingabire",
    "Mutabazi",
    "Nyirahabimana",
    "Habimana",
    "Umukunzi",
    "Bizimana",
    "Uwayezu",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@gmail.com`,
    password: "Password123!",
    contact: `+250${Math.floor(Math.random() * 900000000) + 100000000}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    profileUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    accountType: accountType,
    jobTitle:
      accountType === "driver"
        ? jobTitles[Math.floor(Math.random() * jobTitles.length)]
        : undefined,
    aboutMe: `Professional ${accountType} with experience in the transportation industry.`,
  };
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await dbConnection();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      Users.deleteMany({}),
      Companies.deleteMany({}),
      Jobs.deleteMany({}),
    ]);

    // Create companies
    console.log("🏢 Creating companies...");
    const companies = [];
    for (let i = 0; i < 10; i++) {
      const companyData = generateCompanyData(i);
      const hashedPassword = await bcrypt.hash(companyData.password, 10);

      const company = new Companies({
        ...companyData,
        password: hashedPassword,
      });

      const savedCompany = await company.save();
      companies.push(savedCompany);
      console.log(`✅ Created company: ${companyData.name}`);
    }

    // Create regular users
    console.log("👥 Creating users...");
    const users = [];
    for (let i = 0; i < 15; i++) {
      const userData = generateUserData("user", i);
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new Users({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      users.push(savedUser);
      console.log(
        `✅ Created user: ${userData.firstName} ${userData.lastName}`
      );
    }

    // Create driver users
    console.log("🚗 Creating drivers...");
    for (let i = 0; i < 10; i++) {
      const driverData = generateUserData("driver", i);
      const hashedPassword = await bcrypt.hash(driverData.password, 10);

      const driver = new Users({
        ...driverData,
        password: hashedPassword,
      });

      const savedDriver = await driver.save();
      users.push(savedDriver);
      console.log(
        `✅ Created driver: ${driverData.firstName} ${driverData.lastName}`
      );
    }

    // Create job posts
    console.log("💼 Creating job posts...");
    const jobs = [];
    for (let i = 0; i < 25; i++) {
      const randomCompany =
        companies[Math.floor(Math.random() * companies.length)];
      const jobData = generateJobData(randomCompany._id);

      const job = new Jobs(jobData);
      const savedJob = await job.save();
      jobs.push(savedJob);
      console.log(
        `✅ Created job: ${jobData.jobTitle} at ${randomCompany.name}`
      );
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Job Posts: ${jobs.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding script
seedDatabase();
