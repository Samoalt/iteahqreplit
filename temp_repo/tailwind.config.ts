
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				},
				// Elastic-inspired color palette
				elastic: {
					navy: {
						50: '#f0f4ff',
						100: '#e0e7ff',
						200: '#c7d2fe',
						300: '#a5b4fc',
						400: '#818cf8',
						500: '#6366f1',
						600: '#4f46e5',
						700: '#4338ca',
						800: '#3730a3',
						900: '#312e81',
						950: '#1e3a8a',
					},
					teal: {
						50: '#f0fdfa',
						100: '#ccfbf1',
						200: '#99f6e4',
						300: '#5eead4',
						400: '#2dd4bf',
						500: '#14b8a6',
						600: '#0d9488',
						700: '#0f766e',
						800: '#115e59',
						900: '#0891b2',
						950: '#042f2e',
					},
					green: {
						50: '#f0fdf4',
						100: '#dcfce7',
						200: '#bbf7d0',
						300: '#86efac',
						400: '#4ade80',
						500: '#22c55e',
						600: '#16a34a',
						700: '#15803d',
						800: '#166534',
						900: '#059669',
						950: '#052e16',
					},
					gray: {
						50: '#f8fafc',
						100: '#f1f5f9',
						200: '#e2e8f0',
						300: '#cbd5e1',
						400: '#94a3b8',
						500: '#64748b',
						600: '#475569',
						700: '#334155',
						800: '#1e293b',
						900: '#0f172a',
						950: '#020617',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'elastic-slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'elastic-scale': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'elastic-pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'elastic-slide-up': 'elastic-slide-up 0.3s ease-out',
				'elastic-scale': 'elastic-scale 0.2s ease-out',
				'elastic-pulse': 'elastic-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			fontFamily: {
				'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
				'display': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
				'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '500' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
				'2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
				'5xl': ['3rem', { lineHeight: '3rem', fontWeight: '700' }],
			},
			fontWeight: {
				'light': '300',
				'normal': '400',
				'medium': '500',
				'semibold': '600',
				'bold': '700',
			},
			boxShadow: {
				'elastic': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
				'elastic-lg': '0 20px 25px -5px rgba(30, 58, 138, 0.1), 0 10px 10px -5px rgba(30, 58, 138, 0.04)',
				'elastic-xl': '0 25px 50px -12px rgba(30, 58, 138, 0.25)',
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 50%, #059669 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
				'gradient-accent': 'linear-gradient(135deg, #0891b2 0%, #059669 100%)',
				'gradient-navy': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
				'gradient-teal': 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
				'gradient-green': 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
