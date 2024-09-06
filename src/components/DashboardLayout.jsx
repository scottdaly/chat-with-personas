import DashboardNav from "./DashboardNav";

export default function DashboardLayout({ children }) {
    return (
      <div className="flex flex-row min-h-screen">
        <DashboardNav />
        <div className="flex flex-col container mx-auto max-w-4xl h-screen">
          {children}
        </div>
      </div>
    );
  }