# Recipe Parser

A Next.js application that parses recipes from URLs, converts measurements to metric (NZ standard), and provides print-friendly output.

## Features

- Parse recipes from any recipe website
- Automatic measurement conversion to metric
- New Zealand-specific equivalents (e.g., "1 stick butter" → "125g")
- Toggle between original and converted measurements
- Save recipes locally (localStorage)
- Print-friendly layout (single page)
- Temperature conversion (Fahrenheit → Celsius)

## Getting Started

### Prerequisites

- **Node.js 20.9.0 or later** (currently using v20.19.6)
- npm or yarn
- Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. Clone or navigate to this directory:
   ```bash
   cd recipe-parser
   ```

2. Copy the environment template and add your API key:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Parse a Recipe**: Enter a recipe URL and click "Parse Recipe"
2. **View Recipe**: The parsed recipe will display with converted measurements
3. **Toggle Measurements**: Switch between metric and original measurements
4. **Print**: Click the print button for a clean, single-page layout
5. **Save**: Recipes are automatically saved to localStorage
6. **Delete**: Remove recipes you no longer need

## How It Works

### Parsing Strategy

The app uses a 3-tier approach:

1. **JSON-LD First** (fast, free): Checks for schema.org Recipe markup
2. **HTML Preprocessing** (token reduction): Cleans HTML to focus on recipe content
3. **LLM Parsing** (flexible): Uses Claude API as fallback for sites without structured data

### Measurement Conversion

- Automatic conversion of US/Imperial measurements to metric
- Special handling for NZ equivalents (butter sticks, can sizes, etc.)
- Fraction parsing (1/2, ½, 1 1/2, etc.)
- Range support (1-2 cups → 250-500ml)
- Temperature conversion (350°F → 175°C)

### Storage

Recipes are stored in browser localStorage:
- No server-side database needed
- Data persists across sessions
- Automatic cleanup when quota is exceeded

## Project Structure

```
recipe-parser/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── api/parse-recipe/   # Recipe parsing endpoint
│   │   ├── recipe/             # Recipe display page
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   ├── lib/
│   │   ├── parsers/            # Recipe parsing logic
│   │   ├── converters/         # Measurement conversion
│   │   ├── storage/            # localStorage operations
│   │   └── utils/              # Utility functions
│   ├── types/                  # TypeScript types
│   └── styles/                 # CSS files
├── public/                     # Static assets
└── package.json
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Parsing**: Cheerio, Claude API
- **Validation**: Zod

## Deployment

### Environment Variables

The app uses environment variables for configuration. **Never commit `.env.local` or any file containing your API key to git.**

#### Required Environment Variables:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

#### Local Development:
1. Copy `.env.local.example` to `.env.local`
2. Add your API key to `.env.local`
3. The `.gitignore` file ensures this won't be committed

#### Production Deployment:

**Vercel:**
1. Go to your project settings → Environment Variables
2. Add `ANTHROPIC_API_KEY` with your API key value
3. Deploy normally - Vercel will inject the variable at build time

**Netlify:**
1. Go to Site settings → Environment variables
2. Add `ANTHROPIC_API_KEY` with your API key value
3. Deploy normally

**Docker:**
```bash
docker run -e ANTHROPIC_API_KEY=your_key_here your-image
```

**Other Platforms:**
Most hosting platforms support environment variables through their dashboard or CLI. Set `ANTHROPIC_API_KEY` before deployment.

## Cost

The app uses the Claude API (Haiku model) for parsing recipes when structured data isn't available:
- Estimated cost: $0.001-0.005 per recipe
- Most modern recipe sites use JSON-LD (free parsing)
- Parsed recipes are cached in localStorage

## Troubleshooting

### "Failed to parse recipe"
- The URL may require JavaScript to load (try a different recipe site)
- The site may not contain a recipe
- Your API key may be invalid

### "Storage quota exceeded"
- Delete old recipes to free up space
- localStorage has a ~5-10MB limit per domain

### Recipe not displaying correctly
- Try parsing again
- Some recipe sites have unusual formatting

## Future Enhancements

- User accounts for cloud sync
- Recipe editing
- Shopping list generation
- Meal planning
- Recipe scaling
- Browser extension

## License

ISC
# recipe-parser
