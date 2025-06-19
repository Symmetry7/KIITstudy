import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";
import { demoLogin, demoSignup, MockUser } from "./mockAuth";

// Check if we're in demo mode (Firebase not properly configured)
const isDemoMode = () => {
  return !isFirebaseConfigured();
};

export interface KIITUser {
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
  createdAt: any;
  lastActive: any;
}

// Validate KIIT email format
export const validateKIITEmail = (email: string): boolean => {
  // Handle common input issues
  if (!email || typeof email !== "string") {
    return false;
  }

  // Trim whitespace and convert to lowercase for domain validation
  const cleanEmail = email.trim().toLowerCase();

  // KIIT email regex - more permissive for the local part, strict for domain
  const kiitEmailRegex = /^[a-zA-Z0-9._%+-]+@kiit\.ac\.in$/i;
  return kiitEmailRegex.test(cleanEmail);
};

// Validate KIIT roll number format
export const validateKIITRollNumber = (rollNumber: string): boolean => {
  // KIIT roll number format: YYXXXXX (Year + 5 digits)
  // Examples: 2405099, 2305912, 2415122, etc.
  const rollRegex = /^(19|20|21|22|23|24|25|26|27|28|29)\d{5}$/;
  return rollRegex.test(rollNumber);
};

// Extract course and year from roll number
export const extractCourseInfo = (
  rollNumber: string,
): { course: string; year: string; department: string } => {
  if (!validateKIITRollNumber(rollNumber)) {
    throw new Error("Invalid KIIT roll number format");
  }

  const year = rollNumber.substring(0, 2);
  const branchCode = rollNumber.substring(2, 4); // Take next 2 digits for branch

  // Map branch codes to courses and departments (simplified)
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
    "04": { course: "B.Tech ME", department: "Mechanical Engineering" },
    "06": { course: "B.Tech CE", department: "Civil Engineering" },
    "07": {
      course: "B.Tech ETC",
      department: "Electronics & Telecommunication",
    },
    "08": {
      course: "B.Tech CSE (AI&ML)",
      department: "Computer Science & Engineering",
    },
    "09": {
      course: "B.Tech CSE (Cyber Security)",
      department: "Computer Science & Engineering",
    },
  };

  const courseInfo = branchMap[branchCode] || {
    course: "B.Tech",
    department: "Engineering",
  };

  return {
    course: courseInfo.course,
    year: `20${year} Batch`,
    department: courseInfo.department,
  };
};

// Helper function to convert Firebase errors to user-friendly messages
const getAuthErrorMessage = (error: any): string => {
  // If it's already a user-friendly message, return as is
  if (error?.message && !error?.code) {
    return error.message;
  }

  if (!error?.code) {
    return "Unable to connect to server. Please check your internet connection.";
  }

  switch (error.code) {
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "Service temporarily unavailable. Please try again later.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please use a different email or try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid KIIT email address.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password with at least 8 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few minutes before trying again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support.";
    default:
      return "Authentication failed. Please try again later.";
  }
};

