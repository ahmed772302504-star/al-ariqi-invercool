import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B192C] text-white flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#1E3E62]/60 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur">
            <div className="w-16 h-16 rounded-2xl bg-[#060E18] border border-[#C87D55] p-2 flex items-center justify-center mx-auto mb-4">
              <img src="/logo-icon.png" alt="AL-ARRIQI INVERCOOL" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold mb-2">العريقي إنفركول</h1>
            <p className="text-sm text-slate-300 mb-6">
              حدث خطأ أثناء تحميل الصفحة في التطبيق. اضغط أدناه لإعادة التحميل.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#B86B3E] text-white font-bold text-sm shadow-lg hover:scale-105 transition"
            >
              إعادة تحميل التطبيق
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
