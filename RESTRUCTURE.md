# Umbau: die Dokument-Schicht und das Guides-Theme

Ein Migrationsplan, keine Architekturbeschreibung. Was hier steht, gehört nach
dem letzten Schritt in `ARCHITECTURE.md` — und diese Datei gelöscht.

Was der Umbau erreichen soll, in einem Satz: das System bekommt eine
**Dokument-Schicht** neben der Komponenten-Schicht, ein **Theme**, das
`phpdocumentor/guides` darauf abbildet, und eine **gerenderte Doku-Site**, die
aus derselben Quelle kommt wie Storybook. Warum, steht in `guides-theme/GAPS.md`.

## Wie es danach aussieht

`+` neu · `~` ändert sich · alles andere bleibt, wie es ist.

Gruppiert nach dem, was ein Verzeichnis **ist** — Quelle, Erzeugnis, Export,
Werkzeug, Wort. Das ist dieselbe Ordnung, nach der `ARCHITECTURE.md` das Repo
liest, und der Umbau fügt in drei dieser fünf Gruppen etwas hinzu.

```
typo3-design-system/
│
│  ── QUELLE ─────────────────── von Hand geschrieben ──
├── src/                              das System. Drei Schichten, Peers
│   ├── tokens/                       7 Dateien — colors, controls, fonts,
│   │                                 motion, radius, spacing, typography
│   ├── styles/
│   │   ├── styles.css                Einstieg: Tokens + Komponenten-Schicht
│   │   ├── components.css            das sds--Vokabular, 205 Namen
│   │   ├── document.css           +  die Dokument-Schicht, NICHT in styles.css
│   │   └── _specimen.css             Karten-Chrome, ebenfalls außerhalb
│   ├── components/                   34 Dateien, 26 registrierte Elemente
│   ├── lib/                          element, template, render, highlight, icons
│   └── index.ts                      der Bündel-Einstieg
├── docs/                          ~  NUR die publizierte Doku, RST
│   ├── index.rst                     Landing: die drei Verwendungen
│   ├── design-system.rst             als Claude Design System
│   ├── guides-theme.rst              als Render-Guide-Template
│   ├── frontend.rst                  als eigenständiges Frontend
│   ├── documents.rst                 die Dokument-Schicht
│   ├── guidelines/                   die neun Richtlinien — noch zu übersetzen
│   ├── guides.xml                    Parser, Theme-Pfad, Marke
│   └── _images/                      was die Seiten zeigen
├── stories/                       ~  alles, was Storybook liest
│   ├── guidelines/  9               die MDX-Seiten, hierher gezogen
│   ├── components/  29              die Elemente
│   ├── specimens/   33              was die Karten zeigen
│   ├── pages/        6              ganze Seiten
│   └── lib/          6              figure, page, site, specimen, swatch, Specimen.tsx
├── guides-theme/                  +  das Composer-Paket
│   ├── composer.json                 Abhängigkeiten, PSR-4 — nie ein Lock
│   ├── src/                          die Konfigurations-Extension, Twig-Globals
│   ├── resources/config/             Container-Konfiguration
│   ├── resources/template/           Twig-Overrides gegen die Guides-Pfade
│   ├── acceptance/                   der Acceptance Test: jeder Knoten einmal
│   └── GAPS.md                       was Guides ausgibt und uns fehlt
│
│  ── ERZEUGT ────────────────── nie von Hand anfassen ──
├── specimens/                     ~  drei Wurzeleinträge werden einer
│   ├── components/                   Karten in 5 Gruppen: code, core, data,
│   │                                 navigation, surfaces
│   ├── guidelines/                   32 Richtlinien-Karten
│   └── screens/                      6 Seiten: answer, documentation, feature,
│                                     landing, news, tool-reference
├── fonts/                            21 woff2, aus @fontsource
├── assets/                           icons/, diagrams/, 13 Signets und Marken
│                                     fonts/ und assets/ bleiben: öffentliche API
│
│  ── EXPORT ─────────────────── was das Repo verlässt ──
├── dist/                             npm-Drop-in, eingecheckt: soul.js,
│   └── (+ document.css)           ~  soul.css, index.js, types/
├── ds-bundle/                        Upload-Nutzlast, flache Wurzel
├── site/                          +  die Publish-Wurzel für Pages, NICHT eingecheckt
│   └── _acceptance/                  die Kontrollinstanz, nicht publiziert
│
│  ── WERKZEUG ───────────────────────────────────────────
├── scripts/                          17 Tasks + lib/
│   ├── build.ts                   ~  rechnet die Tiefe, statt sie zu kennen
│   ├── dist.ts                    ~  zweiter CSS-Einstiegspunkt
│   ├── verify.ts                  ~  kennt document.css, liest .twig
│   ├── task.ts                    ~  ein Task mehr: guides
│   ├── cards.ts  fit.ts  ssr.ts      das Tor
│   ├── shoot.ts  diff.ts  sheet.ts   die visuelle Regression
│   ├── status.ts  plan.ts  synced.ts der Sync
│   └── fonts.ts  icons.ts  serve.ts  conventions.ts  lib/
├── tests/                         ~  9 Specs, einer mehr: die Guides-Ausgabe
├── .storybook/                       main, manager, preview, viewports, docs.css
├── .infra/                        ~  Dockerfile — PHP 8.2 und Composer neben Node
├── .design-sync/                     config.json, conventions.md, NOTES.md
├── .github/workflows/             +  die erste CI
├── Makefile                       ~  make guides
├── package.json  tsconfig.json  playwright.config.ts
│
│  ── WORT ──────────────────────────────────────────────
├── ARCHITECTURE.md                ~  wie das Repo gebaut ist
├── SKILL.md                          wie man mit dem System entwirft
├── RATIONALE.md                      warum jede Regel existiert
├── AGENTS.md  CLAUDE.md              wer was liest, und wohin es zeigt
├── README.md  SIGNET-PROMPT.md  THIRD-PARTY.md  LICENSE
└── RESTRUCTURE.md                 +  dieser Plan, danach gelöscht
```

