import autumnBackground from '@/assets/bg-autumn.webp';
import springBackground from '@/assets/bg-spring.webp';
import summerBackground from '@/assets/bg-summer.webp';
import winterBackground from '@/assets/bg-winter.webp';

export const getSeasonBackground = (): string => {
  const month = new Date().getMonth();

  if (month >= 2 && month <= 4) {
    return springBackground;
  } else if (month >= 5 && month <= 7) {
    return summerBackground;
  } else if (month >= 8 && month <= 10) {
    return autumnBackground;
  } else {
    return winterBackground;
  }
};
