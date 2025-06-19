import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

export interface StudyGroupParticipant {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  isStudying: boolean;
  studyTime: number;
  joinedAt: any;
  role: "admin" | "member";
}

// Demo mode check
const isDemoMode = () => !isFirebaseConfigured();

// Mock data for demo mode
const mockStudyGroups: StudyGroup[] = [
  {
    id: "demo-group-1",
    name: "DSA Marathon",
    subject: "Data Structures & Algorithms",
    description:
      "Intensive problem-solving session focusing on trees and graphs",
    adminId: "demo-admin-1",
    participants: [
      {
        uid: "demo-user-1",
        name: "Rahul Kumar",
        email: "rahul@kiit.ac.in",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech CSE",
        isStudying: true,
        studyTime: 145,
        joinedAt: new Date(),
        role: "admin",
      },
      {
        uid: "demo-user-2",
        name: "Priya Sharma",
        email: "priya@kiit.ac.in",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech CSE",
        isStudying: true,
        studyTime: 132,
        joinedAt: new Date(),
        role: "member",
      },
      {
        uid: "demo-user-3",
        name: "Arjun Patel",
        email: "arjun@kiit.ac.in",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech EE",
        isStudying: false,
        studyTime: 98,
        joinedAt: new Date(),
        role: "member",
      },
    ],
    pendingRequests: [],
    timer: {
      duration: 50,
      startTime: new Date(),
      isActive: true,
      type: "deep-focus",
    },
    settings: {
      isPrivate: false,
      requireApproval: false,
      maxParticipants: 20,
      allowChat: true,
    },
    stats: {
      totalSessions: 15,
      totalHours: 47,
      averageParticipants: 8,
    },
    createdAt: new Date(),
    lastActive: new Date(),
  },
  {
    id: "demo-group-2",
    name: "Calculus Problem Solving",
    subject: "Mathematics",
    description: "Working through integration and differentiation problems",
    adminId: "demo-admin-2",
    participants: [
      {
        uid: "demo-user-4",
        name: "Ananya Das",
        email: "ananya@kiit.ac.in",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech IT",
        isStudying: true,
        studyTime: 167,
        joinedAt: new Date(),
        role: "admin",
      },
      {
        uid: "demo-user-5",
        name: "Rohit Mehta",
        email: "rohit@kiit.ac.in",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech ME",
        isStudying: true,
        studyTime: 134,
        joinedAt: new Date(),
        role: "member",
      },
    ],
    pendingRequests: [],
    timer: {
      duration: 25,
      startTime: new Date(),
      isActive: true,
      type: "pomodoro",
    },
    settings: {
      isPrivate: false,
      requireApproval: false,
      maxParticipants: 15,
      allowChat: true,
    },
    stats: {
      totalSessions: 8,
      totalHours: 23,
      averageParticipants: 6,
    },
    createdAt: new Date(),
    lastActive: new Date(),
  },
];

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  adminId: string;
  participants: StudyGroupParticipant[];
  pendingRequests: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    course: string;
    requestedAt: any;
  }[];
  timer: {
    duration: number; // in minutes
    startTime: any;
    isActive: boolean;
    type: "pomodoro" | "deep-focus" | "sprint";
  };
  settings: {
    isPrivate: boolean;
    requireApproval: boolean;
    maxParticipants: number;
    allowChat: boolean;
  };
  stats: {
    totalSessions: number;
    totalHours: number;
    averageParticipants: number;
  };
  createdAt: any;
  lastActive: any;
}

export interface FriendRequest {
  id: string;
  fromUid: string;
  toUid: string;
  fromName: string;
  fromEmail: string;
  fromAvatar: string;
  fromCourse: string;
  status: "pending" | "accepted" | "rejected";
  sentAt: any;
}

// Create a new study group
export const createStudyGroup = async (
  groupData: Omit<StudyGroup, "id" | "createdAt" | "lastActive">,
): Promise<string> => {
  const docRef = doc(collection(db, "studyGroups"));
  const studyGroup: StudyGroup = {
    ...groupData,
    id: docRef.id,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  };

  await setDoc(docRef, studyGroup);
  return docRef.id;
};

