import * as Sentry from "@sentry/browser";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { composeWithProps } from "tools/context-utils";
import {
  PageContainerScrollable,
  PageTitle,
  PanelMessageText,
} from "ui/SharedComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  hasError: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class GovernancePage extends React.Component<IProps, IState> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error) {
    // Log the error to Sentry.
    Sentry.captureException(error);
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      this.state.hasError &&
      this.props.ledger.network.name !== prevProps.ledger.network.name
    ) {
      this.setState({ hasError: false });
    }
  }

  render(): Nullable<JSX.Element> {
    const { i18n } = this.props;
    if (this.state.hasError) {
      return (
        <PanelMessageText>
          {i18n.tString("Error fetching data...")}
        </PanelMessageText>
      );
    }

    const { network } = this.props.ledger;

    if (!network.supportsGovernance) {
      return (
        <PanelMessageText>
          Governance is not supported yet for <b>{network.name}</b>.
        </PanelMessageText>
      );
    }

    switch (network.name) {
      case "COSMOS":
      case "OASIS":
      case "CELO":
        return (
          <PageContainerScrollable>
            <PageTitle data-cy="governance-page-title">
              {i18n.tString("Governance")}
            </PageTitle>
            <PanelMessageText>
              Governance is coming soon for Celo.
            </PanelMessageText>
          </PageContainerScrollable>
        );
      default:
        return null;
    }
  }
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(GovernancePage);
