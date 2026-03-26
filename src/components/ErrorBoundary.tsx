import React, { Component, ErrorInfo } from 'react';
import { Target, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🔥 React Render Error Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">System Error</h1>
          <p className="text-zinc-400 mb-8 max-w-md text-center">
            {this.state.errorMsg || "An unexpected rendering error caused the application to crash."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20"
          >
            <RefreshCw size={18} /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
