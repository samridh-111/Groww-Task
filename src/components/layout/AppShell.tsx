import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-bg relative flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
