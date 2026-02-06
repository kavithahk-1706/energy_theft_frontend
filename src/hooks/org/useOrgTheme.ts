export const useOrgTheme = (primaryColor: string) => {
  // This can be expanded later to handle more complex theme logic
  return {
    "--neon-cyan": primaryColor,
    "--org-glow": `${primaryColor}33`, // 20% opacity version
  };
};