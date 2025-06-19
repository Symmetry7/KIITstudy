// Mock authentication service for demo mode
// This provides a realistic demo experience without Firebase

export interface MockUser {
  uid: string;
  email: string;
  name: string;
  rollNumber: string;
  course: string;
  year: string;
  department: string;
  isVerified: boolean;
  totalStudyHours: number;
  streak: number;
  rank: number;
  friends: string[];
  groups: string[];
  createdAt: Date;
  lastActive: Date;
}

// In-memory user storage for demo
const demoUsers: { [email: string]: MockUser } = {};

// Demo login function
export const demoLogin = async (
  email: string,
  password: string,
): Promise<MockUser> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Basic validation
  if (!email.includes("@kiit.ac.in")) {
    throw new Error("Please use your KIIT email address (@kiit.ac.in)");
  }

  if (password.length < 6) {
    throw new Error(
      "Invalid email or password. Please check your credentials and try again.",
    );
  }

  // Check if user exists, if not create a demo user
  if (!demoUsers[email]) {
    demoUsers[email] = createDemoUser(email);
  }

  return demoUsers[email];
};

// Demo signup function
export const demoSignup = async (
  email: string,
  password: string,
  name: string,
  rollNumber: string,
): Promise<MockUser> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Check if user already exists
  if (demoUsers[email]) {
    throw new Error(
      "This email is already registered. Please use a different email or try logging in.",
    );
  }

  // Create new demo user
  const user = createDemoUser(email, name, rollNumber);
  demoUsers[email] = user;

  return user;
};

// Create a demo user with realistic data
function createDemoUser(
  email: string,
  name?: string,
  rollNumber?: string,
): MockUser {
  const uid = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const finalRollNumber = rollNumber || "2405099";
  const finalName =
    name ||
    email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // Extract course info from roll number
  const year = finalRollNumber.substring(0, 2);
  const branchCode = finalRollNumber.substring(2, 4);

  const branchMap: { [key: string]: { course: string; department: string } } = {
    "05": {
      course: "B.Tech CSE",
      department: "Computer Science & Engineering",
    },
    "15": {
      course: "B.Tech CSE",
      department: "Computer Science & Engineering",
    },
    "41": {
      course: "B.Tech CSE",
      department: "Computer Science & Engineering",
    },
    "01": { course: "B.Tech IT", department: "Information Technology" },
    "02": { course: "B.Tech ECE", department: "Electronics & Communication" },
    "03": { course: "B.Tech EE", department: "Electrical Engineering" },
  };

  const courseInfo = branchMap[branchCode] || {
    course: "B.Tech CSE",
    department: "Computer Science & Engineering",
  };

  return {
    uid,
    email,
    name: finalName,
    rollNumber: finalRollNumber,
    course: courseInfo.course,
    year: `20${year} Batch`,
    department: courseInfo.department,
    isVerified: true,
    totalStudyHours: Math.floor(Math.random() * 200) + 50,
    streak: Math.floor(Math.random() * 15) + 1,
    rank: Math.floor(Math.random() * 100) + 1,
    friends: [],
    groups: [],
    createdAt: new Date(),
    lastActive: new Date(),
  };
}

// Get current demo user from localStorage
export const getCurrentDemoUser = (): MockUser | null => {
  try {
    const userData = localStorage.getItem("kiit_user");
    const isAuth = localStorage.getItem("kiit_auth");

    if (isAuth === "true" && userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error getting demo user:", error);
  }

  return null;
};

// Demo logout
export const demoLogout = () => {
  localStorage.removeItem("kiit_auth");
  localStorage.removeItem("kiit_user");
};
