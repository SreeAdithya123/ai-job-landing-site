import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				headline: ['Sora', 'system-ui', 'sans-serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
				metric: ['Space Grotesk', 'system-ui', 'sans-serif'],
				'resume-heading': ['Playfair Display', 'Georgia', 'serif'],
				'resume-heading-alt': ['Merriweather', 'Georgia', 'serif'],
				'resume-body': ['Lora', 'Georgia', 'serif'],
				'resume-body-alt': ['Source Serif 4', 'Georgia', 'serif'],
			},
			fontSize: {
				'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				'h2': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
				'h3': ['1.375rem', { lineHeight: '1.4' }],
				'body-lg': ['1.125rem', { lineHeight: '1.65' }],
				'body': ['1rem', { lineHeight: '1.65' }],
			},
			letterSpacing: {
				'headline': '-0.02em',
				'title': '-0.01em',
				'button': '0.02em',
				'label': '0.03em',
			},
			lineHeight: {
				'headline': '1.1',
				'title': '1.2',
				'subheading': '1.3',
				'body': '1.65',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
				'medium': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.12)',
				'glow': '0 0 20px rgba(79, 70, 229, 0.15)',
				'glow-secondary': '0 0 20px rgba(56, 189, 248, 0.15)',
				'glow-accent': '0 0 20px rgba(244, 114, 182, 0.15)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.15)' },
					'50%': { boxShadow: '0 0 30px rgba(79, 70, 229, 0.25)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
