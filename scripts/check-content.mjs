import fs from "fs";
import { resume, projects } from "../src/data/resume.js";

const requiredResumeFields = ["name", "role", "phone", "email", "summary"];
const requiredProjectFields = [
  "slug",
  "name",
  "period",
  "role",
  "summary",
  "stack",
  "background",
  "responsibilities",
  "results",
  "interviewAngles",
  "assets",
];

const errors = [];

for (const field of requiredResumeFields) {
  if (!resume[field]) errors.push(`resume.${field} is required`);
}

if (projects.length < 6) {
  errors.push("expected at least 6 projects from the source resume");
}

if (!resume.education?.school || !resume.education?.major) {
  errors.push("education must be present on the online resume");
}

for (const project of projects) {
  for (const field of requiredProjectFields) {
    if (!project[field] || (Array.isArray(project[field]) && project[field].length === 0)) {
      errors.push(`${project.slug || project.name}: ${field} is required`);
    }
  }
  if (!project.assets.every((asset) => asset.type && asset.title && asset.text && asset.status && "url" in asset && "thumbnail" in asset && asset.privacyLevel)) {
    errors.push(`${project.slug}: every asset needs type, title, text, status, url, thumbnail and privacyLevel`);
  }
}

const source = fs.readFileSync(new URL("../resume_source.txt", import.meta.url), "utf8");
const rendered = JSON.stringify({ resume, projects });
const mustKeepKeywords = [
  "HTTP/HTTPS/TCP/UDP",
  "CoreData",
  "SQLite",
  "FMDB",
  "Masonry",
  "Snapkit",
  "比特币生态导航图",
  "区块链发展趋势图",
  "河北科技大学理工学院",
  "机械设计制造及其自动化",
];

for (const keyword of mustKeepKeywords) {
  if (source.includes(keyword) && !rendered.includes(keyword)) {
    errors.push(`source keyword not mapped into structured online resume: ${keyword}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Content check passed: ${projects.length} projects, ${resume.skills.length} skill groups.`);
