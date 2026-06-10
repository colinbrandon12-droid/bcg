// ─── MLB PLAYER DATABASE ──────────────────────────────────────────────────
export const HITTERS = [
  {name:"Will Smith",pos:"C",hr:25,tri:1,sb:15},
  {name:"Salvador Perez",pos:"C",hr:48,tri:2,sb:12},
  {name:"JT Realmuto",pos:"C",hr:22,tri:5,sb:105},
  {name:"Adley Rutschman",pos:"C",hr:21,tri:3,sb:18},
  {name:"William Contreras",pos:"C",hr:20,tri:2,sb:14},
  {name:"Sean Murphy",pos:"C",hr:26,tri:2,sb:8},
  {name:"Cal Raleigh",pos:"C",hr:39,tri:1,sb:10},
  {name:"Patrick Bailey",pos:"C",hr:16,tri:2,sb:6},
  {name:"Miguel Amaya",pos:"C",hr:14,tri:2,sb:8},
  {name:"Francisco Alvarez",pos:"C",hr:25,tri:1,sb:5},
  {name:"Willson Contreras",pos:"C",hr:22,tri:2,sb:20},
  {name:"Tyler Stephenson",pos:"C",hr:15,tri:2,sb:7},
  {name:"Henry Davis",pos:"C",hr:14,tri:3,sb:12},
  {name:"Logan OHoppe",pos:"C",hr:18,tri:2,sb:6},
  {name:"Freddie Freeman",pos:"1B",hr:31,tri:7,sb:48},
  {name:"Vladimir Guerrero Jr",pos:"1B",hr:48,tri:3,sb:20},
  {name:"Pete Alonso",pos:"1B",hr:53,tri:2,sb:14},
  {name:"Paul Goldschmidt",pos:"1B",hr:36,tri:6,sb:172},
  {name:"Michael Busch",pos:"1B",hr:20,tri:4,sb:18},
  {name:"Christian Walker",pos:"1B",hr:36,tri:4,sb:28},
  {name:"Matt Olson",pos:"1B",hr:54,tri:3,sb:11},
  {name:"Spencer Torkelson",pos:"1B",hr:31,tri:2,sb:8},
  {name:"Triston Casas",pos:"1B",hr:23,tri:2,sb:5},
  {name:"Ryan Mountcastle",pos:"1B",hr:33,tri:3,sb:8},
  {name:"CJ Abrams",pos:"1B",hr:22,tri:7,sb:54},
  {name:"Jose Altuve",pos:"2B",hr:31,tri:7,sb:337},
  {name:"Marcus Semien",pos:"2B",hr:45,tri:7,sb:119},
  {name:"Nico Hoerner",pos:"2B",hr:10,tri:5,sb:82},
  {name:"Hyeseong Kim",pos:"2B",hr:11,tri:4,sb:211},
  {name:"Luis Arraez",pos:"2B",hr:11,tri:4,sb:32},
  {name:"Gleyber Torres",pos:"2B",hr:38,tri:3,sb:27},
  {name:"Jeff McNeil",pos:"2B",hr:15,tri:5,sb:43},
  {name:"Gavin Lux",pos:"2B",hr:12,tri:4,sb:20},
  {name:"Andres Gimenez",pos:"2B",hr:17,tri:5,sb:64},
  {name:"Ozzie Albies",pos:"2B",hr:30,tri:8,sb:95},
  {name:"Jazz Chisholm Jr",pos:"2B",hr:24,tri:8,sb:75},
  {name:"Jonathan India",pos:"2B",hr:21,tri:4,sb:36},
  {name:"Brendan Donovan",pos:"2B",hr:13,tri:5,sb:32},
  {name:"Manny Machado",pos:"3B",hr:32,tri:5,sb:78},
  {name:"Austin Riley",pos:"3B",hr:38,tri:5,sb:19},
  {name:"Rafael Devers",pos:"3B",hr:38,tri:5,sb:18},
  {name:"Max Muncy",pos:"3B",hr:36,tri:3,sb:22},
  {name:"Eugenio Suarez",pos:"3B",hr:49,tri:2,sb:16},
  {name:"Isaac Paredes",pos:"3B",hr:31,tri:1,sb:10},
  {name:"Yandy Diaz",pos:"3B",hr:22,tri:4,sb:17},
  {name:"Alec Bohm",pos:"3B",hr:20,tri:4,sb:20},
  {name:"Jordan Walker",pos:"3B",hr:17,tri:4,sb:22},
  {name:"Mark Vientos",pos:"3B",hr:27,tri:3,sb:8},
  {name:"Mookie Betts",pos:"SS",hr:29,tri:7,sb:126},
  {name:"Dansby Swanson",pos:"SS",hr:22,tri:4,sb:65},
  {name:"Francisco Lindor",pos:"SS",hr:31,tri:6,sb:146},
  {name:"Corey Seager",pos:"SS",hr:33,tri:4,sb:26},
  {name:"Trea Turner",pos:"SS",hr:28,tri:10,sb:230},
  {name:"Willy Adames",pos:"SS",hr:31,tri:5,sb:61},
  {name:"Bobby Witt Jr",pos:"SS",hr:33,tri:11,sb:130},
  {name:"Carlos Correa",pos:"SS",hr:26,tri:5,sb:77},
  {name:"Bo Bichette",pos:"SS",hr:24,tri:7,sb:57},
  {name:"Jeremy Pena",pos:"SS",hr:22,tri:5,sb:38},
  {name:"Elly De La Cruz",pos:"SS",hr:25,tri:9,sb:90},
  {name:"Gunnar Henderson",pos:"SS",hr:37,tri:6,sb:35},
  {name:"Anthony Volpe",pos:"SS",hr:23,tri:5,sb:64},
  {name:"Zach Neto",pos:"SS",hr:21,tri:5,sb:35},
  {name:"Shohei Ohtani",pos:"LF",hr:54,tri:8,sb:106},
  {name:"Juan Soto",pos:"LF",hr:35,tri:4,sb:70},
  {name:"Ian Happ",pos:"LF",hr:24,tri:5,sb:55},
  {name:"Kyle Tucker",pos:"LF",hr:29,tri:8,sb:90},
  {name:"Yordan Alvarez",pos:"LF",hr:37,tri:3,sb:12},
  {name:"Randy Arozarena",pos:"LF",hr:20,tri:5,sb:97},
  {name:"Jurickson Profar",pos:"LF",hr:24,tri:6,sb:105},
  {name:"Steven Kwan",pos:"LF",hr:11,tri:6,sb:62},
  {name:"Brandon Nimmo",pos:"LF",hr:17,tri:4,sb:30},
  {name:"Christian Yelich",pos:"LF",hr:44,tri:7,sb:183},
  {name:"Pete Crow-Armstrong",pos:"CF",hr:31,tri:6,sb:76},
  {name:"Mike Trout",pos:"CF",hr:45,tri:8,sb:205},
  {name:"Byron Buxton",pos:"CF",hr:28,tri:10,sb:93},
  {name:"Luis Robert Jr",pos:"CF",hr:38,tri:8,sb:69},
  {name:"Cody Bellinger",pos:"CF",hr:47,tri:8,sb:115},
  {name:"Corbin Carroll",pos:"CF",hr:25,tri:8,sb:126},
  {name:"Cedric Mullins",pos:"CF",hr:30,tri:7,sb:104},
  {name:"Michael Harris II",pos:"CF",hr:19,tri:4,sb:62},
  {name:"Jarren Duran",pos:"CF",hr:16,tri:9,sb:78},
  {name:"TJ Friedl",pos:"CF",hr:17,tri:6,sb:48},
  {name:"Jackson Merrill",pos:"CF",hr:24,tri:7,sb:28},
  {name:"Teoscar Hernandez",pos:"RF",hr:26,tri:6,sb:90},
  {name:"Fernando Tatis Jr",pos:"RF",hr:42,tri:9,sb:104},
  {name:"Julio Rodriguez",pos:"RF",hr:32,tri:9,sb:105},
  {name:"Seiya Suzuki",pos:"RF",hr:32,tri:6,sb:30},
  {name:"Starling Marte",pos:"RF",hr:12,tri:10,sb:281},
  {name:"George Springer",pos:"RF",hr:39,tri:6,sb:135},
  {name:"Aaron Judge",pos:"RF",hr:62,tri:3,sb:75},
  {name:"Bryce Harper",pos:"RF",hr:35,tri:5,sb:108},
  {name:"Ronald Acuna Jr",pos:"RF",hr:41,tri:7,sb:217},
  {name:"Kyle Schwarber",pos:"RF",hr:47,tri:3,sb:28},
  {name:"Tommy Edman",pos:"RF",hr:19,tri:8,sb:115},
  {name:"Andy Pages",pos:"RF",hr:18,tri:3,sb:12},
  {name:"Lane Thomas",pos:"RF",hr:28,tri:5,sb:62},
  {name:"Daulton Varsho",pos:"RF",hr:27,tri:5,sb:60},
];

