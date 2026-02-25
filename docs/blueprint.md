# **App Name**: DevSphere Portfolio

## Core Features:

- Dynamic Project Display: Fetch and showcase developer projects from GitHub API, filtering for live applications with valid homepage URLs, and implementing pagination (6 projects per page) for intuitive navigation.
- Enhanced Project Details Modal: An interactive modal, triggered by hover or click, revealing comprehensive project information, including repository name, live URL, GitHub URL, tech stack with icons, and a concise AI-generated summary of the README.md content. Features blur background, smooth animation, and close functionality (including ESC key support).
- AI-Powered README Summarizer: Utilizes an AI tool to analyze and distill lengthy GitHub README files, extracting and generating succinct, highlight-rich summaries for quick user comprehension within the project details modal.
- Modern Hero Section: A striking introduction with a large, animated heading using a typing effect, alongside clear call-to-action buttons.
- Insightful About Section: Presents developer's profile through a modern split layout, featuring animated skill badges, and dynamically fetched GitHub activity statistics.
- Secure Contact Form: A submission form that securely stores inquiries directly in a Firestore database, providing an animated success message upon successful submission.
- Adaptive Theme Toggle: Allows users to seamlessly switch between dark and light modes, enhancing accessibility and personalized viewing experience with corresponding UI adjustments.

## Style Guidelines:

- The visual experience is grounded in sophistication, with a dark theme setting a premium and tech-oriented tone. The primary hue, a rich and deep violet (#5F1E96), embodies thoughtful design and digital innovation, ensuring elements are distinctly visible on a darker backdrop.
- The background color is a heavily desaturated, very dark gray with a subtle hint of the primary hue (#1B181F), creating a 'dark charcoal' foundation that is easy on the eyes and provides a premium feel.
- A vibrant and energetic light blue (#C4DAFF) serves as the accent color, analogous to the primary hue. This contrasting bright blue is strategically used for interactive elements like CTAs and highlights, drawing attention while maintaining the overall modern aesthetic.
- Headlines and body text will use 'Inter', a grotesque sans-serif font known for its modern, machined, and objective aesthetic, ensuring clean and highly readable content across the portfolio.
- Code blocks and snippets, particularly within rendered README files, will utilize 'Source Code Pro', a monospaced sans-serif, providing clear, structured readability for technical content.
- Emphasize modern, minimalist line-art or subtly filled icons. Skill badges in the 'About' section will be animated with gentle reveal effects or a soft pulse to signify interaction and proficiency.
- A mobile-first, fully responsive grid system will ensure optimal display across all devices. The sticky navbar will feature a subtle glassmorphism effect, appearing slightly translucent and blurred over the content, aligning with the premium aesthetic.
- Subtle yet engaging animations will be incorporated throughout: smooth scrolling, elegant section reveal transitions (e.g., fades and slides), slight 'hover lift' effects for interactive cards, and a sophisticated blurry backdrop animation for modal dialogues.