const fs = require("fs");
const path = require("path");
const root = process.cwd();

const PACK_VERSION = 4;
const PACK_ID = "guest-hub-questions-v4-20260808";

const trivia = {
  id: "trivia",
  title: "Couples & Family Trivia",
  subtitle: "Real Dani & Javad lore. +15 pts per correct answer.",
  pointsPerCorrect: 15,
  contentPackVersion: PACK_VERSION,
  contentPackId: PACK_ID,
  questions: [
    { q: "Who made the first move?", choices: ["Dani", "Javad", "Mutual escalation", "Destiny + strong Wi-Fi"], answer: 1, explain: "Edit official answer on Host desk if lore differs." },
    { q: "Who asked the other out?", choices: ["Dani", "Javad", "A group chat forced it", "Still debating in committee"], answer: 1, explain: "Host can flip the official answer." },
    { q: 'Who said "I love you" first?', choices: ["Dani", "Javad", "Luna (via bark)", "Simultaneously, for the plot"], answer: 1, explain: "Canonical lore unless Host overrides." },
    { q: "Who fell in love first?", choices: ["Dani", "Javad", "Both at the same second", "The pets noticed first"], answer: 0, explain: "Soft lore." },
    { q: "Who knew first that marriage was going to happen?", choices: ["Dani", "Javad", "Both at the same time", "The dog knew first"], answer: 0, explain: "Soft lore." },
    { q: "What is the name of Javad & Dani's dog?", choices: ["Luna", "Pixel", "Taco", "Server"], answer: 0, explain: "Luna." },
    { q: "Who is the better cook (according to household law)?", choices: ["Dani", "Javad", "Takeout is the third partner", "Whoever didn't burn dinner"], answer: 0, explain: "Household law." },
    { q: "Who is more sentimental about old photos and texts?", choices: ["Dani", "Javad", "The cloud storage bill", "Both, full softies"], answer: 0, explain: "Sentimentality points." },
    { q: "Who planned more of the adventurous trips?", choices: ["Dani", "Javad", "The group chat", "Google Maps (solo hero)"], answer: 1, explain: "Outdoors energy." },
    { q: "Who has the bigger celebrity-crush energy?", choices: ["Dani", "Javad", "Both equally unhinged", "We don't talk about that"], answer: 0, explain: "Light roast." },
    { q: "Who is more excited for the wedding day?", choices: ["Dani", "Javad", "The guests (chaos option)", "Equal-volume screaming"], answer: 3, explain: "Equal hype default." },
    {
      q: "Which of Dani's sisters is so self-centered, petty, and egotistical that the ENTIRE wedding party had to keep reminding her: today is Dani's engagement party (not hers), maid of honor is not a paid position, she may not be the center of attention, and she should focus on supporting her only sister Dani on one of the most important days of her life?",
      choices: ["Ronni", "Alondra", "Both (a full production)", "We plead the fifth (coward option)"],
      answer: 0,
      explain: "Confirm sister name on Host desk if needed. Roast intentional.",
    },
  ],
};

const heSaid = {
  id: "he-said-she-said",
  title: "He Said / She Said",
  subtitle: "Who is more likely? Speed helps a tiny bit.",
  contentPackVersion: PACK_VERSION,
  contentPackId: PACK_ID,
  questions: [
    { q: "Who is more dramatic?", choices: ["Dani", "Javad", "Both, honestly"], answer: 0 },
    { q: "Who is more likely to get hangry first?", choices: ["Dani", "Javad", "Both (dangerous)"], answer: 0 },
    { q: "Who is more likely to steal food off the other person's plate?", choices: ["Dani", "Javad", "A coordinated joint operation"], answer: 2 },
    { q: 'Who says "I\'m fine" when they are definitely not fine?', choices: ["Dani", "Javad", "Both, Olympic level"], answer: 0 },
    { q: "Who is more likely to start an argument over something ridiculous?", choices: ["Dani", "Javad", "Both, for sport"], answer: 2 },
    { q: "Who is more stubborn?", choices: ["Dani", "Javad", "Dead heat"], answer: 2 },
    { q: "Who is more likely to steal the blankets?", choices: ["Dani", "Javad", "The pets (true winners)"], answer: 0 },
    { q: "Who is more likely to hit snooze until the alarm gives up?", choices: ["Dani", "Javad", "Both, separate alarms"], answer: 1 },
    { q: 'Who is more likely to say "we should clean" and then not clean?', choices: ["Dani", "Javad", "Both, then order tacos"], answer: 2 },
    { q: 'Who is more likely to say "it\'s not that far" on a hike when it absolutely is?', choices: ["Dani", "Javad", "Both, lying with confidence"], answer: 1 },
    { q: "Who is more likely to spoil the pets rotten?", choices: ["Dani", "Javad", "Both (pets win)"], answer: 2 },
    { q: "Who is the pets' favorite human (according to the pets)?", choices: ["Dani", "Javad", "Whoever has treats"], answer: 2 },
  ],
};

fs.writeFileSync(path.join(root, "public/celebrate/data/trivia.json"), JSON.stringify(trivia, null, 2) + "\n");
fs.writeFileSync(path.join(root, "public/celebrate/data/he-said-she-said.json"), JSON.stringify(heSaid, null, 2) + "\n");
console.log("wrote packs", trivia.questions.length, heSaid.questions.length, PACK_ID);