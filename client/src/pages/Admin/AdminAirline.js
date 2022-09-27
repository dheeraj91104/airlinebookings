import { message, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AirlineForm from "../../components/AirlineForm";
import PageTitle from "../../components/PageTitle";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";

function AdminAirline() {
  const dispatch = useDispatch();
  const [showAirlineForm, setShowAirlineForm] = useState(false);
  const [Airlinees, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const getAirlinees = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/airline/get-all-airline", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setAirlines(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteAirline = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/airline/delete-airline", {
        _id: id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getAirlinees();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            class="ri-delete-bin-line"
            onClick={() => {
              deleteAirline(record._id);
            }}
          ></i>
          <i
            class="ri-pencil-line"
            onClick={() => {
              setSelectedAirline(record);
              setShowAirlineForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAirlinees();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Airlinees" />
        <button className="primary-btn" onClick={() => setShowAirlineForm(true)}>
          Add Airline
        </button>
      </div>

      <Table columns={columns} dataSource={Airlinees} />

      {showAirlineForm && (
        <AirlineForm
          showAirlineForm={showAirlineForm}
          setShowAirlineForm={setShowAirlineForm}
          type={selectedAirline ? "edit" : "add"}
          selectedAirline={selectedAirline}
          setSelectedAirline={setSelectedAirline}
          getData={getAirlinees}
        />
      )}
    </div>
  );
}

export default AdminAirline;
