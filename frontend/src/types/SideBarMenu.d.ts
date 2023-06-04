import { IconType } from "react-icons";

export interface SideBarMenuItem {
    id : string;
    label : string;
    icon : IconType;
    url : string;
    privilegeNeeded : string;
}
