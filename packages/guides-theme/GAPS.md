# phpDocumentor Guides

Was das Theme noch schuldet, und die Entscheidungen, an die sich alles Weitere
zu halten hat. Was geschlossen ist, steht nicht hier — es steht im Template, in
`src/styles/document.css` oder im Element, und `tests/guides.spec.ts` hält es
fest. Eine Liste, die ihre erledigten Zeilen behält, ist ein Änderungsprotokoll
und wird nicht mehr gelesen.

Grundlage ist die tatsächliche Ausgabe: die HTML-Templates in
`phpdocumentor/guides`, `guides-restructured-text`, `guides-code` und
`guides-graphs`. `guides-theme-bootstrap` ist das Vorbild für die Form, nicht
für den Inhalt.

## Was ein Theme ist

Ein Guides-Theme ist ein Composer-Paket mit zwei Teilen und keinem dritten:

- `resources/template/**/*.html.twig` — Overrides gegen die Pfade des Kerns.
  Ein Template, das nicht überschrieben wird, rendert die Kernausgabe.
- `resources/config/*.php` — Symfony-Container-Konfiguration, die das Theme
  registriert und optional eigene Direktiven mitbringt.

CSS liefert ein Theme nicht aus; das Layout verlinkt es. Der Kern setzt **keine
einzige eigene Klasse mit Präfix** — er schreibt `admonition note`, `section`,
`toc`, `confval`, `guilabel`, oder gar nichts. Wo eine Klasse aus dem
RST-Quelltext kommt (`.. container:: foo`, `:class:`), steht sie ungefiltert im
Markup.

Deshalb tragen zwei Wege zusammen und keiner allein: Templates überschreiben,
damit `sds-`-Klassen und Custom Elements ins Markup kommen, und eine
Dokument-Schicht — `src/styles/document.css`, auf `.sds-prose` gescopet und von
`styles.css` bewusst nicht importiert —, die die Klassen und blanken Elemente
des Kerns auf Tokens abbildet. Weg eins allein lässt jeden Absatz ungestylt,
Weg zwei allein schreibt das System in fremdem Vokabular ein zweites Mal.

## Was entschieden ist

Die Regeln, an die jede offene Zeile unten gebunden ist:

- **Das Theme lebt in diesem Repo** und wird per Subtree-Split ausgeliefert.
- **Der Server schreibt, das Element wertet auf.** Ohne JavaScript muss die
  Seite vollständig lesbar sein — Farbe steht im Markup, Reiter zeigen ihren
  Inhalt, die Rail steht. Das Element bringt Kopf, Kopieren-Knopf, Umschalten
  und Einklappen dazu.
- **Wer färbt, entscheidet der Inhalt.** Trägt er `hljs-`-Klassen, ist er schon
  gefärbt und wird gehalten wie er kam, Wrapper samt Startzeile und
  hervorgehobenen Zeilen; sonst färbt `sds-code` selbst
  (`src/components/code.ts`, `given`). Kein neues Attribut, kein Schalter im
  Theme. Der Klassenversatz zwischen dem highlight.js des Servers und dem hier
  ist harmlos: alles Unbenannte liest als normaler Text.
- **Zwölf Admonition-Typen fallen auf vier Tönungen**, nach Sphinx' eigener
  Gruppierung.
- **Das Maß gilt für Wörter, nicht für Blöcke.** Der Text hält 66ch; Tabellen,
  Codeblöcke und Diagramme laufen bis an die Spalte.
- **Eine Komponente im Fließtext spricht die Größe des Dokuments, eine
  Beschriftung darunter.** Innerhalb von `.sds-prose` werden dafür die Tokens
  umgebunden, die die Komponenten-Schicht ohnehin liest — keine Regel, die ein
  Bauteil einer Komponente benennt, also auch kein Spezifitätskampf.
- **Die Namen des Kerns werden nicht umbenannt.** Eine Ausgabe, die kein
  anderes Werkzeug mehr liest, ist kein Gewinn.

## Welche Schicht was tut

Die Frage, was zum Gerüst gehört, entscheidet gleichzeitig, wer gefüttert wird
und wer Markup annehmen muss.

