import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error){ return { hasError: true, error }; }
  componentDidCatch(error, info){ console.error("ErrorBoundary:", error, info); }
  render(){
    if (this.state.hasError){
      return (
        <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm">
          <b>Ocurrió un error al renderizar.</b>
          <pre className="mt-2 whitespace-pre-wrap">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
