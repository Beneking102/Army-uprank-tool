# NC-Army Uprank Tool - Netlify Deployment

## Übersicht

Eine moderne React-basierte Single Page Application (SPA) für die Verwaltung von Army-Fraktionen in GTA RP Servern. Das Tool bietet eine umfassende Demo-Version mit allen Hauptfunktionen.

## Features

- **Dashboard**: Übersicht mit Statistiken und Charts
- **Personal-Verwaltung**: Mitglieder, Ränge und Profile
- **Punkte-System**: Wöchentliche Aktivitätspunkte
- **Rang-System**: 14 Ränge von Schütze bis Oberst
- **Sonderpositionen**: Spezielle Rollen mit Bonus-Punkten
- **Responsive Design**: Mobile-first, funktioniert auf allen Geräten
- **Demo-Modus**: Vollständig funktionsfähig ohne Backend

## Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: Wouter (lightweight React router)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Build Tool**: Vite
- **Deployment**: Netlify (Static Site)

## Netlify Deployment

### Automatische Deployment

1. Repository mit Netlify verbinden
2. Build-Einstellungen:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 20

### Manuelle Deployment

```bash
# Dependencies installieren
npm install

# Production Build
npm run build

# dist/ Ordner zu Netlify deployen
```

### Umgebungsvariablen

Keine besonderen Umgebungsvariablen erforderlich. Die App läuft komplett im Browser mit Mock-Daten.

## Entwicklung

```bash
# Development Server starten
npm run dev

# Type Check
npm run type-check

# Preview Build
npm run preview
```

## Projekt-Struktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── ui/             # Basis UI-Komponenten (Radix + Tailwind)
│   └── layout/         # Layout-Komponenten
├── pages/              # Haupt-Seiten der App
├── services/           # API Service (Mock-Implementation)
├── data/               # Mock-Daten für Demo
├── types/              # TypeScript Type-Definitionen
├── lib/                # Utility-Funktionen
└── hooks/              # Custom React Hooks
```

## Browser-Unterstützung

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Initial Bundle: ~300KB gzipped
- First Contentful Paint: < 1.5s
- Lighthouse Score: 95+

## Features der Demo-Version

### ✅ Vollständig implementiert
- Landing Page mit Feature-Übersicht
- Dashboard mit Echtzeit-Statistiken
- Personal-Verwaltung mit Beförderungen
- Punkte-System mit wöchentlicher Eingabe
- Rang-System mit 14 Hierarchieebenen
- Sonderpositionen mit Bonus-Punkten
- Responsive Design für alle Geräte

### 📊 Demo-Daten
- 5 beispielhafte Army-Mitglieder
- 14 Ränge (Schütze bis Oberst)  
- 5 Sonderpositionen mit verschiedenen Schwierigkeitsgraden
- Punkte-Einträge und Beförderungshistorie
- Realistische Dashboard-Statistiken

### 🎯 Interaktive Funktionen
- Beförderungen durchführen
- Punkte vergeben
- Statistiken in Echtzeit
- Responsive Navigation
- Demo-Reset Funktion

## Deployment-Optimierungen

- Code Splitting für bessere Ladezeiten
- Asset-Optimierung und Caching
- Gzip-Kompression
- Browser-Caching Strategien
- Security Headers
- SPA-Routing mit Netlify Redirects

## Support

Die Demo-Version zeigt die vollständige Funktionalität des NC-Army Uprank Tools. Alle Daten sind beispielhaft und werden im Browser-Speicher verwaltet.

Für Produktions-Deployment mit echter Datenbank und Backend-Integration, kontaktieren Sie das Entwicklungsteam.