Drei Export-Flächen an der Wurzel, wo heute zwei stehen — und `site/` ist die
einzige, die nicht eingecheckt wird: den Drop-in kopiert jemand, eine gerenderte
Site wird veröffentlicht.

In der Gruppe ERZEUGT bewegt sich genau ein Ding, und zwar nur der Ort: die
drei Specimen-Verzeichnisse werden eines. Keine Karte, kein Screen, keine
Schrift und kein Icon ändert dabei seinen Inhalt — und `ds-bundle/`, das aus
genau diesen Dingen besteht, sieht danach aus wie vorher.

## Was sich nicht bewegt

Zuerst das, damit der Umfang nicht größer aussieht als er ist. Der Umbau ist
**additiv**:

- `src/` bleibt, wo und wie es ist. Kein `packages/`, keine Workspaces.
- `stories/`, `dist/`, `ds-bundle/` bleiben unberührt.
- `.design-sync/config.json` bleibt `shape: "package"`. Der Upload nach
  claude.ai/design ändert sich nicht — auch nicht in Schritt 1b, wo die
  Karten im Repo umziehen: die Namen **im Bundle** sind der Vertrag, nicht
  ihr Ort hier.
- `styles.css` bleibt der eine Einstiegspunkt für das `sds-`-Vokabular. Die
  Dokument-Schicht kommt **daneben**, nicht hinein.

Ein bestehendes Verzeichnis ändert seine Bedeutung: `docs/`. Das ist Schritt 5
und der einzige Schritt ohne bequemen Rückweg. Drei ändern ihren Ort und sonst
nichts: die Specimen-Verzeichnisse in Schritt 1b.

## Was wir angesehen und gelassen haben

Damit es niemand ein zweites Mal durchdenkt:

- **`fonts/`, `assets/`, `dist/` bleiben an der Wurzel.** Sie sind öffentliche
  API: die `exports`-Map nennt `./fonts/*`, `./assets/*`, `./dist/*`, `files`
  liefert sie aus, `main`/`module`/`types` zeigen auf `dist/`. Ein Umzug bricht
  jeden Import bei jedem Verbraucher. Für `fonts/` und `assets/` nennt
  `ARCHITECTURE.md` bereits den zweiten Grund.
- **Kein gemeinsames Verzeichnis für Konfiguration.** `.storybook/` ist
  Werkzeugkonvention, `.design-sync/` ist der Vertrag mit dem Sync-Kit, das
  `config.json` genau dort liest. Zwei von fünf Kandidaten können nicht
  umziehen, und eine Gruppe mit zwei Ausnahmen ist keine. Der Punkt-Präfix
  sortiert sie ohnehin an den Anfang jeder Auflistung.
