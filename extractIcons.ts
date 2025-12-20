import * as TrinilIcons from 'trinil-react';

// Get all icon names
const allIcons = Object.keys(TrinilIcons)
  .filter(key => {
    const exported = TrinilIcons[key as keyof typeof TrinilIcons];
    return typeof exported === 'function';
  })
  .sort();

console.log(`Total icons: ${allIcons.length}`);
console.log('\nAll icon names:');
console.log(allIcons.join('\n'));
