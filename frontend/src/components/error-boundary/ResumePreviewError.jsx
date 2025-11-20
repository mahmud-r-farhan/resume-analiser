import React from 'react';

class ResumePreviewError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4 border border-red-500 rounded">
          PDF generation failed: {this.state.error?.message || 'Unknown error'}. Contact Support: dev@devplus.fun
        </div>
      );
    }
    return this.props.children;
  }
}

export default ResumePreviewError;