import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import StripeCheckout from "react-stripe-checkout";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [airline, setAirline] = useState(null);
  const getAirline = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/airline/get-airline-by-id", {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setAirline(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        airline: airline._id,
        seats: selectedSeats,
        transactionId,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * airline.fare * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getAirline();
  }, []);
  return (
    <div>
      {airline && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{airline.name}</h1>
            <h1 className="text-md">
              {airline.from} - {airline.to}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">
                Jourey Date : {airline.journeyDate}
              </p>
              <p className="text-md">
                Fare : $ {airline.fare} /-
              </p>
              <p className="text-md">
                Departure Time : {airline.departure}
              </p>
              <p className="text-md">
                Arrival Time : {airline.arrival}
              </p>
              <p className="text-md">
                Capacity : {airline.capacity}
              </p>
              <p className="text-md">
                Seats Left : {airline.capacity - airline.seatsBooked.length}
              </p>
            </div>
            <hr />

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {airline.fare * selectedSeats.length} /-
              </h1>
              <hr />

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={airline.fare * selectedSeats.length * 100}
                currency="INR"
                stripeKey="pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ"
              >
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              airline={airline}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
