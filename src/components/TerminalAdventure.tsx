import React, { useState } from 'react';
export function TerminalAdventure() {
  const [place,setPlace]=useState('camp');
  const scenes:Record<string,{art:string;text:string;choices:[string,string][]}>={
    camp:{art:'   /\\        *\n  /  \\    .      /\\\n /____\\   ( )   /__\\\n           /|\\',text:'Midnight at the roadside workshop. A raven waits beside a warm campfire. Beyond the trees, a terminal glows.',choices:[['raven','Speak to the raven'],['terminal','Follow the green glow'],['road','Look down the road']]},
    raven:{art:'   ,_\n  (o )>\n  / )\\\n  " "',text:'The raven offers an ancient truth: “Back up your work before trying something clever.” It accepts payment in interesting bugs.',choices:[['terminal','Ask about the terminal'],['camp','Return to the fire']]},
    terminal:{art:' +----------------------+\n | SIGNAL FOUND:   42   |\n | > curiosity.exe      |\n +----------------------+',text:'The screen asks what you came here to build. There is no wrong answer. You find a tiny brass key engraved with a prime number: 101.',choices:[['vault','Try the brass key'],['camp','Pocket the key and return']]},
    vault:{art:'    .----------.\n    |  * 101 * |\n    |    <>    |\n    `----------\'',text:'The vault opens. Inside: one blank notebook, one very sharp pencil, and all the time between now and sunrise. Treasure acquired: a new beginning.',choices:[['camp','Start another night']]},
    road:{art:'       .     *\n     /   |   \\\n    /    |    \\\n   /     |     \\',text:'The road disappears into the stars. Somewhere out there, a truck carries a studio and a developer with one more idea. You wave.',choices:[['camp','Head back to camp']]}
  };
  const scene=scenes[place];return <div className="terminal-adventure"><pre aria-hidden="true">{scene.art}</pre><p>{scene.text}</p><div>{scene.choices.map(([target,label])=><button key={target} onClick={()=>setPlace(target)}>{label} →</button>)}</div></div>;
}
export function primeMessage(argument:string) {
  if(!/^\d{1,10}$/.test(argument)||Number(argument)>1000000000)return 'Try /prime <whole number from 0 to 1000000000>.';
  const n=Number(argument);if(n<2)return `${n} is not prime. The primes begin at 2.`;
  for(let divisor=2;divisor*divisor<=n;divisor+=divisor===2?1:2)if(n%divisor===0)return `${n} = ${divisor} × ${n/divisor}. Composite. A factor has emerged from the fog.`;
  return `${n} is prime. Another outpost on the arithmetic frontier.`;
}
