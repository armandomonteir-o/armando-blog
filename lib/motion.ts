// Same values as the --ease-* tokens in styles/theme.css, for motion/react.
export const easeOut = [0.23, 1, 0.32, 1] as const;
export const easeInOut = [0.77, 0, 0.175, 1] as const;
export const easeDrawer = [0.32, 0.72, 0, 1] as const;

// Apple-style spring: subtle bounce, carries velocity when interrupted.
export const spring = { type: "spring", duration: 0.5, bounce: 0.2 } as const;
