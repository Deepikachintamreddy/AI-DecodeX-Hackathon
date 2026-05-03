// Pre-baked sample data so judges can hit "Try Sample" without uploading anything.
// Simulates 4 years of a CS DBMS paper.

export const SAMPLE_PAPERS = [
  {
    year: '2021',
    subject: 'Database Management Systems',
    exam_name: 'End-Sem',
    total_marks: 100,
    questions: [
      { q_no: '1a', text: 'Define normalization. Explain 1NF, 2NF, 3NF with examples.', topic: 'Database Normalization', subtopic: '1NF, 2NF, 3NF', marks: 10, difficulty: 'Medium', type: 'Long' },
      { q_no: '1b', text: 'Differentiate between DDL and DML commands.', topic: 'SQL Basics', subtopic: 'DDL vs DML', marks: 5, difficulty: 'Easy', type: 'Short' },
      { q_no: '2a', text: 'Draw an ER diagram for a hospital management system.', topic: 'ER Diagram', subtopic: 'Entity-Relationship Modeling', marks: 10, difficulty: 'Medium', type: 'Diagram' },
      { q_no: '2b', text: 'Explain ACID properties of transactions.', topic: 'Transaction ACID Properties', subtopic: 'Atomicity, Consistency, Isolation, Durability', marks: 8, difficulty: 'Medium', type: 'Long' },
      { q_no: '3', text: 'Write SQL queries: find employees with salary > avg salary.', topic: 'SQL Queries', subtopic: 'Subqueries', marks: 10, difficulty: 'Medium', type: 'Numerical' },
      { q_no: '4', text: 'Explain B+ tree indexing with insertion example.', topic: 'B+ Tree Indexing', subtopic: 'Insertion', marks: 12, difficulty: 'Hard', type: 'Long' },
      { q_no: '5', text: 'What is a deadlock? Explain detection and prevention.', topic: 'Concurrency Control', subtopic: 'Deadlock', marks: 10, difficulty: 'Hard', type: 'Long' },
    ],
  },
  {
    year: '2022',
    subject: 'Database Management Systems',
    exam_name: 'End-Sem',
    total_marks: 100,
    questions: [
      { q_no: '1a', text: 'Explain BCNF with an example. How is it different from 3NF?', topic: 'Database Normalization', subtopic: 'BCNF', marks: 10, difficulty: 'Hard', type: 'Long' },
      { q_no: '1b', text: 'Define primary key, foreign key, candidate key.', topic: 'Database Keys', subtopic: 'Key types', marks: 6, difficulty: 'Easy', type: 'Short' },
      { q_no: '2', text: 'Construct ER diagram for a university registration system.', topic: 'ER Diagram', subtopic: 'Entity-Relationship Modeling', marks: 12, difficulty: 'Medium', type: 'Diagram' },
      { q_no: '3a', text: 'Write SQL: list top-3 highest paid employees per department.', topic: 'SQL Queries', subtopic: 'Window functions', marks: 8, difficulty: 'Hard', type: 'Numerical' },
      { q_no: '3b', text: 'Explain joins: INNER, LEFT, RIGHT, FULL with examples.', topic: 'SQL Joins', subtopic: 'Join types', marks: 8, difficulty: 'Medium', type: 'Long' },
      { q_no: '4', text: 'Discuss two-phase locking protocol.', topic: 'Concurrency Control', subtopic: '2PL Protocol', marks: 10, difficulty: 'Hard', type: 'Long' },
      { q_no: '5', text: 'Explain B+ tree vs hash indexing — when to use each.', topic: 'B+ Tree Indexing', subtopic: 'Index comparison', marks: 10, difficulty: 'Medium', type: 'Long' },
    ],
  },
  {
    year: '2023',
    subject: 'Database Management Systems',
    exam_name: 'End-Sem',
    total_marks: 100,
    questions: [
      { q_no: '1', text: 'Normalize the given relation up to BCNF. Show all FDs.', topic: 'Database Normalization', subtopic: 'BCNF, Functional Dependencies', marks: 15, difficulty: 'Hard', type: 'Numerical' },
      { q_no: '2a', text: 'SQL: find customers who bought every product in category X.', topic: 'SQL Queries', subtopic: 'Division / Universal quantifier', marks: 10, difficulty: 'Hard', type: 'Numerical' },
      { q_no: '2b', text: 'Explain 4 types of SQL joins with examples.', topic: 'SQL Joins', subtopic: 'Join types', marks: 8, difficulty: 'Medium', type: 'Long' },
      { q_no: '3', text: 'ER diagram for an online food delivery system with 4 entities.', topic: 'ER Diagram', subtopic: 'Entity-Relationship Modeling', marks: 12, difficulty: 'Medium', type: 'Diagram' },
      { q_no: '4', text: 'ACID properties — explain Isolation in detail with examples.', topic: 'Transaction ACID Properties', subtopic: 'Isolation levels', marks: 10, difficulty: 'Medium', type: 'Long' },
      { q_no: '5a', text: 'Explain timestamp ordering protocol for concurrency control.', topic: 'Concurrency Control', subtopic: 'Timestamp ordering', marks: 10, difficulty: 'Hard', type: 'Long' },
      { q_no: '5b', text: 'B+ tree: insert 30, 20, 50, 40, 70, 60 into an empty B+ tree of order 4.', topic: 'B+ Tree Indexing', subtopic: 'Insertion', marks: 10, difficulty: 'Hard', type: 'Numerical' },
    ],
  },
  {
    year: '2024',
    subject: 'Database Management Systems',
    exam_name: 'End-Sem',
    total_marks: 100,
    questions: [
      { q_no: '1a', text: 'Normalization: given a schema and FDs, decompose into BCNF.', topic: 'Database Normalization', subtopic: 'BCNF decomposition', marks: 12, difficulty: 'Hard', type: 'Numerical' },
      { q_no: '1b', text: 'Explain functional dependency and its types.', topic: 'Functional Dependencies', subtopic: 'FD types', marks: 6, difficulty: 'Medium', type: 'Short' },
      { q_no: '2', text: 'SQL: complex query with nested subqueries, GROUP BY, HAVING.', topic: 'SQL Queries', subtopic: 'Advanced queries', marks: 12, difficulty: 'Hard', type: 'Numerical' },
      { q_no: '3', text: 'ER diagram for a bank — accounts, customers, transactions, loans.', topic: 'ER Diagram', subtopic: 'Entity-Relationship Modeling', marks: 12, difficulty: 'Medium', type: 'Diagram' },
      { q_no: '4a', text: 'Concurrency: explain optimistic concurrency control.', topic: 'Concurrency Control', subtopic: 'Optimistic CC', marks: 10, difficulty: 'Hard', type: 'Long' },
      { q_no: '4b', text: 'Recovery techniques: explain log-based recovery.', topic: 'Database Recovery', subtopic: 'Log-based recovery', marks: 10, difficulty: 'Hard', type: 'Long' },
      { q_no: '5', text: 'NoSQL vs SQL: when to use each. Give 3 use cases.', topic: 'NoSQL Databases', subtopic: 'SQL vs NoSQL', marks: 8, difficulty: 'Medium', type: 'Long' },
    ],
  },
];

