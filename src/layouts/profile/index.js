// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Overview page components
import Header from "layouts/profile/components/Header";
import Tables from "layouts/profile/components/Tables";
import { useState } from "react";

function Overview() {
  const [users, setUsers] = useState([]);
  return (
    <DashboardLayout>
      <DashboardNavbar role="admin" />
      <MDBox mb={2} />
      <Header>
        <Tables users={users} />
      </Header>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Overview;