- **Vier `lib/` statt fünf.** `src/`, `scripts/`, `stories/`, `tests/` haben je
  eines, lokal zu ihrem Verbraucher. `docs/lib/` gibt es nicht mehr: die eine
  Doppelung war echt, `stories/lib/specimen.ts` und `Specimen.tsx` beschreiben
  dasselbe aus zwei Richtungen, und sie liegen jetzt nebeneinander. Die dritte
  Beschreibung in PHP kommt, wenn die Richtlinien umziehen.

## Schritt 0 — der Baum ist grün

Kein Teil des Umbaus, aber Voraussetzung. `make verify` fällt heute an
Schritt 7: `.design-sync/conventions.md` nennt `sds-bands--quiet`,
`sds-surface-icon-body` und `sds-surface-icon-title`, die es nicht mehr gibt.
Dazu liegen `crumbs`, `figure`, `footer` und `stat` uneingecheckt im Baum.

Erst grün, dann umbauen. Sonst ist nach jedem Schritt unklar, wessen Fehler
gerade zu sehen ist.

## Schritt 1 — `build.ts` rechnet die Tiefe, statt sie zu kennen — **erledigt**

Der einzige Schritt, der nichts hinzufügt und trotzdem zuerst kommt.

`scripts/build.ts` schreibt Pfade in Karten und Screens um und bekommt die
Tiefe als Literal gesagt: `rewriteDepth(c.text, '../../../')` für eine Karte,
`'../'` für einen Screen. Das ist die Kopplung, an der das Bundle zweimal
gebrochen ist — nicht weil das Layout falsch wäre, sondern weil eine
deklarierte Tiefe still falsch wird, sobald sich etwas bewegt.

**Tun:** die Tiefe aus dem relativen Pfad der Datei rechnen, die gerade
umgeschrieben wird.

**Getan:** `rewriteDepth(txt, up)` heißt jetzt `rewriteRefs(txt, dir)` und
zählt den Aufstieg aus `relative(OUT, dir)`. Die beiden Literale an den
Aufrufstellen sind weg, ebenso der Kommentar am Screen-Zweig, der die Tiefe ein
drittes Mal behauptete.

**Beweis:** zwei Builds vorher liefern dieselbe Prüfsumme, der Build ist also
deterministisch. Nachher unterscheidet sich **eine** Datei, `_ds_sync.json`,
und darin **ein** Feld: `scriptsSha`, der Hash von `build.ts` selbst. Jede
ausgelieferte Datei ist byte-identisch. `make verify` grün, `make typecheck`
ohne Fehler.

`ARCHITECTURE.md` sagt an dieser Stelle jetzt, was gilt: mit der Layout-Änderung
muss noch die `@import`-Umschreibung mitgehen, die Pfade nennt — die Tiefe nicht
mehr.

Danach kostet jede spätere Verschiebung nichts mehr, und der Rest des Plans
muss sich nicht darum herumbauen.

## Schritt 1b — die Specimen ziehen unter ein Dach — **erledigt**

Lebt von Schritt 1 und steht deshalb hier, nicht später.

`components/`, `guidelines/` und `screens/` liegen an der Wurzel zwischen
Quelle und Export. Sie sind Specimen und sonst nichts:

```
specimens/
├── components/     die Komponenten-Karten, in fünf Gruppen
├── guidelines/     die Richtlinien-Karten
└── screens/        die Starting Points
```

Die Kopplung ist kleiner, als die Menge der Dateien vermuten lässt — alles,
was Karten liest, liest sie durch eine Bibliothek:

- `scripts/lib/cards.ts:87` und `:142` — **zwei Zeilen.** Fit, Screenshots,
  Verify und Diff hängen daran und ändern sich nicht.
- `.storybook/main.ts:69` — eine Zeile, die Karten unter ihrem Pfad ausliefert.
- die Tiefenrechnung aus Schritt 1.

**Die Namen im Bundle bleiben.** `build.ts:199` schreibt nach
`ds-bundle/components/…`, `plan.ts` listet `components/**`, `guidelines/**`,
`screens/**` — das ist der Upload-Vertrag. `build.ts` bildet danach ab, statt
gleichnamig zu kopieren. Der Satz aus `ARCHITECTURE.md`, dass das Bundle flach
ist und das Repo nicht, wird dadurch wahrer.

