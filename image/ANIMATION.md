# Cena animada

`principal.jpg` permanece como original e fallback. `principal-clean.png` foi
criada com a ferramenta integrada ImageGen para remover o braço levantado e os
ponteiros, mantendo o enquadramento. O braço original é recortado por um clipPath
SVG em `index.html`; os novos ponteiros são vetoriais. `js/scene.js` sincroniza
essas camadas em ciclos de oito segundos, pausa fora da tela e respeita movimento
reduzido. O efeito é uma animação em camadas, não um vídeo.

Prompt usado (ferramenta integrada, sem API/CLI):

> Use case: precise-object-edit. Create an animation clean plate of this exact image, preserving framing, aspect ratio 16:9 and all object positions exactly. Remove ONLY the woman's raised arm extending from her right shoulder toward the clock (image normalized coordinates x=.496 to .526, y=.675 to .727); reconstruct the golden sky behind that arm. Keep her shoulder, head, dress, other hanging arm and entire body exactly unchanged. Also remove ONLY the black clock hands inside the wooden grandfather clock face on the right (center at normalized .650,.456; hands extend upward to .624,.362 and .649,.374). Fill their former area with the matching aged copper clockface texture. Keep the roman numerals, winding holes, outer rings and clock body unchanged. Keep the giant left clock, all lighting and all other details unchanged. No new elements. This will be overlaid with original arm and animated clock hands.
