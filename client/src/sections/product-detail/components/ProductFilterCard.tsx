"use client";

import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import { Slider } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckboxLabel from "./CheckboxLabel";
import { H5, H6, Paragraph, Span } from "../../../components/Typography";
import AccordionHeader from "../../../components/accordion/AccordionHeader";
import { FlexBetween } from "../../../components/flexbox";
import { useAppContext } from "../../../context/AppContext";

interface Category {
  title: string;
  children?: Category[];
}

interface Props {
  filters?: ProductFilters;
  changeFilters?: (key: ProductFilterKeys, values: ProductFilterValues) => void;
}

export default function ProductFilterCard({ filters, changeFilters }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { categories } = useAppContext();
  const router = useRouter();

  const handleChangePrice = (values: number[]) => {
    changeFilters && changeFilters("price", values);
  };

  const handleCategoryToggle = (categoryPath: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [categoryPath]: !prevState[categoryPath],
    }));
  };

  const handleCategoryClick = (selectedCategories: {
    cate?: string;
    sub_cate?: string;
    child_cate?: string;
  }) => {
    const query = new URLSearchParams();

    if (selectedCategories.cate) {
      query.append("cate", selectedCategories.cate);
    }
    if (selectedCategories.sub_cate) {
      query.append("sub_cate", selectedCategories.sub_cate);
    }
    if (selectedCategories.child_cate) {
      query.append("child_cate", selectedCategories.child_cate);
    }

    router.push(`/product?${query.toString()}`);
    router.refresh();
  };

  const CategoryItem: React.FC<{
    category: Category;
    level: number;
    parentTitles: string[];
  }> = ({ category, level, parentTitles }) => {
    const hasChildren = category.children && category.children.length > 0;
    const categoryPath = [...parentTitles, category.title].join("/");

    const handleToggle = () => {
      handleCategoryToggle(categoryPath);
    };

    const handleClick = () => {
      if (!hasChildren) {
        const selectedCategories: {
          cate?: string;
          sub_cate?: string;
          child_cate?: string;
        } = {};

        if (level === 1) {
          selectedCategories.cate = category.title;
        } else if (level === 2) {
          selectedCategories.cate = parentTitles[0];
          selectedCategories.sub_cate = category.title;
        } else if (level === 3) {
          selectedCategories.cate = parentTitles[0];
          selectedCategories.sub_cate = parentTitles[1];
          selectedCategories.child_cate = category.title;
        }

        handleCategoryClick(selectedCategories);
      }
    };

    return (
      <Fragment key={categoryPath}>
        <AccordionHeader
          open={collapsed[categoryPath]}
          onClick={hasChildren ? handleToggle : handleClick}
          sx={{
            padding: ".5rem 0",
            cursor: "pointer",
            color: "grey.600",
            display: "flex",
            alignItems: "center",
            pl: `${(level - 1) * 2}rem`,
          }}
        >
          <Span>{category.title}</Span>
        </AccordionHeader>

        {hasChildren && (
          <Collapse in={collapsed[categoryPath]} timeout="auto" unmountOnExit>
            <Box>
              {category.children!.map((child) => (
                <CategoryItem
                  key={child.title}
                  category={child}
                  level={level + 1}
                  parentTitles={[...parentTitles, category.title]}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Fragment>
    );
  };

  return (
    <div>
      <H6 mb={1.25}>Danh Mục</H6>
      {categories.map((category: Category) => (
        <CategoryItem
          key={category.title}
          category={category}
          level={1}
          parentTitles={[]}
        />
      ))}

      <Box component={Divider} my={3} />

      <H6 mb={2}>Price Range</H6>

      <Slider
        min={0}
        max={10000000}
        size="small"
        value={filters?.price || [0, 10000000]}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v.toLocaleString()} VNĐ`}
        onChange={(_, v) => handleChangePrice(v as number[])}
      />
      <FlexBetween>
        <TextField
          fullWidth
          size="small"
          type="number"
          placeholder="0"
          value={filters?.price[0] || 0}
          onChange={(e) =>
            handleChangePrice([+e.target.value, filters?.price[1] || 10000000])
          }
        />

        <H5 color="grey.600" px={1}>
          -
        </H5>

        <TextField
          fullWidth
          size="small"
          type="number"
          placeholder="10000000"
          value={filters?.price[1] || 10000000}
          onChange={(e) =>
            handleChangePrice([filters?.price[0] || 0, +e.target.value])
          }
        />
      </FlexBetween>

      <Box component={Divider} my={3} />

      <H6 mb={2}>Brands</H6>
      {/* Bạn có thể thêm các bộ lọc thương hiệu ở đây */}
    </div>
  );
}
