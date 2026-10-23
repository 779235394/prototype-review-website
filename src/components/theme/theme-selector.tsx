import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWebsiteTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

const themeOptions = [
  { mode: "light", label: "日间", icon: SunIcon },
  { mode: "dark", label: "夜间", icon: MoonIcon },
  { mode: "system", label: "跟随系统", icon: MonitorIcon },
] as const;

const themeIcons = { light: SunIcon, dark: MoonIcon, system: MonitorIcon };
const themeLabels = { light: "日间", dark: "夜间", system: "跟随系统" };

/** 主题选项只显示图标，通过提示与读屏名称解释含义。 */
function ThemeOption({ mode, label, icon: Icon }: (typeof themeOptions)[number]) {
  const { mode: selectedMode, selectMode } = useWebsiteTheme();

  /** 将当前选项交给统一主题管理器保存和应用。 */
  function selectThisMode() {
    selectMode(mode);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          aria-pressed={selectedMode === mode}
          onClick={selectThisMode}
          className={cn("size-11 border border-transparent", selectedMode === mode && "border-primary bg-accent text-accent-foreground")}
        >
          <Icon className="size-5" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

/** 提供日间、夜间、跟随系统三项图标选择，不把模式文字常显在导航上。 */
export function ThemeSelector() {
  const { mode, ready, error } = useWebsiteTheme();
  const Icon = themeIcons[mode];
  const label = `选择主题，当前${themeLabels[mode]}`;

  /** 将固定的三种主题定义转换为具有独立可访问名称的按钮。 */
  function renderOption(option: (typeof themeOptions)[number]) {
    return <ThemeOption key={option.mode} {...option} />;
  }

  return (
    <div>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={label} disabled={!ready}>
                <Icon className="size-5" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
        <PopoverContent align="end" sideOffset={8} className="w-auto p-3" aria-label="选择外观主题">
          <div role="group" aria-label="主题模式" className="flex gap-2">
            {themeOptions.map(renderOption)}
          </div>
        </PopoverContent>
      </Popover>
      {error !== null && <p role="alert" className="theme-preference-error">{error}</p>}
    </div>
  );
}
