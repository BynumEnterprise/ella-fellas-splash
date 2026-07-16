"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function AskBox({
  onAsk,
  initial = "",
}: {
  onAsk: (text: string) => void;
  initial?: string;
}) {
  const [text, setText] = useState(initial);

  const examples = [
    "Baltimore Saturday — tickets, a hotel and dinner nearby",
    "What time does she go on in Tulsa?",
    "Red Rocks in October, where should I stay?",
  ];

  return (
    <div>
      <label htmlFor="ask" className="block font-display text-lg text-denim tracking-wide mb-1">
        TELL US WHAT YOU&apos;RE TRYING TO DO
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAsk(text);
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          id="ask"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I want to go to the Baltimore show Saturday — tickets, somewhere to stay, and food nearby"
          className="flex-1 px-4 py-3 border-2 border-denim/30 focus:border-primary outline-none rounded-md bg-paper text-ink"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-ink font-display tracking-wide text-lg rounded-md hover:bg-primary-dark hover:text-paper transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" /> PLAN IT
        </button>
      </form>
      <div className="flex flex-wrap gap-2 mt-2">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setText(ex);
              onAsk(ex);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-ink/20 text-ink/70 hover:border-primary hover:text-primary"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