**Getan.** Die Schätzung „zwei Zeilen" war falsch — sie galt fürs *Lesen*.
Geschrieben und ausgeliefert wird an drei weiteren Stellen, und jede hatte
dieselbe Krankheit wie `build.ts`: einen von Hand geschriebenen Aufstieg.

- `scripts/lib/cards.ts` — die drei Wurzeln, plus `SPECIMENS` und `inRepo()`.
  Ein deklarierter Pfad ist der Name **im Bundle**; wo die Datei hier liegt,
  rechnet dieses Paar aus. Einmal gesagt, überall benutzt.
- `scripts/cards.ts` — der Schreiber rechnet `up` jetzt aus dem Repo-Pfad, und
  `orphans()` vergleicht endlich dasselbe Vokabular auf beiden Seiten. Ohne das
  wären mit einem Schlag 57 Karten „verwaist" gewesen.
- **Acht Story-Dateien schrieben `../assets/` selbst.** Statt acht Literale
  umzuschreiben zählt der Shell auch diesen Aufstieg — dieselbe Stelle, die
  schon die Stylesheets zählt.
- `.storybook/main.ts`, `scripts/look.ts` — Ausliefern und Aufrufen. `look`
  nimmt weiter den Namen, den eine Story schreibt.

**Zwei Defekte, die dabei ans Licht kamen** und beide älter sind als der Umzug:

- `rewriteRefs` kannte für Assets nur `src=`, nicht `href=`. Ein Diagramm ist
  ein `<img src>` *und* ein `<a href>` auf dieselbe Datei; der zweite ging mit
  dem Aufstieg ins Bundle, den er im Repo hatte.
- `unresolvedRefs()` fragte nur, ob eine Referenz *existiert*, nicht ob sie
  **im Bundle** liegt. Ein Aufstieg zu viel landet im Repo, wo `assets/` und
  `src/` beide existieren — die Datei wird gefunden, die Prüfung ist grün, und
  was ausgeliefert wird, zeigt auf nichts. Das ist jetzt eine eigene Meldung,
  und sie kommt vor der Existenzfrage.

**Beweis:** `make verify` grün (57 Karten, 149 Referenzen, 0 gebrochen),
`make test` 85 von 85. Gegenüber dem Stand vor dem Umzug unterscheiden sich im
Bundle zwei Dateien: `_ds_sync.json` — dort `sourceKeys` und `scriptsSha`, also
die Quellen, die sich geändert haben — und
`BrandSignetFamily.prompt.md`, dessen eingebettetes Markup-Beispiel jetzt
`../../assets/` zeigt. Kein `renderHash` hat sich bewegt: jede gerenderte Karte
und jeder Screen ist byte-identisch.

## Schritt 2 — die Dokument-Schicht — **erledigt**

`src/styles/document.css`. Element-Selektoren für das, was ein Renderer
ausgibt und keine Klasse trägt: `h1`–`h6`, `p`, `ul`/`ol`/`li`, `dl`/`dt`/`dd`,
`blockquote`, `hr`, `code`, `pre`, `figure`, `img`, `table`/`caption`, `sup`,
`sub`, `kbd`, `abbr`, `cite`.

**Sie wird von `styles.css` nicht importiert.** Das ist der ganze Punkt: wer
das System für eine Anwendungsoberfläche benutzt, bekommt keine Meinung zu
jedem `<p>` auf der Seite. Wer ein Dokument setzt, nimmt die zweite Datei dazu.
Dieselbe Trennung wie bei `_specimen.css`, aus demselben Grund.

Anzufassen:

- `scripts/dist.ts` — ein zweiter CSS-Einstiegspunkt neben `soul.css`, nach
  `dist/document.css`. Der `exports`-Block in `package.json` deckt das über
  `"./dist/*"` bereits ab.
- `scripts/verify.ts` — Schritt 2 liest heute zwei Stylesheets in die Menge
  der definierten Namen (`components.css`, `_specimen.css`). `document.css`
  kommt dazu.
- `scripts/build.ts` — **nicht** anfassen. Die Dokument-Schicht gehört nicht in
  `ds-bundle/`: dieser Upload ist zum Entwerfen mit dem System, nicht zum
  Setzen von Dokumenten. Damit bleibt die flache Bundle-Wurzel unberührt.

