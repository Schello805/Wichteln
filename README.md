# Wichtelhelfer

Eine moderne Web-App für das beliebte Schrottwichteln-Spiel.

## Funktionen

- **Virtuelle Würfel**: Ein oder mehrere Würfel können geworfen werden.
- **Regelanzeige**: Automatische Anzeige der Regel basierend auf dem Wurfergebnis (jetzt als Overlay!).
- **Timer**: Ein integrierter Timer für zeitbegrenzte Runden.
- **Einstellungen**: Anpassbare Regeln, Anzahl der Würfel und Sound-Optionen.
- **Table-Mode**: Split-Screen und Rotation für das Spielen am Tisch.
- **Manuelle Eingabe**: Falls echte Würfel verwendet werden sollen.
- **Verlauf**: Anzeige der letzten Würfe.
- **Responsive Design**: Funktioniert auf Desktop und Mobile.
- **PWA**: Installierbar als App auf dem Smartphone.
- **Spaßfaktoren**: Soundeffekte, Vibration und Konfetti bei Jokern!

## Installation (Lokal)

1. Repository klonen:
   ```bash
   git clone https://github.com/Schello805/Wichteln.git
   ```
2. In das Verzeichnis wechseln:
   ```bash
   cd Wichteln
   ```
3. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

## Installation auf Linux Server (Debian/Ubuntu)

Diese Anleitung beschreibt die Installation auf einem typischen Linux-Webserver (z.B. mit Apache oder Nginx).

### 1. Voraussetzungen installieren

Stelle sicher, dass `git`, `curl` und `node` (mindestens v18) installiert sind.

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Git und Curl installieren
sudo apt install git curl -y

# Node.js installieren (falls noch nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Projekt einrichten

Klone das Repository in dein Web-Verzeichnis (z.B. `/var/www/html/Wichteln`).

```bash
cd /var/www/html
sudo git clone https://github.com/Schello805/Wichteln.git
sudo chown -R $USER:$USER Wichteln
cd Wichteln
```

### 3. Installation & Build

Du kannst das beiliegende `install.sh` Skript verwenden, um die Installation und zukünftige Updates zu vereinfachen.

```bash
# Skript ausführbar machen
chmod +x install.sh

# Installation starten
./install.sh
```

Das Skript führt automatisch `npm install` und `npm run build` aus. Der fertige Build liegt dann im Ordner `dist`.

### 4. Webserver konfigurieren

#### Apache

Erstelle eine Konfigurationsdatei: `/etc/apache2/sites-available/wichteln.conf`

```apache
<VirtualHost *:80>
    ServerName wichteln.deine-domain.de
    DocumentRoot /var/www/html/Wichteln/dist

    <Directory /var/www/html/Wichteln/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Für SPA Routing (React Router)
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/wichteln_error.log
    CustomLog ${APACHE_LOG_DIR}/wichteln_access.log combined
</VirtualHost>
```

Aktiviere die Seite:
```bash
sudo a2ensite wichteln.conf
sudo a2enmod rewrite
sudo systemctl reload apache2
```

#### Nginx

Erstelle eine Konfigurationsdatei: `/etc/nginx/sites-available/wichteln`

```nginx
server {
    listen 80;
    server_name wichteln.deine-domain.de;
    root /var/www/html/Wichteln/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktiviere die Seite:
```bash
sudo ln -s /etc/nginx/sites-available/wichteln /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Wichtiger Hinweis zu PWA & HTTPS

Damit die PWA-Funktionen (Service Worker, Installation auf Handy) funktionieren, **MUSS** die Seite über **HTTPS** ausgeliefert werden. Nutze dafür z.B. Let's Encrypt (`certbot`).

## Rechtliches

**Impressum:**  
Michael Schellenberger  
info@schellenberger.biz

**Datenschutz:**  
Siehe [DATENSCHUTZ.md](DATENSCHUTZ.md).

**Hinweis:**  
Dieses Projekt ist Open Source und wurde mit Unterstützung von KI erstellt.  
Quellcode: [https://github.com/Schello805/Wichteln](https://github.com/Schello805/Wichteln)

## Lizenz

Erstellt von M. Schellenberger.
