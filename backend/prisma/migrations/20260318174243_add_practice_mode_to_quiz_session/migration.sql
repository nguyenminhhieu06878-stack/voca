-- CreateTable
CREATE TABLE "review_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "lastScore" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "needsReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "review_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "review_items_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabulary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "practiceMode" TEXT NOT NULL DEFAULT 'words',
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 0,
    "timeLimit" INTEGER,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_practices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "audioPath" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'practice',
    "quizSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "practices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "practices_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabulary" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "practices_quizSessionId_fkey" FOREIGN KEY ("quizSessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_practices" ("audioPath", "createdAt", "feedback", "id", "isCorrect", "mode", "score", "transcription", "userId", "vocabularyId") SELECT "audioPath", "createdAt", "feedback", "id", "isCorrect", "mode", "score", "transcription", "userId", "vocabularyId" FROM "practices";
DROP TABLE "practices";
ALTER TABLE "new_practices" RENAME TO "practices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "review_items_userId_vocabularyId_key" ON "review_items"("userId", "vocabularyId");
