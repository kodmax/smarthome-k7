import {
  Activity,
  AirVent,
  Banknote,
  BriefcaseBusiness,
  Camera,
  ChartCandlestick,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  Clapperboard,
  CloudDrizzle,
  CloudHail,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Cog,
  Copy,
  Droplets,
  Fan,
  FileText,
  Flame,
  Globe,
  Heater,
  House,
  Info,
  LayoutDashboard,
  Leaf,
  Link,
  List,
  Funnel,
  FunnelX,
  Menu,
  Moon,
  Newspaper,
  PieChart,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Star,
  Sun,
  SunMedium,
  SunMoon,
  Sunrise,
  Sunset,
  Thermometer,
  ThermometerSun,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wind,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { createStyledIcon } from './createStyledIcon'
import { iconStyles } from './iconStyles'

export { createStyledIcon } from './createStyledIcon'
export type { StyledIconOptions, StyledIconProps, StyledLucideIcon } from './createStyledIcon'
export type { IconGlow } from './iconGlow'
export { iconStyles } from './iconStyles'
export { iconGlowFilter } from './iconGlow'

export const HomeIcon = createStyledIcon(House, iconStyles.neutral)
export const DashboardIcon = createStyledIcon(LayoutDashboard, iconStyles.neutral)
export const EnergyIcon = createStyledIcon(Zap, iconStyles.energy)
export const ConsumptionIcon = createStyledIcon(Activity, iconStyles.energy)
export const PowerIcon = createStyledIcon(ChartNoAxesColumnIncreasing, iconStyles.energy)
export const TemperatureIcon = createStyledIcon(Thermometer, iconStyles.temperature)
export const ThermometerSunIcon = createStyledIcon(ThermometerSun, iconStyles.temperature)
export const AirVentIcon = createStyledIcon(AirVent, iconStyles.temperature)
export const HeatingIcon = createStyledIcon(Flame, iconStyles.temperature)
export const HeaterIcon = createStyledIcon(Heater, iconStyles.temperature)
export const CoolingIcon = createStyledIcon(Snowflake, iconStyles.weather)
export const FanIcon = createStyledIcon(Fan, iconStyles.weather)
export const HumidityIcon = createStyledIcon(Droplets, iconStyles.weather)
export const AirQualityIcon = createStyledIcon(Leaf, iconStyles.air)
export const GlobeIcon = createStyledIcon(Globe, iconStyles.air)
export const WindIcon = createStyledIcon(Wind, iconStyles.weather)
export const WeatherIcon = createStyledIcon(CloudSun, iconStyles.weather)
export const RainIcon = createStyledIcon(CloudRain, iconStyles.weather)
export const SnowIcon = createStyledIcon(CloudSnow, iconStyles.weather)
export const HailIcon = createStyledIcon(CloudHail, iconStyles.error)
export const SleetIcon = createStyledIcon(CloudDrizzle, iconStyles.weather)
export const MixedPrecipIcon = createStyledIcon(CloudRainWind, iconStyles.weather)
export const SunIcon = createStyledIcon(Sun, iconStyles.warning)
export const NightIcon = createStyledIcon(Moon, iconStyles.weather)
export const UVIcon = createStyledIcon(SunMedium, iconStyles.warning)
export const SunsetIcon = createStyledIcon(Sunset, iconStyles.warning)
export const SunriseIcon = createStyledIcon(Sunrise, iconStyles.warning)
export const StockMarketIcon = createStyledIcon(ChartCandlestick, iconStyles.energy)
export const TrendUpIcon = createStyledIcon(TrendingUp, iconStyles.weather)
export const TrendDownIcon = createStyledIcon(TrendingDown, iconStyles.temperature)
export const NewsIcon = createStyledIcon(Newspaper, iconStyles.neutral)
export const MoviesIcon = createStyledIcon(Clapperboard, iconStyles.neutral)
export const CameraIcon = createStyledIcon(Camera, iconStyles.warning)
export const JobsIcon = createStyledIcon(BriefcaseBusiness, iconStyles.neutral)
export const JobMarketActiveOffersIcon = createStyledIcon(BriefcaseBusiness, iconStyles.jobs)
export const JobMarketNewOffersIcon = createStyledIcon(TrendingUp, iconStyles.energy)
export const JobMarketSalaryRangeIcon = createStyledIcon(SlidersHorizontal, iconStyles.jobs)
export const FileTextIcon = createStyledIcon(FileText, iconStyles.jobs)
export const BanknoteIcon = createStyledIcon(Banknote, iconStyles.media)
export const PieChartIcon = createStyledIcon(PieChart, iconStyles.temperature)
export const ListIcon = createStyledIcon(List, iconStyles.muted)
export const FilterIcon = createStyledIcon(Funnel, iconStyles.muted)
export const FilterOffIcon = createStyledIcon(FunnelX, iconStyles.muted)
export const SettingsIcon = createStyledIcon(Cog, iconStyles.muted)
export const SunMoonIcon = createStyledIcon(SunMoon, iconStyles.muted)
export const SecurityIcon = createStyledIcon(ShieldCheck, iconStyles.air)
export const AlertIcon = createStyledIcon(TriangleAlert, iconStyles.warning)
export const SuccessIcon = createStyledIcon(CircleCheck, iconStyles.energy)
export const InfoIcon = createStyledIcon(Info, iconStyles.weather)
export const IconLink = createStyledIcon(Link, iconStyles.link)
export const IconCopy = createStyledIcon(Copy, iconStyles.link)
export const FavStarIcon = createStyledIcon(Star, iconStyles.fav)
export const BackIcon = createStyledIcon(ChevronLeft, iconStyles.neutral)
export const ChevronRightIcon = createStyledIcon(ChevronRight, iconStyles.neutral)
export const CollapseMenuIcon = createStyledIcon(ChevronsLeft, iconStyles.muted)
export const ExpandMenuIcon = createStyledIcon(ChevronsRight, iconStyles.muted)
export const MenuIcon = createStyledIcon(Menu, iconStyles.neutral)
