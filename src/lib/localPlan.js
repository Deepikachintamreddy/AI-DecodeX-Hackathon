/**
 * Deterministic study plan generator that works without AI.
 * Used as a fallback if the Gemini API is rate-limited.
 */
export function generateLocalPlan(rankedTopics, days, hoursPerDay) {
  // Take top topics that fit in the schedule
  const totalHours = days * hoursPerDay;
  const plan = [];
  
  // Distribute topics over days
  for (let i = 0; i < days; i++) {
    const topicIndex = i % rankedTopics.length;
    const topic = rankedTopics[topicIndex];
    
    plan.push({
      day: i + 1,
      date_offset: `Day ${i + 1}`,
      focus: topic.name,
      topics: [topic.name, "Review key concepts"],
      tasks: [
        `Study ${topic.name} detailed notes (1.5h)`,
        `Solve 3-5 previous year questions (1.5h)`
      ],
      expected_hours: hoursPerDay
    });
  }

  return {
    plan,
    strategy_note: "This plan is optimized for high-yield topics based on frequency analysis. Since the schedule is tight, focus 70% of your time on solving problems rather than reading theory."
  };
}
