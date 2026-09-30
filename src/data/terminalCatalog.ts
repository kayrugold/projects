import { forgeData } from './forge';
import { ledgerData } from './ledger';
import { projectGuides } from './projectGuides';

export const terminalProjects = [
  ...ledgerData.map(p => ({ id: p.id, title: p.title, description: p.description, page: p.projectPage || p.id, url: p.url })),
  ...forgeData.map(p => ({ id: p.id, title: p.title, description: projectGuides[p.id]?.purpose || p.description, page: p.projectPage || p.id, url: p.action.match(/launchApp\('([^']+)'\)/)?.[1] })),
];
export function findProjects(query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return terminalProjects;
  const exact = terminalProjects.find(p => p.id === term || p.title.toLowerCase() === term);
  return exact ? [exact] : terminalProjects.filter(p => `${p.id} ${p.title} ${p.description}`.toLowerCase().includes(term));
}
export const extraCommands = [
  ['/chat', 'Open studio chat'],
  ['/forum', 'Visit Rookery conversations'],
  ['/xyrtania', 'Enter the flagship game'],
  ['/eggs', 'Find a few hidden signals'],
  ['/adventure', 'Explore a tiny roadside adventure'],
  ['/raven', 'Ask the studio raven for a hint'],
  ['/stars', 'Step outside for a moment'],
  ['/prime <number>', 'Test a whole number up to one billion'],
  ['/projects', 'List projects with clickable details'],
  ['/find <words>', 'Search project names and descriptions'],
  ['/open <project>', 'Open a project’s details'],
  ['/launch <project>', 'Launch an available browser app'],
  ['/beacon', 'Read or refresh the studio transmission'],
  ['/crt [on|off|toggle]', 'Control the CRT screen effect'],
  ['/history', 'Show commands from this session'],
  ['/about', 'Meet the person behind the studio'],
  ['/report', 'Open the feedback workshop'],
  ['/pwd', 'Show the current website route'],
  ['/roll [sides]', 'Roll a die with 2–1000 sides'],
  ['/coin', 'Flip a virtual coin'],
] as const;
