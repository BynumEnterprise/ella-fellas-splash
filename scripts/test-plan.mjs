#!/usr/bin/env node
/**
 * Plan My Night smoke test.
 *
 * Hits /api/plan (the same deterministic resolver the page runs in the browser)
 * with the prompts that used to dead-end, and asserts that EVERY one comes back
 * with a real show plus the blocks the sentence asked for.
 *
 * The failure this guards against is the one the owner hit: a perfectly normal
 * sentence with no city in it ("I wanna go to the next show and get tickets and
 * go out for dinner before and then drinks after") returning no plan at all.
 *
 *   node scripts/test-plan.mjs                       # production
 *   node scripts/test-plan.mjs http://localhost:3000 # local dev
 */

const base = (process.argv[2] ?? "https://ellafellas.com").replace(/\/$/, "");

const CASES = [
  {
    q: "I wanna go to the next show and get tickets and go out for dinner before and then drinks after",
    blocks: ["tickets", "dinner", "drinks"],
  },
  { q: "next show", blocks: [] },
  { q: "tickets and drinks after in Nashville", blocks: ["tickets", "drinks"] },
  { q: "this weekend", blocks: [] },
  { q: "dinner before the next one", blocks: ["dinner"] },
  { q: "asdkjhqwe zzzz nonsense", blocks: [] },
  { q: "", blocks: [] },
  { q: "Red Rocks in October, where should I stay?", blocks: [] },
  { q: "drinks before the show and dinner after in Philly", blocks: ["dinner", "drinks"] },
];

let failed = 0;

for (const c of CASES) {
  const url = `${base}/api/plan?q=${encodeURIComponent(c.q)}`;
  let data;
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    data = await res.json();
  } catch (err) {
    console.log(`FAIL  "${c.q}" -> request error: ${err.message}`);
    failed++;
    continue;
  }

  const problems = [];
  if (!data.ok || !data.show) problems.push("no show resolved");
  if (!data.understood) problems.push("no explanation");
  for (const key of c.blocks) {
    if (!(data.blocks ?? []).some((b) => b.key === key)) problems.push(`missing ${key} block`);
  }

  if (problems.length) {
    failed++;
    console.log(`FAIL  "${c.q}"\n      ${problems.join("; ")}\n      ${JSON.stringify(data).slice(0, 400)}`);
  } else {
    const where = `${data.show.city}, ${data.show.state} ${data.show.date}`;
    const blocks = data.blocks.map((b) => b.key).join("+") || "none";
    console.log(`PASS  "${c.q}"\n      -> ${where} [${data.confidence}] blocks: ${blocks}`);
  }
}

console.log(`\n${CASES.length - failed}/${CASES.length} passed against ${base}`);
process.exit(failed ? 1 : 0);