export const PITCHERS = [
  {name:"Shohei Ohtani",pos:"SP"},
  {name:"Yoshinobu Yamamoto",pos:"SP"},
  {name:"Blake Snell",pos:"SP"},
  {name:"Tyler Glasnow",pos:"SP"},
  {name:"Roki Sasaki",pos:"SP"},
  {name:"Corbin Burnes",pos:"SP"},
  {name:"Zac Gallen",pos:"SP"},
  {name:"Pablo Lopez",pos:"SP"},
  {name:"Framber Valdez",pos:"SP"},
  {name:"Logan Webb",pos:"SP"},
  {name:"Sandy Alcantara",pos:"SP"},
  {name:"Kevin Gausman",pos:"SP"},
  {name:"Max Fried",pos:"SP"},
  {name:"Spencer Strider",pos:"SP"},
  {name:"Gerrit Cole",pos:"SP"},
  {name:"Shota Imanaga",pos:"SP"},
  {name:"Justin Steele",pos:"SP"},
  {name:"Cole Ragans",pos:"SP"},
  {name:"Jordan Wicks",pos:"SP"},
  {name:"Colin Rea",pos:"SP"},
  {name:"Bailey Ober",pos:"SP"},
  {name:"Freddy Peralta",pos:"SP"},
  {name:"Sonny Gray",pos:"SP"},
  {name:"Dustin May",pos:"SP"},
  {name:"Tarik Skubal",pos:"SP"},
  {name:"Michael King",pos:"SP"},
  {name:"Emmanuel Clase",pos:"CL"},
  {name:"Ryan Pressly",pos:"CL"},
  {name:"Michael Kopech",pos:"CL"},
  {name:"Devin Williams",pos:"CL"},
  {name:"Josh Hader",pos:"CL"},
  {name:"Edwin Diaz",pos:"CL"},
  {name:"Mason Miller",pos:"CL"},
  {name:"David Bednar",pos:"CL"},
  {name:"Evan Phillips",pos:"RP"},
  {name:"Brusdar Graterol",pos:"RP"},
  {name:"Porter Hodge",pos:"RP"},
  {name:"Nate Pearson",pos:"RP"},
  {name:"Ryan Helsley",pos:"RP"},
  {name:"Jhoan Duran",pos:"RP"},
  {name:"Julian Merryweather",pos:"RP"},
  {name:"Caleb Thielbar",pos:"RP"},
];

