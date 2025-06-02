import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [token, setToken] = useState("");
  const [timetable, setTimetable] = useState(Object);
  const [param, setParam] = useState({ route: "", start: "", end: "" });
  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch(
          "https://tech-assessment.clickferry.app/api/v1/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: "clickferry",
              password: "wpv3CQM*ptb4frv0hzm",
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        setToken((await response.json()).token);
      } catch (err) {
        console.log("Error during login:", err.message);
      }
    };

    login();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const route = formData.get("route");
    const start = formData.get("start");
    const end = formData.get("end");
    setParam({ route, start, end });
  };
  console.log("Form parameters:", param);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeTableResponse = await fetch(
          `https://tech-assessment.clickferry.app/api/v1/timetable?route=${param.route}&start=${param.start}&end=${param.end}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!timeTableResponse.ok) {
          throw new Error("Failed to fetch timetable");
        }
        setTimetable(await timeTableResponse.json());
      } catch (err) {
        console.log("Error during fetching timetable:", err.message);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token, param]);

  console.log("Timetable:", timetable.trips);

  return (
    <main>
      <form onSubmit={submitForm}>
        route:
        <select name="route">
          <option defaultValue="IBIZFORM">IBIZFORM</option>
          <option defaultValue="FORMIBIZ">FORMIBIZ</option>
        </select>
        start: <input name="start" type="date" />
        end: <input name="end" type="date" />
        <input type="submit" value="Submit" />
      </form>
      <div>
        {Object.entries(timetable?.trips ?? {}).map(([tripData, trips]) => {
          return <span key={tripData}>{JSON.stringify(trips)}</span>;
        }) ?? "No trips found"}
      </div>
    </main>
  );
}
