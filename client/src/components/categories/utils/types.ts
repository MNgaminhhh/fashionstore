export interface CategoryItemOffer {
  url: string;
  href: string;
  position: "right" | "bottom";
}

export interface CategoryItem {
  href: string;
  title: string;
  component?: string;
  icon?: string;
  children?: CategoryItem[];
  offer?: CategoryItemOffer;
}
