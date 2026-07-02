import fs from 'fs';

let content = fs.readFileSync('src/components/InfosPratiquesTab.tsx', 'utf8');

// Insert the import
content = content.replace(
  'import React, { useState, useEffect } from "react";',
  'import React, { useState, useEffect } from "react";\nimport BerlinMap from "./BerlinMap";'
);

// We need a good place to put BerlinMap. Let's see the end of the "general" section.
// A good place would be after the contact cards.

const contactCardsEnd = `          {/* Contact 2 */}
          <div className="p-4 bg-stone-50 /40 border border-stone-200/60 rounded-[16px] space-y-3.5">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h4 className="font-display font-bold text-stone-850 text-sm">{configs.contactName2 || "Sœur Schmidt"}</h4>
                <p className="text-[10px] text-stone-550 font-semibold uppercase tracking-wider">Logistique / Repas & Transports</p>
              </div>
              <span className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-display font-semibold text-stone-600 text-xs shadow-2xs">
                LO
              </span>
            </div>
            
            <div className="space-y-2">
              <a href={\`tel:\${configs.contactPhone2 || "+49 176 98765432"}\`} className="flex items-center gap-2 text-xs md:text-sm text-stone-600 hover:text-stone-900 transition-colors bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/50">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium">{configs.contactPhone2 || "+49 176 98765432"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* SUB-TAB 2: PHRASES */}`;

const sIdx = content.indexOf('  {/* SUB-TAB 2: PHRASES */}');
if (sIdx !== -1) {
    const endGeneralIdx = content.lastIndexOf('    </div>\n  )}', sIdx);
    
    // We can insert the map just before the closing </div> of the "general" tab content container ?
    // The "general" tab grid has grid-cols-1 lg:grid-cols-3
    // Contacts is in lg:col-span-2.
    // We can just add a new div at the bottom of the grid or something. Let's replace the contacts end block.

    const targetSection = `            </div>
          </div>
        </div>
      </div>
    </div>
  )}`;

    const cIdx = content.indexOf(targetSection);
    if(cIdx !== -1) {
        const replaceSection = `            </div>
          </div>
        </div>
        
        {/* Map Visualization */}
        <div className="mt-6 pt-6 border-t border-stone-200/60">
            <BerlinMap />
        </div>
        
      </div>
    </div>
  )}`;
        content = content.replace(targetSection, replaceSection);
        console.log('Appended map.');
    } else {
        // Find grid closing tag
        console.log('Could not find exact block, performing dynamic insert.');
        const closingJSXOffset = content.lastIndexOf('    </div>\n  )}', sIdx);
        if (closingJSXOffset !== -1) {
             const pre = content.substring(0, closingJSXOffset - 4); // "    "
             const post = content.substring(closingJSXOffset - 4);
             // We actually want the map inside lg:col-span-2 ? 
             // "grid grid-cols-1 lg:grid-cols-3 gap-6" holds column 1 and column 2
             // Let's just insert it here.
             content = pre + '\\n      {/* Map Visualization */}\\n      <div className="lg:col-span-3"><BerlinMap /></div>\\n' + post;
        } else {
             console.log('Failed to insert.');
        }
    }
} else {
    console.log('Target section not found');
}

fs.writeFileSync('src/components/InfosPratiquesTab.tsx', content, 'utf8');
