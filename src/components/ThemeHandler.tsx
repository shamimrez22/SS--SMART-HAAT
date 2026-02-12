
'use client';

import { useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * ThemeHandler - Injects dynamic CSS variables based on Firestore settings.
 * Converts HEX to HSL format for compatibility with ShadCN variables.
 * Ensures ALL text changes color when themeTextColor is updated.
 */
export function ThemeHandler() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;

    // Helper to convert hex to HSL space-separated string for ShadCN
    const hexToHsl = (hex: string) => {
      let r = 0, g = 0, b = 0;
      if (!hex) return '0 0% 100%';
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    if (settings.themePrimaryColor) {
      const hsl = hexToHsl(settings.themePrimaryColor);
      root.style.setProperty('--primary', hsl);
      root.style.setProperty('--accent', hsl);
      root.style.setProperty('--ring', hsl);
    }

    if (settings.themeBackgroundColor) {
      const hsl = hexToHsl(settings.themeBackgroundColor);
      root.style.setProperty('--background', hsl);
      root.style.setProperty('--card', hsl);
      root.style.setProperty('--popover', hsl);
    }

    if (settings.themeTextColor) {
      const hsl = hexToHsl(settings.themeTextColor);
      // UPDATE ALL TEXT VARIABLES SIMULTANEOUSLY
      root.style.setProperty('--foreground', hsl);
      root.style.setProperty('--card-foreground', hsl);
      root.style.setProperty('--popover-foreground', hsl);
      root.style.setProperty('--muted-foreground', hsl);
      root.style.setProperty('--secondary-foreground', hsl);
      root.style.setProperty('--accent-foreground', hsl);
    }

    if (settings.themeButtonColor) {
      root.style.setProperty('--button-bg', settings.themeButtonColor);
    }

  }, [settings]);

  return null;
}
