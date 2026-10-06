export const getCalloutCardPosition = (
  screenX: number,
  screenY: number,
  windowWidth: number,
  windowHeight: number
) => {
  const cardWidth = 270;
  const cardHeight = 170;

  // Avoid top-left hero block (width ~480px, height ~360px)
  let targetX: number;
  let targetY: number;

  if (screenX < 460) {
    // If anchor is near left side, place card further right to clear hero text
    targetX = Math.max(screenX + 50, 460);
    targetY = screenY < 320 ? 330 : screenY - 40;
  } else if (screenX > windowWidth - cardWidth - 60) {
    // If anchor is near right edge, place card to the left
    targetX = screenX - cardWidth - 50;
    targetY = screenY - 50;
  } else {
    // Default: slightly to the right of the anchor
    targetX = screenX + 45;
    targetY = screenY - 60;
  }

  // Viewport bounds clamping
  targetX = Math.max(30, Math.min(windowWidth - cardWidth - 30, targetX));
  targetY = Math.max(95, Math.min(windowHeight - cardHeight - 80, targetY));

  return { targetX, targetY, cardWidth, cardHeight };
};