export const SAMPLE_SYLLABUS = `Database Management Systems Syllabus

Unit 1: Introduction to DBMS, Data Models, ER Diagram
Unit 2: Relational Model, SQL Queries, SQL Joins, Database Keys
Unit 3: Functional Dependencies, Database Normalization (1NF, 2NF, 3NF, BCNF)
Unit 4: Transaction ACID Properties, Concurrency Control, Deadlock, 2PL Protocol
Unit 5: Database Recovery, B+ Tree Indexing, Hashing
Unit 6: Distributed Databases, NoSQL Databases, Data Warehousing, OLAP
Unit 7: Database Security, Access Control, SQL Injection prevention`;

export const SAMPLE_CLUSTERS = [
  { canonical: 'Database Normalization', members: ['Database Normalization'] },
  { canonical: 'SQL Queries', members: ['SQL Queries'] },
  { canonical: 'SQL Joins', members: ['SQL Joins'] },
  { canonical: 'ER Diagram', members: ['ER Diagram'] },
  { canonical: 'Concurrency Control', members: ['Concurrency Control'] },
  { canonical: 'B+ Tree Indexing', members: ['B+ Tree Indexing'] },
  { canonical: 'Transaction ACID Properties', members: ['Transaction ACID Properties'] },
  { canonical: 'SQL Basics', members: ['SQL Basics'] },
  { canonical: 'Database Keys', members: ['Database Keys'] },
  { canonical: 'Functional Dependencies', members: ['Functional Dependencies'] },
  { canonical: 'Database Recovery', members: ['Database Recovery'] },
  { canonical: 'NoSQL Databases', members: ['NoSQL Databases'] },
];

export const SAMPLE_PLAN = {
  "plan": [
    {
      "day": 1,
      "date_offset": "Day 1",
      "focus": "Database Normalization Fundamentals",
      "topics": ["1NF, 2NF, 3NF", "Functional Dependencies"],
      "tasks": ["Review normal forms (1h)", "Practice 10 normalization problems (2h)"],
      "expected_hours": 3
    },
    {
      "day": 2,
      "date_offset": "Day 2",
      "focus": "Advanced Normalization & BCNF",
      "topics": ["BCNF", "4NF & 5NF overview"],
      "tasks": ["Solve BCNF decomposition cases (2h)", "Summary of higher normal forms (1h)"],
      "expected_hours": 3
    },
    {
      "day": 3,
      "date_offset": "Day 3",
      "focus": "SQL Mastery - Joins & Subqueries",
      "topics": ["Outer Joins", "Correlated Subqueries"],
      "tasks": ["Write SQL for complex join scenarios (2h)", "Practice nested queries (1h)"],
      "expected_hours": 3
    }
  ],
  "strategy_note": "Focus heavily on Normalization and SQL Joins as they account for 45% of the total marks in recent years. Save the last day for a full mock paper attempt."
}

export const SAMPLE_PREDICTION = {
  "predicted_paper": {
    "title": "Predicted DBMS End-Sem Paper 2026",
    "instructions": "Answer all questions. Section A is compulsory. Choose 3 from Section B.",
    "sections": [
      {
        "name": "Section A (Compulsory)",
        "marks_each": 5,
        "questions": [
          { "q_no": 1, "text": "Define BCNF. How does it differ from 3NF? Provide an example where a relation is in 3NF but not BCNF.", "topic": "Normalization", "marks": 5 },
          { "q_no": 2, "text": "Explain the concept of ACID properties in transaction management with a real-world example.", "topic": "Transactions", "marks": 5 }
        ]
      },
      {
        "name": "Section B (Analytical)",
        "marks_each": 15,
        "questions": [
          { "q_no": 3, "text": "Given a relation R(A,B,C,D,E) and FDs {A->BC, CD->E, B->D, E->A}, find the candidate keys and decompose into 3NF.", "topic": "Normalization", "marks": 15 },
          { "q_no": 4, "text": "Compare and contrast B+ Trees and Hash Indexing. In which scenarios is a B+ Tree preferred?", "topic": "Indexing", "marks": 15 }
        ]
      }
    ],
    "total_marks": 100,
    "rationale": "Normalization and SQL remain the highest-yield topics. We expect a heavy focus on BCNF and Indexing structure in this cycle based on the 3-year rising trend."
  }
}
