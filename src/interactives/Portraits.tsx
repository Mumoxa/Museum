import { useState } from 'react';
import { award } from '../lib/achievements';

interface Person { name: string; years: string; role: string; note: string; group: '1800s' | 'freedom' }

const PEOPLE: Person[] = [
  { name: 'Shaka', years: 'c. 1787–1828', role: 'Zulu king', note: 'Reorganised the army and built a larger Zulu kingdom. Historians debate his legacy.', group: '1800s' },
  { name: 'Moshoeshoe I', years: 'c. 1786–1870', role: 'Founder of the Basotho nation', note: 'Brought many families together at Thaba Bosiu and negotiated with the Boers and the British.', group: '1800s' },
  { name: 'Cetshwayo', years: 'c. 1826–1884', role: 'Zulu king in 1879', note: 'Led the Zulu kingdom during the Anglo-Zulu War of 1879.', group: '1800s' },
  { name: 'Paul Kruger', years: '1825–1904', role: 'President of the South African Republic (Transvaal)', note: 'Led the Boer republic during the South African War. His government excluded African people from political power.', group: '1800s' },
  { name: 'Albert Luthuli', years: '1898–1967', role: 'ANC president', note: 'Led the ANC during the 1950s and 1960s. Awarded the Nobel Peace Prize.', group: 'freedom' },
  { name: 'Robert Sobukwe', years: '1924–1978', role: 'Founder of the Pan Africanist Congress', note: 'Founded the PAC in 1959. He was imprisoned, and then kept under restriction for years.', group: 'freedom' },
  { name: 'Walter Sisulu', years: '1912–2003', role: 'ANC leader', note: 'Was tried with Mandela and sentenced to life imprisonment in 1964.', group: 'freedom' },
  { name: 'Steve Biko', years: '1946–1977', role: 'Black Consciousness leader', note: 'Encouraged pride and self-reliance. He died in police custody in 1977.', group: 'freedom' },
  { name: 'Nelson Mandela', years: '1918–2013', role: 'Activist, prisoner, and first democratically elected President', note: 'Spent 27 years in prison, 18 of them on Robben Island. President from 1994 to 1999.', group: 'freedom' },
  { name: 'Hendrik Verwoerd', years: '1901–1966', role: 'Prime Minister, 1958–1966', note: 'A leading architect of apartheid. He was assassinated in 1966, and his policies are remembered as a major injustice.', group: 'freedom' },
];

export function Portraits({ note }: { note?: string }) {
  const filter = note === '1800s' || note === 'freedom' ? note : null;
  const list = filter ? PEOPLE.filter((p) => p.group === filter) : PEOPLE;
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="portraits">
      <p className="muted">These are name cards, not photographs, so they do not show what anyone looked like. Tap a card to read more.</p>
      <ul className="portrait-grid">
        {list.map((p) => {
          const initials = p.name.split(' ').map((w) => w[0]).join('').slice(0, 3);
          const isOpen = open === p.name;
          return (
            <li key={p.name}>
              <button
                type="button"
                className="portrait-card"
                aria-expanded={isOpen}
                onClick={() => { setOpen(isOpen ? null : p.name); award('explorer'); }}
              >
                <span className="medallion" aria-hidden="true">{initials}</span>
                <span className="pc-name">{p.name}</span>
                <span className="pc-years">{p.years}</span>
                <span className="pc-role">{p.role}</span>
                {isOpen && <span className="pc-note">{p.note}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