// Get all active study groups (with active timers)
export const getActiveStudyGroups = async (): Promise<StudyGroup[]> => {
  if (isDemoMode()) {
    // Return mock data for demo mode
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    return mockStudyGroups.filter((group) => group.timer.isActive);
  }

  const q = query(
    collection(db, "studyGroups"),
    where("timer.isActive", "==", true),
    orderBy("lastActive", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudyGroup);
};

// Get study group by ID
export const getStudyGroup = async (
  groupId: string,
): Promise<StudyGroup | null> => {
  const docRef = doc(db, "studyGroups", groupId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as StudyGroup;
  }
  return null;
};

// Join study group directly (no approval needed)
export const joinGroup = async (
  groupId: string,
  userInfo: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    course: string;
  },
): Promise<void> => {
  if (isDemoMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find the group in mock data
    const group = mockStudyGroups.find((g) => g.id === groupId);
    if (!group) {
      throw new Error("Study group not found");
    }

    // Get current joined groups from localStorage
    const joinedGroupsKey = `joinedGroups_${userInfo.uid}`;
    const joinedGroups = JSON.parse(
      localStorage.getItem(joinedGroupsKey) || "[]",
    );

    // Check if user is already a participant
    if (joinedGroups.includes(groupId)) {
      throw new Error("You are already a member of this group");
    }

    // Check if group is full
    if (group.participants.length >= group.settings.maxParticipants) {
      throw new Error("Study group is full");
    }

    // Add to joined groups in localStorage
    joinedGroups.push(groupId);
    localStorage.setItem(joinedGroupsKey, JSON.stringify(joinedGroups));

    // Create participant object and add to the group in mockStudyGroups
    const newParticipant: StudyGroupParticipant = {
      uid: userInfo.uid,
      name: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.avatar,
      course: userInfo.course,
      isStudying: false,
      studyTime: 0,
      joinedAt: new Date(),
      role: "member",
    };

    // Add participant to the group
    group.participants.push(newParticipant);

    console.log(`Demo: ${userInfo.name} joined ${group.name} successfully`);
    return;
  }

  const groupRef = doc(db, "studyGroups", groupId);
  const group = await getDoc(groupRef);

  if (!group.exists()) {
    throw new Error("Study group not found");
  }

  const groupData = group.data() as StudyGroup;

  // Check if user is already a participant
  if (groupData.participants.some((p) => p.uid === userInfo.uid)) {
    throw new Error("You are already a member of this group");
  }

  // Check if group is full
  if (groupData.participants.length >= groupData.settings.maxParticipants) {
    throw new Error("Study group is full");
  }

  // Create participant object
  const newParticipant: StudyGroupParticipant = {
    uid: userInfo.uid,
    name: userInfo.name,
    email: userInfo.email,
    avatar: userInfo.avatar,
    course: userInfo.course,
    isStudying: false,
    studyTime: 0,
    joinedAt: serverTimestamp(),
    role: "member",
  };

  // Add to participants directly
  await updateDoc(groupRef, {
    participants: arrayUnion(newParticipant),
    lastActive: serverTimestamp(),
  });
};

