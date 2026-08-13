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
- **Ein Element, das im Fließtext steht, hebt sein Markup an.** Ein Generator
  kennt nur Attribute und Kinder, und ein Element, das Light DOM aus seinen
  Eigenschaften rendert, überschreibt dabei seine Kinder — das Markup ist weg.
  `lifted()` ist die Form, die das löst; die Dokument-Schicht ist der Beleg,
  dass sie trägt. Was als nächstes einen Knoten bekommt, wird danach gebaut.
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
- **Ein Bild, das seine Farben mitbringt, bekommt einen Grund, der dafür
  gezeichnet ist.** Eine Zeichnung ohne `id="art"` wird verlinkt und behält,
  was ihr Exporter eingebacken hat — meist dunkle Strichzeichnung auf nichts,
  und auf dunklem Grund widerspricht die Seite dem Bild, das sie zeigt. Rahmen,
  Kartenbild und Betrachter nehmen darunter `--surface-art`, die einzige Fläche
  des Systems mit einem Wert für beide Modi. Damit ist auch `figure.uml-diagram`
  beantwortet, ohne dass `guides-graphs` hier installiert wäre: was das Paket
  emittiert, ist ein verlinktes Bild, und ein verlinktes Bild landet auf diesem
  Grund. Umfärben lässt sich fremdes Bildmaterial nicht — die Farben eines
  PlantUML-Diagramms stehen im `skinparam` des Autors.
- **Eine Klasse aus dem Quelltext trägt durch und bedeutet nichts.** Was
  `.. container::` oder `:class:` ins Markup schreibt, hat kein System gewählt;
  eine Regel, die so einen Namen trifft, macht das private Vokabular jedes
  Autors zur öffentlichen Schnittstelle dieses Designsystems. Der Inhalt wird
  gesetzt, der Kasten nicht. Die eigenen `sds-`-Namen sind die Ausnahme, die es
  belegt: sie sind hier definiert und die Klassenschicht ist absichtlich von
  Hand schreibbar.
- **Die zweite Tab-Form wird nicht unterstützt, in keiner Form.** `div.tabs`
  mit `button[data-tabs][data-target]` und `div.tab-content` kommt aus keinem
  hier installierten Paket und ist deshalb nie gerendert worden. Ein Template
  gegen eine Ausgabe zu schreiben, die niemand ansehen kann, ist geraten, und
  geratenes Markup prüft weder ein Check noch ein Test: es steht im Baum und
  stimmt oder stimmt nicht, und niemand erfährt welches davon. `.. tabs::` und
  `.. configuration-block::` sind die Schreibweisen, die es gibt, und beide
  werden `sds-tabs`. Bringt ein Paket die andere doch mit, kommt sie mit einer
  Ausgabe, die man ansehen kann — dann wird entschieden, vorher nicht.
- **`card-grid` gibt es nicht mehr, und das ist eine Entscheidung.** Die
  Schreibweise war eine zweite Tür auf dasselbe Raster: `:columns:` und
  `:gap:` wurden in `wide`, `dense` und `flush` übersetzt, `:card-height:`
  angenommen und verworfen. Zwei Namen für eine Sache heißt, dass jede Seite
  sich für einen entscheidet und der Leser beide kennen muss, und die zweite
  spricht in Spalten und Breakpoints — genau das, was `grid` nicht tut. Wer
  eine TYPO3-Dokumentation herüberholt, schreibt `.. grid::` mit einer der
  drei Breiten; die Spaltenzahl war ohnehin nie eine Spur, sondern eine Frage
  nach dem Platz.
