import springBackground from "../../assets/bg-spring.jpg";
import summerBackground from "../../assets/bg-summer.jpg";
import autumnBackground from "../../assets/bg-autumn.jpg";
import winterBackground from "../../assets/bg-winter.jpg";

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
