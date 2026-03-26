import React from 'react';
import { Card, Button } from '../components/ui/Base';
import { Copy, Sparkles, Code2, Mail } from 'lucide-react';

const PROMPTS = [
  {
    title: "The 'Interview Recovery' Email Prompt",
    icon: Mail,
    color: "text-orange-400 bg-orange-500/10",
    description: "Use this when: You missed your interview or experienced a technical glitch, and you need to ask HR for a second chance.",
    content: `I need to write a high-stakes, professional email to a Recruiter/Placement Cell.
The Problem: During my online assessment/AI interview, I experienced a critical 'Rendering Failure' where the text and slides did not appear (Hardware Acceleration glitch).
The Goal: Persuade them that I am a top-tier candidate who was stopped by a technical bug, and request a 'Manual Link Reset' or a rescheduled slot.
Tone: Professional, apologetic for the inconvenience, but technically clear about the error.
Write the email now.`
  },
  {
    title: "The 'GOATED' App Generation Prompt",
    icon: Code2,
    color: "text-emerald-400 bg-emerald-500/10",
    description: "Use this when: You want an AI to architect a professional-grade web application for your resume/placement portfolio.",
    content: `Act as a Principal Software Architect. I want to build a [INSERT APP NAME, e.g., Crypto Tracker Dashboard].
Stack: [INSERT STACK, e.g., React, Tailwind, Node.js]
Standard: Production-ready, Clean Code, SOLID principles.
Output Requirements:
Project Structure: Provide a professional folder architecture.
State Management: Use the best practice for this stack.
UI/UX: Use a modern 'Glassmorphism' or 'Minimalist' design logic with Tailwind CSS.
Error Handling: Implement global error boundaries and try/catch blocks.
Task: Generate the core 'App.js' and the primary functional component with full logic. No placeholders.`
  }
];

export default function PromptToolkit() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app we'd trigger a toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="text-blue-400" />
          GOATED Prompt Toolkit
        </h2>
        <p className="text-zinc-400 mt-2 text-lg">
          The ultimate collection of AI prompts to recover from interviews and build resume-worthy projects.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {PROMPTS.map((prompt, i) => (
          <Card key={i} className="p-8 bg-zinc-900/50 border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center \${prompt.color}\`}>
                  <prompt.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{prompt.title}</h3>
                  <p className="text-sm font-medium text-zinc-500 max-w-xl">{prompt.description}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-zinc-950 border border-white/5 rounded-2xl p-6 font-mono text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap flex flex-col group/code">
              {prompt.content}
              <Button 
                onClick={() => handleCopy(prompt.content)}
                variant="secondary" 
                size="sm" 
                className="self-end mt-4 gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity bg-white/5 hover:bg-white/10"
              >
                <Copy size={14} /> Copy Prompt
              </Button>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          </Card>
        ))}
      </div>
    </div>
  );
}
