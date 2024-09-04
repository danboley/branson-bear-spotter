import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { locations } from "./types/locations";
import { Poi } from "./types/types";

const AdminPortal: React.FC = ({ pois }) => {
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRowData(pois);
  }, [locations, pois]);

  const columnDefs = [
    { headerName: "ID", field: "id", minWidth: 100, flex: 1 },
    { headerName: "Name", field: "name", minWidth: 100, flex: 1 },
    {
      headerName: "Address",
      field: "address",
      minWidth: 100,
      flex: 1,
    },
    { headerName: "Lat", field: "latitude", minWidth: 100, flex: 1 },
    { headerName: "Long", field: "longitude", minWidth: 100, flex: 1 },
    { headerName: "Details", field: "details", minWidth: 200, flex: 3 },
    {
      headerName: "Approval Status",
      field: "approvalStatus",
      minWidth: 100,
      flex: 1,
    },
    {
      headerName: "Approval Notes",
      field: "approvalNotes",
      minWidth: 200,
      flex: 3,
    },
    {
      headerName: "Image",
      field: "imagePath",
      minWidth: 200,
      flex: 3,
    },
    {
      headerName: "Submitted By",
      field: "userId",
      minWidth: 100,
      flex: 1,
    },
  ];

  function handleRowClicked(e: { data: Poi }) {
    const poiId = e.data.id;
    navigate(`/pois/edit/${poiId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="p-4 border-2 border-white w-full max-w-6xl">
        <h2 className="text-white px-3 pb-3 rounded-md text-sm font-medium">
          Manage POI Submissions
        </h2>
        <div
          className="ag-theme-alpine"
          style={{ height: "400px", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            onRowClicked={handleRowClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
