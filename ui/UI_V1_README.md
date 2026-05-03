# Glassroof UI — v1

Anonymous rent transparency platform. Map-based rent data sharing without accounts or personal information.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

The app runs at `http://localhost:5173` (or the port Vite assigns). Uses HashRouter, so navigate via `/#/map`, `/#/info`, etc.

## Project Structure

```
src/
├── components/
│   ├── Header.jsx       # Navigation bar with logo and menu
│   └── Header.css
├── pages/
│   ├── Home.jsx         # Landing page — calls to action
│   ├── Home.css
│   ├── Map.jsx          # Core map page with location + listing tabs
│   ├── Map.css
│   ├── Info.jsx         # Privacy policy and contact
│   └── Info.css
├── App.jsx              # Main app with routing
├── App.css
├── main.jsx             # React entry point
└── index.css            # Global styles
```

## Technology Stack

- **React 19** — UI framework
- **React Router** — HashRouter for client-side routing
- **Ant Design 6** — UI components (Button, Form, Input, Select, DatePicker, Tabs, etc.)
- **MapLibre GL** — Open-source map library
- **Vite** — Fast build tool and dev server
- **ESLint** — Code linting

## Pages

### Home (`/#/`)
- Clean landing page with headline and CTA
- Links to the map
- Static preview placeholder

### Map (`/#/map`)
- **Two-panel layout:**
  - Left: Full-height MapLibre map with rent clusters
  - Right: Tabbed panel (380px wide)

**Tab 1 — Location:**
- Geolocation permission flow
- Fallback to address search if denied
- Shows location status

**Tab 2 — Add a Listing:**
- Conversational, step-by-step form
- Collects: unit type, monthly rent, lease start date, optional notes
- Submit button: "Add Anonymously"
- No auth required

### Info (`/#/info`)
- Privacy Policy section (explains data collection, anonymity guarantees)
- Contact section (email link)

## Key Features

✓ **No accounts** — Just drop a pin and add data
✓ **Anonymous by default** — No PII collected, no email required
✓ **HashRouter** — Works with static hosting (GitHub Pages)
✓ **Responsive** — Tabs adapt to mobile (bottom sheet)
✓ **MapLibre integration** — Open-source map rendering
✓ **Ant Design UI** — Clean, professional components

## Form Flow (Add a Listing)

1. "Drop a pin or search your address"
2. "What type of unit?" (Studio / 1BR / 2BR / 3BR+)
3. "What's your monthly rent?" (number input)
4. "When did this lease start?" (month/year picker)
5. "Anything else?" (optional notes)
6. [Add Anonymously] button

## Environment

- Node.js 18+
- npm or yarn

## Future Enhancements (Out of v1)

- Listing verification
- User accounts / auth
- Trend charts and analytics
- Admin moderation
- Mobile-specific optimizations
- Map clustering improvements
- Backend API integration for data persistence

## Development Notes

- Map defaults to New York area (40°N, 74°W) with zoom 12
- Geolocation uses browser's native API
- All listings stored in React state (ephemeral for now)
- Ant Design's default theme (can be customized via ConfigProvider)

---

Built for anonymous rent transparency. Privacy first. 🏠