- **Ein Exkurs im Fließtext ist keine Fläche aus einem Satz.** `topic` und
  `sidebar` sind ein Kasten, den der Leser überspringen darf und den die
  Gliederung nicht listet: nie einer aus einem Satz, nie gescannt, nie steht
  etwas daneben. `sds-surface` ist für das Gegenteil gebaut — Glyph, Label,
  Titel, Körper, quer zueinander gelesen, und sein Vorgabe-Layout sagt es
  wörtlich. Die drei Templates zeichnen die Platte deshalb weiter selbst; ein
  `<aside>` mit `.sds-panel` ist die Klassenschicht als Vokabular und nicht als
  Vordertür, was `src/components/surface.ts` bei diesem Template namentlich so
  festhält. Die Komponente kommt dort in den Render, wo sie richtig ist: als
  eigene Direktive in einem `grid`, neben `stat`.

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
`sds-code`, `sds-table`, `sds-figure`, `sds-tabs`, `sds-diff`, `sds-surface`,
`sds-quote`. Hier ist Markup annehmen keine Bequemlichkeit, sondern die
Bedingung: der Inhalt eines Knotens ist beliebiger Inhalt.

**Im Satz** — `sds-icon`, `sds-link`, `sds-badge`, und die Textrollen, die es
noch nicht gibt. Für eine Rolle wie `guilabel` ist ein Custom Element der
falsche Preis: eine Klasse und eine CSS-Regel tun es, und Guides setzt die
Klasse ohnehin schon.

**Anwendung** — `sds-modal`, `sds-dialog`, `sds-overlay`,
`sds-field`, `sds-field-error`. In einer Doku-Seite kommt davon nichts vor,
außer wir stellen die Suche.

## Was nicht an uns liegt

Ein Blockzitat kommt als Definitionsliste heraus. Der eingerückte Block in
`acceptance/index.rst` wird zu `<dl><dt>erste Zeile</dt><dd>zweite Zeile</dd>`.
Das ist der Parser und nicht das Theme; die Reparatur wäre eine eigene
Production-Rule hier oder ein Patch dort. Zitieren kann eine Seite trotzdem:
`.. quote::` ist die Direktive, die der Knoten nicht hergibt, und sie verlangt
die Quelle, die ein Blockzitat nur anbieten würde.

Die Annotationsliste ist kein Gegenstück-Problem, sondern gar keins. Der Knoten
sammelt Fußnoten und Zitate ein und rendert seine Kinder ohne ein eigenes
Element — es gibt nichts im Markup, dem eine Klasse oder eine Komponente
entsprechen könnte. Sichtbar werden `.footnote` und `.citation`, und die haben
ihre Regel in `document.css`.

## Auslieferung und Verhalten

Nicht Styling, sondern was das Paket können muss.

- **Ein Link auf eine einzelne Antwort.** `:name:` am `accordion-item` wird
  angenommen und verworfen: wohin ein Sprung in eine zusammengefaltete Antwort
  landet — und ob er sie aufklappt — ist nicht entschieden. `:header-level:`
  ebenso, denn die Zusammenfassung ist ein Bedienelement und keine Überschrift.
- **`:target`.** Für Überschrift, confval und Glossarbegriff ist es
  entschieden: die angesprungene Stelle färbt ihren Namen ruhig im Akzent. Für
  Fußnoten und Karten steht es aus, und die Antwort ist dieselbe oder eine
  begründete andere.
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

- **Was fehlt, ist nicht dasselbe wie was hier nichts zu suchen hat.**
  `PENDING.guides` in `scripts/coverage.ts` ist die Schuld: ein Element, das
  einen Knoten oder eine eigene Direktive braucht, und die Liste schrumpft nur
  — ein gedeckter Eintrag macht das Gate genauso rot wie ein fehlender.
  `ELSEWHERE` daneben ist die andere Antwort und keine Schuld: Formularteile,
  Overlays, die Pillen-Navigation und die Paginierung. Ein Handbuch hat kein
  Formular zum Ausfüllen, keine Anwendungs-Chrome und keine nummerierten
  Seiten — sein Weg weiter ist der `sds-pager`. Taucht eins davon doch im
  Render auf, war die Einordnung falsch, und der Check sagt es.

## In welcher Reihenfolge

Nichts. Was noch aussteht, steht oben unter „Auslieferung und Verhalten" und
ist jeweils eine Entscheidung, keine Reihenfolge.
