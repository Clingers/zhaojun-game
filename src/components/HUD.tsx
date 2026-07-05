// HUD 占位组件
// TODO: 实现完整的 HUD 交互界面

interface HUDProps {
  className?: string;
}

export default function HUD({ className = '' }: HUDProps) {
  return (
    <div className={`hud-overlay ${className}`}>
      {/* TODO: Forward / Stay / Dialogue / Collect 交互按钮 */}
      <div className="hud-placeholder opacity-0">
        HUD 组件开发中...
      </div>
    </div>
  );
}
