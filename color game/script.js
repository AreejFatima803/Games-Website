const fs = require('fs');

const html = fs.readFileSync('selection.html', 'utf8');

// The original 6 cards end at the 6th card's closing </div></div>.
// Card 7 starts exactly at line 156: '<div class="card">\n                    <div class="card-inner">\n                        <!-- Detailed Turtle -->'
// The cards-grid closing tag is at line 787.

const splitPoint1 = html.indexOf('                <div class="card">\r\n                    <div class="card-inner">\r\n                        <!-- Detailed Turtle -->');

if (splitPoint1 === -1) {
    console.error("Could not find start point");
    process.exit(1);
}

const splitPoint2 = html.lastIndexOf('            </div>\r\n        </div>\r\n    </div>');

if (splitPoint2 === -1) {
    console.error("Could not find end point");
    process.exit(1);
}

const part1 = html.substring(0, splitPoint1);
const part2 = html.substring(splitPoint2);

const newCards = `
                <div class="card">
                    <div class="card-inner">
                        <!-- Fish -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 40,100 C 60,60 140,60 160,100 C 140,140 60,140 40,100 Z" />
                            <path d="M 40,100 L 10,70 L 10,130 Z" />
                            <circle cx="130" cy="90" r="5" />
                            <path d="M 145,100 A 5,5 0 0,1 145,110" />
                            <path d="M 90,70 C 100,40 120,40 120,75" />
                            <path d="M 90,130 C 100,160 120,160 120,125" />
                            <path d="M 70,80 A 10,10 0 0,0 70,120 M 90,85 A 10,10 0 0,0 90,115 M 110,80 A 10,10 0 0,0 110,120" />
                            <circle cx="170" cy="80" r="4" /><circle cx="180" cy="60" r="6" /><circle cx="190" cy="40" r="8" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- House -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="50" y="100" width="100" height="80" />
                            <path d="M 30,100 L 100,40 L 170,100 Z" />
                            <rect x="130" y="50" width="20" height="40" />
                            <rect x="85" y="130" width="30" height="50" />
                            <circle cx="108" cy="155" r="3" fill="black" />
                            <rect x="65" y="120" width="20" height="20" />
                            <rect x="115" y="120" width="20" height="20" />
                            <line x1="75" y1="120" x2="75" y2="140" /><line x1="65" y1="130" x2="85" y2="130" />
                            <line x1="125" y1="120" x2="125" y2="140" /><line x1="115" y1="130" x2="135" y2="130" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Car -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 30,130 L 170,130 L 170,100 L 140,100 L 120,60 L 60,60 L 40,100 L 30,100 Z" />
                            <circle cx="60" cy="130" r="20" /><circle cx="60" cy="130" r="10" />
                            <circle cx="140" cy="130" r="20" /><circle cx="140" cy="130" r="10" />
                            <path d="M 60,60 L 120,60 L 140,100 L 40,100 Z" />
                            <line x1="90" y1="60" x2="90" y2="100" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Tree -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 90,180 L 90,100 L 70,80 L 90,100 L 110,80 L 110,100 L 110,180 Z" />
                            <path d="M 50,100 C 20,80 40,40 70,40 C 90,10 130,20 140,50 C 170,50 170,90 140,110 C 120,130 70,130 50,100 Z" />
                            <circle cx="80" cy="60" r="5" /><circle cx="120" cy="70" r="5" /><circle cx="90" cy="90" r="5" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Rocket -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 100,20 C 140,60 140,120 120,140 L 80,140 C 60,120 60,60 100,20 Z" />
                            <circle cx="100" cy="80" r="15" />
                            <circle cx="100" cy="80" r="10" />
                            <path d="M 80,140 L 60,170 L 90,140 Z" />
                            <path d="M 120,140 L 140,170 L 110,140 Z" />
                            <path d="M 90,140 L 100,180 L 110,140 Z" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Cupcake -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 60,110 L 75,180 L 125,180 L 140,110 Z" />
                            <line x1="70" y1="110" x2="85" y2="180" />
                            <line x1="90" y1="110" x2="100" y2="180" />
                            <line x1="110" y1="110" x2="115" y2="180" />
                            <path d="M 50,110 C 50,70 80,50 100,50 C 120,50 150,70 150,110 Z" />
                            <circle cx="100" cy="40" r="10" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Crown -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 30,150 L 170,150 L 180,80 L 140,110 L 100,50 L 60,110 L 20,80 Z" />
                            <circle cx="20" cy="70" r="5" />
                            <circle cx="100" cy="40" r="5" />
                            <circle cx="180" cy="70" r="5" />
                            <rect x="90" y="110" width="20" height="20" />
                            <circle cx="50" cy="130" r="5" />
                            <circle cx="150" cy="130" r="5" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Starfish -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 100,20 L 120,70 L 180,70 L 130,110 L 150,170 L 100,130 L 50,170 L 70,110 L 20,70 L 80,70 Z" />
                            <circle cx="100" cy="100" r="5" />
                            <circle cx="100" cy="60" r="3" />
                            <circle cx="100" cy="140" r="3" />
                            <circle cx="60" cy="100" r="3" />
                            <circle cx="140" cy="100" r="3" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Diamond -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 50,60 L 150,60 L 180,100 L 100,180 L 20,100 Z" />
                            <path d="M 50,60 L 80,100 L 20,100 Z" />
                            <path d="M 150,60 L 120,100 L 180,100 Z" />
                            <path d="M 50,60 L 100,100 L 150,60" />
                            <path d="M 80,100 L 100,180 L 120,100 Z" />
                            <path d="M 20,100 L 100,100 L 180,100" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Robot -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="60" y="40" width="80" height="70" rx="10" />
                            <circle cx="80" cy="70" r="10" /><circle cx="120" cy="70" r="10" />
                            <rect x="80" y="90" width="40" height="10" />
                            <rect x="50" y="60" width="10" height="30" />
                            <rect x="140" y="60" width="10" height="30" />
                            <line x1="100" y1="40" x2="100" y2="20" />
                            <circle cx="100" cy="15" r="5" />
                            <rect x="70" y="110" width="60" height="60" rx="5" />
                            <rect x="80" y="120" width="40" height="20" />
                            <circle cx="100" cy="155" r="8" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Hot Air Balloon -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 50,80 C 50,20 150,20 150,80 C 150,130 120,150 120,150 L 80,150 C 80,150 50,130 50,80 Z" />
                            <path d="M 75,30 C 70,80 90,150 90,150" />
                            <path d="M 125,30 C 130,80 110,150 110,150" />
                            <rect x="85" y="160" width="30" height="25" />
                            <line x1="85" y1="150" x2="85" y2="160" />
                            <line x1="115" y1="150" x2="115" y2="160" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Ice Cream -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 60,100 L 100,180 L 140,100 Z" />
                            <path d="M 65,100 C 60,70 90,60 100,60 C 110,60 140,70 135,100 Z" />
                            <path d="M 75,70 C 70,40 100,30 110,30 C 120,30 130,40 125,70" />
                            <circle cx="110" cy="25" r="8" />
                            <line x1="70" y1="110" x2="130" y2="110" />
                            <line x1="80" y1="130" x2="120" y2="130" />
                            <line x1="90" y1="150" x2="110" y2="150" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Sun -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="100" cy="100" r="40" />
                            <line x1="100" y1="20" x2="100" y2="50" />
                            <line x1="100" y1="150" x2="100" y2="180" />
                            <line x1="20" y1="100" x2="50" y2="100" />
                            <line x1="150" y1="100" x2="180" y2="100" />
                            <line x1="45" y1="45" x2="65" y2="65" />
                            <line x1="155" y1="155" x2="135" y2="135" />
                            <line x1="45" y1="155" x2="65" y2="135" />
                            <line x1="155" y1="45" x2="135" y2="65" />
                            <circle cx="85" cy="90" r="5" /><circle cx="115" cy="90" r="5" />
                            <path d="M 85,110 A 15,15 0 0,0 115,110" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Moon & Stars -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 120,40 C 60,40 60,160 120,160 C 90,140 90,60 120,40 Z" />
                            <circle cx="50" cy="50" r="5" />
                            <circle cx="150" cy="100" r="8" />
                            <circle cx="80" cy="150" r="4" />
                            <circle cx="160" cy="50" r="6" />
                            <circle cx="40" cy="120" r="7" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Boat -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 40,120 L 160,120 L 140,160 L 60,160 Z" />
                            <line x1="100" y1="120" x2="100" y2="40" />
                            <path d="M 100,40 L 150,110 L 100,110 Z" />
                            <path d="M 100,50 L 60,110 L 100,110 Z" />
                            <path d="M 20,150 Q 40,130 60,150 T 100,150 T 140,150 T 180,150" fill="none" stroke="black" />
                            <path d="M 20,170 Q 40,150 60,170 T 100,170 T 140,170 T 180,170" fill="none" stroke="black" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Dinosaur -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 120,50 C 140,50 150,70 150,90 C 120,90 120,120 150,120 L 150,160 L 130,160 L 130,130 C 100,140 70,140 50,160 L 30,160 C 30,120 50,100 80,90 C 80,60 100,50 120,50 Z" />
                            <circle cx="130" cy="70" r="4" />
                            <path d="M 80,90 L 70,70 L 90,85" />
                            <path d="M 95,75 L 85,55 L 105,70" />
                            <path d="M 60,105 L 45,95 L 70,115" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Guitar -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 70,120 C 50,100 50,70 80,70 C 100,70 110,90 130,90 C 160,90 160,140 130,160 C 100,180 60,170 70,120 Z" />
                            <circle cx="105" cy="120" r="15" />
                            <rect x="98" y="20" width="14" height="85" />
                            <rect x="90" y="10" width="30" height="20" />
                            <line x1="100" y1="105" x2="100" y2="20" />
                            <line x1="105" y1="105" x2="105" y2="20" />
                            <line x1="110" y1="105" x2="110" y2="20" />
                          </g>
                        </svg>
                    </div>
                </div>
                <div class="card">
                    <div class="card-inner">
                        <!-- Teddy Bear -->
                        <svg viewBox="0 0 200 200" width="85%" height="85%" xmlns="http://www.w3.org/2000/svg">
                          <g fill="white" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="100" cy="80" r="40" />
                            <circle cx="65" cy="45" r="20" />
                            <circle cx="135" cy="45" r="20" />
                            <circle cx="100" cy="150" r="45" />
                            <circle cx="55" cy="170" r="20" />
                            <circle cx="145" cy="170" r="20" />
                            <circle cx="60" cy="120" r="15" />
                            <circle cx="140" cy="120" r="15" />
                            <circle cx="85" cy="75" r="5" />
                            <circle cx="115" cy="75" r="5" />
                            <ellipse cx="100" cy="95" rx="15" ry="10" />
                            <circle cx="100" cy="92" r="3" fill="black" />
                          </g>
                        </svg>
                    </div>
                </div>
`;

fs.writeFileSync('selection.html', part1 + newCards + part2);
console.log('Update complete.');
