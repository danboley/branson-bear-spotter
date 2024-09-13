import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Poi } from "./types/types";

interface AdminPortalProps {
  pois: Poi[];
}

const AdminPortal: React.FC<AdminPortalProps> = ({ pois }) => {
  const [rowData, setRowData] = useState<Poi[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRowData(pois);
  }, [pois]);

  const columnDefs: ColDef<Poi>[] = [
    { headerName: "ID", field: "id", minWidth: 100, flex: 1, filter: true },
    { headerName: "Name", field: "name", minWidth: 100, flex: 1, filter: true },
    {
      headerName: "Address",
      field: "address",
      minWidth: 100,
      flex: 1,
      filter: true,
    },
    {
      headerName: "Lat",
      field: "latitude",
      minWidth: 100,
      flex: 1,
      filter: true,
    },
    {
      headerName: "Long",
      field: "longitude",
      minWidth: 100,
      flex: 1,
      filter: true,
    },
    {
      headerName: "Details",
      field: "details",
      minWidth: 200,
      flex: 3,
      filter: true,
    },
    {
      headerName: "Approval Status",
      field: "approvalStatus",
      minWidth: 100,
      flex: 1,
      filter: true,
    },
    {
      headerName: "Approval Notes",
      field: "approvalNotes",
      minWidth: 200,
      flex: 3,
      filter: true,
    },
    {
      headerName: "Image",
      field: "imagePath",
      minWidth: 200,
      flex: 3,
      filter: true,
    },
    {
      headerName: "Submitted By",
      field: "User.username",
      minWidth: 100,
      flex: 1,
      filter: true,
    },
  ];

  function handleRowClicked(e: RowClickedEvent<Poi, any>) {
    const poiId = e.data!.id;
    navigate(`/pois/edit/${poiId}`);
  }

  return (
    <div className="flex bg-main items-center justify-center min-h-screen px-4">
      <div className="p-4 border-2 border-white rounded w-full max-w-6xl">
        <h2 className="text-white px-3 pb-3 rounded-md font-medium">
          Manage Submissions
        </h2>
        <div
          className="ag-theme-quartz"
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
