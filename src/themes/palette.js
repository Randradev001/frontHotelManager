// third-party
import { presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';
import { extendPaletteWithChannels } from 'utils/colorUtils';

const greyAscent = ['#f8faf9', '#a7b1aa', '#374151', '#1f2937'];

// ==============================|| GREY COLORS BUILDER ||============================== //

function buildGrey() {
  const greyPrimary = [
    '#ffffff',
    '#f8faf9',
    '#f1f5f2',
    '#e8eee9',
    '#d8e3dc',
    '#a7b1aa',
    '#6b7280',
    '#4b5563',
    '#374151',
    '#1f2937',
    '#111827'
  ];
  const greyConstant = ['#f8faf9', '#d8e3dc'];

  return [...greyPrimary, ...greyAscent, ...greyConstant];
}

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export function buildPalette(presetColor) {
  const lightColors = { ...presetPalettes, grey: buildGrey() };
  const lightPaletteColor = ThemeOption(lightColors, presetColor);

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPaletteColor);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight,
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        disabled: '#a7b1aa'
      },
      action: {
        disabled: '#d8e3dc',
        hover: 'rgba(0, 128, 64, 0.05)',
        selected: 'rgba(0, 128, 64, 0.09)'
      },
      divider: '#d8e3dc',
      background: {
        paper: '#ffffff',
        default: '#f8faf9'
      }
    }
  };
}
