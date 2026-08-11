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

## Gap 2 — Knoten ohne jedes Gegenstück

Jede Zeile ist eine Direktive oder ein Knoten, den Guides rendert und für den es
bei uns weder Klasse noch Komponente gibt.

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

## Gap 3 — Gegenstück da, Markup fremd

Hier gibt es eine Komponente; sie greift nur nicht, weil Guides anderes Markup
schreibt. Das sind die Template-Overrides.

| Guides | Bei uns | Was fehlt |
| --- | --- | --- |
| `div.admonition.<typ>` in **zwölf** Typen: note, tip, hint, important, caution, attention, warning, danger, error, seealso, todo, plus generisch mit eigenem Titel | `sds-note` in **vier** Tönungen | Die Abbildung 12 → 4 ist eine Designentscheidung, keine Fleißarbeit. `seealso` und `todo` haben in unserem Vokabular keine Tönung. Der generische Fall trägt einen frei gesetzten Titel |
| `<pre><code class="language-x line-numbers" data-start data-emphasize-lines>` plus optional `div.code-block-caption` **über** dem Block | `sds-code` mit `__head`, `__lang`, `__copy`, `__body`, `__caption` | Zeilennummern, hervorgehobene Zeilen, Startzeile. Die Bildunterschrift steht bei Guides über, bei uns unter dem Block |
| `div.configuration-block` mit `role="tablist"`, `data-language`, `configuration-codeblock` | `sds-tabs` + `sds-tab-item` | Fremdes Markup, und die Sprachwahl soll für **alle** Blöcke einer Seite gelten. Das JS dafür liefert Guides nicht mit |
| `div.tabs` > `ul > li > button[data-tabs][data-target]` + `div.tab-content` | dasselbe | Zweite, andere Tab-Form im selben Ausgabeformat — das Theme muss beide auf eine Komponente ziehen |
| `nav > span.breadcrumb.level-N` | `.sds-crumbs`, `__sep`, `__here` | Kein Trennzeichen-Element, kein `here`; die Ebene steht in der Klasse |
| `ul.menu-level` > `li.toc-item.current.active` > `a.section-level-N` | `.sds-rail__group`, `.sds-rail__item` | Beliebig tiefe Verschachtelung; `current` (diese Seite) und `active` (im Pfad) sind zwei verschiedene Zustände, wir haben einen |
| `figure.uml-diagram` mit einem Bild | Diagramm-Richtlinie mit Hell/Dunkel-Paar | Guides rendert eine Datei. Im dunklen Modus ist sie falsch |
| Fuß-Navigation: `div.rst-footer-buttons` > `a.btn.btn-neutral` mit `span.fa.fa-arrow-circle-left` | `.sds-btn`, `sds-icon` | Icon-Font-Klassen statt unserer Glyphen |

## Gap 4 — Auslieferung und Verhalten

Nicht Styling, sondern was das Paket können muss.

- **Es gibt kein Paket.** Kein Twig-Template-Set, keine
  Container-Konfiguration, kein Composer-Paket. Das ist der eigentliche
  Liefergegenstand; `guides-theme-bootstrap` zeigt den Umfang: 27 Templates und
  neun Klassen für ein Theme, das kaum mehr tut als Bootstrap-Klassen zu setzen.
- **Custom Elements in statischer Ausgabe.** `sds-code` und `sds-tabs` brauchen
  `_ds_bundle.js`. Guides schreibt statisches HTML — das Layout muss das Bundle
  laden, und ohne JS muss der Inhalt lesbar bleiben. Das ist derselbe Grund,
  aus dem die Specimen-Karten keine Custom Elements enthalten dürfen
  (`ARCHITECTURE.md`).
- **Layout.** Das Kern-Layout ist ein nacktes `<html>` mit `{% block %}`. Kopf,
  Rail, Spalte, Fußzeile kommen aus `.sds-shell`/`.sds-body`/`.sds-column` und
  müssen dort eingesetzt werden. Ein Sprunglink auf `#main-content` fehlt.