// Approve join request (admin only)
export const approveJoinRequest = async (
  groupId: string,
  requestUid: string,
  adminUid: string,
): Promise<void> => {
  if (isDemoMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log(
      `Demo: Approved join request for user ${requestUid} in group ${groupId}`,
    );
    return;
  }

  const groupRef = doc(db, "studyGroups", groupId);
  const group = await getDoc(groupRef);

  if (!group.exists()) {
    throw new Error("Study group not found");
  }

  const groupData = group.data() as StudyGroup;

  // Check if user is admin
  if (groupData.adminId !== adminUid) {
    throw new Error("Only group admin can approve requests");
  }

  // Find the pending request
  const request = groupData.pendingRequests.find((r) => r.uid === requestUid);
  if (!request) {
    throw new Error("Join request not found");
  }

  // Create participant object
  const newParticipant: StudyGroupParticipant = {
    uid: request.uid,
    name: request.name,
    email: request.email,
    avatar: request.avatar,
    course: request.course,
    isStudying: false,
    studyTime: 0,
    joinedAt: serverTimestamp(),
    role: "member",
  };

  // Add to participants and remove from pending requests
  await updateDoc(groupRef, {
    participants: arrayUnion(newParticipant),
    pendingRequests: arrayRemove(request),
    lastActive: serverTimestamp(),
  });
};

// Reject join request (admin only)
export const rejectJoinRequest = async (
  groupId: string,
  requestUid: string,
  adminUid: string,
): Promise<void> => {
  if (isDemoMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(
      `Demo: Rejected join request for user ${requestUid} in group ${groupId}`,
    );
    return;
  }

  const groupRef = doc(db, "studyGroups", groupId);
  const group = await getDoc(groupRef);

  if (!group.exists()) {
    throw new Error("Study group not found");
  }

  const groupData = group.data() as StudyGroup;

  // Check if user is admin
  if (groupData.adminId !== adminUid) {
    throw new Error("Only group admin can reject requests");
  }

  // Find and remove the pending request
  const request = groupData.pendingRequests.find((r) => r.uid === requestUid);
  if (!request) {
    throw new Error("Join request not found");
  }

  await updateDoc(groupRef, {
    pendingRequests: arrayRemove(request),
  });
};

// Remove participant (admin only)
export const removeParticipant = async (
  groupId: string,
  participantUid: string,
  adminUid: string,
): Promise<void> => {
  const groupRef = doc(db, "studyGroups", groupId);
  const group = await getDoc(groupRef);

  if (!group.exists()) {
    throw new Error("Study group not found");
  }

  const groupData = group.data() as StudyGroup;

  // Check if user is admin
  if (groupData.adminId !== adminUid) {
    throw new Error("Only group admin can remove participants");
  }

  // Find and remove the participant
  const participant = groupData.participants.find(
    (p) => p.uid === participantUid,
  );
  if (!participant) {
    throw new Error("Participant not found");
  }

  await updateDoc(groupRef, {
    participants: arrayRemove(participant),
    lastActive: serverTimestamp(),
  });
};

// Start study timer
export const startStudyTimer = async (
  groupId: string,
  duration: number,
  type: "pomodoro" | "deep-focus" | "sprint",
): Promise<void> => {
  const groupRef = doc(db, "studyGroups", groupId);

  await updateDoc(groupRef, {
    "timer.duration": duration,
    "timer.startTime": serverTimestamp(),
    "timer.isActive": true,
    "timer.type": type,
    lastActive: serverTimestamp(),
  });
};

// Stop study timer
export const stopStudyTimer = async (groupId: string): Promise<void> => {
  const groupRef = doc(db, "studyGroups", groupId);

  await updateDoc(groupRef, {
    "timer.isActive": false,
    lastActive: serverTimestamp(),
  });
};

// Update participant study status
export const updateStudyStatus = async (
  groupId: string,
  participantUid: string,
  isStudying: boolean,
  studyTimeToAdd: number = 0,
): Promise<void> => {
  const groupRef = doc(db, "studyGroups", groupId);
  const group = await getDoc(groupRef);

  if (!group.exists()) {
    throw new Error("Study group not found");
  }

  const groupData = group.data() as StudyGroup;
  const participantIndex = groupData.participants.findIndex(
    (p) => p.uid === participantUid,
  );

  if (participantIndex === -1) {
    throw new Error("You are not a member of this group");
  }

  // Update participant
  const updatedParticipants = [...groupData.participants];
  updatedParticipants[participantIndex] = {
    ...updatedParticipants[participantIndex],
    isStudying,
    studyTime: updatedParticipants[participantIndex].studyTime + studyTimeToAdd,
  };

  await updateDoc(groupRef, {
    participants: updatedParticipants,
    lastActive: serverTimestamp(),
  });
};

