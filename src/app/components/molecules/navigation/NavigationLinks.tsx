import { NAVIGATION_LINKS } from "../../../constants/navigation/links";
import NavigationLink from "../../atoms/navigation/NavigationLink";

export default function NavigationLinks() {

    return (
        <>
            {NAVIGATION_LINKS.map((navigationLink) => (
                <div key={`navigationlink-${navigationLink.to}`}>
                    <NavigationLink
                        label={navigationLink.label}
                        to={navigationLink.to}
                    />
                </div>
            ))}
        </>
    );
}
