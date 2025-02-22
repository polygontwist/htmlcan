# htmlcan (HTML to Canvas)

HTML-Knoten auf canva-Element rendern, z. B. für WebGL-Texturen.

## Vorschau
Beispiel: Oben Canvas, unten HTML

![Vergleich Canvas vs. HTML](https://github.com/polygontwist/htmlcan/blob/main/screenshot.png)

## Funktionsweise
Das Skript analysiert HTML-Elemente und überträgt deren Stileigenschaften auf ein Canvas-Element. 
Dabei werden unter anderem folgende Attribute berücksichtigt:

- Position und Größe
- Hintergrundfarbe
- Textfarbe und Schriftart
- Eckenabrundung
- Bilder

Auch klassische `<input>`-Elemente werden gerendert, allerdings ohne Interaktionsmöglichkeiten. Interaktionsmöglichkeiten müssten zusätzlich implementiert werden.

## Einschränkungen
⚠️ **Hinweis:** Das Skript funktioniert nur, wenn es von einem Server aus geladen wird.

## Änderungen in Version 2
- Code-Optimierung
- Unterstützung für `padding`
- Unterstützung für Elemente mit `:before`, z. B. Font-Icons

## Schriftart-Quelle
- **URL:** [IcoMoon](https://icomoon.io/#icons-icomoon)
- **Designer:** Keyamoon
- **Lizenz:** GPL oder CC BY 4.0

---

### Installation & Nutzung
1. Stelle sicher, dass das Skript über einen Server bereitgestellt wird.
2. Binde das Skript in deine HTML-Datei ein.
3. Rufe die `htmlcan`-Funktion mit dem gewünschten HTML-Element nach dem laden auf.

```js
	<script type="module">
		import { htmltocanvas } from './script.js';	

		const setup=function(){
			htmltocanvas({
			"canvas":document.getElementById("zielcanvas"),
			"quelle":document.getElementById("quellhtml")
			//,"autosize":true
			//,"autoscale":true
			});
		}

		window.addEventListener('load',function(e){setup()});
		
	</script>
```

## Lizenz
Dieses Projekt steht unter der **MIT-Lizenz**. Siehe die Datei `LICENSE` für weitere Informationen.

---

_Feedback und Beiträge sind willkommen!_ 🚀

