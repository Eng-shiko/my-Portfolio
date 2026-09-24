//dashboard 
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar'; 

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-x-hidden">
        
        <main className="p-2  h-auto ">
          <Outlet />
        </main>

      </div>
    </div>
  );
}