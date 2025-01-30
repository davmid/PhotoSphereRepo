import { Category } from "../types/interfaces";
import PetsIcon from '@mui/icons-material/Pets';
import ForestIcon from '@mui/icons-material/Forest';
import ExploreIcon from "@mui/icons-material/Explore";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export const categories: Category[] = [
    { name: "Animals", color: "#FFB6C1", path: "/main", icon: PetsIcon },
    { name: "Nature", color: "#98FB98", path: "/search", icon: ForestIcon },
    { name: "Car", color: "#ADD8E6", path: "/explore", icon: DirectionsCarIcon },
    { name: "Exploring", color: "#FFDA89", path: "/create", icon: ExploreIcon },
  ];