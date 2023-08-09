import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // You can also log the error to an error reporting service
        // console.log(
        //     `logErrorToMyService(${error}, ${errorInfo}, ${this.props.scope});`
        // );
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div>Something went wrong</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
