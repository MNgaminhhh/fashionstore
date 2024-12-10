"use client";

import { Fragment, useState } from "react";
import {
  Box,
  Divider,
  Collapse,
  TextField,
  Slider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Checkbox,
  Radio,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FlexBetween } from "../../../components/flexbox";
import { useAppContext } from "../../../context/AppContext";

const mappingTypeProduct: { [key: string]: string } = {
  none: "Sản Phẩm Bình Thường",
  new_arrival: "Hàng Mới Về",
  best_product: "Sản Phẩm Tốt Nhất",
  featured_product: "Sản Phẩm Nổi Bật",
  top_product: "Sản Phẩm Hàng Đầu",
};

interface Category {
  title: string;
  children?: Category[];
}

interface ProductFilters {
  name?: string;
  price?: number[];
  productType?: string[];
  category: {
    cate_names?: string[];
    sub_cate_names?: string[];
    child_cate_names?: string[];
  };
}

type ProductFilterKeys = "price" | "category" | "productType" | "name";
type ProductFilterValues = any;

interface Props {
  filters?: ProductFilters;
  changeFilters?: (key: ProductFilterKeys, values: ProductFilterValues) => void;
}

const ProductFilterCard: React.FC<Props> = ({ filters, changeFilters }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { categories } = useAppContext();
  const router = useRouter();

  const handleChangePrice = (values: number[]) => {
    changeFilters && changeFilters("price", values);
    updateURL({ ...filters, price: values, productType: filters?.productType });
  };

  const handleCategoryToggle = (categoryPath: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [categoryPath]: !prevState[categoryPath],
    }));
  };

  const handleProductTypeChange = (typeKey: string, checked: boolean) => {
    let updatedTypes = filters?.productType ? [...filters.productType] : [];

    if (checked) {
      if (!updatedTypes.includes(typeKey)) {
        updatedTypes.push(typeKey);
      }
    } else {
      updatedTypes = updatedTypes.filter((t) => t !== typeKey);
    }

    changeFilters && changeFilters("productType", updatedTypes);
    updateURL({ ...filters, productType: updatedTypes });
  };

  const handleCategorySelect = (categoryPath: string, level: number) => {
    let updatedCateNames = filters?.category?.cate_names
      ? [...filters.category.cate_names]
      : [];
    let updatedSubCateNames = filters?.category?.sub_cate_names
      ? [...filters.category.sub_cate_names]
      : [];
    let updatedChildCateNames = filters?.category?.child_cate_names
      ? [...filters.category.child_cate_names]
      : [];

    const categoryTitle = categoryPath.split("/").pop() || "";
    if (level === 1) {
      if (updatedCateNames.includes(categoryTitle)) {
        updatedCateNames = [];
      } else {
        updatedCateNames = [categoryTitle];
      }
      updatedSubCateNames = [];
      updatedChildCateNames = [];
    } else if (level === 2) {
      if (updatedSubCateNames.includes(categoryTitle)) {
        updatedSubCateNames = [];
      } else {
        updatedSubCateNames = [categoryTitle];
      }
      updatedChildCateNames = [];
    } else if (level === 3) {
      if (updatedChildCateNames.includes(categoryTitle)) {
        updatedChildCateNames = [];
      } else {
        updatedChildCateNames = [categoryTitle];
      }
    }

    const newFilters = {
      ...filters,
      category: {
        cate_names: updatedCateNames,
        sub_cate_names: updatedSubCateNames,
        child_cate_names: updatedChildCateNames,
      },
    };

    changeFilters && changeFilters("category", newFilters.category);
    updateURL(newFilters);
  };

  const handleNameChange = (name: string) => {
    changeFilters && changeFilters("name", name);
    updateURL({ ...filters, name });
  };

  const updateURL = (updatedFilters: ProductFilters) => {
    const query = new URLSearchParams();

    updatedFilters.category?.cate_names?.forEach((name) =>
      query.append("cate_name", name)
    );
    updatedFilters.category?.sub_cate_names?.forEach((name) =>
      query.append("sub_cate_name", name)
    );
    updatedFilters.category?.child_cate_names?.forEach((name) =>
      query.append("child_cate_name", name)
    );

    if (updatedFilters.price) {
      query.append("low_price", updatedFilters.price[0].toString());
      query.append("high_price", updatedFilters.price[1].toString());
    }

    if (updatedFilters.productType && updatedFilters.productType.length > 0) {
      updatedFilters.productType.forEach((pt) =>
        query.append("product_type", pt)
      );
    }

    if (updatedFilters.name && updatedFilters.name.trim() !== "") {
      query.append("name", updatedFilters.name);
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

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleCategoryToggle(categoryPath);
    };
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleCategorySelect(categoryPath, level);
    };

    let isChecked = false;
    if (level === 1) {
      isChecked =
        filters?.category?.cate_names?.includes(category.title) || false;
    } else if (level === 2) {
      isChecked =
        filters?.category?.sub_cate_names?.includes(category.title) || false;
    } else if (level === 3) {
      isChecked =
        filters?.category?.child_cate_names?.includes(category.title) || false;
    }

    return (
      <Fragment key={categoryPath}>
        <ListItem disablePadding>
          <ListItemButton sx={{ pl: level * 2 }} onClick={handleClick}>
            <Radio
              edge="start"
              checked={isChecked}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={
                <Typography variant="body1" color="text.secondary">
                  {category.title}
                </Typography>
              }
            />
            {hasChildren && (
              <ListItemIcon sx={{ minWidth: "auto" }} onClick={handleToggle}>
                {collapsed[categoryPath] ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={collapsed[categoryPath]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children!.map((child) => (
                <CategoryItem
                  key={child.title}
                  category={child}
                  level={level + 1}
                  parentTitles={[...parentTitles, category.title]}
                />
              ))}
            </List>
          </Collapse>
        )}
      </Fragment>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tìm Kiếm Tên Sản Phẩm
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Nhập tên sản phẩm..."
        value={filters?.name || ""}
        onChange={(e) => handleNameChange(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>
        Danh Mục
      </Typography>
      <List component="nav" aria-labelledby="nested-list-subheader">
        {categories.map((category: Category) => (
          <CategoryItem
            key={category.title}
            category={category}
            level={1}
            parentTitles={[]}
          />
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Khoảng Giá
      </Typography>
      <Box px={2}>
        <Slider
          min={0}
          max={10000000}
          size="small"
          value={filters?.price || [0, 10000000]}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v.toLocaleString()} VNĐ`}
          onChange={(_, v) => handleChangePrice(v as number[])}
          sx={{ mb: 2 }}
        />
        <FlexBetween>
          <TextField
            label="Từ"
            variant="outlined"
            size="small"
            type="number"
            value={filters?.price?.[0] || 0}
            onChange={(e) =>
              handleChangePrice([
                +e.target.value,
                filters?.price?.[1] || 10000000,
              ])
            }
            InputProps={{
              inputProps: { min: 0, max: 10000000 },
            }}
            sx={{ width: "45%" }}
          />
          <Typography variant="body1" color="text.secondary">
            -
          </Typography>
          <TextField
            label="Đến"
            variant="outlined"
            size="small"
            type="number"
            value={filters?.price?.[1] || 10000000}
            onChange={(e) =>
              handleChangePrice([filters?.price?.[0] || 0, +e.target.value])
            }
            InputProps={{
              inputProps: { min: 0, max: 10000000 },
            }}
            sx={{ width: "45%" }}
          />
        </FlexBetween>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Kiểu Sản Phẩm
      </Typography>
      <List>
        {Object.entries(mappingTypeProduct).map(([key, value]) => {
          const checked = filters?.productType?.includes(key) || false;
          return (
            <ListItem key={key} disablePadding>
              <ListItemButton>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  checked={checked}
                  onChange={(e) =>
                    handleProductTypeChange(key, e.target.checked)
                  }
                />
                <ListItemText primary={value} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ProductFilterCard;
