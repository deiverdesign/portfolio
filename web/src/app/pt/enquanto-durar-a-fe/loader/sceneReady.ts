// Sinal entre a cena 3D (PortaoMaterial) e o loader: "a primeira cena já pode aparecer".
// O evento avisa quem está ouvindo; o atributo no <html> cobre quem chegou depois do aviso.
export const SCENE_READY_EVENT = "edf:scene-ready";
export const SCENE_READY_ATTRIBUTE = "data-edf-scene-ready";

export function announceSceneReady() {
  document.documentElement.setAttribute(SCENE_READY_ATTRIBUTE, "true");
  window.dispatchEvent(new Event(SCENE_READY_EVENT));
}

export function isSceneReady() {
  return document.documentElement.getAttribute(SCENE_READY_ATTRIBUTE) === "true";
}
