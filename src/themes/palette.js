// third-party
import { presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';
import { extendPaletteWithChannels } from 'utils/colorUtils';

const greyAscent = ['#F8FAFD', '#A9B7C9', '#33465F', '#10233D'];

// ==============================|| GREY COLORS BUILDER ||============================== //

function buildGrey() {
  const greyPrimary = [
    '#ffffff',
    '#F8FAFD',
    '#F2F6FB',
    '#E8EEF6',
    '#D7E1EE',
    '#A9B7C9',
    '#718198',
    '#52647B',
    '#33465F',
    '#10233D',
    '#061B36'
  ];
  const greyConstant = ['#F8FAFD', '#D7E1EE'];

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
        primary: '#10233D',
        secondary: '#607089',
        disabled: '#A9B7C9'
      },
      action: {
        disabled: '#D7E1EE',
        hover: 'rgba(8, 125, 241, 0.07)',
        selected: 'rgba(8, 125, 241, 0.13)'
      },
      divider: '#D7E1EE',
      background: {
        paper: '#ffffff',
        default: '#F4F7FB'
      }
    }
  };
}
