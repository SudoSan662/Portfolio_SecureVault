# 🔐 Portfolio SecureVault

Zero-Knowledge Passwort-Manager · AES-256-GCM · GitHub als verschlüsselter Cloud-Speicher.

[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-00e07a?style=flat-square&logo=github)](https://DEIN-USERNAME.github.io/Portfolio_SecureVault/)
[![Security](https://img.shields.io/badge/Crypto-AES--256--GCM-00e07a?style=flat-square)]()
[![Zero Knowledge](https://img.shields.io/badge/Architecture-Zero--Knowledge-00e07a?style=flat-square)]()
[![Tests](https://img.shields.io/badge/Security%20Tests-59%20passed%20·%200%20failed-00e07a?style=flat-square)]()
[![Version](https://img.shields.io/badge/Version-1.1-00e07a?style=flat-square)]()

---

## Was ist SecureVault?

SecureVault ist ein Zero-Knowledge Passwort-Manager der vollständig im Browser läuft. Passwörter werden clientseitig verschlüsselt bevor sie GitHub erreichen — kein Backend, kein SaaS-Abo, volle Datenkontrolle.

Ideal für Teams, Agenturen und sicherheitsbewusste KMUs die Kundenzugänge verwalten und externe Mitarbeitende projektbasiert einbinden müssen.

---

## Features (v1.1 · Aktuell)

### Sicherheit
- 🔒 **AES-256-GCM** Verschlüsselung — jeder Eintrag einzeln, mit zufälligem IV
- 🔑 **PBKDF2** Key Derivation — 200.000 Iterationen, SHA-256
- 👁️ **Zero-Knowledge** — GitHub sieht nur verschlüsselte Blobs, nie Klartextdaten
- 🛡️ **Brute-Force Schutz** — 5 Versuche, dann 5-Minuten Lockout
- 🧂 **Kryptografisch sichere Salts** — 24 Byte pro User, verhindert Rainbow-Table-Angriffe

### Team & Zugang
- 👥 **Team Vault** — mehrere User teilen denselben verschlüsselten Vault
- 🔑 **GitHub Token Access Control** — Zugang sofort entziehbar, zeitbasiert via Token TTL
- 👤 **Multi-User** — Admin erstellt neue User direkt im Vault
- 🔐 **Individueller Master-Key** — jeder User hat sein eigenes Passwort, kein geteiltes Secret

### Vault & UX
- 📁 **Projekte / Kategorien** — Passwörter strukturiert nach Kunden oder Bereichen
- 🎲 **Passwort-Generator** — kryptografisch sicher, 142-Bit Entropie, direkt in Clipboard
- 🔍 **Echtzeit-Suche** — filtert über Titel, Benutzername und URL
- 👁️ **Reveal Toggle** — Passwörter standardmässig verborgen, per Klick sichtbar
- 📋 **1-Click Copy** — Passwort und Benutzername einzeln kopierbar

### Password Aging Tracker *(neu in v1.1)*
- 🟢 **Farbige Age-Badges** auf jeder Passwort-Karte — Grün → Gelb → Orange → Rot
- ⚠️ **Sidebar-Filter "Zu erneuern"** — zeigt alle abgelaufenen Passwörter auf einen Blick
- ⚙️ **Konfigurierbarer Schwellenwert** — Standard 90 Tage, einstellbar auf 30 / 60 / 180 / 365 Tage
- ↻ **Quick-Renew Button** — öffnet Edit-Modal direkt vorausgefüllt für abgelaufene Einträge
- 🔔 **Warning-Banner** — erscheint automatisch wenn mehr als 5 Passwörter abgelaufen sind

### Sync & Infrastruktur
- ☁️ **GitHub API** als verschlüsselter Remote-Speicher — 0€/Monat
- 🔄 **Conflict Handling** — SHA pre-check + 409 Resolver verhindert Datenverlust
- 📱 **No Install** — läuft im Browser, kein App-Store, kein Backend
- 🌐 **Multi-Device** — selber Vault auf jedem Gerät via Token + Master-Passwort

---

## Roadmap

### 🔌 Milestone 1 · Autofill Browser Extension
> Status: 🔵 Geplant · Aufwand: ~6 Wochen

Passwörter direkt in Login-Felder einfügen ohne Copy-Paste. Die Extension erkennt Login-Formulare automatisch und schlägt passende Einträge vor.

- Chrome & Firefox Extension (Manifest V3)
- Automatische Domain-Erkennung — nur passende Einträge werden vorgeschlagen
- 1-Click Autofill nach User-Bestätigung
- Auto-Lock nach Inaktivität
- Vault-Key bleibt im Memory der Extension — verlässt nie den Browser
- HTTPS-only Autofill als Sicherheitsmassnahme

---

### 🗂️ Milestone 2 · Granulare Projekt-Zugriffskontrolle & Schreibrechte
> Status: 🔵 Geplant · Aufwand: ~4 Wochen

Ein Freelancer soll nur Projekt „Autohaus" sehen, nicht alle anderen Kundenprojekte — und selbst dort nur lesen, nicht bearbeiten. Mit M2 bekommt jedes Projekt einen eigenen Verschlüsselungs-Key, und jeder User erhält beim Einladen nicht nur eine Projektzuweisung, sondern auch eine Berechtigungsstufe: **was** er sieht und **was** er darin tun darf.

#### Projektzugang

Der Admin bestimmt beim Erstellen eines Accounts oder nachträglich, auf welche Projekte ein User überhaupt Zugriff hat. Ein User ohne Projektzugang erhält den Verschlüsselungs-Key dieses Projekts nie — er kann die Einträge technisch nicht entschlüsseln, auch nicht mit direktem API-Zugriff auf das Repository.

- Per-Project Keys — jedes Projekt hat einen eigenen AES-256-GCM Key
- User erhalten nur die Keys der Projekte, für die sie freigeschaltet sind
- Key-Rotation bei Offboarding — entzogene Keys werden neu generiert
- Migration bestehender Vaults automatisch beim Upgrade

#### Schreib- und Leserechte pro Projekt

Zusätzlich zum Projektzugang wird beim Anlegen eines Accounts pro Projekt eine Berechtigungsstufe vergeben. Diese legt fest ob ein User in einem Projekt nur lesen oder auch aktiv Einträge verwalten kann.

| Stufe | Sehen | Kopieren | Anlegen | Bearbeiten | Löschen |
|-------|-------|----------|---------|------------|---------|
| **Kein Zugang** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Leser** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Mitarbeiter** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Verwalter** | ✅ | ✅ | ✅ | ✅ | ✅ |

Die Berechtigungsstufe wird verschlüsselt im Vault gespeichert und beim Login clientseitig ausgelesen. Für jedes Projekt kann ein User eine andere Stufe haben — z.B. Leser in „Kunde A" und Mitarbeiter in „Kunde B".

#### Ablauf beim Einladen eines neuen Users

```
Admin öffnet "Nutzer erstellen"
        │
        ▼
Benutzername + Master-Passwort festlegen
        │
        ▼
Projekte auswählen → pro Projekt: Leser / Mitarbeiter / Verwalter
        │
        ▼
System verschlüsselt die freigegebenen Project-Keys
mit dem neuen User-Key und speichert sie im Vault
```

Der neue User sieht nach dem Login ausschliesslich die Projekte, für die er freigeschaltet wurde. Die Berechtigungsstufe steuert, welche UI-Elemente sichtbar sind und welche Schreiboperationen serverseitig erlaubt werden.

#### Rollen-Übersicht (vollständiges System ab M2)

| Rolle | Beschreibung | Typischer Einsatz |
|-------|--------------|-------------------|
| **Admin** | Voller Zugriff auf alle Projekte und alle Verwaltungsfunktionen | Vault-Eigentümer |
| **Verwalter** | Lesen, schreiben und löschen in zugewiesenen Projekten | Senior-Teammitglied |
| **Mitarbeiter** | Lesen und schreiben (kein Löschen) in zugewiesenen Projekten | Reguläres Teammitglied |
| **Leser** | Nur lesen und kopieren in zugewiesenen Projekten | Freelancer, externer Zugang |

- Admin vergibt und entzieht Projektzugänge und Berechtigungsstufen jederzeit
- Berechtigungsänderungen sind sofort wirksam — beim nächsten Speichern greift die neue Stufe
- Zeitlich begrenzte Accounts möglich: Ablaufdatum beim Erstellen setzbar (ideal für Freelancer-Projekte)


---

### 🕊️ Milestone 3 · Nachlass-Funktion (Digital Legacy)
> Status: 🔵 Geplant · Aufwand: ~4 Wochen

Falls der Vault-Eigentümer den Zugang verliert, soll eine vorher bestimmte Vertrauensperson Zugang erhalten — ohne dass diese Person heute schon Zugang hat.

- **Dead Man's Switch** — konfigurierbares Check-in Intervall (30/60/90 Tage)
- 7-Tage Warnung per Notification vor Ablauf der Frist
- Vault-Key wird mit Public-Key der Vertrauensperson verschlüsselt (ECDH)
- Manuelle Bestätigung durch Vertrauensperson erforderlich — kein Automatismus
- Recovery Code für den Eigentümer zum jederzeitigen Zurücksetzen
- Verschlüsselter Legacy-Key in separater Datei `legacy.enc` im Repo


---

## Sicherheitsarchitektur

```
Master-Passwort (nur im RAM)
        │
        ▼
PBKDF2 (200k Iterationen, SHA-256, Salt)
        │
        ├── Auth-Hash    → in vault.db.enc (Login-Verifikation)
        └── AES-256 Key  → nur im RAM, nie gespeichert
                │
                ▼
        Vault-Key (Team-Schlüssel, verschlüsselt pro User)
                │
                ▼
        Verschlüsselte Einträge (AES-256-GCM)
                │
                ▼
        GitHub API → vault.db.enc (nur verschlüsselter Blob)
```

**Was GitHub sieht:** Einen verschlüsselten Base64-Blob.
**Was GitHub NICHT sieht:** Passwörter, Benutzernamen, Master-Passwort, Encryption Key.

---

## Conflict Handling

Die App verhindert Datenverlust bei gleichzeitiger Nutzung:

```
Vor jedem Speichern:
  → SHA des aktuellen GitHub-Files prüfen
  → Abweichung erkannt → Konflikt-Dialog

Konflikt-Dialog:
  → GitHub-Version laden (empfohlen)
  → Eigene Version erzwingen (force-push)
  → Abbrechen
```

---

## Security Test Results (v1.1)

| Kategorie | Bestanden | Warnings |
|-----------|-----------|----------|
| XSS Prevention | ✅ 6/6 | 1 |
| SQL Injection | ✅ 4/4 | 2 |
| CSRF Protection | ✅ 4/4 | 0 |
| Authentication | ✅ 6/6 | 1 |
| Cryptography | ✅ 7/7 | 1 |
| Data Storage | ✅ 6/6 | 1 |
| Input Validation | ✅ 6/6 | 0 |
| API Security | ✅ 5/5 | 0 |
| DOM Security | ✅ 5/5 | 1 |
| Data Leakage | ✅ 6/6 | 1 |
| Session Management | ✅ 5/5 | 0 |
| Conflict Resolution | ✅ 4/4 | 0 |
| **Gesamt** | **✅ 59/59** | **7 minor** |

---

## Vergleich mit Alternativen

| Feature | SecureVault | 1Password Teams | Bitwarden | KeePass |
|---------|-------------|-----------------|-----------|---------|
| Zero-Knowledge | ✅ | ✅ | ✅ | ✅ |
| AES-256 | ✅ | ✅ | ✅ | ✅ |
| Monatliche Kosten | **0 €** | ~19 € | ~3 €/User | 0 € |
| Volle Datenkontrolle | ✅ Eigenes Repo | ❌ Ihre Server | ❌ Ihre Server | ✅ |
| Team-Sharing | ✅ | ✅ | ✅ | ❌ Manuell |
| Zeitbasierter Zugang | ✅ Token TTL | ✅ | ❌ | ❌ |
| No Install | ✅ Browser | ❌ App | ❌ App | ❌ App |
| Open Source | ✅ | ❌ | ✅ | ✅ |
| Audit-Log | ❌ by design | ✅ | ✅ Enterprise | ❌ |
| Password Aging | ✅ | ✅ | ✅ | ❌ |

---

## Deployment (5 Minuten)

### Schritt 1 — Repository erstellen

```bash
# GitHub CLI
gh repo create Portfolio_SecureVault --public --clone
cd Portfolio_SecureVault

# oder manuell: github.com → New repository → Portfolio_SecureVault
git clone https://github.com/DEIN-USERNAME/Portfolio_SecureVault.git
cd Portfolio_SecureVault
```

### Schritt 2 — Dateien hinzufügen

```bash
git add index.html
git commit -m "🔐 Portfolio_SecureVault — initial deploy"
git push origin main
```

### Schritt 3 — GitHub Pages aktivieren

```
GitHub Repo → Settings → Pages
→ Source: Deploy from a branch
→ Branch: main / (root)
→ Save
```

Nach ~60 Sekunden live unter `https://DEIN-USERNAME.github.io/Portfolio-SecureVault/`

---

## GitHub Token erstellen

```
github.com/settings/personal-access-tokens/new

Token name:        SecureVault
Expiration:        365 Tage (oder Projektdauer für externe User)
Repository access: Only select repositories → Portfolio_SecureVault
Permissions:
  → Contents:  Read and Write
  → Metadata:  Read (automatisch)
```

---

## Technologie

| Komponente | Technologie |
|------------|-------------|
| Verschlüsselung | Web Crypto API (nativ im Browser) |
| Key Derivation | PBKDF2 · 200k iter · SHA-256 |
| Symmetric Enc | AES-256-GCM · 12-Byte IV |
| Storage | GitHub Contents API |
| Hosting | GitHub Pages |
| Dependencies | **Keine** — pure Vanilla JS |

---

## Bekannte Limitierungen

- Kein Audit-Log — Zero-Knowledge by design, der Betreiber sieht nicht was entschlüsselt wird
- Kein granularer Projektzugang pro User — kommt mit Milestone 2
- GitHub API Rate Limits bei sehr vielen gleichzeitigen Nutzern
- Token-Management erfordert GitHub-Konto für jeden User

---

## Warum GitHub als Storage?

- **Zero Infrastrukturkosten** — 0€/Monat, 99.9% Uptime
- **Native Versionierung** — Git History als automatisches Backup
- **Zero-Knowledge by design** — GitHub kann nicht entschlüsseln
- **Fine-grained Access Control** — Token nur für dieses eine Repo
- **Sofortiger Zugangsentzug** — Token deaktivieren = kein Zugang mehr

*Tradeoffs: Metadaten-Exposition (Sync-Zeitpunkte sichtbar), kein Granular-Access auf Eintrags-Ebene (kommt mit M2), API Rate Limits bei vielen gleichzeitigen Nutzern.*

---

## Changelog

### v1.1
- ✅ Password Aging Tracker — farbige Age-Badges, Sidebar-Filter, Warning-Banner, Quick-Renew, konfigurierbarer Schwellenwert

### v1.0
- ✅ Initiales Release — AES-256-GCM, PBKDF2, Multi-User, GitHub Sync, Conflict Handling, Passwort-Generator

---

*SecureVault v1.1 ist produktionsbereit für kleine bis mittelgrosse Teams. Die Milestones 1–3 erweitern die Plattform schrittweise zur vollständigen Enterprise-Lösung.*
