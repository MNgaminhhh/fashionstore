import ButtonBase from "@mui/material/ButtonBase";
import { alpha, styled } from "@mui/material/styles";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Paragraph, Span } from "../../../../../Typography";

interface ActiveProps {
  active: boolean;
}

interface CompactProps {
  compact: boolean;
}

interface CollapseCompactProps {
  collapsed: boolean;
  compact: boolean;
}

interface ChevronLeftProps {
  sidebarCompact: boolean;
  compact: boolean;
}

const SidebarWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "compact",
})<CompactProps>(({ theme, compact }) => ({
  width: compact ? 86 : 280,
  height: "100vh",
  position: "fixed",
  transition: "width .2s ease",
  zIndex: theme.zIndex.drawer,
  color: theme.palette.common.black,
  backgroundColor: theme.palette.grey[800],
  boxShadow: theme.shadows[3],
  "&:hover": {
    width: compact ? 280 : undefined,
  },
}));

const NavItemButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ theme, active }) => ({
  height: 44,
  width: "100%",
  borderRadius: 8,
  marginBottom: 4,
  padding: "0 12px 0 16px",
  justifyContent: "flex-start",
  color: theme.palette.common.white,
  transition: "background-color 0.15s ease",
  ...(active && {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.grey[900], 0.6),
    "& .MuiSvgIcon-root .secondary": {
      color: theme.palette.primary.main,
      opacity: 1,
    },
  }),
}));

const ListLabel = styled(Paragraph, {
  shouldForwardProp: (prop) => prop !== "compact",
})<CompactProps>(({ compact }) => ({
  fontWeight: 600,
  fontSize: "12px",
  marginTop: "20px",
  marginLeft: "15px",
  marginBottom: "10px",
  textTransform: "uppercase",
  transition: "opacity 0.15s ease, width 0.15s ease",
  opacity: compact ? 0 : 1,
  width: compact ? 0 : "auto",
}));

const ListIconWrapper = styled("div")(({ theme }) => ({
  width: 22,
  height: 22,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "0.8rem",
  "& svg": {
    width: "100%",
    height: "100%",
    color: theme.palette.text.disabled,
  },
}));

const ExternalLink = styled("a")({
  overflow: "hidden",
  whiteSpace: "pre",
  marginBottom: "8px",
  textDecoration: "none",
});

const StyledText = styled(Span, {
  shouldForwardProp: (prop) => prop !== "compact",
})<CompactProps>(({ compact }) => ({
  whiteSpace: "nowrap",
  transition: "opacity 0.15s ease, width 0.15s ease",
  opacity: compact ? 0 : 1,
  width: compact ? 0 : "auto",
}));

const BulletIcon = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ theme, active }) => ({
  width: 3,
  height: 3,
  marginLeft: "10px",
  borderRadius: "50%",
  marginRight: "1.3rem",
  background: active ? theme.palette.primary.main : theme.palette.common.white,
  boxShadow: active
    ? `0px 0px 0px 4px ${alpha(theme.palette.primary.main, 0.2)}`
    : "none",
}));

const BadgeValue = styled("div", {
  shouldForwardProp: (prop) => prop !== "compact",
})<CompactProps>(({ compact }) => ({
  padding: "1px 8px",
  borderRadius: "300px",
  display: compact ? "none" : "inline-block",
}));

const ChevronLeftIcon = styled(ChevronLeft, {
  shouldForwardProp: (prop) => prop !== "compact" && prop !== "sidebarCompact",
})<ChevronLeftProps>(({ compact, sidebarCompact }) => ({
  width: 40,
  height: 40,
  padding: 8,
  cursor: "pointer",
  borderRadius: "50%",
  transition: "all 0.3s",
  color: "rgba(255, 255, 255, .6)",
  display: compact ? "none" : "block",
  transform: sidebarCompact ? "rotate(180deg)" : "rotate(0deg)",
  "&:hover": {
    color: "rgba(255, 255, 255, 1)",
    background: "rgba(255, 255, 255, .05)",
  },
}));

const ChevronRightIcon = styled(ChevronRight, {
  shouldForwardProp: (prop) => prop !== "compact" && prop !== "collapsed",
})<CollapseCompactProps>(({ collapsed, compact, theme: { direction } }) => ({
  fontSize: 18,
  color: "white",
  transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
  transition: "transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms",
  ...(compact && { display: "none", width: 0 }),
  ...(collapsed && direction === "rtl" && { transform: "rotate(180deg)" }),
}));

export {
  ListLabel,
  StyledText,
  BulletIcon,
  BadgeValue,
  ExternalLink,
  NavItemButton,
  SidebarWrapper,
  ListIconWrapper,
  ChevronLeftIcon,
  ChevronRightIcon,
};
