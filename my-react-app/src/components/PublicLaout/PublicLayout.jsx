import React from 'react';
import Header from './Header'; // đảm bảo đường dẫn đúng với vị trí Header của bạn
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <>
      <div>
<Header />
      </div>
      
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet />
      </main>
      <footer style={{ background: '#f1f1f1', textAlign: 'center', padding: '16px' }}>
        © 2025 Vietcare Lab. All rights reserved.
      </footer>
    </>
  );
}
