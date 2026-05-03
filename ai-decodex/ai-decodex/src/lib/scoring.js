// scoring.js — the "real formula" that ranks topics by predicted exam importance.
// This is what makes DecodeX more than a counter.

export function computeTopicScores(papers, clusters) {
  // 1. Build a year-set for normalization
  const years = [...new Set(papers.map((p) => Number(p.year) || null).filter(Boolean))].sort();
  const latestYear = years[years.length - 1] || new Date().getFullYear();
  const totalYears = Math.max(years.length, 1);

  // 2. Map every original topic -> canonical (from clusters)
  const canonicalMap = {};
  clusters.forEach((c) => {
    c.members.forEach((m) => {
      canonicalMap[m.toLowerCase()] = c.canonical;
    });
  });

  // 3. Aggregate stats per canonical topic
  const stats = {};
  papers.forEach((paper) => {
    const py = Number(paper.year) || latestYear;
    paper.questions.forEach((q) => {
      const canonical =
        canonicalMap[(q.topic || '').toLowerCase()] || q.topic || 'Unknown';
      if (!stats[canonical]) {
        stats[canonical] = {
          name: canonical,
          frequency: 0,
          totalMarks: 0,
          yearsAppeared: new Set(),
          difficulties: { Easy: 0, Medium: 0, Hard: 0 },
          types: {},
          questions: [],
          yearCounts: {},
        };
      }
      const s = stats[canonical];
      s.frequency += 1;
      s.totalMarks += Number(q.marks) || 3;
      s.yearsAppeared.add(py);
      s.difficulties[q.difficulty || 'Medium'] =
        (s.difficulties[q.difficulty || 'Medium'] || 0) + 1;
      s.types[q.type || 'Short'] = (s.types[q.type || 'Short'] || 0) + 1;
      s.yearCounts[py] = (s.yearCounts[py] || 0) + 1;
      s.questions.push({ ...q, year: py, paperSubject: paper.subject });
    });
  });

  // 4. Compute the importance score per topic
  const totalQuestions = papers.reduce((a, p) => a + p.questions.length, 0) || 1;

  const ranked = Object.values(stats).map((s) => {
    // Frequency component (0-1): share of total questions
    const frequencyNorm = s.frequency / totalQuestions;

    // Recency weight (0-1): exponentially weight recent years
    let recencySum = 0;
    let recencyMax = 0;
    years.forEach((y) => {
      const w = Math.exp(-(latestYear - y) / 2); // decay with half-life ~1.4 years
      recencyMax += w;
      if (s.yearCounts[y]) recencySum += w * s.yearCounts[y];
    });
    const recencyNorm = recencyMax > 0 ? recencySum / (s.frequency * (recencyMax / totalYears)) : 0;
    const recencyScore = Math.min(1, recencyNorm);

    // Trend slope: simple linear regression of yearly counts
    const trendSlope = computeSlope(years, s.yearCounts);
    const trendScore = Math.max(0, Math.min(1, 0.5 + trendSlope / 2));

    // Marks weight: average marks per question, normalized
    const avgMarks = s.totalMarks / Math.max(s.frequency, 1);
    const marksScore = Math.min(1, avgMarks / 10);

    // Final weighted score (0-100)
    const score =
      0.4 * frequencyNorm * 10 +     // amplified because frequencyNorm is small
      0.3 * recencyScore +
      0.2 * trendScore +
      0.1 * marksScore;

    const final = Math.round(Math.min(100, score * 100));

    return {
      name: s.name,
      score: final,
      frequency: s.frequency,
      yearsAppeared: [...s.yearsAppeared].sort(),
      yearCounts: s.yearCounts,
      avgMarks: Number(avgMarks.toFixed(1)),
      difficulties: s.difficulties,
      types: s.types,
      trendSlope: Number(trendSlope.toFixed(2)),
      questions: s.questions,
      breakdown: {
        frequency: Number((frequencyNorm * 100).toFixed(1)),
        recency: Number((recencyScore * 100).toFixed(1)),
        trend: Number((trendScore * 100).toFixed(1)),
        marks: Number((marksScore * 100).toFixed(1)),
      },
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  return { ranked, years, latestYear };
}

function computeSlope(years, yearCounts) {
  if (years.length < 2) return 0;
  const xs = years;
  const ys = years.map((y) => yearCounts[y] || 0);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

export function computeSyllabusGaps(syllabusTopics, ranked) {
  if (!syllabusTopics || syllabusTopics.length === 0) return null;
  const rankedNames = ranked.map((r) => r.name.toLowerCase());

  const covered = [];
  const gaps = [];
  syllabusTopics.forEach((topic) => {
    const t = topic.toLowerCase();
    const match = ranked.find(
      (r) =>
        r.name.toLowerCase().includes(t) ||
        t.includes(r.name.toLowerCase().split(' ')[0]),
    );
    if (match) covered.push({ topic, match: match.name, score: match.score });
    else gaps.push(topic);
  });

  const surplus = ranked
    .filter(
      (r) =>
        !syllabusTopics.some(
          (s) =>
            r.name.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(r.name.toLowerCase().split(' ')[0]),
        ),
    )
    .slice(0, 5)
    .map((r) => r.name);

  return { covered, gaps, surplus };
}