**Gerüst** — schreibt das Layout einmal, kommt in keinem Dokument vor:
`sds-theme`, `sds-crumbs`, `sds-rail`, `sds-menu`, `sds-pills`, `sds-footer`,
`sds-signet`, dazu die Klassen `.sds-shell`, `.sds-bar`, `.sds-body`,
`.sds-column`, `.sds-page`. Gefüttert aus Guides-Objekten — Menübaum,
Brotkrumen, Projekttitel —, und deren Inhalt sind reine Beschriftungen. Dafür
reichen Attribute; Kinder braucht hier niemand.

**Dokument** — bildet RST-Knoten ab und steht mitten im Fließtext: `sds-note`,
`sds-code`, `sds-table`, `sds-figure`, `sds-tabs`, `sds-diff`, `sds-surface`.
Hier ist Markup annehmen keine Bequemlichkeit, sondern die Bedingung: der
Inhalt eines Knotens ist beliebiger Inhalt.

**Im Satz** — `sds-icon`, `sds-link`, `sds-badge`, und die Textrollen, die es
noch nicht gibt. Für eine Rolle wie `guilabel` oder `kbd` ist ein Custom
Element der falsche Preis: eine Klasse und eine CSS-Regel tun es, und Guides
setzt die Klasse ohnehin schon.

**Anwendung** — `sds-modal`, `sds-dialog`, `sds-drawer`, `sds-overlay`,
`sds-field`, `sds-field-error`. In einer Doku-Seite kommt davon nichts vor,
außer wir stellen die Suche.

## Was nicht an uns liegt

Ein Blockzitat kommt als Definitionsliste heraus. Der eingerückte Block in
`acceptance/index.rst` wird zu `<dl><dt>erste Zeile</dt><dd>zweite Zeile</dd>`,
und `<blockquote>` erscheint in der ganzen Ausgabe kein einziges Mal — die
Regel dafür in `document.css` ist damit unerreichbar, obwohl sie stimmt. Das
ist der Parser und nicht das Theme; die Reparatur wäre eine eigene
Production-Rule hier oder ein Patch dort.

## Knoten ohne Gegenstück

Jede Zeile ist ein Knoten, den Guides rendert und für den es bei uns weder
Klasse noch Komponente gibt.

| Knoten | Markup | Warum es zählt |
| --- | --- | --- |
| **Glossar** | `div` + `dl` mit Ankern | |
| **Annotationsliste** | Sammelknoten | |
| **Zeilenblock** | `div.line-block` > `div.line` | Funktioniert heute nur, weil `div` umbricht — eine Regel hat er nicht. Auch von confval benutzt |
| **Math** | `<math>` bzw. MathJax-Ausgabe | Keine Schrift, keine Regel dafür |
| **Permalink zur Überschrift** | Im Kern gar nicht; Themes hängen ein Ankerzeichen an | Ohne das ist keine Überschrift verlinkbar |
| **Container / wrap** | `div` mit **beliebigen** Klassen aus dem Quelltext | Braucht eine Policy: was darf ein Autor an Klassen setzen |

## Gegenstück da, Markup fremd

| Guides | Bei uns | Was fehlt |
| --- | --- | --- |
| `div.tabs` > `ul > li > button[data-tabs][data-target]` + `div.tab-content` | `sds-tabs` + `sds-tab-item` | Zweite, andere Tab-Form im selben Ausgabeformat. Sie kommt aus keinem hier installierten Paket und ist deshalb nie gerendert worden |
| `figure.uml-diagram` mit einem Bild | Diagramm-Richtlinie mit Hell/Dunkel-Paar | Guides rendert eine Datei. Im dunklen Modus ist sie falsch |
| Fuß-Navigation: `div.rst-footer-buttons` > `a.btn.btn-neutral` mit `span.fa.fa-arrow-circle-left` | `.sds-btn`, `sds-icon` | Icon-Font-Klassen statt unserer Glyphen |

Dazu ein Verhalten statt eines Markups: der `configuration-block` wird zu
`sds-tabs` wie `.. tabs::` auch, aber was die Direktive eigentlich verspricht,
steht aus — PHP einmal wählen und jeden Block der Seite folgen lassen. Das ist
Verhalten im Element, kein Template.

## Elemente, die kein Markup annehmen

Ein Generator kennt nur Attribute und Kinder: eine Story setzt Eigenschaften,
ein Twig-Template schreibt Markup. Ein Element, das Light DOM aus seinen
Eigenschaften rendert, überschreibt dabei seine Kinder — das Markup ist weg.
`lifted()` ist die Form, die das löst; `sds-code` und `sds-note` sind der
Beleg, dass sie trägt. Offen ist, was eine Doku-Seite als nächstes braucht:

