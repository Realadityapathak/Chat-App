/**
 * Shared Motion Configuration for Precision Telegraph
 * Restricted strictly to transform and opacity.
 * Wrapped in MotionConfig reducedMotion="user".
 */

export const transitionPhysics = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const snappyDuration = {
  duration: 0.16,
  ease: [0.22, 1, 0.36, 1],
};

// Incoming message entrance: only transform and opacity, 160ms
export const incomingMessageVariants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: snappyDuration },
};

// Tactical button press feedback
export const tactilePress = {
  tap: { scale: 0.97 },
};

// Mobile slide between contact list and chat pane
export const mobilePaneVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: snappyDuration },
  exit: { opacity: 0, x: -12, transition: snappyDuration },
};

// Signature Sound Deck tick animation
export const soundWaveVariants = {
  idle: { scaleY: 0.25, opacity: 0.4 },
  active: { scaleY: 1, opacity: 1, transition: { duration: 0.08 } },
};
