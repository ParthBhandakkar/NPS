import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Sidebar />
      <main className="lg:ml-[260px] min-h-screen">
        <div className="p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
