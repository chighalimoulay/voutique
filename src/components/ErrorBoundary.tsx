import { AlertTriangle } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * حدود الخطأ — قاعدة «ممنوع الشاشة البيضاء».
 * أي استثناء أثناء العرض يُلتقط هنا ويظهر بديل عربي مفهوم
 * بدل انهيار التطبيق بالكامل.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // في التطوير نطبع التفاصيل الكاملة لتسهيل التشخيص
    if (import.meta.env.DEV) {
      console.error('[VOUTIQUE] خطأ في العرض:', error, info.componentStack);
    }
  }

  private handleReload = () => {
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-mauve-200 bg-white px-6 py-12 text-center shadow-soft">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mauve-50 text-mauve-500">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </span>

          <h1 className="text-lg font-semibold">حدث خطأ غير متوقع</h1>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            تعذّر عرض هذا الجزء من الصفحة. يرجى المحاولة مرة أخرى.
          </p>

          {import.meta.env.DEV && this.state.message && (
            <pre
              dir="ltr"
              className="mt-4 max-h-40 w-full overflow-auto rounded-xl bg-cream p-3 text-left text-xs text-ink-soft"
            >
              {this.state.message}
            </pre>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-full bg-mauve-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mauve-600"
            >
              إعادة تحميل الصفحة
            </button>

            <a
              href="/"
              className="rounded-full border border-mauve-300 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mauve-50"
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      </div>
    );
  }
}
