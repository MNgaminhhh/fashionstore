import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ManIcon from "@mui/icons-material/Man";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PetsIcon from "@mui/icons-material/Pets";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import WomanIcon from "@mui/icons-material/Woman";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import GrassIcon from "@mui/icons-material/Grass";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MicIcon from "@mui/icons-material/Mic";
import { CategoryItem } from "../../utils/types";
import MegaMenu1 from "../megamenu/MegaMenu1";
import MegaMenu2 from "../megamenu/MegaMenu2";
export const categoryMenus: CategoryItem[] = [
  {
    icon: CheckroomIcon,
    title: "Fashion",
    href: "/fashion",
    component: MegaMenu1.name,
    children: [
      {
        title: "Man Clothes",
        href: "#",
        children: [
          { title: "Shirt", href: "/products/search/shirt" },
          { title: "T- shirt", href: "/products/search/t-shirt" },
          { title: "Pant", href: "/products/search/pant" },
          { title: "Underwear", href: "/products/search/underwear" },
        ],
      },
      {
        title: "Accessories",
        href: "#",
        children: [
          { title: "Belt", href: "/products/search/belt" },
          { title: "Hat", href: "/products/search/Hat" },
          { title: "Watches", href: "/products/search/Watches" },
          { title: "Sunglasses", href: "/products/search/Sunglasses" },
        ],
      },
      {
        title: "Shoes",
        href: "#",
        children: [
          { title: "Sneakers", href: "/products/search/Sneakers" },
          { title: "Sandals", href: "/products/search/Sandals" },
          { title: "Formal", href: "/products/search/Formal" },
          { title: "Casual", href: "/products/search/Casual" },
        ],
      },
      {
        title: "Bags",
        href: "#",
        children: [
          { title: "Backpack", href: "/products/search/backpack" },
          { title: "Crossbody Bags", href: "/products/search/Crossbody Bags" },
          { title: "Side Bags", href: "/products/search/Side Bags" },
          { title: "Slides", href: "/products/search/Slides" },
        ],
      },
    ],
  },
  {
    icon: LaptopMacIcon,
    title: "Electronics",
    component: MegaMenu1.name,
    href: "/products/search/electronics",
  },
  {
    icon: TwoWheelerIcon,
    title: "Bikes",
    href: "/products/search/bikes",
    component: MegaMenu2.name,
    children: [
      {
        icon: ManIcon,
        title: "Man",
        href: "#",
        component: MegaMenu1.name,
        children: [
          {
            title: "Man Clothes",
            href: "#",
            children: [
              { title: "Shirt", href: "/products/search/shirt" },
              { title: "T- shirt", href: "/products/search/t-shirt" },
              { title: "Pant", href: "/products/search/pant" },
              { title: "Underwear", href: "/products/search/underwear" },
            ],
          },
        ],
      },
      {
        icon: WomanIcon,
        title: "Woman",
        href: "/products/search/electronics",
      },
      {
        icon: ChildCareIcon,
        title: "Baby Boy",
        href: "/products/search/home&garden",
      },
      {
        icon: ChildFriendlyIcon,
        title: "Baby Girl",
        href: "/products/search/bikes",
      },
    ],
  },
  {
    icon: GrassIcon,
    title: "Home & Garden",
    href: "#",
    component: MegaMenu1.name,
  },
  {
    icon: CardGiftcardIcon,
    title: "Gifts",
    href: "#",
    component: MegaMenu2.name,
  },
  { icon: MicIcon, title: "Music", href: "/products/search/music" },
  {
    icon: FaceRetouchingNaturalIcon,
    title: "Health & Beauty",
    href: "/products/search/health&beauty",
  },
  { icon: PetsIcon, title: "Pets", href: "/products/search/pets" },
  {
    icon: SportsEsportsIcon,
    title: "Baby Toys",
    href: "/products/search/baby-toys",
  },
  {
    icon: RestaurantIcon,
    title: "Groceries",
    href: "/products/search/groceries",
  },
  {
    icon: DirectionsCarIcon,
    title: "Automotive",
    href: "/products/search/automotive",
  },
];
