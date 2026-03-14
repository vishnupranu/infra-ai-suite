import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} className="bg-gradient-primary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
