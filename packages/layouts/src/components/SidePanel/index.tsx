import React from 'react';
import withStyles, { WithStylesProps } from '@airbnb/lunar/lib/composers/withStyles';
import PropTypes from 'prop-types';
import { mutuallyExclusiveProps } from 'airbnb-prop-types';
import IconChevronLeft from '@airbnb/lunar-icons/lib/interface/IconChevronLeft';
import IconChevronRight from '@airbnb/lunar-icons/lib/interface/IconChevronRight';
import Spacing from '@airbnb/lunar/lib/components/Spacing';

import iconComponent from '@airbnb/lunar/lib/prop-types/iconComponent';

export type SplitPaneProps = {
  sidePane: React.ReactNode;
  mainPane: React.ReactNode;
  collapsible?: boolean;
  compact?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  fixedWidth?: string | number;
  percentWidth?: number;
  iconColor?: string;
  // @ts-ignore
  iconClosed?: any;
  iconOpen?: any;
  iconSize?: string;
  buttonTop?: number;
  background?: string;
  rightSide?: boolean;
};

export type SplitPaneState = {
  collapsed: boolean;
};

/** A two-column layout with a collapsible side bar that can scale with screen width. */
class SidePanel extends React.Component<SplitPaneProps & WithStylesProps, SplitPaneState> {
  static propTypes = {
    fixedWidth: mutuallyExclusiveProps(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      'maxWidth',
      'minWidth',
      'percentWidth',
    ),
    iconClosed: iconComponent,
    iconOpen: iconComponent,
    maxWidth: mutuallyExclusiveProps(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      'fixedWidth',
    ),
    minWidth: mutuallyExclusiveProps(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      'fixedWidth',
    ),
    percentWidth: mutuallyExclusiveProps(PropTypes.number, 'fixedWidth'),
  };

  public static defaultProps = {
    background: 'white',
    buttonTop: 16,
    collapsible: true,
    compact: true,
    iconClosed: IconChevronRight,
    iconColor: '#484848', // core.neutral[5]
    iconOpen: IconChevronLeft,
    iconSize: '1.1rem',
    maxWidth: Infinity,
    minWidth: 0,
    rightSide: false,
  };

  constructor(props: SplitPaneProps & WithStylesProps) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  private handleToggleSidePane = () => {
    this.setState(({ collapsed }) => ({
      collapsed: !collapsed,
    }));
  };

  public render() {
    const {
      background,
      buttonTop,
      collapsible,
      compact,
      cx,
      iconColor,
      iconClosed,
      iconOpen,
      iconSize,
      sidePane,
      mainPane,
      styles,
      theme,
      percentWidth,
      minWidth,
      maxWidth,
      fixedWidth,
      rightSide,
    } = this.props;
    const { collapsed } = this.state;

    const defaultWidth = percentWidth ? `${percentWidth}%` : `${40 * theme!.unit}px`;

    const buttonBackgroundColor = collapsed ? theme!.color.accent.bg : background;

    const sidePanelStyle = {
      width: collapsed ? 0 : fixedWidth || defaultWidth,
      maxWidth,
      minWidth: collapsed ? 0 : minWidth,
      flex: fixedWidth
        ? `0 0 ${collapsed ? 0 : fixedWidth}px`
        : `0 0 ${collapsed ? 0 : defaultWidth}`,
      padding: collapsed ? 0 : 3 * theme!.unit,
      borderRightColor:
        !rightSide && collapsed ? buttonBackgroundColor : theme!.color.core.neutral[1],
      borderLeftColor:
        rightSide && collapsed ? buttonBackgroundColor : theme!.color.core.neutral[1],
    };

    const collapseButtonStyle = {
      top: buttonTop,
      background: buttonBackgroundColor,
      borderRightColor:
        !rightSide && !collapsed ? buttonBackgroundColor : theme!.color.core.neutral[1],
      borderLeftColor:
        rightSide && !collapsed ? buttonBackgroundColor : theme!.color.core.neutral[1],
    };

    const mainPanelColorStyle = {
      background: background || theme!.color.accent.bg,
    };

    const collapseButton = (
      <button
        type="button"
        className={cx(
          collapseButtonStyle,
          styles.collapseButton,
          collapsed && !rightSide && styles.collapseButtonHiddenLeft,
          collapsed && rightSide && styles.collapseButtonHiddenRight,
          !collapsed && !rightSide && styles.collapseButtonVisibleLeft,
          !collapsed && rightSide && styles.collapseButtonVisibleRight,
        )}
        onClick={this.handleToggleSidePane}
      >
        <Spacing vertical={1} horizontal={compact ? 0 : 1}>
          {collapsed
            ? React.cloneElement(iconClosed, { size: iconSize, color: iconColor })
            : React.cloneElement(iconOpen, { size: iconSize, color: iconColor })}
        </Spacing>
      </button>
    );

    return (
      <div className={cx(styles.splitPane)}>
        {rightSide && <div className={cx(styles.mainPanel, mainPanelColorStyle)}>{mainPane}</div>}
        <div
          className={cx(
            styles.sidePanel,
            rightSide && styles.sidePanelRight,
            !rightSide && styles.sidePanelLeft,
            sidePanelStyle,
          )}
        >
          {collapsible && collapseButton}
          <div className={cx(styles.sidePanelInner)}>{!collapsed && sidePane}</div>
        </div>
        {!rightSide && <div className={cx(styles.mainPanel, mainPanelColorStyle)}>{mainPane}</div>}
      </div>
    );
  }
}

export default withStyles(
  ({ unit, color }) => ({
    splitPane: {
      display: 'inline-flex',
      minHeight: `calc(100vh - ${8 * unit}px)`,
      width: '100%',
    },
    mainPanel: {
      padding: unit * 4,
      overflow: 'auto',
      flexGrow: 1,
    },
    sidePanel: {
      wordBreak: 'break-word',
      background: color.accent.bg,
      height: `calc(100vh - ${8 * unit}px)`,
      position: 'sticky',
      top: 8 * unit,
    },

    sidePanelLeft: {
      borderRight: '1px solid',
    },

    sidePanelRight: {
      borderLeft: '1px solid',
    },

    sidePanelInner: {
      height: '100%',
      overflow: 'auto',
      zIndex: 100,
    },

    collapseButton: {
      cursor: 'pointer',
      position: 'absolute',
      border: `1px solid ${color.core.neutral[1]}`,
      padding: 0,
      borderRadius: 0,
    },

    collapseButtonVisibleRight: {
      left: -1,
      borderBottomRightRadius: 4,
      borderTopRightRadius: 4,
      borderLeft: '1px solid',
    },
    collapseButtonHiddenRight: {
      right: 0,
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 4,
      borderRight: '1px solid',
    },

    collapseButtonVisibleLeft: {
      right: -1,
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 4,
      borderRight: '1px solid',
    },
    collapseButtonHiddenLeft: {
      left: 0,
      borderBottomRightRadius: 4,
      borderTopRightRadius: 4,
      borderLeft: '1px solid',
    },
  }),
  {
    passThemeProp: true,
  },
)(SidePanel);