- **Modus-Umschalter.** `sds-theme` hat in der Guides-Ausgabe keinen Platz, und
  die gewählte Einstellung muss über den Seitenwechsel hinweg halten.
- **Suche.** Der Kern hat keine. Wenn wir sie stellen: Feld ist da
  (`.sds-field`), Ergebnisfläche nicht — `sds-modal`/`sds-drawer` wären die
  Basis, samt Tastaturkürzel.
- **Karten und Akkordeon.** `card`, `card-grid`, `card-group`, `accordion` sind
  Theme-Direktiven, keine Kern-Knoten — in TYPO3-Dokumentation aber verbreitet.
  Wer sie will, schreibt Node- und Directive-Klassen. `.sds-card` deckt den
  Rahmen ab, nicht Kopf/Fuß/Bild/Raster.
- **`:target`.** Anker sind überall (confval, Glossar, Fußnoten, Karten). Was
  die angesprungene Stelle anzeigt, ist nicht entschieden.
- **Druck.** Kein Druck-Stylesheet.
- **Nichts davon ist geprüft.** Es gibt kein Guides-Fixture, das gebaut und
  gegen Bilder verglichen wird, also fällt die Ausgabe aus `make verify`
  heraus.

## Gap 5 — Eigenschaften gegen Markup

Der Codeblock war kein Einzelfall, sondern der erste Fall. Von 26 Elementen
nehmen **drei** an, was zwischen ihren Tags steht: `sds-button`, `sds-code`,
`sds-tab-item`. Die übrigen 23 rendern Light DOM aus ihren Eigenschaften und
überschreiben dabei ihre Kinder. Ein Twig-Template, das Markup hineinschreibt,
verliert es.

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

Ungefähr 40 Knotenarten ohne Gegenstück, 8 mit fremdem Markup, dazu die
Fließtext-Ebene, die heute komplett aus Browser-Defaults besteht, und 23 von 26
Elementen, die Markup zwischen ihren Tags nicht annehmen.

Teuer ist daran nicht die Menge. Teuer sind drei Entscheidungen: die Abbildung
der zwölf Admonition-Typen auf vier Tönungen, die Frage, wie weit die
66ch-Prosa in einer Referenz mit Tabellen und Codeblöcken überhaupt gilt, und
die Umstellung der Dokument-Schicht darauf, dass der Server schreibt und das
Element aufwertet.

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

Danach in dieser Reihenfolge:

1. ~~Die Fließtext-Ebene.~~ Steht als `src/styles/document.css` — siehe Gap 1.
   Sie war die größte einzelne Fläche und die billigste, weil reine Zuordnung
   auf Tokens.
2. **Ein Fixture, das jeden Knoten genau einmal enthält.** Ein kleines
   RST-Projekt, gerendert und angesehen. Es kostet wenig und macht alles
   danach sichtbar statt vermutet — und es klärt gleich die Infrastrukturfrage:
   der Container hier hat Node, Guides braucht PHP 8.1 und Composer. Es steht
   jetzt vor allem anderen: die Dokument-Schicht war ohne Guides zu setzen,
   jedes weitere Stück nicht mehr.
3. **Die Dokument-Schicht nimmt Kinder an.** `sds-note` zuerst, weil ohne sie
   kein Theme entsteht; dann `sds-table`, `sds-surface`, `sds-figure`. Form wie
   bei `sds-code`: `lifted()` dazu, Eigenschaften bleiben für die Stories, je
   ein Beleg als Story.
4. **Das Theme-Paket.** Layout, die Overrides aus Gap 3, Container-Konfiguration.
5. **Der Rest von Gap 2.** confval, Definitionslisten, Fußnoten, Glossar — in
   der Reihenfolge, in der das Fixture sie hässlich zeigt.
