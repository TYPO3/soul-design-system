# phpDocumentor Guides

Was es kostet, `phpdocumentor/guides` mit diesem System zu setzen — und was das
System dafür heute nicht hat.

Grundlage ist die tatsächliche Ausgabe: die 110 HTML-Templates in
`phpdocumentor/guides`, `guides-restructured-text`, `guides-code` und
`guides-graphs`. `guides-theme-bootstrap` ist das Vorbild für die Form, nicht
für den Inhalt.

## Was ein Theme ist

Ein Guides-Theme ist ein Composer-Paket mit zwei Teilen und keinem dritten:

- `resources/template/**/*.html.twig` — Overrides gegen die Pfade des Kerns.
  Ein Template, das nicht überschrieben wird, rendert die Kernausgabe.
- `resources/config/*.php` — Symfony-Container-Konfiguration, die das Theme
  registriert und optional eigene Direktiven mitbringt (`card`, `accordion`,
  `card-grid` beim Bootstrap-Theme, mit je einer Node- und einer
  Directive-Klasse).

CSS liefert ein Theme nicht aus; das Layout verlinkt es. Der Kern setzt **keine
einzige eigene Klasse mit Präfix** — er schreibt `admonition note`, `section`,
`toc`, `confval`, `guilabel`, oder gar nichts. Wo eine Klasse aus dem
RST-Quelltext kommt (`.. container:: foo`, `:class:`), steht sie ungefiltert im
Markup.

Daraus folgt die Grundentscheidung, die vor der Gap-Liste steht:

1. **Templates überschreiben**, damit `sds-`-Klassen und Custom Elements ins
   Markup kommen — trägt alles, was einer Direktive entspricht.
2. **Ein `guides.css` liefern**, das die Klassen und blanken Elemente des Kerns
   auf Tokens abbildet — trägt alles, was aus dem Fließtext fällt und nie eine
   Klasse bekommt (`<p>`, `<ul>`, `<dl>`, `<blockquote>`, `<sup>`, `<kbd>`).

Beides ist nötig. Weg 1 allein lässt jeden Absatz ungestylt, Weg 2 allein
schreibt das System in fremdem Vokabular ein zweites Mal.

## Was heute trägt

| Guides emittiert | Bei uns |
| --- | --- |
| `hljs-*` in Codeblöcken (`guides-code` delegiert an `scrivo/highlight.php`) | `.hljs-*` ist gemappt — siehe aber „Wer färbt" unten |
| `<table>` mit `<thead>`/`<tbody>`/`<th>` | `.sds-table` samt Dichten |
| `<a>` | `.sds-link`, `.sds-link--external` |
| `<strong>`, `<em>` | Browser-Default, und das ist richtig |
| Seitennavigation aus `toctree` | `.sds-rail`, `.sds-rail__group`, `.sds-rail__item` |
| Brotkrumen | `.sds-crumbs` |

## Wer färbt

Beide Seiten färben, und das ist zu entscheiden, bevor ein Template geschrieben
wird.

`guides-code` färbt auf dem Server mit `scrivo/highlight.php` und gibt
`hljs-`-Klassen aus. `sds-code` färbt im Browser mit highlight.js 11. Wickelt
man das eine ins andere, hebt die Komponente ihre Kinder aus, liest sie über
`textContent` — die Spans des Servers fallen auf den Quelltext zurück — und
färbt denselben Text ein zweites Mal. Kaputt geht dabei nichts; es kostet nur:

- **Sprachabdeckung.** `highlight.php` bringt das Set von highlight.js 9.18
  mit, `src/lib/highlight.ts` registriert bewusst dreizehn Grammatiken. Für
  alles andere gibt `highlight()` `null` zurück — die Komponente *entfernt*
  dann Farbe, die schon da war.
- **`data-start` und `data-emphasize-lines`.** `wrapped` rendert das `<code>`
  neu und lässt beides fallen.
- **Farbe ohne JavaScript.** Die hat der Server bereits geliefert; über die
  Komponente hängt sie am Bundle.

Der Klassenversatz 9.18 gegen 11 ist dagegen harmlos: `components.css` bildet
rund dreißig Namen auf drei Farben ab, alles Unbenannte liest als normaler Text.