export const POSITIONS = ["C","1B","2B","3B","SS","LF","CF","RF"];

export function toPlayer(h, pos) {
  return { name: h.name, pos, hrSeason: h.hr, triSeason: h.tri, sbCareer: h.sb };
}
export function toPitcher(p, slotPos) {
  return { name: p.name, pos: slotPos || p.pos, isPitcher: true };
}

// ─── DEFAULT ROSTERS ─────────────────────────────────────────────────────
const findH = (name) => HITTERS.find(h => h.name === name) || HITTERS[0];

export const DEFAULT_AWAY_LINEUP = [
  toPlayer(findH("Will Smith"), "C"),
  toPlayer(findH("Freddie Freeman"), "1B"),
  toPlayer(findH("Hyeseong Kim"), "2B"),
  toPlayer(findH("Max Muncy"), "3B"),
  toPlayer(findH("Mookie Betts"), "SS"),
  toPlayer(findH("Teoscar Hernandez"), "LF"),
  toPlayer(findH("Shohei Ohtani"), "CF"),
  toPlayer(findH("Andy Pages"), "RF"),
];
export const DEFAULT_AWAY_PITCHERS = [
  toPitcher({name:"Shohei Ohtani"}, "SP"),
  toPitcher({name:"Blake Snell"}, "SP"),
  toPitcher({name:"Yoshinobu Yamamoto"}, "SP"),
  toPitcher({name:"Tyler Glasnow"}, "SP"),
  toPitcher({name:"Roki Sasaki"}, "RP"),
  toPitcher({name:"Dustin May"}, "RP"),
  toPitcher({name:"Brusdar Graterol"}, "RP"),
  toPitcher({name:"Evan Phillips"}, "RP"),
  toPitcher({name:"Michael Kopech"}, "CL"),
];
export const DEFAULT_HOME_LINEUP = [
  toPlayer(findH("Miguel Amaya"), "C"),
  toPlayer(findH("Michael Busch"), "1B"),
  toPlayer(findH("Nico Hoerner"), "2B"),
  toPlayer(findH("Isaac Paredes"), "3B"),
  toPlayer(findH("Dansby Swanson"), "SS"),
  toPlayer(findH("Ian Happ"), "LF"),
  toPlayer(findH("Pete Crow-Armstrong"), "CF"),
  toPlayer(findH("Seiya Suzuki"), "RF"),
];
export const DEFAULT_HOME_PITCHERS = [
  toPitcher({name:"Shota Imanaga"}, "SP"),
  toPitcher({name:"Justin Steele"}, "SP"),
  toPitcher({name:"Colin Rea"}, "SP"),
  toPitcher({name:"Jordan Wicks"}, "SP"),
  toPitcher({name:"Porter Hodge"}, "RP"),
  toPitcher({name:"Nate Pearson"}, "RP"),
  toPitcher({name:"Julian Merryweather"}, "RP"),
  toPitcher({name:"Caleb Thielbar"}, "RP"),
  toPitcher({name:"Ryan Pressly"}, "CL"),
];

