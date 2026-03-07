import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function VisitorGraph() {

  const [data, setData] = useState([]);

  const API = "https://zeecurity-backend.onrender.com/api";

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {

      const res = await axios.get(`${API}/preapproved`);

      

      const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

      const counts = days.map(day => ({
        day,
        visitors: Math.floor(Math.random()*10) + 1
      }));

      setData(counts);

    } catch (err) {
      console.error(err);
    }
  };

  return (

    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3}/>
      </LineChart>
    </ResponsiveContainer>

  );
}