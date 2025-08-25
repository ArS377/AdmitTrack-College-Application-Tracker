import { useLayoutEffect, useState } from "react";
import axios from "axios";
import PaginatedSortableCollegeTable from "../components/PaginatedSortableCollegeTable";

export default function Research() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  useLayoutEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${apiUrl}/collegelist?q=1`);
        if (response) {
          setData(response.data);
        } else {
          console.error("No response for collegelist request");
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <PaginatedSortableCollegeTable collegeList={data} />
    </>
  );
}