// ─── DICE ENGINE ─────────────────────────────────────────────────────────
export function getDiceOutcome(d1, d2, player) {
  const sum = d1 + d2;
  if (d1 === 1 && d2 === 1) return { type: "walk", label: "Walk (BB)" };
  if ((d1 === 6 && d2 <= 3) || (d2 === 6 && d1 <= 3)) return { type: "strikeout", label: "Strikeout (K)" };
  if (d1 === 6 && d2 === 6) {
    if (player && player.hrSeason >= 45) return { type: "homerun", label: "Home Run! (6+6)" };
    if (player && player.triSeason >= 6) return { type: "triple", label: "Triple! (6+6)" };
    return { type: "double", label: "Double (6+6)" };
  }
  if (sum === 11) return { type: "homerun", label: "Home Run!" };
  if (sum === 10) return { type: "double", label: "Double" };
  if (sum === 5) return { type: "single", label: "Single" };
  if ((d1 === 3 && d2 === 4) || (d1 === 4 && d2 === 3)) return { type: "single", label: "Single" };
  return { type: "out", label: "Out" };
}

export const aiError = () => Math.random() < 0.03;
export const aiRobHR = () => Math.random() < 0.028;
export const aiInjury = () => Math.random() < 0.028;
export const injPos = () => { const r = Math.random(); return r < 0.333 ? "LF" : r < 0.667 ? "CF" : "RF"; };
export const canSteal = (p) => p && p.sbCareer >= 20;
export const stealSafe = (d1, d2, to3) => to3 ? (d1 === d2) : (d1 !== d2);
export const rollDice = () => [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];

export function advanceRunners(bases, hitType, name) {
  const b = [...bases]; let runs = 0;
  if (hitType === "walk") {
    if (b[0] && b[1] && b[2]) runs++;
    if (b[0] && b[1]) b[2] = b[1];
    if (b[0]) b[1] = b[0];
    b[0] = name; return [b, runs];
  }
  if (hitType === "single") { if (b[2]) runs++; return [[name, b[0]||null, b[1]||null], runs]; }
  if (hitType === "double") { if (b[2]) runs++; if (b[1]) runs++; return [[null, name, b[0]||null], runs]; }
  if (hitType === "triple") { runs=(b[0]?1:0)+(b[1]?1:0)+(b[2]?1:0); return [[null,null,name], runs]; }
  if (hitType === "triple_stop2") { if (b[0]) runs++; if (b[2]) runs++; return [[null,name,b[1]||null], runs]; }
  if (hitType === "homerun") { runs=1+(b[0]?1:0)+(b[1]?1:0)+(b[2]?1:0); return [[null,null,null], runs]; }
  return [bases, 0];
}

// ─── INITIAL GAME STATE ──────────────────────────────────────────────────
export function makeInitialState(awayName, awayLineup, awayPitchers, homeName, homeLineup, homePitchers) {
  return {
    awayName, homeName,
    awayLineup, homeLineup,
    awayPitchers, homePitchers,
    inning: 1,
    isTop: true,
    outs: 0,
    bases: [null, null, null],
    awayScores: [],
    homeScores: [],
    awayIR: 0,
    homeIR: 0,
    awayBatterIdx: 0,
    homeBatterIdx: 0,
    awayPitcherIdx: 0,
    homePitcherIdx: 0,
    log: [{ text: "-- Top 1 --", t: "inning" }],
    gameOver: false,
    status: "active", // waiting_away | waiting_home | active | complete
    lastAction: null,
  };
}
