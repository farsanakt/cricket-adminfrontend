import { PageBanner } from "../theme";

export default function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <PageBanner title={title || "Coming Soon"} sub="" />
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e8e8e8',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            backgroundColor: '#e8f3fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
          }}
        >
          📋
        </div>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '14px', color: '#888' }}>
          This section is ready to be built out. Content will appear here.
        </p>
        <button
          style={{
            marginTop: '20px',
            padding: '10px 24px',
            backgroundColor: '#2f9be0',
            color: 'white',
            border: 'none',
            borderRadius: '7px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
