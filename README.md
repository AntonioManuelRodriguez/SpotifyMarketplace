# Garage 🏁

Tema para **Spotify de escritorio** hecho con [Spicetify](https://spicetify.app), con un **menú de personalización** integrado para cambiar de coche, colores y adornos en directo, sin tocar código.

Trae cuatro looks:

| Tema | Colores | Placa del reproductor |
|------|---------|-----------------------|
| **Supra Neón** (por defecto) | Morado fluorescente y rosa | 2JZ-GTE · 3.0 TWIN TURBO |
| **Supra Rojo** | Renaissance Red del A80 | 2JZ-GTE · 3.0 TWIN TURBO |
| **Mercedes** | Gris plata y blanco | AMG · 4.0 V8 BITURBO |
| **BMW** | Azul y blanco | M · 3.0 TWIN POWER TURBO |

<!-- FOTO: captura general de Spotify con el tema Supra Neón -->
![Supra Neón]()

---

## Qué incluye

- 🎨 **4 temas** que se cambian con un clic desde el menú.
- 🎛️ **Menú de personalización** (`Ctrl + Alt + G`): colores propios, brillo neón, bordes, inclinación, textos y más.
- ✨ **Adornos** que se pueden encender o apagar uno a uno:
  - Rejilla neón, fibra de carbono y destellos de fondo.
  - Luz trasera animada sobre el reproductor.
  - Placa del motor y marca de agua gigante.
  - Esquinas HUD en las tarjetas al pasar el ratón.
  - Bandera de cuadros en el borde superior.
  - Marcas de cuentarrevoluciones sobre la barra de progreso.
  - Rayas de carreras en el menú lateral.
- ⚡ **Modo rendimiento** para PCs justos.
- 💾 **Guardado automático** de tus ajustes, con opción de exportarlos e importarlos.

---

## Requisitos

- **Spotify de escritorio** descargado desde la [web oficial de Spotify](https://www.spotify.com/download). La versión de la Microsoft Store **no** es compatible con Spicetify.
- **[Spicetify CLI](https://spicetify.app/docs/getting-started)** instalado. Este tema se ha hecho con la versión `2.45.1`; con otras puede funcionar, pero no está comprobado.
- **PowerShell** (Windows) o una terminal (Linux y macOS).
- Conexión a internet la primera vez, para cargar la fuente racing desde Google Fonts. Sin ella el tema usa una fuente de reserva y se ve igual, solo menos racing.

> ⚠️ Spicetify modifica archivos de Spotify. Hace una copia de seguridad al ejecutar `spicetify backup apply`, pero úsalo bajo tu responsabilidad. Este proyecto no está afiliado ni respaldado por Spotify ni por Spicetify.

---

## Instalación

### 1. Instalar Spicetify (si no lo tienes)

**Windows** (PowerShell):

```powershell
iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex
```

**Linux / macOS** (terminal):

```bash
curl -fsSL https://raw.githubusercontent.com/spicetify/cli/main/install.sh | sh
```

Cierra Spotify y haz la copia de seguridad inicial:

```bash
spicetify backup apply
```

### 2. Copiar los archivos de Garage

Averigua dónde guarda Spicetify sus datos:

```powershell
spicetify path userdata
```

Normalmente es `%APPDATA%\spicetify` en Windows y `~/.config/spicetify` en Linux y macOS. Dentro hay dos carpetas que nos interesan, `Themes` y `Extensions`.

Copia los archivos así:

| Archivo | Destino |
|---------|---------|
| `user.css` | `Themes/Garage/user.css` |
| `color.ini` | `Themes/Garage/color.ini` |
| `garage-menu.js` | `Extensions/garage-menu.js` |

Te tiene que quedar:

```
spicetify/
├── Themes/
│   └── Garage/
│       ├── user.css
│       └── color.ini
└── Extensions/
    └── garage-menu.js
```

> 📌 La carpeta del tema debe llamarse exactamente **`Garage`**, con la G en mayúscula y sin subcarpetas dentro. Si no, Spicetify dirá `Theme "Garage" not found`.

**Atajo en PowerShell (Windows):** estando en la carpeta donde descargaste los tres archivos.

```powershell
$ud = spicetify path userdata
New-Item -ItemType Directory -Force "$ud\Themes\Garage"
Copy-Item .\user.css "$ud\Themes\Garage"
Copy-Item .\color.ini "$ud\Themes\Garage"
Copy-Item .\garage-menu.js "$ud\Extensions"
```

### 3. Activar el tema y la extensión

```bash
spicetify config current_theme Garage color_scheme garage
spicetify config inject_css 1 replace_colors 1 overwrite_assets 1
spicetify config extensions garage-menu.js
spicetify apply
```

Spotify se reinicia solo. Si todo ha ido bien verás el tema en morado neón y un botón **Garage** en la barra superior.

<!-- FOTO: captura del botón Garage en la barra superior -->
![Botón Garage](docs/img/boton-garage.png)

---

## Uso

### Abrir el menú

Hay tres formas:

1. Botón **Garage** en la barra superior de Spotify.
2. Opción **Garage · personalizar** en el menú de tu perfil.
3. Atajo de teclado **`Ctrl + Alt + G`**.

Si tu versión de Spotify no muestra el botón de la barra, aparece un botón flotante con un engranaje (⚙) cerca del reproductor. Para cerrar el menú usa `Esc`, la ✕ o haz clic fuera.

<!-- FOTO: captura del menú Garage abierto -->
![Menú Garage](docs/img/menu.png)

### Qué se puede cambiar

| Sección | Qué hace |
|---------|----------|
| **Elige el coche** | Cambia entre Supra Neón, Supra Rojo, Mercedes y BMW. Al cambiar de tema se borran los colores propios y los textos personalizados. |
| **Colores** | Cinco selectores: principal, brillante, secundario, plata y fondo. Se aplican al momento. El botón *Volver a los colores del tema* los deshace. |
| **Ajustes finos** | Brillo neón (0–150 %), bordes redondeados (0–20 px) e inclinación racing de la placa y la aguja (0–14°). |
| **Adornos** | Interruptores para cada adorno, para las animaciones, la fuente racing y el **modo rendimiento**. |
| **Textos de adorno** | Cambia el texto de la placa del reproductor y de la marca de agua gigante (máximo 40 caracteres). |
| **Guardar, compartir o restablecer** | *Copiar ajustes* te da un JSON con tu configuración, *Aplicar JSON pegado* la restaura y *Restablecer todo* vuelve a los valores de fábrica. |

Los ajustes se guardan solos y se mantienen cuando cierras Spotify.

<!-- FOTO: comparativa de los cuatro temas -->
| Supra Neón | Supra Rojo |
|:---:|:---:|
| ![Supra Neón](docs/img/supra-neon.png) | ![Supra Rojo](docs/img/supra-rojo.png) |
| **Mercedes** | **BMW** |
| ![Mercedes](docs/img/mercedes.png) | ![BMW](docs/img/bmw.png) |

### Modo rendimiento

Si Spotify va a tirones, por ejemplo al plegar la biblioteca, abre el menú y activa **Modo rendimiento** en la sección *Adornos*. Quita brillos, sombras de texto, animaciones y las capas de fondo más pesadas. Si con eso va fluido, puedes volver a desactivarlo y apagar solo el adorno que moleste.

Además, el tema pausa solo los efectos mientras se pliega o ensancha la biblioteca y los reactiva al terminar.

---

## Cómo funciona

- **`user.css`** tiene todo el diseño. Los colores, el brillo, los bordes, la inclinación y las capas de fondo salen de variables CSS `--g-*`, con valores por defecto en morado neón. Cada adorno se apaga con una clase `html.g-no-*`.
- **`garage-menu.js`** es una extensión de Spicetify. Guarda tus ajustes en `localStorage`, escribe las variables `--g-*` y `--spice-*` en el elemento raíz y activa o quita las clases de adornos. Por eso los cambios son inmediatos y no hace falta recargar.
- **`color.ini`** es el esquema base `garage` (colores del tema morado). Spicetify lo usa como punto de partida y la extensión lo sobrescribe en caliente.

El fondo (rejilla, carbono, destellos) vive en una capa fija que cubre toda la ventana y se pinta una sola vez, para que plegar la biblioteca no obligue a repintarlo.

---

## Actualizar

Copia otra vez `user.css` y `garage-menu.js` encima de los que tienes y ejecuta:

```bash
spicetify apply
```

## Desinstalar

```bash
spicetify config extensions garage-menu.js-
spicetify config current_theme ""
spicetify apply
```

Para quitar Spicetify entero y dejar Spotify como estaba:

```bash
spicetify restore
```

---

## Solución de problemas

**`Theme "Garage" not found`**
La carpeta del tema no está en el sitio correcto. Comprueba con `spicetify path userdata` que existe `Themes/Garage/` (con la G mayúscula) y que `user.css` y `color.ini` están directamente dentro, sin una subcarpeta extra.

**No aparece el botón Garage ni funciona `Ctrl + Alt + G`**
Mira que la extensión esté activa con `spicetify config extensions`. Debe salir `garage-menu.js` una sola vez. Si sale duplicado o con otro nombre, quítalo con `spicetify config extensions NOMBRE-` (el guion final lo elimina) y vuelve a añadir `garage-menu.js`. Después ejecuta `spicetify apply`.

**Los colores no cambian al elegir otro tema en el menú**
Comprueba que `replace_colors` esté a `1`:

```bash
spicetify config inject_css 1 replace_colors 1 overwrite_assets 1
spicetify apply
```

**Los botones de play salen con un cuadrado detrás**
Estaba corregido en la versión actual (el color va en el círculo interior del botón). Si te pasa, asegúrate de tener el `user.css` más reciente.

**Va a tirones al plegar la biblioteca**
Activa el **Modo rendimiento** desde el menú. Si sigue igual, apaga los adornos de uno en uno para ver cuál lo causa.

**Después de actualizar Spotify se ha roto el tema**
Spotify borra los parches al actualizarse. Vuelve a aplicarlo:

```bash
spicetify restore backup apply
```

Si tras eso algún adorno no se ve, Spotify puede haber cambiado el nombre de alguna clase CSS. Abre las herramientas de desarrollador con `spicetify enable-devtools`, haz `spicetify apply` y clic derecho → *Inspeccionar elemento* para ver el nombre nuevo.

**La fuente no se ve racing**
La fuente se carga desde Google Fonts. Si Spotify la bloquea o no hay internet, usa una de reserva. También puedes tener activado *Fuente racing* en el menú: comprueba que no esté apagado.

---

## Estructura del repositorio

```
Garage/
├── user.css          # Diseño del tema (variables, adornos, arreglos)
├── color.ini         # Esquema de colores base
├── garage-menu.js    # Extensión con el menú de personalización
├── README.md
└── docs/
    └── img/          # Capturas usadas en este README
```

## Créditos

Hecho por **Kyle** con ayuda de Claude. Funciona gracias a [Spicetify](https://github.com/spicetify/cli).

Inspirado en el Toyota Supra, el Mercedes-AMG y el BMW M. Los nombres y marcas pertenecen a sus respectivos propietarios y aquí se usan solo como inspiración estética.
