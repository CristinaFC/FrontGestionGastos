import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';


const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

// Calculating ratio from iPhone breakpoints
const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1;
const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1;

// We set our base font size value
const baseUnit = 16;

// We're simulating EM by changing font size according to Ratio
const unit = baseUnit * ratioX;


function em(value)
{
    return moderateScale(unit * value);
}


const Style = {
    // GENERAL
    DEVICE_WIDTH: x,
    DEVICE_HALF_WIDTH: x / 2,
    DEVICE_THIRD_WIDTH: x / 3,
    DEVICE_QUARTER_WIDTH: x / 6,
    DEVICE_FORTY_PERCENT_WIDTH: x * 0.4,
    DEVICE_FORTY_FIVE_PERCENT_WIDTH: x * 0.45,
    DEVICE_EIGHTY_PERCENT_WIDTH: x * 0.8,
    DEVICE_NINETY_PERCENT_WIDTH: x * 0.9,
    DEVICE_HEIGHT: y,
    DEVICE_FORTY_PERCENT_HEIGHT: y * 0.4,
    DEVICE_FORTY_FIVE_PERCENT_HEIGHT: y * 0.45,
    DEVICE_SIXTY_PERCENT_HEIGHT: y * 0.6,
    DEVICE_SEVEN_PERCENT_HEIGHT: y * 0.07,
    DEVICE_SEVENTY_PERCENT_HEIGHT: y * 0.7,
    DEVICE_HALF_HEIGHT: y / 2,
    DEVICE_THIRD_HEIGHT: y / 3,
    DEVICE_QUARTER_HEIGHT: y / 4,
    RATIO_X: ratioX,
    RATIO_Y: ratioY,
    UNIT: em(1),
    PADDING_10XS: em(0.1),
    PADDING_9XS: em(0.2),
    PADDING_8XS: em(0.25),
    PADDING_7XS: em(0.3),
    PADDING_6XS: em(0.4),
    PADDING_5XS: em(0.5),
    PADDING_4XS: em(0.6),
    PADDING_3XS: em(0.7),
    PADDING_2XS: em(0.8),
    PADDING_XS: em(0.9),
    PADDING: em(1.25),
    PADDING_S: em(1.5),
    PADDING_M: em(1.75),
    PADDING_L: em(2.0),
    PADDING_XL: em(2.5),
    PADDING_2XL: em(3.0),
    PADDING_3XL: em(4.0),
    PADDING_4XL: em(5.0),
    PADDING_5XL: em(6.0),
    PADDING_6XL: em(7.0),
    PADDING_TOP_SAFE_AREA: Platform.OS === 'ios' ? paddingTopIOS : 0,

    // CARD
    CARD_WIDTH: x - em(1.25) * 2,
    CARD_HEIGHT: (x - em(1.25) * 2) * (3 / 5),
    CARD_PADDING_X: em(1.875),
    CARD_PADDING_Y: em(1.25),



    // TABLE
    CALENDAR_DAYS: (x - 60) / 6,
    CALENDAR_HOURS: (x - 50) / 2,

    // FONT
    FONT_FAMILY: 'system font',
    FONT_SIZE: em(1),
    FONT_SIZE_SMALL_XS: em(0.65),
    FONT_SIZE_SMALL_S: em(0.75),
    FONT_SIZE_SMALL: em(0.875),
    FONT_SIZE_MEDIUM: em(1.0),
    FONT_SIZE_TITLE: em(1.25),
    FONT_SIZE_TITLE_S: em(1.5),
    FONT_SIZE_TITLE_M: em(1.75),
    FONT_SIZE_TITLE_L: em(2.25),
    FONT_SIZE_TITLE_XL: em(2.5),
    FONT_SIZE_TITLE_2XL: em(3.0),
    FONT_SIZE_TITLE_3XL: em(4.0),

    // ICONS
};

export { Style };