**Getan**, und nicht leer: Gap 1 ist vollständig gesetzt — sechs
Überschriftenebenen, Absätze, Listen samt Verschachtelung,
Definitionslisten, Zitate, Striche, Inline-Code und Codeblöcke, `kbd`, `abbr`,
`cite`, `mark`, hoch- und tiefgestellt, Links, Bilder, Abbildungen mit
Unterschrift, Tabellen mit `caption`.

**Zwei Entscheidungen, die dabei fielen** — beide umkehrbar, beide im
Kopf der Datei begründet:

- **Alles ist auf `.sds-prose` gescopet**, nicht auf blanke Elemente. Sonst
  bekäme eine Doku-Seite auch in ihrer Leiste und ihrer Rail Meinungen zu
  jedem Absatz. Das Theme wickelt die Ausgabe des Renderers in diese Klasse;
  die Möbel drumherum bleiben der Komponenten-Schicht.
- **h4–h6 ohne neue Tokens.** Drei neue Größen wären Dopplungen —
  `--font-size-body` und `--font-size-ui` unter anderem Namen. In einem
  Dokument unterscheidet eine vierte Ebene sich vom Absatz darunter durch
  Gewicht und Luft, nicht durch Größe; die sechste landet im Label-Register,
  das der Rest des Systems für die Wörter der Maschine benutzt.

Dazu die Antwort auf die Maß-Frage: **der Text hält 66ch, die Blöcke nicht.**
Eine Referenz ist Sätze *und* eine vierzigspaltige Tabelle. Der Container gibt
sein eigenes Limit auf und reicht es an das weiter, was aus Wörtern besteht —
Absätze, Listen, Zitate, Überschriften und der Strich, der Interpunktion des
Textes ist. Tabellen, Codeblöcke und Abbildungen laufen bis an die Spalte, und
eine zu breite Tabelle scrollt in sich selbst.

**Beweis:** `make dist` liefert `dist/document.css` (4,7 kB), `make verify`
grün mit 494 statt 493 Dateien im Drop-in-Vergleich, `make test` 85 von 85.
Dazu eine gesetzte Beispielseite in beiden Modi angesehen, statt CSS blind zu
committen — der volle Strich unter dem 66ch-Absatz fiel genau dort auf.

## Schritt 3 — `guides-theme/` als Skelett, und PHP im Bild

```
guides-theme/
  composer.json
  resources/config/soul.php          Container-Konfiguration
  resources/template/                Twig-Overrides, zunächst nur das Layout
```

Das Layout verlinkt `soul.css`, `document.css` und `soul.js` und setzt
`.sds-shell`/`.sds-body`/`.sds-column`. Sonst nichts. Kein Override für
Admonitions, Tabellen oder Code — die kommen später und einzeln, damit man
sieht, was jedes einzelne ändert.

Anzufassen:

- `.infra/Dockerfile` — PHP 8.2 CLI und Composer in die `base`-Stufe. Das ist
  der teuerste Posten des Plans und der einzige, der ein Versprechen des
  Makefiles anfasst: der Host braucht weiterhin nur Docker und Make, aber das
  Bild trägt jetzt zwei Sprachen.
- `scripts/task.ts` — Task `guides`, der ein Fixture nach `site/` rendert.
- `Makefile` — `guides` in die `TASKS`-Liste.
- `.gitignore`, `.dockerignore` — `site/`, `guides-theme/vendor/`.

`site/` wird **nicht** eingecheckt. `dist/` ist eingecheckt, weil Verbraucher
den Drop-in kopieren; eine gerenderte Site kopiert niemand, die wird
veröffentlicht.

**Beweis:** eine gerenderte HTML-Seite in `site/`, im Browser geöffnet, mit
unseren Schriften und Tokens.

## Schritt 4 — das Kitchen-Sink-Fixture

`guides-theme/fixture/` — ein RST-Projekt mit einem Dokument je Knotenfamilie:
Admonitions in allen zwölf Typen, Codeblöcke mit Nummern und hervorgehobenen
Zeilen, Tabellen mit `caption` und `colspan`, Definitions-, Feld- und
Optionslisten, confval, Glossar, Fußnoten, Zitate, Reiter, Abbildungen, Math,
jede Textrolle.

