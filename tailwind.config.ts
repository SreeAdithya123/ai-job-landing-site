
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
			colors: {
				border: '#E5E7EB',
				input: '#E5E7EB',
				ring: '#14B8A6',
				background: '#F8FAFC',
				foreground: '#1E293B',
				primary: {
					DEFAULT: '#8B5CF6',
					foreground: '#FFFFFF',
					light: '#C4B5FD',
					hover: '#7C3AED'
				},
				secondary: {
					DEFAULT: '#F1F5F9',
					foreground: '#1E293B'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F1F5F9',
					foreground: '#64748B'
				},
				accent: {
					DEFAULT: '#14B8A6',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E293B'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E293B'
				},
				sidebar: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E293B',
					primary: '#8B5CF6',
					'primary-foreground': '#FFFFFF',
					accent: '#F1F5F9',
					'accent-foreground': '#1E293B',
					border: '#E5E7EB',
					ring: '#14B8A6'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)',
				'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
			},
			backdropBlur: {
				'glass': '16px'
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
				'glow-accent': '0 0 20px rgba(20, 184, 166, 0.3)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'glow': 'glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
