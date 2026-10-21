export interface Helpline { num: string; name: string; type: 'Emergency' | 'Counselling'; when: string }

// Numbers are the national helplines named in the project brief.
// Availability and routing vary by state (several states route 1098/181 through 112): verify before launch.
export const HELPLINES: Helpline[] = [
  { num: '112', name: 'Emergency Response Support System', type: 'Emergency', when: 'Pan-India emergency number for police, fire or medical emergencies, or if you are in immediate danger.' },
  { num: '1098', name: 'CHILDLINE – Child Helpline', type: 'Emergency', when: 'For any child or adolescent in need of care or protection: abuse, forced marriage, child labour, or being unsafe at home.' },
  { num: '181', name: 'Women Helpline', type: 'Emergency', when: 'For women and girls facing violence or harassment. Availability and routing depend on the state.' },
  { num: '14416', name: 'Tele-MANAS – Mental Health Support', type: 'Counselling', when: 'Free, confidential counselling for stress, anxiety, low mood or emotional distress. Not an emergency service: call 112 if you are in danger.' },
];
