import { Category } from "../types/interfaces";
import PetsIcon from '@mui/icons-material/Pets';
import ForestIcon from '@mui/icons-material/Forest';
import ExploreIcon from "@mui/icons-material/Explore";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export const categories: Category[] = [
    { name: "Animals", color: "#fb5607", path: "/animals", icon: PetsIcon },
    { name: "Nature", color: "#06d6a0", path: "/nature", icon: ForestIcon },
    { name: "Cars", color: "#9d4edd", path: "/cars", icon: DirectionsCarIcon },
    { name: "Wallpapers", color: "#3a86ff", path: "/wallpapers", icon: ExploreIcon },
  ];