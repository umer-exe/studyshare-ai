// src/constants/courses.ts
export type Course = { name: string; slug: string };

export const COURSES: Course[] = [
  { name: "Data Structures & Algorithms", slug: "dsa" },
  { name: "Discrete Math",               slug: "discrete-math" },
  { name: "Database Management Systems", slug: "dbms" },
  { name: "Differential Equations",      slug: "diff-eq" },
  // add more here later…
];

export const COURSE_SLUGS = new Set(COURSES.map(c => c.slug));
