import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  tabName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Error in ${this.props.tabName} tab:`, error, info);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.tabName !== this.props.tabName) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          <div className="font-medium text-[var(--color-error)] text-lg">
            Something went wrong in the {this.props.tabName} tab
          </div>
          <p className="max-w-md text-center text-[var(--color-text-secondary)] text-sm">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