Niemand liest das. Es ist der Beleg, gegen den jeder weitere Schritt geprüft
wird, und es macht die Gap-Liste aus `guides-theme/GAPS.md` sichtbar statt behauptet.

Anzufassen: `tests/` bekommt einen Playwright-Spec, der die gerenderten Seiten
aufnimmt. Damit reicht das visuelle Tor bis in die Guides-Ausgabe.

## Schritt 5 — `docs/` wird Quelle

Der Schritt, der Bedeutung ändert. Bis hierher hat der Umbau nur hinzugefügt.

Heute sind die neun `docs/*.mdx` Storybook-Seiten: rund 500 Zeilen Prosa und
genau ein fremdes Element, `<Specimen src viewport title />`. Danach sind sie
die gemeinsame Quelle für Storybook **und** die Site.

**Offene Entscheidung, vor diesem Schritt zu treffen:** wie `<Specimen>` auf
beiden Seiten gelesen wird. Zwei Wege — die Schreibweise beibehalten und Guides
beibringen, diesen Block zu erkennen; oder eine Direktive schreiben und MDX
beibringen, sie zu dulden. Der erste hält die bestehenden Dateien unverändert,
der zweite ist auf der Guides-Seite die vorgesehene Form.

Anzufassen:

- `guides-theme/src/` — Directive- und Node-Klasse für das Specimen, plus
  Template. Das ist die erste eigene Direktive und die Stelle, an der
  `guides-theme-bootstrap` das Vorbild ist.
- `stories/lib/specimen.ts` und `docs/lib/Specimen.tsx` — hier steht dasselbe
  zweimal, und die PHP-Direktive wäre das dritte Mal. Was ein Specimen ist —
  Pfad, Viewport, Titel — gehört einmal aufgeschrieben und dreimal gerendert.
  Zusammenlegen, während man ohnehin an der Stelle ist.
- `.storybook/main.ts` — der Glob bleibt, solange die Dateien `.mdx` heißen.
- `ARCHITECTURE.md` — `docs/` steht dort heute nicht als Quelle. Muss es dann.

**Beweis:** dieselbe Seite in Storybook und in `site/`, beide mit derselben
Karte an derselben Größe.

**Rückweg:** keiner, der nichts kostet. Ab hier hängen zwei Renderer an einer
Datei.

## Schritt 6 — die erste CI

Das Repo hat kein `.github`. Ein Pages-Rendering ist deshalb nicht ein
Workflow mehr, sondern der erste — und die Frage, die er aufwirft, ist größer
als das Theme: **läuft `make verify` in CI?** Bisher ist das Tor etwas, das
jemand vor dem Commit tippt.

Vorschlag: ein Workflow, zwei Aufgaben. `make verify` auf jedem Push,
`make guides` plus Veröffentlichung auf `main`. Beides im selben Bild, das
schon existiert.

**Offene Entscheidung:** das Bild in jedem Lauf bauen (langsam, aber ohne
Registry) oder nach ghcr schieben und ziehen.

## Schritt 7 — aufräumen

- `ARCHITECTURE.md`: der Layout-Absatz nennt jetzt drei Export-Flächen —
  `dist/` (npm), `ds-bundle/` (Upload), `site/` (Pages) — und `docs/` als
  Quelle. Dazu die Entscheidung, warum die Dokument-Schicht außerhalb der
  `styles.css`-Hülle liegt; das ist genau die Sorte Entscheidung, die diese
  Datei festhält.
- `README.md`: der zweite Einstiegspunkt, und wann man ihn nimmt.
- `guides-theme/GAPS.md`: aus der Gap-Liste wird abgearbeitet, was abgearbeitet ist.
- Diese Datei löschen.

## Offene Entscheidungen, gesammelt

1. Schreibweise des Specimens, gemeinsam für MDX und Guides (Schritt 5).
2. h4–h6 in der Typskala (Schritt 2).
3. Zwölf Admonition-Typen auf vier Tönungen (nach Schritt 4, wenn das Fixture
   sie nebeneinander zeigt).
4. Gilt das 66ch-Maß in einer Referenz, und wie bricht ein Block daraus aus.
5. Läuft `make verify` in CI, und wie kommt das Bild dorthin (Schritt 6).
6. Ob die Dokument-Schicht später doch in `ds-bundle/` gehört — heute nein,
   aber nur, weil dort niemand Dokumente setzt.
