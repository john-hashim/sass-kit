CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'system');

ALTER TABLE "User" ADD COLUMN "theme" "Theme" NOT NULL DEFAULT 'dark';