| Element | Heute | Was ein Knoten braucht |
| --- | --- | --- |
| `sds-table` | `columns`, `rows` als Arrays | Eine Zelle mit Link, `<code>` oder Hervorhebung lässt sich nicht als JSON-Attribut ausdrücken. Dazu `colspan`, `rowspan`, `<caption>` |
| `sds-surface` | `body: { type: String }` | Trägt `topic`, `sidebar`, später Karten — alles mit Prosa darin |
| `sds-figure` | `caption: string \| TemplateResult` | Bildunterschriften tragen Links und Rollen |
| `sds-stat`, `sds-modal`, `sds-dialog`, `sds-drawer` | dasselbe Muster | Für eine Doku-Seite zweitrangig |

## Auslieferung und Verhalten

Nicht Styling, sondern was das Paket können muss.

- **Ein Sprunglink auf `#main-content` fehlt.** Das Layout setzt die Spalte,
  aber nichts springt an ihren Anfang, und mit Rail und Leiste davor ist das
  eine lange Reise.
- **`card-group` und `accordion`.** Theme-Direktiven, keine Kern-Knoten — in
  TYPO3-Dokumentation aber verbreitet. `card` und `card-grid` gibt es jetzt:
  `sds-card` zeichnet Bild, Kopf, Körper und Fuß, das Raster kommt in drei
  Breiten, und die Spaltenangaben der Bootstrap-Schreibweise werden als Frage
  nach dem Platz gelesen statt als Spuren gezählt. Wer die beiden übrigen will,
  schreibt Node- und Directive-Klassen nach demselben Muster.
- **`:target`.** Anker sind überall (confval, Glossar, Fußnoten, Karten). Was
  die angesprungene Stelle anzeigt, ist nicht entschieden.
- **Druck.** Kein Druck-Stylesheet.
- **Niemand sieht, wie die Seite aussieht.** `tests/guides.spec.ts` rendert und
  öffnet sie: es lädt jede Seite unter `.out/site/` und lässt keinen Fehler und
  keine fehlende Datei durch, und es hält die Befunde fest, für die dieses
  Theme geschrieben wurde. Was es nicht tut, ist hinsehen — kein Bildvergleich
  und keine Achse gegen die Ausgabe, und jeder Knoten, für den dort keine Zeile
  steht, ist weiterhin ungeprüft. Was dazukommt, bekommt seine Zeile dort;
  sonst wandert es still wieder auf.

## Die Deckungsregel

`make coverage` verlangt jede Komponente an drei Stellen — Story, gezeichnete
Klasse, **und eine vom Guides-Renderer erzeugte Seite**. Die dritte ist dieses
Theme, und sie ist die einzige, an der eine Komponente auf Markup trifft, das
nicht für sie geschrieben wurde. Ein Beleg im Fixture (`acceptance/`) zählt,
eine Kopie unter `acceptance/_cards/` nicht: eine kopierte Karte beweist nichts
über den Renderer.

- **Ein Teil der Elemente hat im Render noch keinen Ort.** Sie stehen
  namentlich in `PENDING.guides` in `scripts/coverage.ts` — Formularteile,
  Overlays, die Ergebnisliste, Paginierung, Zitat, Byline, der leere Zustand.
  Jedes braucht entweder einen Knoten, den der Kern ohnehin emittiert, oder
  eine eigene Direktive. Die Liste schrumpft nur: ein Eintrag, der gedeckt ist,
  lässt das Gate genauso rot werden wie ein fehlender.
- **`sds-confval` ist ein Haken im Namensraum dieses Systems, hinter dem kein
  Stylesheet steht.** Er wird entschieden, indem der Name definiert oder fallen
  gelassen wird, nicht von einem Template, das ihn weiter schreibt.

## In welcher Reihenfolge

1. **Die Knoten ohne Gegenstück** — in der Reihenfolge, in der das Fixture sie
   hässlich zeigt.
2. **`sds-table`, `sds-surface`, `sds-figure`** — Form wie bei `sds-code`:
   `lifted()` dazu, Eigenschaften bleiben für die Stories, je ein Beleg als
   Story.
3. **Die drei fremden Markups** und das Verhalten des `configuration-block`.
