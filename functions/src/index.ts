import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Function 1 — onUserCreated (Auth trigger)
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    const userRef = db.collection('users').doc(user.uid);
    await userRef.set({
      uid: user.uid,
      displayName: user.displayName || 'Candidate',
      email: user.email,
      photoURL: user.photoURL || null,
      xp: 0,
      level: 1,
      streak: 0,
      streakFreezeCount: 1,
      lastActiveDate: new Date().toISOString(),
      readinessScore: 0,
      dsaScore: 0,
      aptitudeScore: 0,
      pipelineScore: 0,
      targetCompanies: [],
      targetRole: '',
      placementDate: null,
      onboardingComplete: false,
      isPlaced: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // TODO: Send welcome email via SendGrid
    console.log(`Successfully created default data for new user: ${user.uid}`);
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
  }
});

// Function 5 — updateStreakOnLogin (HTTPS Callable)
export const updateStreakOnLogin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'User record not found.');
    }

    const userData = doc.data()!;
    const lastActiveDateStr = userData.lastActiveDate;
    
    // Calculate difference in days
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const lastActive = lastActiveDateStr ? new Date(lastActiveDateStr) : today;
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));
    
    let currentStreak = userData.streak || 0;
    let freezeCount = userData.streakFreezeCount || 0;
    let xp = userData.xp || 0;

    if (diffDays === 1) {
      // Logged in the next day
      currentStreak += 1;
    } else if (diffDays > 1) {
      // Missed at least one day
      if (freezeCount > 0) {
        freezeCount -= 1; // Use freeze
        currentStreak += 1; // Preserve and increment
      } else {
        currentStreak = 1; // Reset streak
      }
    } else if (diffDays === 0 && !userData.lastActiveDate) {
      // Extremely new user
      currentStreak = 1;
    }

    // Checking milestones
    if (currentStreak > userData.streak) {
      if (currentStreak % 7 === 0) xp += 100;
      if (currentStreak === 30) xp += 500;
    }

    await userRef.update({
      streak: currentStreak,
      streakFreezeCount: freezeCount,
      xp: xp,
      lastActiveDate: now.toISOString(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, newStreak: currentStreak, xp };

  } catch (error: any) {
    console.error('Error updating streak:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Helper Function 8 — computePercentile
const computePercentile = async (testId: string, userScore: number): Promise<number> => {
  const attemptsSnapshot = await db.collection('testAttempts').where('testId', '==', testId).get();
  if (attemptsSnapshot.empty) return 100;

  let lowerOrEqualCount = 0;
  attemptsSnapshot.forEach(doc => {
    if (doc.data().score <= userScore) lowerOrEqualCount++;
  });

  return Math.round((lowerOrEqualCount / attemptsSnapshot.size) * 100);
};

// Function 7 — submitTestAttempt (HTTPS Callable)
export const submitTestAttempt = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');

  const { testId, answers, timings } = data;
  const uid = context.auth.uid;

  try {
    // In a real scenario, we would fetch the test from Firestore to validate answers.
    // For now, we simulate the evaluation based on local data passing.
    const totalQuestions = Object.keys(answers).length + 5; // Simulating out of a larger pool
    const correctCount = Object.keys(answers).length; // Simulated accuracy
    const score = correctCount * 4; 
    const totalMarks = totalQuestions * 4;
    const percentage = Math.round((score / totalMarks) * 100);
    const accuracy = Math.round((correctCount / Object.keys(answers).length) * 100) || 0;
    
    // Simulate Time Taken
    const timeTaken = Object.values(timings || {}).reduce((a: any, b: any) => a + b, 0) as number || 900;

    const percentile = await computePercentile(testId, score);

    const attemptId = db.collection(`users/${uid}/testAttempts`).doc().id;
    const attemptData = {
      attemptId,
      testId,
      testName: data.testName || 'Mock Test',
      category: data.category || 'General',
      score,
      totalMarks,
      percentage,
      percentile,
      timeTaken,
      accuracy,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save under global testAttempts and user-specific subcollection (or global depending on schema needs)
    await db.collection('testAttempts').doc(attemptId).set({ ...attemptData, userId: uid });

    // Award XP
    let xpAward = 25;
    if (percentage > 80) xpAward += 50;

    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      xp: admin.firestore.FieldValue.increment(xpAward)
    });

    return { success: true, attemptId, ...attemptData };

  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Function 6 — generateMockTest (HTTPS Callable)
export const generateMockTest = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  
  // Here we would call the Anthropic Claude API to generate questions.
  // We'll mock the response for now.
  const { category, difficulty, questionCount } = data;
  
  return {
    success: true,
    testId: `ai-gen-${Date.now()}`,
    title: `AI Generated ${category} Test - ${difficulty}`,
    questions: [
      { text: "Sample AI Question 1", options: ["A", "B", "C", "D"], answer: "A" }
    ]
  };
});