**Beide Wege bleiben offen**, weil es zwei Arten von Aufrufer gibt und nicht
zwei Meinungen:

| | Wer färbt | Was `sds-code` bekommt |
| --- | --- | --- |
| roh hinein | highlight.js hier, im Browser wie in Node | Quelltext — eine Story, `source`, ein Fence |
| fertig hinein | ein Server, hier `guides-code` | Spans samt `<code class="language-x" data-start>` |

Die Komponente entscheidet das selbst, am einzigen ehrlichen Signal: trägt der
Inhalt `hljs-`-Klassen, ist er schon gefärbt und wird gehalten wie er kam —
Wrapper eingeschlossen, samt Startzeile und hervorgehobenen Zeilen. Sonst färbt
sie wie bisher. Kein neues Attribut, kein Schalter im Theme
(`src/components/code.ts`, `given`).

Für das Theme heißt das: es gibt `<sds-code lang="x">` mit dem `<code>` des
Servers darin aus. Ohne JavaScript steht die Farbe trotzdem, weil sie im Markup
steht; mit JavaScript kommen Kopf, Sprachlabel und Kopieren-Knopf dazu.

## In welchem Register eine Komponente spricht — **geschlossen**

Nicht in der Liste unten, weil es keine Lücke war, sondern eine Naht: beide
Schichten waren fertig und gegeneinander falsch eingestellt.

`--note-body-size` ist 12px. Das ist richtig für die Fläche, für die die
Komponenten-Schicht geschrieben wurde — eine Notiz neben einem Ergebnis, ein
Hinweis unter einem Feld, eine Karte in einem Raster davon, auf einer
Oberfläche mit 15px Grundtext und Dichte als Aufgabe. In einem Dokument ist es
zweimal falsch: der Absatz über der Admonition ist 17px, und die Admonition ist
derselbe Absatz mit einem Rahmen darum; und eine Referenz trägt zwölf davon,
also bekommt die Seite zwei Stimmen und keine Regel, welche gerade spricht.
Dazu lief die Notiz bis an die Spalte, während die Absätze bei 66ch aufhörten —
das einzige Ding auf der Seite, das sich durch Breite ankündigte.

Die Antwort steht in `document.css` unter „a component in text" und schreibt
keine Regel um: innerhalb von `.sds-prose` werden die Tokens umgebunden, die
die Komponenten-Schicht ohnehin liest, und die Box nimmt das Maß der Absätze
neben ihr. Jede Deklaration bleibt, wo sie hingehört; nichts benennt ein
Bauteil einer Komponente, also gibt es auch keinen Spezifitätskampf. Was
Beschriftung ist — Bildunterschrift, Codeblock-Unterschrift, Stat-Notiz,
Zitat-Zuschreibung — bleibt absichtlich im 12px-Register.

Die Regel dahinter, für alles, was noch dazukommt: **eine Komponente im
Fließtext spricht die Größe des Dokuments, eine Beschriftung darunter.**

## Was nicht an uns liegt

Ein Blockzitat kommt als Definitionsliste heraus. Der eingerückte Block in
`acceptance/index.rst` wird zu `<dl><dt>erste Zeile</dt><dd>zweite Zeile</dd>`,
und `<blockquote>` erscheint in der ganzen Ausgabe kein einziges Mal — die
Regel dafür in `document.css` ist damit unerreichbar, obwohl sie stimmt. Das
ist der Parser und nicht das Theme; die Reparatur wäre eine eigene
Production-Rule hier oder ein Patch dort.

## Gap 1 — Fließtext: kein Selektor greift — **geschlossen**

`src/styles/document.css` ist die Antwort darauf: eine Dokument-Schicht als
Peer zur Komponenten-Schicht, auf `.sds-prose` gescopet und von `styles.css`
bewusst nicht importiert. Sie deckt die ganze Tabelle unten ab, einschließlich
h4–h6 — ohne neue Größen-Tokens, weil eine vierte Ebene sich durch Gewicht und
Luft von ihrem Absatz unterscheidet und nicht durch eine Größe, die es schon
gibt. Zum Maß: der Text hält 66ch, Tabellen und Codeblöcke laufen bis an die
Spalte.