// Send friend request
export const sendFriendRequest = async (
  fromUid: string,
  toUid: string,
  fromUserInfo: {
    name: string;
    email: string;
    avatar: string;
    course: string;
  },
): Promise<void> => {
  if (isDemoMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulate success
    console.log(
      `Demo: Friend request sent from ${fromUserInfo.name} to user ${toUid}`,
    );
    return;
  }

  // Check if request already exists
  const q = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid),
  );

  const existingRequests = await getDocs(q);
  if (!existingRequests.empty) {
    throw new Error("Friend request already sent");
  }

  // Create friend request
  const docRef = doc(collection(db, "friendRequests"));
  const friendRequest: FriendRequest = {
    id: docRef.id,
    fromUid,
    toUid,
    fromName: fromUserInfo.name,
    fromEmail: fromUserInfo.email,
    fromAvatar: fromUserInfo.avatar,
    fromCourse: fromUserInfo.course,
    status: "pending",
    sentAt: serverTimestamp(),
  };

  await setDoc(docRef, friendRequest);
};

// Accept friend request
export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(db, "friendRequests", requestId);
  await updateDoc(requestRef, {
    status: "accepted",
  });

  // Add users to each other's friends list
  const request = await getDoc(requestRef);
  if (request.exists()) {
    const requestData = request.data() as FriendRequest;

    // Add to both users' friends arrays
    const fromUserRef = doc(db, "users", requestData.fromUid);
    const toUserRef = doc(db, "users", requestData.toUid);

    await updateDoc(fromUserRef, {
      friends: arrayUnion(requestData.toUid),
    });

    await updateDoc(toUserRef, {
      friends: arrayUnion(requestData.fromUid),
    });
  }
};

// Reject friend request
export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(db, "friendRequests", requestId);
  await updateDoc(requestRef, {
    status: "rejected",
  });
};

// Get friend requests for a user
export const getFriendRequests = async (
  userUid: string,
): Promise<FriendRequest[]> => {
  const q = query(
    collection(db, "friendRequests"),
    where("toUid", "==", userUid),
    where("status", "==", "pending"),
    orderBy("sentAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FriendRequest);
};

// Real-time subscription to study group updates
export const subscribeToStudyGroup = (
  groupId: string,
  callback: (group: StudyGroup | null) => void,
): Unsubscribe => {
  const docRef = doc(db, "studyGroups", groupId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as StudyGroup);
    } else {
      callback(null);
    }
  });
};

// Real-time subscription to active study groups
export const subscribeToActiveStudyGroups = (
  callback: (groups: StudyGroup[]) => void,
): Unsubscribe => {
  if (isDemoMode()) {
    // For demo mode, call callback immediately with mock data
    setTimeout(() => {
      const activeGroups = mockStudyGroups.filter(
        (group) => group.timer.isActive,
      );
      callback(activeGroups);
    }, 100);

    // Return a dummy unsubscribe function
    return () => {
      console.log("Demo: Unsubscribed from study groups");
    };
  }

  const q = query(
    collection(db, "studyGroups"),
    where("timer.isActive", "==", true),
    orderBy("lastActive", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map((doc) => doc.data() as StudyGroup);
    callback(groups);
  });
};

