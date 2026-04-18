import React from 'react';

export default function LoadingIndicator() {
  const messages = [
    'Scanning emails for opportunities...',
    'Classifying genuine opportunities vs spam...',
    'Extracting deadlines and eligibility...',
    'Matching against your profile...',
    'Ranking by urgency and relevance...',
  ];
  const [msgIdx, setMsgIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <div className="loading-text">{messages[msgIdx]}</div>
      <div className="loading-sub">This may take 10-20 seconds depending on the number of emails</div>
    </div>
  );
}
