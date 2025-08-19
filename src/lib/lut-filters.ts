
export const lutToFilter: Record<string, string> = {
    "Teal & Orange": "contrast(1.1) saturate(1.2) sepia(0.3) hue-rotate(-15deg)",
    "Vintage Film": "sepia(0.5) contrast(0.9) brightness(1.1) saturate(0.8)",
    "Bleach Bypass": "contrast(1.4) saturate(0.2) brightness(1.1)",
    "Technicolor": "saturate(1.5) contrast(1.1) hue-rotate(10deg)",
    "Moonlight": "contrast(1.1) saturate(0.1) brightness(0.9) hue-rotate(240deg)",
    "Matrix": "contrast(1.3) saturate(1.2) brightness(0.8) hue-rotate(120deg) sepia(0.2)",
};

export function getLutFilter(lutName: string | null): string | undefined {
    if (!lutName) return undefined;
    return lutToFilter[lutName];
}
