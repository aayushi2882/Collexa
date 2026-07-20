export interface Vibe {
  id: string;
  label: string;
  height: string;
  gradient: string;
  count: string;
}

export const vibesData: Vibe[] = [
  { id: 'ai', label: 'AI', height: 'h-[340px]', gradient: 'from-[#FFB26B]/25 to-[#171B22]', count: '48 opportunity nodes' },
  { id: 'public-speaking', label: 'Public Speaking', height: 'h-[300px]', gradient: 'from-[#FF8A2A]/20 to-[#171B22]', count: '39 opportunity nodes' },
  { id: 'coding', label: 'Coding', height: 'h-[430px]', gradient: 'from-[#FFB26B]/20 to-[#171B22]', count: '84 opportunity nodes' },
  { id: 'photography', label: 'Photography', height: 'h-[430px]', gradient: 'from-[#FF8A2A]/25 to-[#171B22]', count: '45 opportunity nodes' },
  { id: 'design', label: 'Design', height: 'h-[340px]', gradient: 'from-[#FFB26B]/15 to-[#171B22]', count: '62 opportunity nodes' },
  { id: 'startups', label: 'Startups', height: 'h-[390px]', gradient: 'from-[#FF8A2A]/30 to-[#171B22]', count: '71 opportunity nodes' },
  { id: 'music', label: 'Music', height: 'h-[340px]', gradient: 'from-[#FFB26B]/20 to-[#171B22]', count: '32 opportunity nodes' },
  { id: 'debate', label: 'Debate', height: 'h-[430px]', gradient: 'from-[#FF8A2A]/15 to-[#171B22]', count: '24 opportunity nodes' },
  { id: 'dance', label: 'Dance', height: 'h-[340px]', gradient: 'from-[#FFB26B]/15 to-[#171B22]', count: '18 opportunity nodes' },
  { id: 'hackathons', label: 'Hackathons', height: 'h-[340px]', gradient: 'from-[#FF8A2A]/25 to-[#171B22]', count: '56 opportunity nodes' },
];
