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
    return { success: false, message: 'Unauthorized: User must be authenticated.' };
  }

  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      return { success: false, message: 'User record not found.' };
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
    return { success: false, message: error.message || "Internal server error" };
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
  if (!context.auth) return { success: false, message: 'Unauthorized: User must be authenticated.' };

  const { testId, answers, timings } = data;
  if (!testId || !answers) {
    return { success: false, message: 'Invalid payload: testId and answers are required.' };
  }

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
    console.error('Error submitting test attempt:', error);
    return { success: false, message: error.message || 'Internal server error while evaluating test.' };
  }
});

// Function 6 — generateMockTest (HTTPS Callable)
export const generateMockTest = functions.https.onCall(async (data, context) => {
  if (!context.auth) return { success: false, message: 'Unauthorized: User must be authenticated.' };
  
  const { category, difficulty, questionCount } = data;
  
  if (!category || !difficulty) {
    return { success: false, message: 'Invalid payload: category and difficulty are required.' };
  }

  try {
    return {
      success: true,
      testId: `ai-gen-${Date.now()}`,
      title: `AI Generated ${category} Test - ${difficulty}`,
      questions: [
        { text: "Sample AI Question 1", options: ["A", "B", "C", "D"], answer: "A" }
      ]
    };
  } catch (error: any) {
    console.error('Error generating Mock test:', error);
    return { success: false, message: error.message || 'Internal server error while generating test.' };
  }
});

// Function 9 - analyzeJD (HTTPS Callable for Jobseeker Prep System)
export const analyzeJD = functions.https.onCall(async (data, context) => {
  if (!context.auth) return { success: false, message: 'Unauthorized: User must be authenticated.' };
  
  const { jdText, userSkills } = data;
  if (!jdText) {
    return { success: false, message: 'Job Description is required.' };
  }

  try {
    // Dynamic import to avoid breaking initial execution if module loads slightly late
    const { GoogleGenAI } = await import('@google/genai');
    
    // We expect the GEMINI_API_KEY to be available in process.env if loaded via functions setup
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCi5Lix6fw691yMD0nHan8M45Of1aTWKuE"; // Fallback strictly for local emulation/safety
    const ai = new GoogleGenAI({ apiKey });

    // Enforce structured JSON output
    const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze this Job Description and the user's current skills to generate a comprehensive placement preparation matrix.
      You MUST return exactly ONLY RAW JSON matching this structure. Do not wrap in markdown \`\`\`json.
      
      {
        "role": "e.g., Frontend Engineer",
        "experienceLevel": "e.g., Fresher / 2-4 Years",
        "extractedSkills": {
          "mustHave": ["React", "JavaScript", "CSS"],
          "goodToHave": ["AWS", "Docker", "Figma"]
        },
        "skillCategories": {
          "programming": ["JavaScript", "TypeScript"],
          "frameworks": ["React", "Node.js"],
          "databases": ["MongoDB"],
          "softSkills": ["Communication"]
        },
        "skillGap": {
          "missingSkills": ["Docker", "AWS"],
          "strengths": ["React", "JavaScript"]
        },
        "companySuggestions": [
          { "name": "Google", "category": "Product", "matchPercent": 92 },
          { "name": "TCS", "category": "Service", "matchPercent": 75 },
          { "name": "Stripe", "category": "Startup", "matchPercent": 88 }
        ],
        "roadmap": [
          { "day": 1, "topic": "Core JavaScript Concepts", "action": "Review Closures, Promises, and Event Loop" },
          { "day": 2, "topic": "React Hooks Deep Dive", "action": "Build a custom hook, practice useEffect optimizations" }
        ],
        "atsPredictor": {
          "score": 85,
          "resumeTips": ["Add measurable metrics to past projects", "Explicitly mention Docker"]
        },
        "interviewQuestions": [
          "Explain the Virtual DOM in React.",
          "How would you optimize a slow-loading web application?"
        ]
      }

      Input User Skills: ${userSkills || 'Unknown, assume fresher basics'}
      Input Job Description:
      ${jdText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for deterministic JSON output
        responseMimeType: "application/json"
      }
    });

    const outputText = response.text || "{}";
    const parsedJSON = JSON.parse(outputText);

    return { success: true, data: parsedJSON };

  } catch (error: any) {
    console.error('Error analyzing JD:', error);
    return { success: false, message: error.message || 'Failed to analyze Job Description' };
  }
});