Was hier stand, bleibt als Beschreibung dessen stehen, was Guides ausgibt —
das Theme muss es weiterhin treffen.

Zur Zeile über Listen gehören drei Entscheidungen, die die Tabelle nicht
hergibt:

- **Marke und Einzug stehen in `components.css`, nicht in der Dokument-Schicht.**
  Eine Liste ist auch auf einer Oberfläche eine Liste, und eine Anwendung, die
  `document.css` nie verlinkt, bekam bis dahin den 40px-Einzug des Browsers.
  Hier bleibt nur der Rhythmus: Abstand unter dem Block, kleinerer zwischen den
  Punkten. Das Vokabular dazu ist `.sds-list` und `.sds-list--plain`.
- **`a.`, `i.`, `#.` entscheidet der Quelltext.** Guides schreibt sie als
  `type`-Attribut, und ein solches Attribut wiegt in der Kaskade nichts — eine
  Regel auf `ol` hätte jede Buchstabenliste stumm in eine Zahlenliste
  verwandelt. Die Regeln sind deshalb mit `:not([type])` gestellt und lassen
  das Attribut sprechen, wo es steht.
- **`li.dash` wird bewusst ignoriert.** Welches Zeichen jemand getippt hat, ist
  keine Aussage über die Liste; ein Strich als Marke wäre der Quelltext, der
  über das Aussehen der Seite entscheidet. Eine Punktform, eine Regel.

Kein Template-Override für Listen: Guides gibt `<ul>`/`<ol>` blank aus, und
blank ist genau das, was die Element-Regeln treffen. Die eine Listenstelle im
Theme, die keine Prosa ist — das lokale Inhaltsverzeichnis in
`toc-entries.html.twig` — ist über die Namen des Kerns (`.contents`, `.toc`)
gesetzt und braucht die Klasse nicht.

`.sds-prose` setzt Größe, Zeilenhöhe, Farbe und ein 66ch-Maß. **Kind-Regeln hat
die Klasse keine.** Alles hier ist heute Browser-Default:

| Guides emittiert | Lücke |
| --- | --- |
| `<h1>`–`<h6>` (RST erlaubt sechs Ebenen) | Die Typskala endet bei `.sds-h3`. h4–h6 existieren nicht — weder als Klasse noch als Token |
| `<p class="…">` | Kein Absatzabstand im Fließtext |
| `<ul>`, `<ol>`, verschachtelt, `<li class="dash">` | Ungestylt. Keine Aufzählungsstile (a., i., #.), keine Einrückungsregel |
| `<blockquote>` (auch `epigraph`, `pull-quote`, `highlights`) | Ungestylt |
| `<hr>` (`.. transition::`) | Ungestylt |
| `<code>` ohne Klasse (Inline-Literale, mit Abstand das häufigste Inline-Element) | `.sds-mono` existiert, aber das Markup trägt sie nicht |
| `<pre>` ohne `<code>` (Literal-Block, `::`) | Ungestylt; `.sds-code` erwartet Kopf und Körper |
| `<figure>`/`<figcaption>` | `.sds-figure` ist die Zahlen-Figur, `.sds-figure__art` die Zeichnung mit Hell/Dunkel-Paar — beide passen nicht auf ein Doku-Bild mit Bildunterschrift |
| `<img>` mit `align`, `scale`, `width`, optional in `<a>` | Kein responsives Bild, kein Ausrichtungsvokabular |
| `<caption>`, `<colgroup>`/`<col>`, `colspan`/`rowspan` in Tabellen | `.sds-table` kennt keinen `<caption>` und keine Spaltengruppen |
| `<sup>`, `<sub>`, `<cite>`, `<abbr>`, `<kbd>` | Nichts davon ist gestylt |

Dazu ein Maß-Problem: 66ch gilt für Prosa. Codeblöcke, Tabellen und Diagramme in
einer Doku sind breiter. Es fehlt die Regel, wie ein Block aus dem Maß ausbricht,
ohne die Spalte zu sprengen — `.sds-code` löst das für sich, der Rest nicht.

## Gap 2 — Knoten ohne jedes Gegenstück — **zur Hälfte geschlossen**

Zu ist, was eine Regel brauchte und keine Komponente: das lokale
Inhaltsverzeichnis, Rubric, Topic und Sidebar, Fußnote und Zitat, Options- und
Feldliste, hlist — dazu confval, Definitionsliste, version-change und der
eingebettete Rahmen, die ihre Templates schon vorher hatten. Die Regeln stehen
in `src/styles/document.css` unter „what a renderer names": die Namen des Kerns,
auf Tokens abgebildet und **nicht** umbenannt, weil eine Ausgabe, die kein
anderes Werkzeug mehr liest, kein Gewinn ist. Wo der Kern anderes Markup
schreiben musste, liegt es im Theme — `body/menu/content-menu`,
`table-of-content`, `toc-entries`, `body/topic`, `body/directive/topic`,
`structure/sidebar`, `body/field-list`, `inline/footnote`.

Drei davon waren nicht ungestylt, sondern falsch, und das ist der Teil, den
eine Gap-Liste allein nicht findet:

- **`.. contents::` kam als Rail heraus.** Der Kern schickt die Rail, den
  gedruckten `toctree` und das lokale Inhaltsverzeichnis durch dasselbe
  `menu-level.html.twig` — ein Theme, das diese eine Datei überschreibt, hat
  damit über alle drei dasselbe gesagt. Das Ergebnis war eine Reihe gefüllter
  Rail-Items, jedes als aktuelle Seite markiert und jedes mit `href="#"`:
  `renderLink` antwortet für das gerenderte Dokument mit `#`, und ein
  Abschnitt *dieses* Dokuments ist diese Antwort plus Anker. Die beiden
  Inhaltsverzeichnisse bauen ihren Link jetzt selbst.
- **Die Inline-Fußnote nannte eine andere Nummer als der Block.** Der Kern
  druckt, was der Autor zwischen die Klammern geschrieben hat — bei `[#note]_`
  also `#note`, während unten `[1]` steht. Die Nummer steht erst nach dem
  Kompilieren fest, also kommt sie vom Target und nicht vom Knoten.
- **Die Sidebar war eine Admonition.** Aus dem Kern kommt sie als
  `div.admonition.admonition-sidebar`, und damit trüge sie in unserem
  Vokabular einen Glyph, der sagt, sie sei eine Warnung. Sie ist eine
  Abschweifung mit Überschrift — dasselbe wie ein Topic, und jetzt auch so
  gezeichnet.

Offen bleiben Glossar und Annotationsliste, der Zeilenblock (er funktioniert,
aber nur weil `div` umbricht — eine Regel hat er nicht), Math, der Permalink an
der Überschrift und die Policy für `container`/`wrap`.

Was hier stand, bleibt als Beschreibung dessen stehen, was Guides ausgibt.
Jede Zeile ist eine Direktive oder ein Knoten, den Guides rendert und für den es
bei uns weder Klasse noch Komponente gab.

| Knoten | Markup | Warum es zählt |
| --- | --- | --- |
| **confval** | `dl.confval` > `dt` > `code.sig-name.descname`, `dd` > `div.line-block` > `div.line`, `div.confval-description` | Das Rückgrat jeder TYPO3-nahen Referenz. Typ, Pflichtfeld, Default, Anker |
| **Definitionsliste** | `dl` > `dt` + `span.classifier`/`span.classifier-delimiter`, `dd` | Grundform von RST, kommt in jedem längeren Text vor |
| **Feldliste** | `<table>` aus `field-list` (Docinfo: Autor, Version, Datum) | Kopf jedes Dokuments |
| **Optionsliste** | `dl.domain-default-option` > `dt.domain-default-option-name`, `dd.…-description` | CLI-Referenzen |
| **Glossar** | `div` + `dl` mit Ankern | |
| **Fußnote / Zitat** | `div.footnote` > `div.footnote-label` + `div.footnote-content`, dazu inline `<sup><a>` | Zwei Blockformen plus zwei Inline-Formen |
| **Rubric** | `div.rubric` | Überschrift ohne Gliederungswirkung — genau das, was unsere Skala nicht kennt |
| **Topic** | `div.topic` > `p.topic-title` | |
| **Sidebar** | `div.admonition.admonition-sidebar` > `p.sidebar-title` | Wird als Admonition gerendert, ist aber ein Aside |
| **Container / wrap** | `div` mit **beliebigen** Klassen aus dem Quelltext | Braucht eine Policy: was darf ein Autor an Klassen setzen |
| **hlist** | `div.hlist.columns-N` | `.sds-grid` reflowt nach Mindestbreite, kennt kein N |
| **version-change** | `article.versionchange.{added,changed,deprecated}` > `p.versionmodified` | `.sds-badge` ist nah, aber es ist ein Block mit Prosa |
| **Zeilenblock** | `div.line-block` > `div.line` | Auch von confval benutzt |
| **Math** | `<math>` bzw. MathJax-Ausgabe | Keine Schrift, keine Regel dafür |
| **Eingebetteter Rahmen** | `<iframe>` (`.. youtube::`) | Kein Seitenverhältnis-Rahmen |
| **Annotationsliste** | Sammelknoten | |
| **Lokales Inhaltsverzeichnis** | `div.contents` > `p.topic-title` + Liste, `div.toc`, `p.caption` | Die Rail ist Seitennavigation. „Auf dieser Seite" fehlt |
| **Permalink zur Überschrift** | Im Kern gar nicht; Themes hängen ein Ankerzeichen an | Ohne das ist keine Überschrift verlinkbar |

## Gap 3 — Gegenstück da, Markup fremd — **bis auf drei geschlossen**

Offen sind die letzten drei Zeilen der Tabelle: die zweite Tab-Form (sie kommt
aus keinem Paket, das hier installiert ist, und ist deshalb nie gerendert
worden), das UML-Diagramm, dessen eine Datei im dunklen Modus falsch ist, und
die Fuß-Navigation mit ihren Icon-Font-Klassen.

Beim `configuration-block` ist das Markup zu und das Verhalten nicht: er wird
zu `sds-tabs` wie `.. tabs::` auch — vorher stand die rohe Knopfleiste des
Kerns direkt neben der Komponente, mit einem Panel darunter, das ohne das JS,
das Guides nicht mitliefert, nicht erreichbar war. Was die Direktive
eigentlich verspricht, steht noch aus: PHP einmal wählen und jeden Block der
Seite folgen lassen. Das ist Verhalten im Element, kein Template.

| Guides | Bei uns | Was fehlt |
| --- | --- | --- |
| `div.admonition.<typ>` in **zwölf** Typen: note, tip, hint, important, caution, attention, warning, danger, error, seealso, todo, plus generisch mit eigenem Titel | `sds-note` in **vier** Tönungen | Die Abbildung 12 → 4 ist eine Designentscheidung, keine Fleißarbeit. `seealso` und `todo` haben in unserem Vokabular keine Tönung. Der generische Fall trägt einen frei gesetzten Titel |
| `<pre><code class="language-x line-numbers" data-start data-emphasize-lines>` plus optional `div.code-block-caption` **über** dem Block | `sds-code` mit `__head`, `__lang`, `__copy`, `__body`, `__caption` | Zeilennummern, hervorgehobene Zeilen, Startzeile. Die Bildunterschrift steht in beiden über dem Block — bei uns aber **im** Element, das sie setzt, nicht daneben |
| `div.configuration-block` mit `role="tablist"`, `data-language`, `configuration-codeblock` | `sds-tabs` + `sds-tab-item` | Fremdes Markup, und die Sprachwahl soll für **alle** Blöcke einer Seite gelten. Das JS dafür liefert Guides nicht mit |
| `div.tabs` > `ul > li > button[data-tabs][data-target]` + `div.tab-content` | dasselbe | Zweite, andere Tab-Form im selben Ausgabeformat — das Theme muss beide auf eine Komponente ziehen |
| `nav > span.breadcrumb.level-N` | `.sds-crumbs`, `__sep`, `__here` | Kein Trennzeichen-Element, kein `here`; die Ebene steht in der Klasse |
| `ul.menu-level` > `li.toc-item.current.active` > `a.section-level-N` | `.sds-rail__group`, `.sds-rail__item` | Beliebig tiefe Verschachtelung; `current` (diese Seite) und `active` (im Pfad) sind zwei verschiedene Zustände, wir haben einen |
| `figure.uml-diagram` mit einem Bild | Diagramm-Richtlinie mit Hell/Dunkel-Paar | Guides rendert eine Datei. Im dunklen Modus ist sie falsch |
| Fuß-Navigation: `div.rst-footer-buttons` > `a.btn.btn-neutral` mit `span.fa.fa-arrow-circle-left` | `.sds-btn`, `sds-icon` | Icon-Font-Klassen statt unserer Glyphen |

## Gap 4 — Auslieferung und Verhalten

Nicht Styling, sondern was das Paket können muss.

Das Paket gibt es: `composer.json`, die Container-Konfiguration, die
Konfigurations-Extension und die Templates. Damit sind auch das Layout, der
Modus-Umschalter und die Suche zu — `soul-boot.js` schreibt `data-theme` vor
dem ersten Anstrich, und `sds-search` liest einen Index, den der Renderer
schreibt. Es steht:

- **Custom Elements in statischer Ausgabe.** `sds-code` und `sds-tabs` brauchen
  `_ds_bundle.js`. Guides schreibt statisches HTML — das Layout muss das Bundle
  laden, und ohne JS muss der Inhalt lesbar bleiben. Das ist derselbe Grund,
  aus dem die Specimen-Karten keine Custom Elements enthalten dürfen
  (`ARCHITECTURE.md`). Das Layout tut es; die Regel gilt weiter für jedes
  Template, das dazukommt.
- **Ein Sprunglink auf `#main-content` fehlt.** Das Layout setzt die Spalte,
  aber nichts springt an ihr Anfang, und mit Rail und Leiste davor ist das
  eine lange Reise.
- **Karten und Akkordeon.** `card`, `card-grid`, `card-group`, `accordion` sind
  Theme-Direktiven, keine Kern-Knoten — in TYPO3-Dokumentation aber verbreitet.
  Wer sie will, schreibt Node- und Directive-Klassen. `.sds-card` deckt den
  Rahmen ab, nicht Kopf/Fuß/Bild/Raster. `band`, `grid` und `teaser` sind der
  Beleg, dass es geht, und zugleich der Umfang pro Stück.
- **`:target`.** Anker sind überall (confval, Glossar, Fußnoten, Karten). Was
  die angesprungene Stelle anzeigt, ist nicht entschieden.
- **Druck.** Kein Druck-Stylesheet.
- **Niemand sieht die gerenderte Seite an.** `make coverage` liest die
  Templates und den Quelltext des Fixtures — jedes Element hat einen Ort im
  Render, das Theme erfindet keinen Klassennamen, die Hülle ist die der
  Screens. Das ist die Buchhaltung. Was dabei herauskommt, öffnet kein Spec:
  keine der Seiten unter `site/` wird geladen, gemessen oder mit einem Bild
  verglichen. Jeder Befund in diesem Dokument gilt deshalb so lange, wie sich
  jemand erinnert, hingesehen zu haben. Seit `.github/workflows/ci.yml` läuft
  `make guides` bei jedem Push auf `main` — das fängt ab, was der Renderer
  selbst meldet (`--fail-on-error`) und was aus der Site herauszeigt. Was auf
  der Seite steht, sieht auch dieser Lauf nicht an.

## Gap 5 — Eigenschaften gegen Markup — **der teuerste Posten ist zu**

Der Codeblock war kein Einzelfall, sondern der erste Fall. Von 26 Elementen
nahmen **drei** an, was zwischen ihren Tags steht; heute sind es **sechs** —
`sds-button`, `sds-code`, `sds-tab-item`, dazu `sds-note`, `sds-menu` und
`sds-rail`. Die übrigen rendern Light DOM aus ihren Eigenschaften und
überschreiben dabei ihre Kinder. Ein Twig-Template, das Markup hineinschreibt,
verliert es.

`sds-note` war der teuerste Posten und ist der Beleg: eine Admonition trägt
jetzt Absätze, Listen und ganze Codeblöcke, und das Theme setzt zwölf Typen
damit. Offen sind in der Tabelle unten `sds-table`, `sds-surface` und
`sds-figure` — die Reihenfolge, in der eine Doku-Seite sie braucht.

Das ist der Unterschied zwischen unseren bisherigen Aufrufern und diesem: eine
Story und ein Screen setzen Eigenschaften, ein Generator schreibt Markup. Er
kennt nur Attribute und Kinder.

Wo es weh tut, nach Bedarf einer Doku-Seite sortiert:

| Element | Heute | Was ein Knoten braucht |
| --- | --- | --- |
| `sds-note` | `body: { type: String }` | Eine Admonition enthält Absätze, Listen, Codeblöcke. Als Attribut wird das zu Text, und das Markup darin zu sichtbaren spitzen Klammern. Zwölf Typen auf jeder Seite — der teuerste Posten |
| `sds-table` | `columns`, `rows` als Arrays | Eine Zelle mit Link, `<code>` oder Hervorhebung lässt sich nicht als JSON-Attribut ausdrücken. Dazu `colspan`, `rowspan`, `<caption>` |
| `sds-surface` | `body: { type: String }` | Trägt `topic`, `sidebar`, später Karten — alles mit Prosa darin |
| `sds-figure` | `caption: string \| TemplateResult` | Bildunterschriften tragen Links und Rollen |
| `sds-stat`, `sds-modal`, `sds-dialog`, `sds-drawer` | dasselbe Muster | Für eine Doku-Seite zweitrangig |
| `sds-tabs` + `sds-tab-item` | hebt Kinder aus | Trägt schon; das ist die Form, die die anderen brauchen |

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

**Im Satz** — `sds-icon`, `sds-link`, `sds-badge`, und die Textrollen aus
Gap 2, die es noch nicht gibt. Für eine Rolle wie `guilabel` oder `kbd` ist ein
Custom Element der falsche Preis: eine Klasse und eine CSS-Regel tun es, und
Guides setzt die Klasse ohnehin schon.

**Anwendung** — `sds-modal`, `sds-dialog`, `sds-drawer`, `sds-overlay`,
`sds-field`, `sds-field-error`. In einer Doku-Seite kommt davon nichts vor,
außer wir stellen die Suche.

Daraus die Regel, die für Guides überall gilt und für unsere bisherigen
Oberflächen nirgends galt: **der Server schreibt, das Element wertet auf.** Ohne
JavaScript muss die Seite vollständig lesbar sein — Farbe steht im Markup,
Reiter zeigen ihren Inhalt, die Rail steht. Das Element bringt Kopf,
Kopieren-Knopf, Umschalten und Einklappen dazu.

## Größenordnung

Stand am Anfang: ungefähr 40 Knotenarten ohne Gegenstück, 8 mit fremdem
Markup, dazu die Fließtext-Ebene, die komplett aus Browser-Defaults bestand,
und 23 von 26 Elementen, die Markup zwischen ihren Tags nicht annahmen.

Teuer war daran nicht die Menge. Teuer waren drei Entscheidungen: die Abbildung
der zwölf Admonition-Typen auf vier Tönungen, die Frage, wie weit die
66ch-Prosa in einer Referenz mit Tabellen und Codeblöcken überhaupt gilt, und
die Umstellung der Dokument-Schicht darauf, dass der Server schreibt und das
Element aufwertet. Alle drei sind gefallen — die erste im
Admonition-Template, die zweite als „der Text hält 66ch, die Blöcke nicht",
die dritte als `lifted()`.

Was heute noch offen ist, steht in den Gap-Überschriften: der Rest von Gap 2
(Glossar, Zeilenblock, Math, Permalink, die Container-Policy), drei Zeilen aus
Gap 3, `sds-table`/`sds-surface`/`sds-figure` aus Gap 5 — und aus Gap 4 der
Posten, der alles andere trägt: **niemand prüft die Ausgabe.**

## Was zuerst

Drei Entscheidungen stehen vor dem ersten Template, weil sie Vokabular
festlegen und nicht Code:

1. **Wo lebt das Theme.** Ein Guides-Theme ist ein Composer-Paket mit
   PHP-Klassen. Dieses Repo ist das Design-System und kennt kein PHP. Eigenes
   Repo, das dieses als npm-Abhängigkeit zieht, ist die naheliegende Antwort —
   entschieden ist sie nicht.
2. **Zwölf Admonition-Typen auf vier Tönungen.** Und ob `seealso`, `todo` und
   `versionadded/changed/deprecated` eine eigene Form bekommen statt einer
   geliehenen Tönung.
3. **Das Maß.** Ob 66ch in einer Referenz gilt, und wie ein Block — Tabelle,
   Codeblock, Diagramm — daraus ausbricht, ohne die Spalte zu sprengen.

Alle drei sind entschieden: das Theme lebt hier und wird per Subtree-Split
ausgeliefert, die zwölf Typen fallen auf vier Tönungen nach Sphinx' eigener
Gruppierung, und das Maß gilt für Wörter und nicht für Blöcke.

Danach in dieser Reihenfolge:

1. ~~Die Fließtext-Ebene.~~ Steht als `src/styles/document.css` — siehe Gap 1.
   Sie war die größte einzelne Fläche und die billigste, weil reine Zuordnung
   auf Tokens.
2. ~~Ein Fixture, das jeden Knoten genau einmal enthält.~~ Steht als
   `guides-theme/acceptance/`. Es hat getan, was es sollte: jeder Befund in
   Gap 2 und Gap 3 kommt daher, und keiner davon war vorher vermutet worden.
3. ~~`sds-note` nimmt Kinder an.~~ Danach `sds-table`, `sds-surface`,
   `sds-figure` — Form wie bei `sds-code`: `lifted()` dazu, Eigenschaften
   bleiben für die Stories, je ein Beleg als Story.
4. ~~Das Theme-Paket.~~ Layout, Container-Konfiguration und die Overrides aus
   Gap 3 stehen; drei Zeilen dieser Tabelle fehlen noch.
5. **Ein Spec, der das Fixture öffnet.** Er steht jetzt vor dem Rest, und zwar
   aus demselben Grund, aus dem das Fixture vor den Templates stand: alles ab
   hier ist eine Regel, die jemand von Hand nachsieht, und keine, die etwas
   festhält. Ohne ihn wandert jeder geschlossene Punkt oben still wieder auf.
6. **Der Rest von Gap 2.** Glossar, Zeilenblock, Math, Permalink, die
   Container-Policy — in der Reihenfolge, in der das Fixture sie hässlich
   zeigt.

## Die Deckungsregel — was das Theme noch schuldet

Seit `make coverage` (Schritt 2b des Gates) gilt: jede Komponente wird an drei
Stellen gezeigt — Story, gezeichnete Klasse, **und eine vom Guides-Renderer
erzeugte Seite**. Die dritte Stelle ist dieses Theme, und sie ist die einzige,
an der eine Komponente auf Markup trifft, das nicht für sie geschrieben wurde.
Ein Beleg im Fixture (`acceptance/`) zählt, eine Kopie unter
`acceptance/_cards/` nicht: eine kopierte Karte beweist nichts über den
Renderer.

Zwei Dinge folgen daraus für die Arbeit hier:

- **21 Elemente haben im Render noch keinen Ort.** Sie stehen namentlich in
  `PENDING.guides` in `scripts/coverage.ts` — Formularteile, Overlays, die
  Ergebnisliste, Paginierung, Zitat, Byline, der leere Zustand. Jedes braucht
  entweder einen Knoten, den der Kern ohnehin emittiert, oder eine eigene
  Direktive. Die Liste schrumpft nur: ein Eintrag, der gedeckt ist, lässt das
  Gate genauso rot werden wie ein fehlender.
- **Das Theme erfindet keinen Klassennamen.** Offen sind `sds-confval` — ein
  Haken im Namensraum dieses Systems, hinter dem kein Stylesheet steht — und
  `footnote-ref`, der Kernname für eine Marke, die die Dokument-Schicht als
  blankes `sup` setzt. Beides wird entschieden, indem der Name definiert oder
  fallen gelassen wird, nicht von einem Template, das ihn weiter schreibt.

Was das Theme dagegen schon richtig macht: es baut die Seite aus der Hülle, die
alle Screens teilen — `sds-app`, `sds-shell`, `sds-bar`, und darunter entweder
Spalte-neben-Schiene oder die Bänder. Das prüft `make coverage` mit, damit die
zweite Hülle gar nicht erst entsteht.
