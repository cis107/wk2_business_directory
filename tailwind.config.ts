import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ADD THIS SECTION:
  safelist: [
    'bg-blue-100', 'text-blue-800',
    'bg-green-100', 'text-green-800',
    'bg-amber-100', 'text-amber-800',
    'bg-indigo-100', 'text-indigo-800',
    'bg-orange-100', 'text-orange-800',
    'bg-purple-100', 'text-purple-800',
    'bg-teal-100', 'text-teal-800',
    'bg-pink-100', 'text-pink-800',
    'bg-cyan-100', 'text-cyan-800',
    'bg-gray-100', 'text-gray-800',
    'bg-slate-100', 'text-slate-800',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