// Sign up with KIIT credentials
export const signUpWithKIIT = async (
  email: string,
  password: string,
  name: string,
  rollNumber: string,
): Promise<KIITUser> => {
  try {
    // Normalize email input
    const normalizedEmail = email.trim().toLowerCase();

    // Validate KIIT email
    if (!validateKIITEmail(normalizedEmail)) {
      console.log("Email validation failed for:", normalizedEmail);
      throw new Error(
        `Please use your KIIT email address (@kiit.ac.in). Make sure your email ends with @kiit.ac.in`,
      );
    }

    // Validate roll number
    if (!validateKIITRollNumber(rollNumber)) {
      throw new Error("Please enter a valid KIIT roll number");
    }

    // In demo mode, use mock authentication
    if (isDemoMode()) {
      const mockUser = await demoSignup(
        normalizedEmail,
        password,
        name,
        rollNumber,
      );
      // Convert MockUser to KIITUser format
      return {
        uid: mockUser.uid,
        email: mockUser.email,
        name: mockUser.name,
        rollNumber: mockUser.rollNumber,
        course: mockUser.course,
        year: mockUser.year,
        department: mockUser.department,
        isVerified: mockUser.isVerified,
        totalStudyHours: mockUser.totalStudyHours,
        streak: mockUser.streak,
        rank: mockUser.rank,
        friends: mockUser.friends,
        groups: mockUser.groups,
        createdAt: mockUser.createdAt,
        lastActive: mockUser.lastActive,
      };
    }

    // Only execute Firebase code if properly configured
    if (!auth || !db) {
      throw new Error(
        "Unable to connect to server. Please check your internet connection.",
      );
    }

    // Check if roll number already exists
    const rollDoc = await getDoc(doc(db, "rollNumbers", rollNumber));
    if (rollDoc.exists()) {
      throw new Error("This roll number is already registered");
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName: name });

    // Extract course info from roll number
    const courseInfo = extractCourseInfo(rollNumber);

    // Create user document
    const kiitUser: KIITUser = {
      uid: user.uid,
      email: user.email!,
      name,
      rollNumber,
      course: courseInfo.course,
      year: courseInfo.year,
      department: courseInfo.department,
      isVerified: false, // Will be verified by admin/email
      totalStudyHours: 0,
      streak: 0,
      rank: 0,
      friends: [],
      groups: [],
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };

    // Save user data
    await setDoc(doc(db, "users", user.uid), kiitUser);

    // Reserve roll number
    await setDoc(doc(db, "rollNumbers", rollNumber), {
      uid: user.uid,
      email: user.email,
      registeredAt: serverTimestamp(),
    });

    return kiitUser;
  } catch (error: any) {
    // Convert Firebase errors to user-friendly messages
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign in with KIIT credentials
export const signInWithKIIT = async (
  email: string,
  password: string,
): Promise<KIITUser> => {
  try {
    // Normalize email input
    const normalizedEmail = email.trim().toLowerCase();

    // Validate KIIT email
    if (!validateKIITEmail(normalizedEmail)) {
      console.log("Email validation failed for:", normalizedEmail);
      throw new Error(
        `Please use your KIIT email address (@kiit.ac.in). Make sure your email ends with @kiit.ac.in`,
      );
    }

    // In demo mode, use mock authentication
    if (isDemoMode()) {
      const mockUser = await demoLogin(normalizedEmail, password);
      // Convert MockUser to KIITUser format
      return {
        uid: mockUser.uid,
        email: mockUser.email,
        name: mockUser.name,
        rollNumber: mockUser.rollNumber,
        course: mockUser.course,
        year: mockUser.year,
        department: mockUser.department,
        isVerified: mockUser.isVerified,
        totalStudyHours: mockUser.totalStudyHours,
        streak: mockUser.streak,
        rank: mockUser.rank,
        friends: mockUser.friends,
        groups: mockUser.groups,
        createdAt: mockUser.createdAt,
        lastActive: mockUser.lastActive,
      };
    }

    // Only execute Firebase code if properly configured
    if (!auth || !db) {
      throw new Error(
        "Unable to connect to server. Please check your internet connection.",
      );
    }

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );
    const user = userCredential.user;

    // Get user data
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("Account not found. Please sign up first.");
    }

    // Update last active
    await updateDoc(doc(db, "users", user.uid), {
      lastActive: serverTimestamp(),
    });

    return userDoc.data() as KIITUser;
  } catch (error: any) {
    // Convert Firebase errors to user-friendly messages
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  // Clear demo mode storage
  localStorage.removeItem("kiit_auth");
  localStorage.removeItem("kiit_user");

  if (auth && !isDemoMode()) {
    await signOut(auth);
  }
};

// Get current user data
export const getCurrentUserData = async (
  user: User,
): Promise<KIITUser | null> => {
  if (!user) return null;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) return null;

  return userDoc.data() as KIITUser;
};

// Update user study hours
export const updateStudyHours = async (
  uid: string,
  hoursToAdd: number,
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentHours = userDoc.data().totalStudyHours || 0;
    await updateDoc(userRef, {
      totalStudyHours: currentHours + hoursToAdd,
      lastActive: serverTimestamp(),
    });
  }
};