// Leave a study group
export const leaveGroup = async (
  groupId: string,
  userUid: string,
): Promise<void> => {
  if (isDemoMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Remove from joined groups in localStorage
    const joinedGroupsKey = `joinedGroups_${userUid}`;
    const joinedGroups = JSON.parse(
      localStorage.getItem(joinedGroupsKey) || "[]",
    );
    const updatedGroups = joinedGroups.filter((id: string) => id !== groupId);
    localStorage.setItem(joinedGroupsKey, JSON.stringify(updatedGroups));

    // Remove from the group participants in mockStudyGroups
    const group = mockStudyGroups.find((g) => g.id === groupId);
    if (group) {
      group.participants = group.participants.filter((p) => p.uid !== userUid);
    }

    console.log(`Demo: User ${userUid} left group ${groupId}`);
    return;
  }

  // Real Firebase mode
  const groupRef = doc(db, "studyGroups", groupId);
  const group = await getDoc(groupRef);

  if (!group.exists()) {
    throw new Error("Study group not found");
  }

  const groupData = group.data() as StudyGroup;

  // Find and remove the participant
  const participant = groupData.participants.find((p) => p.uid === userUid);
  if (!participant) {
    throw new Error("You are not a member of this group");
  }

  await updateDoc(groupRef, {
    participants: arrayRemove(participant),
    lastActive: serverTimestamp(),
  });
};

// Get user's joined groups
export const getUserJoinedGroups = async (
  userUid: string,
): Promise<StudyGroup[]> => {
  if (isDemoMode()) {
    // Get joined groups from localStorage
    const joinedGroupsKey = `joinedGroups_${userUid}`;
    const joinedGroupIds = JSON.parse(
      localStorage.getItem(joinedGroupsKey) || "[]",
    );

    // Get user-created groups
    const createdGroupsKey = `createdGroups_${userUid}`;
    const createdGroups = JSON.parse(
      localStorage.getItem(createdGroupsKey) || "[]",
    );

    // Return groups that the user has joined
    const joinedGroups = mockStudyGroups.filter(
      (group) =>
        joinedGroupIds.includes(group.id) ||
        group.participants.some((p) => p.uid === userUid),
    );

    // Combine with created groups
    const allUserGroups = [...joinedGroups, ...createdGroups];

    // Add some default groups if none joined yet
    if (allUserGroups.length === 0) {
      // Create a couple of demo groups the user is part of
      const demoJoinedGroups: StudyGroup[] = [
        {
          id: "user-group-1",
          name: "My Study Circle",
          subject: "Computer Science",
          description: "A group I created for daily study sessions",
          adminId: userUid,
          participants: [
            {
              uid: userUid,
              name: "You",
              email: "you@kiit.ac.in",
              avatar: "/api/placeholder/40/40",
              course: "B.Tech CSE",
              isStudying: false,
              studyTime: 150,
              joinedAt: new Date(),
              role: "admin",
            },
            {
              uid: "demo-user-6",
              name: "Aman Singh",
              email: "aman@kiit.ac.in",
              avatar: "/api/placeholder/40/40",
              course: "B.Tech IT",
              isStudying: false,
              studyTime: 120,
              joinedAt: new Date(),
              role: "member",
            },
          ],
          pendingRequests: [],
          timer: {
            duration: 25,
            startTime: new Date(),
            isActive: false,
            type: "pomodoro",
          },
          settings: {
            isPrivate: false,
            requireApproval: false,
            maxParticipants: 10,
            allowChat: true,
          },
          stats: {
            totalSessions: 5,
            totalHours: 12,
            averageParticipants: 4,
          },
          createdAt: new Date(),
          lastActive: new Date(),
        },
      ];
      return demoJoinedGroups;
    }

    // Remove duplicates based on ID
    const uniqueGroups = allUserGroups.filter(
      (group, index, self) =>
        index === self.findIndex((g) => g.id === group.id),
    );

    return uniqueGroups;
  }

  // For real Firebase mode, query groups where user is a participant
  const q = query(
    collection(db, "studyGroups"),
    where("participants", "array-contains", userUid),
    orderBy("lastActive", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudyGroup);
};

// Real-time subscription to friend requests
export const subscribeToFriendRequests = (
  userUid: string,
  callback: (requests: FriendRequest[]) => void,
): Unsubscribe => {
  const q = query(
    collection(db, "friendRequests"),
    where("toUid", "==", userUid),
    where("status", "==", "pending"),
    orderBy("sentAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => doc.data() as FriendRequest);
    callback(requests);
  });
};
