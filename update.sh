#!/bin/bash

# Konfiguration
PROJECT_DIR="/var/www/html/Wichteln"
BRANCH="main"
LOG_FILE="update.log"

# Farben für die Ausgabe
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funktion für Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [ERROR] $1" >> "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [WARN] $1" >> "$LOG_FILE"
}

echo "========================================"
echo "   Wichteln App Update Script"
echo "========================================"

# Prüfen ob wir im richtigen Verzeichnis sind oder das Verzeichnis existiert
if [ -d "$PROJECT_DIR" ]; then
    log "Wechsle in Projektverzeichnis: $PROJECT_DIR"
    cd "$PROJECT_DIR" || error "Konnte nicht in das Verzeichnis wechseln."
else
    # Wenn wir das Skript lokal testen wollen, nutzen wir das aktuelle Verzeichnis
    warn "Projektverzeichnis $PROJECT_DIR nicht gefunden. Nutze aktuelles Verzeichnis: $(pwd)"
    PROJECT_DIR=$(pwd)
fi

# Prüfen ob Git installiert ist
if ! command -v git &> /dev/null; then
    error "Git ist nicht installiert."
fi

# Prüfen ob npm installiert ist
if ! command -v npm &> /dev/null; then
    error "npm ist nicht installiert."
fi

log "Starte Update-Prozess..."

# Git Status prüfen
if [ -d ".git" ]; then
    log "Hole neueste Änderungen von git..."
    git fetch origin "$BRANCH" || error "Fehler beim Abrufen der Änderungen."
    git reset --hard "origin/$BRANCH" || error "Fehler beim Reset auf origin/$BRANCH."
else
    error "Kein Git-Repository gefunden."
fi

# Abhängigkeiten installieren
log "Installiere Abhängigkeiten..."
npm install || error "Fehler bei npm install."

# Build erstellen
log "Erstelle Production Build..."
npm run build || error "Fehler beim Build-Prozess."

log "Update erfolgreich abgeschlossen!"
echo "========================================"
